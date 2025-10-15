import type { GeoTIFFImage } from 'geotiff';
import { log, warn, error } from '../../utils/logger';
import { loadGeoTIFFSource } from '../geotiff/geotiff-source';

export interface CesiumGeoTIFFTerrainProviderOptions {
  url: string;
  projection?: string;
  forceProjection?: boolean;
  nodata?: number;
  Cesium: any;
}

/**
 * Custom Cesium Terrain Provider for GeoTIFF elevation data
 *
 * This provider loads a GeoTIFF file containing elevation data and provides
 * it to Cesium's terrain system as a heightmap.
 */
export class CesiumGeoTIFFTerrainProvider {
  private Cesium: any;
  private image?: GeoTIFFImage;
  private fromProjection: string = 'EPSG:4326';
  private toProjection: string = 'EPSG:3857';
  private sourceBounds: [number, number, number, number] = [0, 0, 0, 0];
  private wgs84Bounds: [number, number, number, number] = [0, 0, 0, 0];
  private width: number = 0;
  private height: number = 0;
  private noDataValue: number = 0;
  private ready: boolean = false;
  private _readyPromise: Promise<boolean>;
  private tilingScheme: any;
  private heightmapWidth: number = 65;
  private heightmapHeight: number = 65;

  constructor(options: CesiumGeoTIFFTerrainProviderOptions) {
    this.Cesium = options.Cesium;

    // Initialize with GeographicTilingScheme (WGS84)
    this.tilingScheme = new this.Cesium.GeographicTilingScheme();

    // Start loading the GeoTIFF
    this._readyPromise = this.initialize(options);
  }

  private async initialize(options: CesiumGeoTIFFTerrainProviderOptions): Promise<boolean> {
    try {
      log(`[cesium-terrain-geotiff] Loading GeoTIFF from ${options.url}`);

      const [geotiffModule, proj4Module, geokeysModule] = await Promise.all([
        import('geotiff'),
        import('proj4'),
        import('geotiff-geokeys-to-proj4'),
      ]);

      const proj4 = (proj4Module as any).default ?? proj4Module;

      const source = await loadGeoTIFFSource(
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
      this.toProjection = source.toProjection;
      this.sourceBounds = source.sourceBounds;
      this.wgs84Bounds = source.wgs84Bounds;
      this.width = source.width;
      this.height = source.height;
      this.noDataValue = source.noDataValue ?? 0;

      log('[cesium-terrain-geotiff] GeoTIFF loaded successfully');
      log(`[cesium-terrain-geotiff] Projection: ${this.fromProjection} -> ${this.toProjection}`);
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
  get rectangle(): any {
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
  ): Promise<any> {
    if (!this.ready || !this.image) {
      return undefined;
    }

    try {
      // Get tile bounds in WGS84
      const rectangle = this.tilingScheme.tileXYToRectangle(x, y, level);
      const west = this.Cesium.Math.toDegrees(rectangle.west);
      const south = this.Cesium.Math.toDegrees(rectangle.south);
      const east = this.Cesium.Math.toDegrees(rectangle.east);
      const north = this.Cesium.Math.toDegrees(rectangle.north);

      // Check if tile intersects with GeoTIFF bounds
      const [geoWest, geoSouth, geoEast, geoNorth] = this.wgs84Bounds;
      if (east < geoWest || west > geoEast || north < geoSouth || south > geoNorth) {
        // Tile is outside GeoTIFF bounds, return flat heightmap
        return this.createFlatHeightmap();
      }

      // Load elevation data for this tile
      const proj4Module = await import('proj4');
      const proj4 = (proj4Module as any).default ?? proj4Module;

      // Transform tile bounds to source projection
      const transformToSource = (coord: [number, number]): [number, number] => {
        return proj4('EPSG:4326', this.fromProjection, coord) as [number, number];
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
      const y0 = Math.floor(((srcNorth - neSource[1]) / pixelHeight) * srcHeight);
      const x1 = Math.ceil(((neSource[0] - srcWest) / pixelWidth) * srcWidth);
      const y1 = Math.ceil(((srcNorth - swSource[1]) / pixelHeight) * srcHeight);

      // Clamp to image bounds
      const windowX = Math.max(0, Math.min(x0, srcWidth));
      const windowY = Math.max(0, Math.min(y0, srcHeight));
      const windowWidth = Math.max(1, Math.min(x1 - x0, srcWidth - windowX));
      const windowHeight = Math.max(1, Math.min(y1 - y0, srcHeight - windowY));

      // Read elevation data from GeoTIFF
      const rasterData = await this.image.readRasters({
        window: [windowX, windowY, windowX + windowWidth, windowY + windowHeight],
        width: this.heightmapWidth,
        height: this.heightmapHeight,
        resampleMethod: 'bilinear',
      });

      // Convert to heightmap array (first band contains elevation)
      const elevationData = rasterData[0] as Float32Array | Int16Array | Uint16Array;
      const buffer = new Float32Array(this.heightmapWidth * this.heightmapHeight);

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
  private createFlatHeightmap(): any {
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
  get availability(): any {
    // For now, we say all tiles are available
    // In a more sophisticated implementation, we'd track which tiles
    // intersect with the GeoTIFF bounds
    return undefined;
  }

  /**
   * Get the tiling scheme
   */
  getTilingScheme(): any {
    return this.tilingScheme;
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
  get credit(): any {
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
  get errorEvent(): any {
    return new this.Cesium.Event();
  }
}

/**
 * Factory function to create a CesiumGeoTIFFTerrainProvider
 */
export async function createCesiumGeoTIFFTerrainProvider(
  options: CesiumGeoTIFFTerrainProviderOptions,
): Promise<CesiumGeoTIFFTerrainProvider> {
  const provider = new CesiumGeoTIFFTerrainProvider(options);
  await provider.readyPromise;
  return provider;
}
