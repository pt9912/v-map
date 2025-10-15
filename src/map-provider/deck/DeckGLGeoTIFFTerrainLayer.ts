import type {
  Layer,
  LayerProps,
  UpdateParameters,
  DefaultProps,
} from '@deck.gl/core';
import type { GeoTIFF, GeoTIFFImage } from 'geotiff';
import type { ColorMap as GeoStylerColorMap } from 'geostyler-style';
import { log, warn, error } from '../../utils/logger';
import { loadGeoTIFFSource } from '../geotiff/geotiff-source';
import type {
  ColorMapName,
} from '../geotiff/utils/colormap-utils';

export interface DeckGLGeoTIFFTerrainLayerProps extends LayerProps {
  url: string; // URL des GeoTIFF (Elevation Data)

  /**
   * Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)
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
   * Tile-Größe in Pixeln
   */
  tileSize?: number;

  /**
   * Mesh-Fehlertoleranz in Metern (Martini)
   * Kleinere Werte = detaillierteres Mesh, aber langsamer
   * Default: 4.0
   */
  meshMaxError?: number;

  /**
   * Wireframe-Modus (nur Mesh-Linien anzeigen)
   * Default: false
   */
  wireframe?: boolean;

  /**
   * Textur-URL (optional) - kann ein Bild oder tile-URL sein
   */
  texture?: string;

  /**
   * Farbe für das Terrain (wenn keine Textur vorhanden)
   * [r, g, b] mit Werten 0-255
   */
  color?: [number, number, number];

  /**
   * ColorMap für Höhendaten-Visualisierung
   * Nur relevant wenn keine texture gesetzt ist
   */
  colorMap?: ColorMapName | GeoStylerColorMap;

  /**
   * Wertebereich für Normalisierung [min, max]
   * Wird für ColorMap-Mapping verwendet
   */
  valueRange?: [number, number];

  /**
   * Höhen-Überhöhung (Exaggeration Factor)
   * Default: 1.0
   */
  elevationScale?: number;
}

/**
 * Factory-Funktion zum Erstellen eines DeckGLGeoTIFFTerrainLayer
 *
 * Dieser Layer kombiniert:
 * - GeoTIFF-Loading mit Projektion-Support (aus DeckGLGeoTIFFLayer)
 * - 3D-Terrain-Rendering (deck.gl TerrainLayer)
 * - Optional: ColorMap-basierte Texturierung
 */
