import type {
  Layer,
  LayerProps,
  UpdateParameters,
  DefaultProps,
  TextureSource,
} from '@deck.gl/core';
import type { _TileLoadProps as TileLoadProps } from '@deck.gl/geo-layers';
import type { BitmapBoundingBox } from '@deck.gl/layers';
import type { GeoTIFF, GeoTIFFImage } from 'geotiff';
import type { ColorMap as GeoStylerColorMap } from 'geostyler-style';
import { log, warn, error } from '../../utils/logger';
import { loadGeoTIFFSource, GeoTIFFSource } from '../geotiff/geotiff-source';
import {
  GeoTIFFTileProcessor,
  getTileProcessorConfig,
} from '../geotiff/utils/GeoTIFFTileProcessor';
import {
  type ColorMapName,
  type ColorStop,
  getColorStops,
} from '../geotiff/utils/colormap-utils';

const LOG_PREFIX = 'v-map - deck - terrain-geotiff - ';
const TILE_LAYER_LOG_PREFIX = 'v-map - deck - terrain-geotiff - tilelayer - ';

export interface DeckGLGeoTIFFTerrainLayerProps extends LayerProps {
  url?: string;

  /**
   * Quell-Projektion des GeoTIFF (z. B. \"EPSG:32632\" oder proj4-String)
   */
  projection?: string;

  /**
   * Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys
   */
  forceProjection?: boolean;

  /**
   * NoData-Wert für ungültige Höhendaten
   */
  noDataValue?: number;

  /**
   * Minimale Zoom-Stufe
   */
  minZoom?: number;

  /**
   * Maximale Zoom-Stufe
   */
  maxZoom?: number;

  /**
   * Tile-Größe in Pixeln (muss 2^n sein, z. B. 256 oder 512)
   */
  tileSize?: number;

  /**
   * Mesh-Fehlertoleranz in Metern für Martini-Triangulierung.
   * Kleinere Werte = detaillierteres Mesh, aber höhere GPU-Last.
   * Default: 4.0
   */
  meshMaxError?: number;

  /**
   * Wireframe-Modus: zeigt nur Mesh-Linien (terrain-Modus)
   * Default: false
   */
  wireframe?: boolean;

  /**
   * Textur-URL (optional)
   */
  texture?: string;

  /**
   * Farbe für das Terrain-Mesh (terrain-Modus, wenn keine Textur)
   * [r, g, b] mit Werten 0-255
   */
  color?: [number, number, number];

  /**
   * ColorMap für Höhendaten-Visualisierung (colormap-Modus)
   */
  colorMap?: ColorMapName | GeoStylerColorMap;

  /**
   * Wertebereich für ColorMap-Normalisierung [min, max]
   */
  valueRange?: [number, number];

  /**
   * Höhen-Überhöhung (terrain-Modus)
   * Default: 1.0
   */
  elevationScale?: number;

  /**
   * Rendering-Modus:
   * - 'terrain': 3D-Mesh via Martini-Algorithmus (Standard)
   * - 'colormap': 2D-Kacheln mit Farbkarte (TileLayer + BitmapLayer)
   */
  renderMode?: 'terrain' | 'colormap';
}

/**
 * Factory-Funktion zum Erstellen eines DeckGLGeoTIFFTerrainLayer
 *
 * Rendert GeoTIFF-Höhendaten als 3D-Terrain-Mesh (Standard) oder als
 * colormap-basierte 2D-Kacheln.
 *
 * Im terrain-Modus (Standard) wird der Martini-Algorithmus (@mapbox/martini)
 * für adaptive RTIN-Mesh-Generierung verwendet. meshMaxError, wireframe und
 * elevationScale sind in diesem Modus funktional.
 */
