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
import {
  GeoTIFFTileProcessor,
  type GeoTIFFTileProcessorConfig,
} from '../geotiff/utils/GeoTIFFTileProcessor';
import { loadGeoTIFFSource } from '../geotiff/geotiff-source';

// Import utility modules
import {
  type ColorMapName,
  type ColorStop,
  getColorStops,
} from '../geotiff/utils/colormap-utils';

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
    proj4Module,
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

  const proj4 = (proj4Module as any).default ?? proj4Module;

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
    private toProjection: string = 'EPSG:3857';
    private sourceBounds: [number, number, number, number] = [0, 0, 0, 0];
    private sourceRef: [number, number] = [0, 0];
    private resolution: number = 1.0;
    private imageWidth: number = 0;
    private imageHeight: number = 0;
    private overviewImages?: GeoTIFFImage[];

    // Tile processor with triangulation
    private tileProcessor?: GeoTIFFTileProcessor;

    constructor(layerProps: DeckGLGeoTIFFLayerProps) {
      super(layerProps);
    }

    // ============================================================================
    // LIFECYCLE METHODS
    // ============================================================================

    /**
     * Called once when layer is first created
     */
    async initializeState(_context?: any): Promise<void> {
      log(this.state);

      this.setState({ init: false });
      await this.loadGeoTIFF();

      this.setState({ init: true });
      log(this.state);
    }

    /**
     * Called when layer props or context has changed
     * Returns true if layer needs to be updated
     */
    shouldUpdateState({ changeFlags }: UpdateParameters<any>): boolean {
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
    }: UpdateParameters<any>): void {
      // Wenn sich die Data-URL geändert hat, lade GeoTIFF neu
      if (changeFlags.dataChanged || newProps.data !== oldProps.data) {
        this.loadGeoTIFF();
        this.setState({});
      }

      // Wenn sich die Projektion geändert hat
      else if (newProps.projection !== oldProps.projection) {
        this.loadGeoTIFF();
        this.setState({});
      }
      log(this.state);
    }

    /**
     * Called before layer is removed - cleanup resources
     */
    finalizeState(_context?: any): void {
      // Cleanup
      if (this.tiff) {
        // GeoTIFF cleanup falls nötig
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

      log(`loadGeoTIFF - init: ${this.state.init}`);
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

        // Initialize tile processor with triangulation
        this.initializeTileProcessor();

        // Invalidate layer um neu zu rendern
        this.triggerLayerUpdate();
      } catch (err) {
        error('Fehler beim Laden des GeoTIFF:', err);
        this.raiseError(err as Error, 'Failed to load GeoTIFF');
      }
    }

    /**
     * Initialize tile processor with configuration
     */
    private initializeTileProcessor(): void {
      // Transform from Mercator to Source projection
      const transformViewToSourceMapFn = (
        coord: [number, number],
      ): [number, number] => {
        const result = proj4(this.toProjection, this.fromProjection, coord);
        return result as [number, number];
      };

      // Inverse: Transform from Source projection to Mercator
      const transformSourceMapToViewFn = (
        coord: [number, number],
      ): [number, number] => {
        const result = proj4(this.fromProjection, this.toProjection, coord);
        return result as [number, number];
      };

      const config: GeoTIFFTileProcessorConfig = {
        transformViewToSourceMapFn,
        transformSourceMapToViewFn,
        sourceBounds: this.sourceBounds,
        sourceRef: this.sourceRef,
        resolution: this.resolution,
        imageWidth: this.imageWidth,
        imageHeight: this.imageHeight,
        fromProjection: this.fromProjection,
        toProjection: this.toProjection,
        baseImage: this.image!,
        overviewImages: this.overviewImages || [],
      };

      this.tileProcessor = new GeoTIFFTileProcessor(config);
      this.tileProcessor.createGlobalTriangulation();
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
        const transformSourceToWGS84 = (coord: [number, number]): [number, number] => {
          return proj4(this.fromProjection, 'EPSG:4326', coord) as [number, number];
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
        if (!isValidCoord(sw) || !isValidCoord(se) || !isValidCoord(nw) || !isValidCoord(ne)) {
          warn('[deck][geotiff] Invalid coordinates after transformation:', { sw, se, nw, ne });
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
        if (!Number.isFinite(minLng) || !Number.isFinite(maxLng) ||
            !Number.isFinite(minLat) || !Number.isFinite(maxLat)) {
          warn('[deck][geotiff] Invalid extent calculated:', { minLng, minLat, maxLng, maxLat });
          return null;
        }

        // Check if extent was clamped
        const wasClamped =
          minLng === MIN_LNG || maxLng === MAX_LNG ||
          minLat === MIN_LAT || maxLat === MAX_LAT;

        if (wasClamped) {
          warn('[deck][geotiff] GeoTIFF extent exceeds valid bounds - clamped to valid range');
        }

        // Return in deck.gl extent format: [minX, minY, maxX, maxY] = [minLng, minLat, maxLng, maxLat]
        return [minLng, minLat, maxLng, maxLat];
      } catch (err) {
        warn('[deck][geotiff] Failed to calculate extent from source bounds:', err);
        return null;
      }
    }

    // ============================================================================
    // TILE DATA GENERATION
    // ============================================================================

    async getTileData(tile: TileLoadProps): Promise<TextureSource> {
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

        if (!rgbaData) return null;

        return {
          data: rgbaData,
          width: tileSize!,
          height: tileSize!,
        };
      } catch (error) {
        warn(`Kachel [${z}/${x}/${y}] konnte nicht geladen werden:`, error);
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
      if (!this.image) return null;

      const { minZoom, maxZoom, tileSize } = this.props;
      const extent = this.getViewExtent();

      // Log extent for debugging
      if (extent) {
        log(`[deck][geotiff] View extent: [${extent.map(v => v.toFixed(2)).join(', ')}]`);
      } else {
        warn('[deck][geotiff] View extent is null - tiles will load globally');
      }

      // Only pass extent if it's valid, otherwise let TileLayer use global extent
      const layerConfig: any = {
        id: `${this.props.id}-tiles`,
        minZoom,
        maxZoom,
        tileSize,
        getTileData: this.getTileData.bind(this),
        onTileError: (err: Error) => {
          warn(`[deck][tilelayer] Error: ${err.message}`);
        },
        renderSubLayers: (subProps: any) => {
          const { tile } = subProps;

          if (!tile?.data) return null;

          const { data, width, height } = tile.data;
          const { west, south, east, north } = subProps.tile.bbox;
          const bounds: BitmapBoundingBox = [west, south, east, north];

          return new BitmapLayer({
            ...subProps,
            id: `${subProps.id}-bitmap`,
            image: {
              data,
              width,
              height,
            },
            bounds: bounds,
            textureParameters: {
              [WebGLRenderingContext.TEXTURE_MIN_FILTER]:
                WebGLRenderingContext.LINEAR,
              [WebGLRenderingContext.TEXTURE_MAG_FILTER]:
                WebGLRenderingContext.LINEAR,
            },
          });
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
