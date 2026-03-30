import type {
  Layer,
  LayerProps,
  UpdateParameters,
  DefaultProps,
  TextureSource,
  LayerContext,
} from '@deck.gl/core';
import type { _TileLoadProps as TileLoadProps } from '@deck.gl/geo-layers';
import type { BitmapBoundingBox } from '@deck.gl/layers';
import type { GeoTIFF, GeoTIFFImage } from 'geotiff';
import type { ColorMap as GeoStylerColorMap } from 'geostyler-style';
import { log, warn, error } from '../../utils/logger';
import {
  GeoTIFFTileProcessor,
  getTileProcessorConfig,
} from '../geotiff/utils/GeoTIFFTileProcessor';
import { loadGeoTIFFSource, GeoTIFFSource } from '../geotiff/geotiff-source';

// Import utility modules
import {
  type ColorMapName,
  type ColorStop,
  getColorStops,
} from '../geotiff/utils/colormap-utils';

const LOG_PREFIX = 'v-map - deck - geotiff - ';
const TILE_LAYER_LOG_PREFIX = 'v-map - deck - geotiff - tilelayer - ';

type BitmapImageSource = ImageData | {
  data: Uint8Array | Uint8ClampedArray;
  width: number;
  height: number;
};

function createBitmapImageSource(
  data: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
): {
  image: BitmapImageSource;
  kind: 'ImageData' | 'raw';
} {
  const ImageDataCtor = (globalThis as typeof globalThis & {
    ImageData?: new (
      data: Uint8ClampedArray,
      width: number,
      height: number,
    ) => ImageData;
  }).ImageData;

  if (!ImageDataCtor) {
    return {
      image: { data, width, height },
      kind: 'raw',
    };
  }

  // deck.gl's texture creation path reads dimensions from `image.data.width/height`.
  // Wrapping raw RGBA tile buffers in ImageData keeps width/height attached and avoids
  // invalid mipmap creation with typed-array-only sources.
  const clampedData =
    data instanceof Uint8ClampedArray
      ? data
      : new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);

  return {
    image: new ImageDataCtor(clampedData, width, height),
    kind: 'ImageData',
  };
}

export interface DeckGLGeoTIFFLayerProps extends LayerProps {
  url: string; // URL des GeoTIFF

  /**
   * Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)
   *
   * Verwendung:
   * 1. Wenn nicht angegeben: Projektion wird aus GeoTIFF GeoKeys gelesen
   * 2. Wenn GeoKeys fehlen: Dieser Wert wird als Fallback verwendet
   * 3. Wenn forceProjection=true: Überschreibt GeoKeys komplett
   *
   * Default fallback: 'EPSG:4326' (WGS84)
   */
  projection?: string;

  /**
   * Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys
   *
   * Nützlich wenn:
   * - GeoTIFF falsche/fehlende Projektionsinformationen hat
   * - Man die Projektion manuell überschreiben möchte
   *
   * Default: false
   */
  forceProjection?: boolean;

  noDataValue?: number;
  nullColor?: [number, number, number, number];
  minZoom?: number;
  maxZoom?: number;
  tileSize?: number;

  /**
   * Sampling-Auflösung (0.0 - 1.0)
   *
   * - 1.0 = volle Auflösung (256x256 samples für 256x256 tile)
   * - 0.5 = halbe Auflösung (128x128 samples, upscaled zu 256x256)
   * - 0.25 = viertel Auflösung (64x64 samples, upscaled zu 256x256)
   *
   * Niedrigere Werte = schneller, aber weniger genau
   * Default: 1.0
   */
  resolution?: number;

  /**
   * Resampling-Methode
   *
   * - 'near': Nearest Neighbor (schnellste, blockartig)
   * - 'bilinear': Bilineare Interpolation (langsamer, glatter)
   *
   * Default: 'bilinear'
   */
  resampleMethod?: 'near' | 'bilinear';