export async function createDeckGLGeoTIFFTerrainLayer(
  props: DeckGLGeoTIFFTerrainLayerProps,
): Promise<Layer> {
  const [
    { CompositeLayer },
    { TileLayer },
    { BitmapLayer },
    { SimpleMeshLayer },
    MartiniModule,
    { default: proj4 },
    geotiffModule,
    geokeysModule,
  ] = await Promise.all([
    import('@deck.gl/core'),
    import('@deck.gl/geo-layers'),
    import('@deck.gl/layers'),
    import('@deck.gl/mesh-layers'),
    import('@mapbox/martini'),
    import('proj4'),
    import('geotiff'),
    import('geotiff-geokeys-to-proj4'),
  ]);
  const Martini = (MartiniModule as unknown as { default?: typeof MartiniModule }).default ?? MartiniModule;

  class DeckGLGeoTIFFTerrainLayer extends CompositeLayer<DeckGLGeoTIFFTerrainLayerProps> {
    static layerName = 'DeckGLGeoTIFFTerrainLayer';

    static defaultProps: DefaultProps<DeckGLGeoTIFFTerrainLayerProps> = {
      minZoom: 0,
      maxZoom: 24,
      tileSize: 256,
      noDataValue: 0,
      forceProjection: false,
      meshMaxError: 4.0,
      wireframe: false,
      elevationScale: 1.0,
      colorMap: 'terrain',
      renderMode: 'terrain',
    };

    private tiff?: GeoTIFF;
    private image?: GeoTIFFImage;
    private fromProjection: string = 'EPSG:4326';
    private viewProjection: string = 'EPSG:3857';
    private sourceBounds: [number, number, number, number] = [0, 0, 0, 0];
    private tileProcessor?: GeoTIFFTileProcessor;
    private activeLoad?: { signature: string; token: number };
    private loadedSignature?: string;
    private loadToken = 0;

    private storeRuntimeState(): void {
      this.setState({
        runtime: {
          tiff: this.tiff,
          image: this.image,
          fromProjection: this.fromProjection,
          sourceBounds: this.sourceBounds,
          tileProcessor: this.tileProcessor,
        },
      });
    }

    private restoreRuntimeState(): void {
      const runtime = (
        this.state as {
          runtime?: {
            tiff?: GeoTIFF;
            image?: GeoTIFFImage;
            fromProjection?: string;
            sourceBounds?: [number, number, number, number];
            tileProcessor?: GeoTIFFTileProcessor;
          };
        }
      ).runtime;

      if (!runtime) return;

      this.tiff ??= runtime.tiff;
      this.image ??= runtime.image;
      this.tileProcessor ??= runtime.tileProcessor;
      this.fromProjection = runtime.fromProjection ?? this.fromProjection;
      this.sourceBounds = runtime.sourceBounds ?? this.sourceBounds;
    }

    constructor(layerProps: DeckGLGeoTIFFTerrainLayerProps) {
      super(layerProps);
    }

    private getLoadSignature(
      props: DeckGLGeoTIFFTerrainLayerProps = this.props,
    ): string {
      return JSON.stringify({
        url: props.url ?? null,
        projection: props.projection ?? null,
        forceProjection: props.forceProjection ?? false,
        noDataValue: props.noDataValue ?? null,
      });
    }

    private scheduleLoad(reason: string): void {
      const signature = this.getLoadSignature();

      if (this.activeLoad?.signature === signature) {
        log(`${LOG_PREFIX}skip duplicate load: ${reason}`);
        return;
      }

      if (this.loadedSignature === signature && this.state.init) {
        log(`${LOG_PREFIX}skip already-loaded source: ${reason}`);
        return;
      }

      const token = ++this.loadToken;
      this.activeLoad = { signature, token };
      this.setState({ init: false });
      void this._loadAsync(token, signature, reason);
    }

    private async _loadAsync(
      token: number,
      signature: string,
      reason: string,
    ) {
      try {
        const applied = await this.loadGeoTIFF(token);
        if (!applied || this.activeLoad?.token !== token) {
          return;
        }

        this.loadedSignature = signature;
        this.setState({ init: true });
        log(`${LOG_PREFIX}load complete: ${reason}`);
      } finally {
        if (this.activeLoad?.token === token) {
          this.activeLoad = undefined;
        }
      }
    }

    // ============================================================================
    // LIFECYCLE METHODS
    // ============================================================================

    async initializeState(_context?: unknown): Promise<void> {
      this.scheduleLoad('initializeState');
    }

    shouldUpdateState({ changeFlags }: UpdateParameters<Layer<DeckGLGeoTIFFTerrainLayerProps>>): boolean {
      return Boolean(
        changeFlags.propsOrDataChanged || changeFlags.updateTriggersChanged,
      );
    }

    updateState({
      props: newProps,
      oldProps,
      changeFlags,
    }: UpdateParameters<Layer<DeckGLGeoTIFFTerrainLayerProps>>): void {
      this.restoreRuntimeState();

      const reloadPropsChanged =
        newProps.url !== oldProps.url ||
        newProps.projection !== oldProps.projection ||
        newProps.forceProjection !== oldProps.forceProjection ||
        newProps.noDataValue !== oldProps.noDataValue;

      const invalidatePropsChanged =
        newProps.meshMaxError !== oldProps.meshMaxError ||
        newProps.wireframe !== oldProps.wireframe ||
        newProps.texture !== oldProps.texture ||
        newProps.color !== oldProps.color ||
        newProps.colorMap !== oldProps.colorMap ||
        newProps.valueRange !== oldProps.valueRange ||
        newProps.elevationScale !== oldProps.elevationScale ||
        newProps.opacity !== oldProps.opacity ||
        newProps.visible !== oldProps.visible ||
        newProps.renderMode !== oldProps.renderMode ||
        changeFlags.updateTriggersChanged;

      if (
        changeFlags.dataChanged ||
        newProps.data !== oldProps.data ||
        reloadPropsChanged
      ) {
        this.scheduleLoad('updateState');
        return;
      }

      if (invalidatePropsChanged) {
        this.setNeedsRedraw();
      }
    }

    finalizeState(_context?: unknown): void {
      if (this.tiff) {
        this.tiff = null;
      }
      this.image = null;
    }

    // ============================================================================
    // GEOTIFF LOADING
    // ============================================================================

    async loadGeoTIFF(token: number): Promise<boolean> {
      const { url, projection, forceProjection } = this.props;

      if (!url) {
        this.tiff = undefined;
        this.image = undefined;
        this.tileProcessor = undefined;
        this.sourceBounds = [0, 0, 0, 0];
        this.storeRuntimeState();
        log(`${LOG_PREFIX}no URL provided, skipping GeoTIFF loading`);
        this.loadedSignature = this.getLoadSignature();
        return true;
      }

      log(`${LOG_PREFIX}loadGeoTIFF: url=${url}, token=${token}`);
      try {
        const source: GeoTIFFSource = await loadGeoTIFFSource(
          url,
          {
            projection,
            forceProjection,
            nodata: this.props.noDataValue,
          },
          {
            geotiff: geotiffModule,
            proj4,
            geokeysToProj4: geokeysModule,
          },
        );

        if (this.activeLoad?.token !== token) {
          log(`${LOG_PREFIX}ignore stale source load result: token=${token}`);
          return false;
        }

        this.tiff = source.tiff;
        this.image = source.baseImage;
        this.fromProjection = source.fromProjection;
        this.sourceBounds = source.sourceBounds;

        const config = await getTileProcessorConfig(source, this.viewProjection);

        if (this.activeLoad?.token !== token) {
          log(`${LOG_PREFIX}ignore stale tile processor result: token=${token}`);
          return false;
        }

        this.tileProcessor = new GeoTIFFTileProcessor(config);
        this.tileProcessor.createGlobalTriangulation();
        this.storeRuntimeState();

        log(
          `${LOG_PREFIX}loaded: projection=${this.fromProjection}→${this.viewProjection}, bounds=[${this.sourceBounds.map(v => v.toFixed(0)).join(',')}]`,
        );

        this.setNeedsRedraw();
        return true;
      } catch (err) {
        error(`${LOG_PREFIX}failed to load GeoTIFF:`, err);
        this.raiseError(err as Error, 'Failed to load GeoTIFF');
        return false;
      }
    }

    // ============================================================================
    // VIEW EXTENT
    // ============================================================================

    private getViewExtent(): [number, number, number, number] | null {
      if (!this.tileProcessor) return null;

      const [srcWest, srcSouth, srcEast, srcNorth] = this.sourceBounds;

      const MAX_LAT = 85.05112878;

      const clampLon = (lon: number) =>
        Math.max(-180, Math.min(180, Number.isFinite(lon) ? lon : 0));
      const clampLat = (lat: number) =>
        Math.max(-MAX_LAT, Math.min(MAX_LAT, Number.isFinite(lat) ? lat : 0));

      const transformSourceToWGS84 = (coord: [number, number]): [number, number] => {
        if (this.fromProjection === 'EPSG:4326') {
          return coord;
        }

        const result = proj4(this.fromProjection, 'EPSG:4326', coord);
        return [Number(result[0]), Number(result[1])];
      };

      try {
        const corners = [
          transformSourceToWGS84([srcWest, srcSouth]),
          transformSourceToWGS84([srcEast, srcSouth]),
          transformSourceToWGS84([srcEast, srcNorth]),
          transformSourceToWGS84([srcWest, srcNorth]),
        ];

        const minLng = clampLon(Math.min(...corners.map(corner => corner[0])));
        const maxLng = clampLon(Math.max(...corners.map(corner => corner[0])));
        const minLat = clampLat(Math.min(...corners.map(corner => corner[1])));
        const maxLat = clampLat(Math.max(...corners.map(corner => corner[1])));

        if (minLng > maxLng || minLat > maxLat) {
          warn(`${LOG_PREFIX}invalid extent calculated from source bounds`);
          return null;
        }

        return [minLng, minLat, maxLng, maxLat];
      } catch (err) {
        warn(`${LOG_PREFIX}failed to calculate extent from source bounds:`, err);
        return null;
      }
    }

    // ============================================================================
    // TILE DATA GENERATION
    // ============================================================================

    async getTileData(tile: TileLoadProps): Promise<TextureSource | { elevationData: Float32Array; gridSize: number } | null> {
      if (!this.image || !this.tileProcessor) return null;

      const { x, y, z } = tile.index;
      const { tileSize, renderMode } = this.props;

      try {
        if (renderMode === 'colormap') {
          return this._getTileDataColormap(x, y, z, tileSize!);
        }
        return this._getTileDataTerrain(x, y, z, tileSize!);
      } catch (err) {
        warn(`${LOG_PREFIX}tile [${z}/${x}/${y}] failed:`, err);
        return null;
      }
    }

    private async _getTileDataColormap(
      x: number,
      y: number,
      z: number,
      tileSize: number,
    ): Promise<TextureSource | null> {
      const { colorMap, valueRange } = this.props;

      let colorStops: ColorStop[] | undefined;
      if (colorMap) {
        colorStops = getColorStops(colorMap, valueRange).stops;
      }

      const rgbaData = await this.tileProcessor!.getTileData({
        x, y, z,
        tileSize,
        resolution: 1.0,
        resampleMethod: 'bilinear',
        colorStops,
      });

      if (!rgbaData) return null;

      return { data: rgbaData, width: tileSize, height: tileSize };
    }

    private async _getTileDataTerrain(
      x: number,
      y: number,
      z: number,
      tileSize: number,
    ): Promise<{ elevationData: Float32Array; gridSize: number } | null> {
      const elevationData = await this.tileProcessor!.getElevationData({ x, y, z, tileSize });

      if (!elevationData) return null;

      return { elevationData, gridSize: tileSize + 1 };
    }

    // ============================================================================
    // RENDERING
    // ============================================================================

    renderLayers() {
      this.restoreRuntimeState();
      if (!this.image || !this.tileProcessor || this.props.visible === false) {
        return null;
      }

      const { minZoom, maxZoom, tileSize, renderMode, opacity } = this.props;
      const extent = this.getViewExtent();

      const layerConfig: Record<string, unknown> = {
        id: `${this.props.id}-tiles`,
        minZoom,
        maxZoom,
        tileSize,
        opacity,
        visible: this.props.visible,
        getTileData: this.getTileData.bind(this),
        onTileError: (err: Error) => {
          warn(`${TILE_LAYER_LOG_PREFIX}error: ${err.message}`);
        },
        renderSubLayers:
          renderMode === 'colormap'
            ? this._renderColormapSubLayer.bind(this)
            : this._renderTerrainSubLayer.bind(this),
      };

      if (extent) {
        layerConfig.extent = extent;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TileLayer constructor expects TileLayerProps which conflicts with dynamic config assembly
      return new TileLayer(layerConfig as any);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- deck.gl renderSubLayers pass-through pattern requires any for prop spreading
    private _renderColormapSubLayer(subProps: any) {
      const { tile } = subProps;

      if (!tile?.data) return null;

      const { data, width, height } = tile.data;
      const { west, south, east, north } = subProps.tile.bbox;
      const bounds: BitmapBoundingBox = [west, south, east, north];
      const { opacity, visible } = this.props;
      const webgl = (globalThis as unknown as Record<string, unknown>).WebGLRenderingContext as Record<string, number> | undefined;
      const textureMinFilter = webgl?.TEXTURE_MIN_FILTER ?? 10241;
      const textureMagFilter = webgl?.TEXTURE_MAG_FILTER ?? 10240;
      const linear = webgl?.LINEAR ?? 9729;

      return new BitmapLayer({
        ...subProps,
        id: `${subProps.id}-bitmap`,
        opacity,
        visible,
        image: { data, width, height },
        bounds,
        textureParameters: {
          [textureMinFilter]: linear,
          [textureMagFilter]: linear,
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- deck.gl renderSubLayers pass-through pattern requires any for prop spreading
    private _renderTerrainSubLayer(subProps: any) {
      const { tile } = subProps;

      if (!tile?.data) return null;

      const { elevationData, gridSize } = tile.data;
      const { west, south, east, north } = subProps.tile.bbox;
      const { meshMaxError, wireframe, color, elevationScale, texture, opacity, visible } =
        this.props;

      // Martini mesh is rebuilt here on each renderSubLayers call.
      // This is acceptable because TileLayer only invokes renderSubLayers
      // when tile data actually changes (new tile loaded or evicted),
      // not on every frame redraw.
      const martini = new Martini(gridSize);
      const martiniTile = martini.createTile(elevationData);
      const { vertices, triangles } = martiniTile.getMesh(meshMaxError ?? 4.0);

      const tileSize = gridSize - 1;
      const numVertices = vertices.length / 2;
      const positions = new Float32Array(numVertices * 3);
      const texCoords = new Float32Array(numVertices * 2);

      const lonRange = east - west;
      const latRange = north - south;
      const scale = elevationScale ?? 1.0;

      for (let i = 0; i < numVertices; i++) {
        const px = vertices[i * 2];
        const py = vertices[i * 2 + 1];
        const elevation = elevationData[py * gridSize + px];

        positions[i * 3 + 0] = west + (px / tileSize) * lonRange;
        positions[i * 3 + 1] = north - (py / tileSize) * latRange;
        positions[i * 3 + 2] = elevation * scale;

        texCoords[i * 2 + 0] = px / tileSize;
        texCoords[i * 2 + 1] = py / tileSize;
      }

      const mesh = {
        attributes: {
          POSITION: { value: positions, size: 3 },
          TEXCOORD_0: { value: texCoords, size: 2 },
        },
        indices: { value: Uint32Array.from(triangles), size: 1 },
        mode: 4 as const, // TRIANGLES
      };

      const tileIndex = subProps.tile?.index;
      const tileTexture =
        typeof texture === 'string'
          ? texture
              .replaceAll('{x}', String(tileIndex?.x ?? '{x}'))
              .replaceAll('{y}', String(tileIndex?.y ?? '{y}'))
              .replaceAll('{z}', String(tileIndex?.z ?? '{z}'))
          : undefined;

      return new SimpleMeshLayer({
        ...subProps,
        id: `${subProps.id}-mesh`,
        opacity,
        visible,
        mesh,
        data: [[0, 0, 0]],
        getPosition: (d: number[]) => d,
        getColor: tileTexture ? [255, 255, 255] : (color ?? [200, 200, 200]),
        texture: tileTexture,
        wireframe: wireframe ?? false,
      });
    }
  }

  return new DeckGLGeoTIFFTerrainLayer(props) as unknown as Layer;
}
