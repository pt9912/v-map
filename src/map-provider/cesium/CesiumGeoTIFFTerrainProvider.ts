import type { GeoTIFFImage } from 'geotiff';
import type proj4Type from 'proj4';
import { log, warn, error } from '../../utils/logger';
import { loadGeoTIFFSource, GeoTIFFSource } from '../geotiff/geotiff-source';

type CesiumModule = typeof import('cesium');
import type { TerrainProvider, TilingScheme, TerrainData, Rectangle, Credit, TileAvailability, Event as CesiumEvent } from 'cesium';

export interface CesiumGeoTIFFTerrainProviderOptions {
  url: string;
  projection?: string;
  forceProjection?: boolean;
  nodata?: number;
  Cesium: CesiumModule;
}

/**
 * Custom Cesium Terrain Provider for GeoTIFF elevation data
 *
 * This provider loads a GeoTIFF file containing elevation data and provides
 * it to Cesium's terrain system as a heightmap.
 */
export class CesiumGeoTIFFTerrainProvider implements TerrainProvider {
  private Cesium: CesiumModule;
  private image?: GeoTIFFImage;
  private fromProjection: string = 'EPSG:4326';
  private sourceBounds: [number, number, number, number] = [0, 0, 0, 0];
  private wgs84Bounds: [number, number, number, number] = [0, 0, 0, 0];
  private width: number = 0;
  private height: number = 0;
  private noDataValue: number = 0;
  private ready: boolean = false;
  private _readyPromise: Promise<boolean>;
  private heightmapWidth: number = 65;
  private heightmapHeight: number = 65;
  private proj4: typeof proj4Type;

  tilingScheme: TilingScheme;

  constructor(options: CesiumGeoTIFFTerrainProviderOptions) {
    this.Cesium = options.Cesium;

    // Initialize with GeographicTilingScheme (WGS84)
    this.tilingScheme = new this.Cesium.GeographicTilingScheme();

    // Start loading the GeoTIFF
    this._readyPromise = this.initialize(options);
  }

  private async initialize(
    options: CesiumGeoTIFFTerrainProviderOptions,
  ): Promise<boolean> {
    try {
      log(`[cesium-terrain-geotiff] Loading GeoTIFF from ${options.url}`);

      const [geotiffModule, { default: proj4 }, geokeysModule] = await Promise.all([
        import('geotiff'),
        import('proj4'),
        import('geotiff-geokeys-to-proj4'),
      ]);

      const source: GeoTIFFSource = await loadGeoTIFFSource(
        options.url,
        {
          projection: options.projection,
          forceProjection: options.forceProjection ?? false,
          nodata: options.nodata,
        },
        {
          geotiff: geotiffModule,
          proj4,
          geokeysToProj4: geokeysModule,
        },
      );

      this.image = source.baseImage;
      this.fromProjection = source.fromProjection;
      this.sourceBounds = source.sourceBounds;
      this.wgs84Bounds = source.wgs84Bounds;
      this.width = source.width;
      this.height = source.height;
      this.noDataValue = source.noDataValue ?? 0;
      this.proj4 = source.proj4; // Store proj4 instance with registered projections

      log('[cesium-terrain-geotiff] GeoTIFF loaded successfully');
      log(
        `[cesium-terrain-geotiff] Source projection: ${this.fromProjection}`,
      );
      log(`[cesium-terrain-geotiff] Bounds: ${this.sourceBounds}`);
      log(`[cesium-terrain-geotiff] WGS84 Bounds: ${this.wgs84Bounds}`);
      log(`[cesium-terrain-geotiff] Dimensions: ${this.width}x${this.height}`);

      this.ready = true;
      return true;
    } catch (err) {
      error('[cesium-terrain-geotiff] Failed to load GeoTIFF:', err);
      this.ready = false;
      return false;
    }
  }

  /**
   * Get the coverage rectangle in WGS84 coordinates
   */
  get rectangle(): Rectangle {
    if (!this.ready || !this.wgs84Bounds) {
      return this.Cesium.Rectangle.MAX_VALUE;
    }

    const [west, south, east, north] = this.wgs84Bounds;
    return this.Cesium.Rectangle.fromDegrees(west, south, east, north);
  }