  /**
   * ColorMap für Grayscale-Daten
   *
   * Unterstützt:
   * 1. Vordefinierte Namen:
   *    - 'grayscale': Schwarz-Weiß (default)
   *    - 'viridis': Wissenschaftliche Farbskala (lila→gelb)
   *    - 'terrain': Terrain-Farben (blau→grün→braun→weiß)
   *    - 'turbo': Google Turbo (blau→grün→gelb→rot)
   *    - 'rainbow': Regenbogen
   *
   * 2. GeoStyler ColorMap (aus SLD via v-map-style):
   *    Wird automatisch vom styleReady Event übernommen
   *
   * Nur für Single-Band (Grayscale) Daten!
   * RGB/RGBA Daten ignorieren diese Prop.
   *
   * Default: 'grayscale'
   */
  colorMap?: ColorMapName | GeoStylerColorMap;

  /**
   * Wertebereich für Normalisierung [min, max]
   *
   * Für Float32/Float64 Daten: Mappt Werte in diesem Bereich auf 0-1 für ColorMap
   * - Werte < min → 0.0 (erste Farbe)
   * - Werte > max → 1.0 (letzte Farbe)
   * - Dazwischen → linear interpoliert
   *
   * Wenn nicht angegeben: Auto-detect aus Daten (kann langsam sein!)
   *
   * Beispiel: [0, 3000] für Höhendaten 0-3000m
   */
  valueRange?: [number, number];
  /** Optional callback for tile load errors, wired by provider. */
  onTileLoadError?: (err: Error) => void;
}

/**
 * Factory-Funktion zum Erstellen eines DeckGLGeoTIFFLayer
 */
