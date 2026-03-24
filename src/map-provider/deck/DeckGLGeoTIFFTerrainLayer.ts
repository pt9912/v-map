import type {
  Layer,
  LayerProps,
  UpdateParameters,
  DefaultProps,
} from '@deck.gl/core';
import type { GeoTIFF, GeoTIFFImage } from 'geotiff';
import type { ColorMap as GeoStylerColorMap } from 'geostyler-style';
import { log, warn, error } from '../../utils/logger';
import { loadGeoTIFFSource, GeoTIFFSource } from '../geotiff/geotiff-source';
import type { ColorMapName } from '../geotiff/utils/colormap-utils';

export interface DeckGLGeoTIFFTerrainLayerProps extends LayerProps {
  url?: string; // URL des GeoTIFF (Elevation Data)

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
  const [{ CompositeLayer }, proj4Module, geotiffModule, geokeysModule] =
    await Promise.all([
      import('@deck.gl/core'),
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
    //private fromProjection: string = 'EPSG:4326';
    //private toProjection: string = 'EPSG:3857';
    private sourceBounds: [number, number, number, number] = [0, 0, 0, 0];

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
    }

    // ============================================================================
    // GEOTIFF LOADING
    // ============================================================================

    async loadGeoTIFF() {
      const { url, projection, forceProjection } = this.props;

      // If no URL is provided, skip loading
      if (!url) {
        log('[terrain-geotiff] No URL provided, skipping GeoTIFF loading');
        return;
      }

      log(`[terrain-geotiff] Loading GeoTIFF from ${url}`);
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

        this.tiff = source.tiff;
        this.image = source.baseImage;
        // Note: sourceRef, resolution, width, height, and overviewImages are not used
        // this.fromProjection = source.fromProjection;
        //this.toProjection = source.toProjection;
        this.sourceBounds = source.sourceBounds;

        log('[terrain-geotiff] GeoTIFF loaded successfully');
        //        log(
        //          `[terrain-geotiff] Projection: ${this.fromProjection} -> ${this.toProjection}`,
        //        );
        log(`[terrain-geotiff] Bounds: ${this.sourceBounds}`);

        this.setNeedsRedraw();
      } catch (err) {
        error('[terrain-geotiff] Failed to load GeoTIFF:', err);
        this.raiseError(err as Error, 'Failed to load GeoTIFF');
      }
    }

    // ============================================================================
    // RENDERING
    // ============================================================================

    renderLayers() {
      if (!this.image) return null;

      // IMPORTANT: deck.gl's TerrainLayer doesn't support GeoTIFF elevation data directly
      // It expects Mapbox Terrain RGB tiles or a similar tile service
      // For GeoTIFF terrain, use Cesium provider instead

      warn(
        '[terrain-geotiff] deck.gl TerrainLayer does not support GeoTIFF elevation data.',
      );
      warn(
        '[terrain-geotiff] Please use provider="cesium" for GeoTIFF terrain support.',
      );
      warn(
        '[terrain-geotiff] deck.gl terrain-geotiff is currently not implemented.',
      );

      // Return null for now - no rendering
      // TODO: Implement custom TileLayer with Martini mesh generation for GeoTIFF terrain
      return null;
    }
  }

  // Layer-Instanz erstellen und zurückgeben
  return new DeckGLGeoTIFFTerrainLayer(props) as unknown as Layer;
}