  /**
   * Request tile geometry for a specific tile
   */
  async requestTileGeometry(
    x: number,
    y: number,
    level: number,
  ): Promise<TerrainData> {
    if (!this.ready || !this.image) {
      return undefined;
    }

    try {
      // Get tile bounds in WGS84
      const rectangle = this.tilingScheme.tileXYToRectangle(x, y, level);
      let west = this.Cesium.Math.toDegrees(rectangle.west);
      let south = this.Cesium.Math.toDegrees(rectangle.south);
      let east = this.Cesium.Math.toDegrees(rectangle.east);
      let north = this.Cesium.Math.toDegrees(rectangle.north);

      // Get GeoTIFF bounds in WGS84
      const [geoWest, geoSouth, geoEast, geoNorth] = this.wgs84Bounds;

      // Check if tile intersects with GeoTIFF bounds
      if (
        east < geoWest ||
        west > geoEast ||
        north < geoSouth ||
        south > geoNorth
      ) {
        // Tile is completely outside GeoTIFF bounds, return flat heightmap
        return this.createFlatHeightmap();
      }

      // Clamp tile bounds to GeoTIFF coverage area
      // This prevents transformation errors when the GeoTIFF projection
      // doesn't support the full WGS84 range (e.g., Mercator and poles)
      west = Math.max(geoWest, Math.min(geoEast, west));
      east = Math.max(geoWest, Math.min(geoEast, east));
      south = Math.max(geoSouth, Math.min(geoNorth, south));
      north = Math.max(geoSouth, Math.min(geoNorth, north));

      // Transform tile bounds to source projection
      // Use the stored proj4 instance that has the projection definitions
      const transformToSource = (coord: [number, number]): [number, number] => {
        try {
          return this.proj4('EPSG:4326', this.fromProjection, coord) as [
            number,
            number,
          ];
        } catch (err) {
          warn('[cesium-terrain-geotiff] Transform failed:', err);
          return coord;
        }
      };

      const swSource = transformToSource([west, south]);
      const neSource = transformToSource([east, north]);

      // Calculate pixel coordinates in GeoTIFF
      const [srcWest, srcSouth, srcEast, srcNorth] = this.sourceBounds;
      const srcWidth = this.width;
      const srcHeight = this.height;

      const pixelWidth = srcEast - srcWest;
      const pixelHeight = srcNorth - srcSouth;

      const x0 = Math.floor(((swSource[0] - srcWest) / pixelWidth) * srcWidth);
      const y0 = Math.floor(
        ((srcNorth - neSource[1]) / pixelHeight) * srcHeight,
      );
      const x1 = Math.ceil(((neSource[0] - srcWest) / pixelWidth) * srcWidth);
      const y1 = Math.ceil(
        ((srcNorth - swSource[1]) / pixelHeight) * srcHeight,
      );

      // Clamp to image bounds
      const windowX = Math.max(0, Math.min(x0, srcWidth));
      const windowY = Math.max(0, Math.min(y0, srcHeight));
      const windowWidth = Math.max(1, Math.min(x1 - x0, srcWidth - windowX));
      const windowHeight = Math.max(1, Math.min(y1 - y0, srcHeight - windowY));

      // Read elevation data from GeoTIFF
      const rasterData = await this.image.readRasters({
        window: [
          windowX,
          windowY,
          windowX + windowWidth,
          windowY + windowHeight,
        ],
        width: this.heightmapWidth,
        height: this.heightmapHeight,
        resampleMethod: 'bilinear',
      });

      // Convert to heightmap array (first band contains elevation)
      const elevationData = rasterData[0] as
        | Float32Array
        | Int16Array
        | Uint16Array;
      const buffer = new Float32Array(
        this.heightmapWidth * this.heightmapHeight,
      );

      for (let i = 0; i < buffer.length; i++) {
        let value = elevationData[i];
        // Replace nodata values with 0
        if (value === this.noDataValue || !isFinite(value)) {
          value = 0;
        }
        buffer[i] = value;
      }

      // Create Cesium HeightmapTerrainData
      return new this.Cesium.HeightmapTerrainData({
        buffer,
        width: this.heightmapWidth,
        height: this.heightmapHeight,
        childTileMask: 0,
        structure: {
          heightScale: 1.0,
          heightOffset: 0.0,
          elementsPerHeight: 1,
          stride: 1,
          elementMultiplier: 1.0,
        },
      });
    } catch (err) {
      warn('[cesium-terrain-geotiff] Failed to load tile geometry:', err);
      return this.createFlatHeightmap();
    }
  }