export async function createDeckGLGeoTIFFLayer(
  props: DeckGLGeoTIFFLayerProps,
): Promise<Layer> {
  // Dynamisches Laden aller benötigten Module
  const [
    //{ Layer: BaseLayer },
    { CompositeLayer },
    { TileLayer },
    { BitmapLayer },
    { default: proj4 },
    geotiffModule,
    geokeysModule,
  ] = await Promise.all([
    import('@deck.gl/core'),
    import('@deck.gl/geo-layers'),
    import('@deck.gl/layers'),
    import('proj4'),
    import('geotiff'),
    import('geotiff-geokeys-to-proj4'),
  ]);

  // Klassen-Definition innerhalb der Factory
  class DeckGLGeoTIFFLayer extends CompositeLayer<DeckGLGeoTIFFLayerProps> {
    static layerName = 'DeckGLGeoTIFFLayer';

    static defaultProps: DefaultProps<DeckGLGeoTIFFLayerProps> = {
      minZoom: 0,
      maxZoom: 24,
      tileSize: 256,
      noDataValue: 0,
      nullColor: [0, 0, 0, 0],
      resolution: 1.0,
      resampleMethod: 'bilinear',
      forceProjection: false,
      colorMap: 'grayscale',
    };

    private tiff?: GeoTIFF;
    private image?: GeoTIFFImage;
    private fromProjection: string = 'EPSG:4326';
    private viewProjection: string = 'EPSG:3857';
    private sourceBounds: [number, number, number, number] = [0, 0, 0, 0];

    // Tile processor with triangulation
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

    constructor(layerProps: DeckGLGeoTIFFLayerProps) {
      super(layerProps);
    }

    private getLoadSignature(
      props: DeckGLGeoTIFFLayerProps = this.props,
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
        log(this.state);
      } finally {
        if (this.activeLoad?.token === token) {
          this.activeLoad = undefined;
        }
      }
    }
    // ============================================================================
    // LIFECYCLE METHODS
    // ============================================================================

    /**
     * Called once when layer is first created
     */
    async initializeState(_context?: LayerContext): Promise<void> {
      log(this.state);
      this.scheduleLoad('initializeState');
      log(this.state);
    }

    /**
     * Called when layer props or context has changed
     * Returns true if layer needs to be updated
     */
    shouldUpdateState({ changeFlags }: UpdateParameters<Layer<DeckGLGeoTIFFLayerProps>>): boolean {
      // Update wenn data, props oder updateTriggers sich ändern
      return Boolean(
        changeFlags.propsOrDataChanged || changeFlags.updateTriggersChanged,
      );
    }

    /**
     * Called when layer needs to be updated
     */
    updateState({
      props: newProps,
      oldProps,
      changeFlags,
    }: UpdateParameters<Layer<DeckGLGeoTIFFLayerProps>>): void {
      this.restoreRuntimeState();

      const reloadPropsChanged =
        newProps.url !== oldProps.url ||
        newProps.projection !== oldProps.projection ||
        newProps.forceProjection !== oldProps.forceProjection ||
        newProps.noDataValue !== oldProps.noDataValue;

      const valueRangeChanged =
        Array.isArray(newProps.valueRange) || Array.isArray(oldProps.valueRange)
          ? !(
              Array.isArray(newProps.valueRange) &&
              Array.isArray(oldProps.valueRange) &&
              newProps.valueRange.length === oldProps.valueRange.length &&
              newProps.valueRange.every(
                (val, idx) => val === oldProps.valueRange![idx],
              )
            )
          : false;

      const invalidatePropsChanged =
        newProps.colorMap !== oldProps.colorMap ||
        valueRangeChanged ||
        newProps.resolution !== oldProps.resolution ||
        newProps.resampleMethod !== oldProps.resampleMethod ||
        newProps.opacity !== oldProps.opacity ||
        newProps.visible !== oldProps.visible ||
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
        this.triggerLayerUpdate();
      }

      log(this.state);
    }

    /**
     * Called before layer is removed - cleanup resources
     */
    finalizeState(_context?: LayerContext): void {
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
        this.triggerLayerUpdate();
        this.loadedSignature = this.getLoadSignature();
        return true;
      }

      log(`${LOG_PREFIX}loadGeoTIFF: init=${this.state.init}, token=${token}`);
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

        // Initialize tile processor using shared utility
        const config = await getTileProcessorConfig(source, this.viewProjection);

        if (this.activeLoad?.token !== token) {
          log(`${LOG_PREFIX}ignore stale tile processor result: token=${token}`);
          return false;
        }

        this.tileProcessor = new GeoTIFFTileProcessor(config);
        this.tileProcessor.createGlobalTriangulation();
        this.storeRuntimeState();

        log(
          `v-map - deck - geotiff - loaded: projection=${source.fromProjection}→${this.viewProjection}, bounds=[${source.sourceBounds.map(v => v.toFixed(0)).join(',')}], wgs84=[${source.wgs84Bounds.map(v => v.toFixed(4)).join(',')}], size=${source.width}x${source.height}, bands=${source.samplesPerPixel}`,
        );

        // Invalidate layer um neu zu rendern
        this.triggerLayerUpdate();
        return true;
      } catch (err) {
        error(`${LOG_PREFIX}failed to load GeoTIFF:`, err);
        this.raiseError(err as Error, 'Failed to load GeoTIFF');
        return false;
      }
    }

    /**
     * Calculate View extent from source bounds
     * Returns [minLng, minLat, maxLng, maxLat] in WGS84 coordinates
     *
     * For deck.gl: TileLayer expects extent in Longitude/Latitude (WGS84)
     * This is used by TileLayer to restrict tile loading to the GeoTIFF coverage area.
     */
    private getViewExtent(): [number, number, number, number] | null {
      if (!this.sourceBounds || !this.tileProcessor) return null;

      const [srcWest, srcSouth, srcEast, srcNorth] = this.sourceBounds;

      // WGS84 (EPSG:4326) limits
      const MAX_LAT = 85.05112878; // Web Mercator latitude limit
      const MIN_LAT = -85.05112878;
      const MAX_LNG = 180;
      const MIN_LNG = -180;

      try {
        // Transform from Source projection to WGS84 (Lat/Lng)
        // deck.gl TileLayer expects extent in longitude/latitude coordinates
        const transformSourceToWGS84 = (
          coord: [number, number],
        ): [number, number] => {
          return proj4(this.fromProjection, 'EPSG:4326', coord) as [
            number,
            number,
          ];
        };

        // Helper to validate coordinates
        const isValidCoord = (coord: [number, number]): boolean => {
          return (
            coord &&
            coord.length === 2 &&
            Number.isFinite(coord[0]) &&
            Number.isFinite(coord[1]) &&
            !Number.isNaN(coord[0]) &&
            !Number.isNaN(coord[1])
          );
        };

        // Helper to clamp to valid WGS84 ranges
        const clampLng = (value: number): number => {
          return Math.max(MIN_LNG, Math.min(MAX_LNG, value));
        };

        const clampLat = (value: number): number => {
          return Math.max(MIN_LAT, Math.min(MAX_LAT, value));
        };

        // Transform all four corners from Source to WGS84
        const sw = transformSourceToWGS84([srcWest, srcSouth]);
        const se = transformSourceToWGS84([srcEast, srcSouth]);
        const nw = transformSourceToWGS84([srcWest, srcNorth]);
        const ne = transformSourceToWGS84([srcEast, srcNorth]);

        // Validate all transformed coordinates
        if (
          !isValidCoord(sw) ||
          !isValidCoord(se) ||
          !isValidCoord(nw) ||
          !isValidCoord(ne)
        ) {
          warn(`${LOG_PREFIX}invalid coordinates after transformation:`, {
            sw,
            se,
            nw,
            ne,
          });
          return null;
        }

        // Calculate bounding box in WGS84 coordinates (lng, lat)
        // Note: sw[0] = lng, sw[1] = lat
        let minLng = Math.min(sw[0], se[0], nw[0], ne[0]);
        let maxLng = Math.max(sw[0], se[0], nw[0], ne[0]);
        let minLat = Math.min(sw[1], se[1], nw[1], ne[1]);
        let maxLat = Math.max(sw[1], se[1], nw[1], ne[1]);

        // Clamp to valid WGS84 ranges
        minLng = clampLng(minLng);
        maxLng = clampLng(maxLng);
        minLat = clampLat(minLat);
        maxLat = clampLat(maxLat);

        // Final validation
        if (
          !Number.isFinite(minLng) ||
          !Number.isFinite(maxLng) ||
          !Number.isFinite(minLat) ||
          !Number.isFinite(maxLat)
        ) {
          warn(`${LOG_PREFIX}invalid extent calculated:`, {
            minLng,
            minLat,
            maxLng,
            maxLat,
          });
          return null;
        }

        // Check if extent was clamped
        const wasClamped =
          minLng === MIN_LNG ||
          maxLng === MAX_LNG ||
          minLat === MIN_LAT ||
          maxLat === MAX_LAT;

        if (wasClamped) {
          warn(`${LOG_PREFIX}extent exceeds valid bounds, clamped to valid range`);
        }

        // Return in deck.gl extent format: [minX, minY, maxX, maxY] = [minLng, minLat, maxLng, maxLat]
        return [minLng, minLat, maxLng, maxLat];
      } catch (err) {
        warn(`${LOG_PREFIX}failed to calculate extent from source bounds:`, err);
        return null;
      }
    }

    // ============================================================================
    // TILE DATA GENERATION
    // ============================================================================

    async getTileData(tile: TileLoadProps): Promise<TextureSource> {
      this.restoreRuntimeState();
      log(`v-map - deck - geotiff - getTileData ENTER(${tile.index.x},${tile.index.y},${tile.index.z}): image=${!!this.image}, processor=${!!this.tileProcessor}`);
      if (!this.image || !this.tileProcessor) return null;

      const x = tile.index.x;
      const y = tile.index.y;
      const z = tile.index.z;

      try {
        const { tileSize, resolution, resampleMethod, colorMap, valueRange } =
          this.props;

        // Prepare colorStops once for this tile (if colorMap is specified)
        let colorStops: ColorStop[] | undefined;
        if (colorMap) {
          const result = getColorStops(colorMap, valueRange);
          colorStops = result.stops;
        }

        // Use tile processor for triangulation-based reprojection
        const rgbaData = await this.tileProcessor.getTileData({
          x,
          y,
          z,
          tileSize: tileSize!,
          resolution: resolution!,
          resampleMethod: resampleMethod!,
          colorStops,
        });

        if (!rgbaData) {
          log(`v-map - deck - geotiff - getTileData(${x},${y},${z}): no data returned`);
          return null;
        }

        // Check for non-zero pixels (detect all-transparent tiles)
        let nonZeroPixels = 0;
        for (let i = 3; i < rgbaData.length; i += 4) {
          if (rgbaData[i] > 0) { nonZeroPixels++; break; }
        }

        log(
          `v-map - deck - geotiff - getTileData(${x},${y},${z}): rgba ${rgbaData.length} bytes, tileSize=${tileSize}, hasContent=${nonZeroPixels > 0}`,
        );

        return {
          data: rgbaData,
          width: tileSize!,
          height: tileSize!,
        };
      } catch (error) {
        warn(`${LOG_PREFIX}tile [${z}/${x}/${y}] failed:`, error);
        return null;
      }
    }

    // ============================================================================
    // RENDERING
    // ============================================================================

    /**
     * renderLayers is called by CompositeLayer to generate sublayers
     */
    renderLayers() {
      this.restoreRuntimeState();
      if (!this.image || !this.tileProcessor || this.props.visible === false) {
        return null;
      }

      const { minZoom, maxZoom, tileSize, opacity, visible } = this.props;
      const extent = this.getViewExtent();

      // Log extent for debugging
      if (extent) {
        log(
          `${LOG_PREFIX}view extent: [${extent
            .map(v => v.toFixed(2))
            .join(', ')}]`,
        );
      } else {
        warn(`${LOG_PREFIX}view extent is null, tiles will load globally`);
      }

      // Only pass extent if it's valid, otherwise let TileLayer use global extent
      // deck.gl TileLayer config with dynamic properties (extent added conditionally)
      const layerConfig: Record<string, unknown> = {
        id: `${this.props.id}-tiles`,
        minZoom,
        maxZoom,
        tileSize,
        opacity,
        visible,
        getTileData: this.getTileData.bind(this),
        onTileError: (err: Error) => {
          warn(`${TILE_LAYER_LOG_PREFIX}error: ${err.message}`);
          this.props.onTileLoadError?.(err);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- deck.gl sub-layer prop forwarding requires any
        renderSubLayers: (subProps: any) => {
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
          const imageSource = createBitmapImageSource(data, width, height);

          log(
            `v-map - deck - geotiff - renderSubLayer(${tile.index.x},${tile.index.y},${tile.index.z}): data=${data?.length ?? 'null'}, w=${width}, h=${height}, bounds=[${west?.toFixed(2)},${south?.toFixed(2)},${east?.toFixed(2)},${north?.toFixed(2)}]`,
          );
          log(
            `v-map - deck - geotiff - textureSource(${tile.index.x},${tile.index.y},${tile.index.z}): kind=${imageSource.kind}, ctor=${imageSource.image?.constructor?.name ?? 'unknown'}, w=${width}, h=${height}, bytes=${data?.length ?? 'null'}`,
          );

          return new BitmapLayer({
            ...subProps,
            id: `${subProps.id}-bitmap`,
            opacity,
            visible,
            image: imageSource.image,
            bounds: bounds,
            textureParameters: {
              [textureMinFilter]: linear,
              [textureMagFilter]: linear,
            },
          });
        },
        updateTriggers: {
          renderSubLayers: [opacity, visible],
        },
      };

      // Only add extent if it's valid
      if (extent) {
        layerConfig.extent = extent;
      }

      return new TileLayer(layerConfig);
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    /**
     * Marks the layer as needing an update
     */
    private triggerLayerUpdate(): void {
      // Force layer to redraw by updating internal state
      this.setNeedsRedraw();
    }
  }

  // Layer-Instanz erstellen und zurückgeben
  return new DeckGLGeoTIFFLayer(props) as unknown as Layer;
}