export async function createDeckGLGeoTIFFTerrainLayer(
  props: DeckGLGeoTIFFTerrainLayerProps,
): Promise<Layer> {
  // Dynamisches Laden aller benötigten Module
  const [
    { CompositeLayer },
    { TerrainLayer },
    { TileLayer },
    proj4Module,
    geotiffModule,
    geokeysModule,
  ] = await Promise.all([
    import('@deck.gl/core'),
    import('@deck.gl/geo-layers'),
    import('@deck.gl/geo-layers'),
    import('proj4'),
    import('geotiff'),
    import('geotiff-geokeys-to-proj4'),
  ]);

  const proj4 = (proj4Module as any).default ?? proj4Module;

  // Klassen-Definition innerhalb der Factory
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
    };

    private tiff?: GeoTIFF;
    private image?: GeoTIFFImage;
    private fromProjection: string = 'EPSG:4326';
    private toProjection: string = 'EPSG:3857';
    private sourceBounds: [number, number, number, number] = [0, 0, 0, 0];
    private sourceRef: [number, number] = [0, 0];
    private resolution: number = 1.0;
    private imageWidth: number = 0;
    private imageHeight: number = 0;
    private overviewImages?: GeoTIFFImage[];

    constructor(layerProps: DeckGLGeoTIFFTerrainLayerProps) {
      super(layerProps);
    }

    private async _loadAsync() {
      await this.loadGeoTIFF();
      this.setState({ init: true });
      log('[terrain-geotiff] Initialization complete');
    }

    // ============================================================================
    // LIFECYCLE METHODS
    // ============================================================================

    async initializeState(_context?: any): Promise<void> {
      this.setState({ init: false });
      this._loadAsync();
    }

    shouldUpdateState({ changeFlags }: UpdateParameters<any>): boolean {
      return Boolean(
        changeFlags.propsOrDataChanged || changeFlags.updateTriggersChanged,
      );
    }

    updateState({
      props: newProps,
      oldProps,
      changeFlags,
    }: UpdateParameters<any>): void {
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
        changeFlags.updateTriggersChanged;

      if (
        changeFlags.dataChanged ||
        newProps.data !== oldProps.data ||
        reloadPropsChanged
      ) {
        this.setState({ init: false });
        this._loadAsync();
        return;
      }

      if (invalidatePropsChanged) {
        this.setNeedsRedraw();
      }
    }

    finalizeState(_context?: any): void {
      if (this.tiff) {
        this.tiff = null;
      }
      this.image = null;
      this.overviewImages = undefined;
    }

    // ============================================================================
    // GEOTIFF LOADING
    // ============================================================================

    async loadGeoTIFF() {
      const { url, projection, forceProjection } = this.props;

      log(`[terrain-geotiff] Loading GeoTIFF from ${url}`);
      try {
        const source = await loadGeoTIFFSource(
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

        this.tiff = source.tiff;
        this.image = source.baseImage;
        this.overviewImages = source.overviewImages;
        this.imageWidth = source.width;
        this.imageHeight = source.height;
        this.fromProjection = source.fromProjection;
        this.toProjection = source.toProjection;
        this.sourceBounds = source.sourceBounds;
        this.sourceRef = source.sourceRef;
        this.resolution = source.resolution;

        log('[terrain-geotiff] GeoTIFF loaded successfully');
        log(`[terrain-geotiff] Projection: ${this.fromProjection} -> ${this.toProjection}`);
        log(`[terrain-geotiff] Bounds: ${this.sourceBounds}`);

        this.setNeedsRedraw();
      } catch (err) {
        error('[terrain-geotiff] Failed to load GeoTIFF:', err);
        this.raiseError(err as Error, 'Failed to load GeoTIFF');
      }
    }

    /**
     * Calculate View extent from source bounds
     * Returns [minLng, minLat, maxLng, maxLat] in WGS84 coordinates
     */
    private getViewExtent(): [number, number, number, number] | null {
      if (!this.sourceBounds) return null;

      const [srcWest, srcSouth, srcEast, srcNorth] = this.sourceBounds;

      const MAX_LAT = 85.05112878;
      const MIN_LAT = -85.05112878;
      const MAX_LNG = 180;
      const MIN_LNG = -180;

      try {
        const transformSourceToWGS84 = (
          coord: [number, number],
        ): [number, number] => {
          return proj4(this.fromProjection, 'EPSG:4326', coord) as [
            number,
            number,
          ];
        };

        const sw = transformSourceToWGS84([srcWest, srcSouth]);
        const se = transformSourceToWGS84([srcEast, srcSouth]);
        const nw = transformSourceToWGS84([srcWest, srcNorth]);
        const ne = transformSourceToWGS84([srcEast, srcNorth]);

        if (!sw || !se || !nw || !ne) {
          warn('[terrain-geotiff] Invalid coordinates after transformation');
          return null;
        }

        let minLng = Math.min(sw[0], se[0], nw[0], ne[0]);
        let maxLng = Math.max(sw[0], se[0], nw[0], ne[0]);
        let minLat = Math.min(sw[1], se[1], nw[1], ne[1]);
        let maxLat = Math.max(sw[1], se[1], nw[1], ne[1]);

        // Clamp to valid ranges
        minLng = Math.max(MIN_LNG, Math.min(MAX_LNG, minLng));
        maxLng = Math.max(MIN_LNG, Math.min(MAX_LNG, maxLng));
        minLat = Math.max(MIN_LAT, Math.min(MAX_LAT, minLat));
        maxLat = Math.max(MIN_LAT, Math.min(MAX_LAT, maxLat));

        return [minLng, minLat, maxLng, maxLat];
      } catch (err) {
        warn('[terrain-geotiff] Failed to calculate extent:', err);
        return null;
      }
    }

    /**
     * Build elevation tile URL template from GeoTIFF URL
     *
     * For now, we'll use the direct GeoTIFF URL.
     * In the future, this could be enhanced to generate tile URLs.
     */
    private getElevationDataUrl(): string {
      // For single GeoTIFF files, we return the URL directly
      // TerrainLayer will load it as a single heightmap
      return this.props.url;
    }

    /**
     * Calculate elevation decoder for GeoTIFF data
     *
     * GeoTIFF elevation values are typically in the actual elevation units (meters).
     * We need to decode them properly for the TerrainLayer.
     */
    private getElevationDecoder() {
      // For GeoTIFF, we typically don't need RGB decoding
      // The values are already in the correct format
      // However, TerrainLayer expects RGB encoding, so we'll use identity
      return {
        rScaler: 1,
        gScaler: 0,
        bScaler: 0,
        offset: 0,
      };
    }

    // ============================================================================
    // RENDERING
    // ============================================================================

    renderLayers() {
      if (!this.image) return null;

      const {
        minZoom,
        maxZoom,
        meshMaxError,
        wireframe,
        texture,
        color,
        elevationScale,
      } = this.props;

      const extent = this.getViewExtent();

      log('[terrain-geotiff] Rendering TerrainLayer with extent:', extent);

      // TerrainLayer configuration
      const terrainConfig: any = {
        id: `${this.props.id}-terrain`,
        minZoom,
        maxZoom,
        elevationData: this.getElevationDataUrl(),
        elevationDecoder: this.getElevationDecoder(),
        meshMaxError: meshMaxError ?? 4.0,
        wireframe: wireframe ?? false,
        color: color ?? [255, 255, 255],
        material: true,
        elevationScale: elevationScale ?? 1.0,
      };

      // Add texture if provided
      if (texture) {
        terrainConfig.texture = texture;
      }

      // Add extent if available
      if (extent) {
        terrainConfig.extent = extent;
      }

      return new TerrainLayer(terrainConfig);
    }
  }

  // Layer-Instanz erstellen und zurückgeben
  return new DeckGLGeoTIFFTerrainLayer(props) as unknown as Layer;
}