  /**
   * Create a flat heightmap for tiles outside the GeoTIFF bounds
   */
  private createFlatHeightmap(): TerrainData {
    const buffer = new Float32Array(this.heightmapWidth * this.heightmapHeight);
    buffer.fill(0);

    return new this.Cesium.HeightmapTerrainData({
      buffer,
      width: this.heightmapWidth,
      height: this.heightmapHeight,
      childTileMask: 0,
    });
  }

  /**
   * Get the availability of tiles
   */
  get availability(): TileAvailability | undefined {
    // For now, we say all tiles are available
    // In a more sophisticated implementation, we'd track which tiles
    // intersect with the GeoTIFF bounds
    return undefined;
  }

  /**
   * Get the tiling scheme
   */
  getTilingScheme(): TilingScheme {
    return this.tilingScheme;
  }

  /**
   * Get the maximum geometric error allowed at a specific level
   * Required by Cesium's TerrainProvider interface
   *
   * The geometric error is the difference (in meters) between the actual terrain
   * and the terrain approximation at this level. Higher levels have lower error.
   */
  getLevelMaximumGeometricError(level: number): number {
    // Standard geometric error calculation for terrain providers
    // Based on Cesium's approach: error decreases exponentially with level
    // Formula: maximumRadius / (tileWidth * (2^level))
    const ellipsoid = this.tilingScheme.ellipsoid;
    const maximumRadius = ellipsoid.maximumRadius;
    const tileWidth = 65; // Standard heightmap width
    return maximumRadius / (tileWidth * Math.pow(2, level));
  }

  loadTileDataAvailability(
    _x: number,
    _y: number,
    _level: number,
  ): undefined | Promise<void> {
    return undefined;
  }

  /**
   * Check if tile data is available for a specific tile
   * Required by Cesium's TerrainProvider interface
   */
  getTileDataAvailable(
    x: number,
    y: number,
    level: number,
  ): boolean | undefined {
    if (!this.ready) {
      return false;
    }

    // Check if tile intersects with GeoTIFF bounds
    const rectangle = this.tilingScheme.tileXYToRectangle(x, y, level);
    const west = this.Cesium.Math.toDegrees(rectangle.west);
    const south = this.Cesium.Math.toDegrees(rectangle.south);
    const east = this.Cesium.Math.toDegrees(rectangle.east);
    const north = this.Cesium.Math.toDegrees(rectangle.north);

    const [geoWest, geoSouth, geoEast, geoNorth] = this.wgs84Bounds;

    // Return true if tile intersects with GeoTIFF bounds
    return !(
      east < geoWest ||
      west > geoEast ||
      north < geoSouth ||
      south > geoNorth
    );
  }

  /**
   * Check if the provider is ready
   */
  get readyPromise(): Promise<boolean> {
    return this._readyPromise;
  }

  /**
   * Get the credit to display
   */
  get credit(): Credit {
    return new this.Cesium.Credit('GeoTIFF Terrain');
  }

  /**
   * Check if the provider has water mask
   */
  get hasWaterMask(): boolean {
    return false;
  }

  /**
   * Check if the provider has vertex normals
   */
  get hasVertexNormals(): boolean {
    return false;
  }

  /**
   * Get the error event
   */
  get errorEvent(): CesiumEvent<TerrainProvider.ErrorEvent> {
    return new this.Cesium.Event();
  }
}

/**
 * Factory function to create a CesiumGeoTIFFTerrainProvider
 */
export async function createCesiumGeoTIFFTerrainProvider(
  options: CesiumGeoTIFFTerrainProviderOptions,
): Promise<TerrainProvider> {
  const provider = new CesiumGeoTIFFTerrainProvider(options);
  await provider.readyPromise;
  return provider;
}
