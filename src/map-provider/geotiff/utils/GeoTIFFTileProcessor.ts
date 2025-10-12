import type { GeoTIFFImage } from 'geotiff';
import { Triangulation, TriResult, calculateBounds } from './Triangulation';
import { log, warn } from '../../../utils/logger';
import {
  type TypedArray,
  sampleNearest,
  sampleBilinear,
} from './sampling-utils';
import { type ColorStop } from './colormap-utils';
import { type TypedArrayType } from './normalization-utils';

/**
 * Configuration for the GeoTIFF Tile Processor
 */
export interface GeoTIFFTileProcessorConfig {
  // Projection transformation function (e.g., proj4)
  transformViewToSourceMapFn: (coord: [number, number]) => [number, number];
  transformSourceMapToViewFn: (coord: [number, number]) => [number, number];

  // Source image properties
  sourceBounds: [number, number, number, number];
  sourceRef: [number, number];
  resolution: number;
  imageWidth: number;
  imageHeight: number;

  // Projections
  fromProjection: string;
  toProjection: string;

  // Images
  baseImage: GeoTIFFImage;
  overviewImages: GeoTIFFImage[];

  // World size for tile calculations (Web Mercator)
  worldSize?: number;
}

/**
 * Parameters for tile data generation
 */
export interface TileDataParams {
  x: number;
  y: number;
  z: number;
  tileSize: number;
  resolution: number;
  resampleMethod: 'near' | 'bilinear';
  colorStops?: ColorStop[];
}

/**
 * Result of read window calculation
 */
interface ReadWindow {
  readXMin: number;
  readXMax: number;
  readYMin: number;
  readYMax: number;
  readWidth: number;
  readHeight: number;
}

/**
 * Processes GeoTIFF tiles with triangulation-based reprojection
 *
 * This class encapsulates the tile rendering logic using triangulation
 * for efficient reprojection from arbitrary source projections to Web Mercator.
 */
export class GeoTIFFTileProcessor {
  // Configuration
  private config: GeoTIFFTileProcessorConfig;
  private worldSize: number = 40075016.686; // Earth circumference in meters (Web Mercator)

  // Global triangulation for the entire image (created once)
  private globalTriangulation?: Triangulation;

  constructor(config: GeoTIFFTileProcessorConfig) {
    this.config = config;
    if (config.worldSize) {
      this.worldSize = config.worldSize;
    }
  }

  /**
   * Create global triangulation for the entire GeoTIFF image
   * This is called once to avoid recreating triangulation for every tile
   */
  public createGlobalTriangulation(): void {
    const startTime = performance.now();

    const [srcWest, srcSouth, srcEast, srcNorth] = this.config.sourceBounds;

    // Transform source corners to target projection (Mercator)
    const transformFnToProj = (coord: [number, number]): [number, number] => {
      return this.config.transformSourceMapToViewFn(coord);
    };

    const { source: bounds } = calculateBounds(
      null,
      null,
      [srcWest, srcSouth, srcEast, srcNorth],
      transformFnToProj,
    );

    const mercatorBounds: [number, number, number, number] = [
      bounds.minX,
      bounds.minY,
      bounds.maxX,
      bounds.maxY,
    ];

    log('Creating global triangulation for bounds:', {
      source: this.config.sourceBounds,
      mercator: mercatorBounds,
    });

    // Inverse transformation: from target (Mercator) back to source
    const inverseTransformFn = (coord: [number, number]): [number, number] => {
      return this.config.transformViewToSourceMapFn(coord);
    };

    // Use adaptive error threshold based on pixel resolution
    const errorThreshold = this.config.resolution / 2.0;

    const step = Math.min(
      10,
      Math.max(this.config.imageWidth, this.config.imageHeight) / 256,
    );

    this.globalTriangulation = new Triangulation(
      inverseTransformFn,
      mercatorBounds,
      errorThreshold,
      this.config.sourceRef,
      this.config.resolution,
      step,
    );

    // Force indexing
    this.globalTriangulation.findSourceTriangleForTargetPoint([0, 0]);

    const triangles = this.globalTriangulation.getTriangles();
    log(
      `Global triangulation created: ${triangles.length} triangles in ${(
        performance.now() - startTime
      ).toFixed(2)}ms`,
    );
  }

  /**
   * Get the global triangulation (may be undefined if not created yet)
   */
  public getGlobalTriangulation(): Triangulation | undefined {
    return this.globalTriangulation;
  }

  /**
   * Calculate tile size in meters for a given zoom level
   */
  private getTileSizeInMeter(z: number): number {
    return this.worldSize / Math.pow(2, z);
  }

  /**
   * Convert tile coordinates to Web Mercator bounds in meters
   */
  private getTileBounds(
    x: number,
    y: number,
    z: number,
  ): [number, number, number, number] {
    const tileSize = this.getTileSizeInMeter(z);
    const west = -this.worldSize / 2 + x * tileSize;
    const north = this.worldSize / 2 - y * tileSize;
    const east = west + tileSize;
    const south = north - tileSize;

    return [west, south, east, north];
  }

  /**
   * Select best overview image based on zoom level
   */
  private selectOverviewImage(
    z: number,
    tileSize: number,
  ): {
    bestImage: GeoTIFFImage;
    bestResolution: number;
    imageLevel: number;
  } {
    const baseResolution = this.config.baseImage.getResolution()[0];
    if (
      !this.config.overviewImages ||
      this.config.overviewImages.length === 0
    ) {
      return {
        bestImage: this.config.baseImage,
        bestResolution: baseResolution,
        imageLevel: 0,
      };
    }

    const tileSizeInMeter = this.getTileSizeInMeter(z);
    const tileResolution = tileSizeInMeter / tileSize;

    // Check base image and all overviews
    const allImages = [this.config.baseImage, ...this.config.overviewImages];

    const maxResImage = allImages[this.config.overviewImages.length];
    const maxResolution =
      baseResolution * Math.pow(2, this.config.overviewImages.length);

    let imageLevel = this.config.overviewImages.length;
    let bestResolution = maxResolution;
    let bestImage = maxResImage;

    let levelCounter = 0;
    let resolution = baseResolution;
    for (const img of allImages) {
      const ratio = tileResolution / (resolution * 2.0);

      if (ratio <= 1.0) {
        bestImage = img;
        bestResolution = resolution;
        imageLevel = levelCounter;
        break;
      }
      levelCounter++;
      resolution = resolution * 2;
    }

    return { bestImage, bestResolution, imageLevel };
  }

  /**
   * Calculate source bounds for a tile after transformation
   */
  private calculateTileSourceBounds(
    mercatorBounds: [number, number, number, number],
  ): {
    tileSrcWest: number;
    tileSrcEast: number;
    tileSrcSouth: number;
    tileSrcNorth: number;
  } {
    const [mercWest, mercSouth, mercEast, mercNorth] = mercatorBounds;

    const { source: bounds } = calculateBounds(
      this.config.sourceRef,
      this.config.resolution,
      [mercWest, mercSouth, mercEast, mercNorth],
      this.config.transformViewToSourceMapFn,
    );

    // Transform tile corners from Mercator to Source projection
    const sw = this.config.transformViewToSourceMapFn([mercWest, mercSouth]);
    const ne = this.config.transformViewToSourceMapFn([mercEast, mercNorth]);
    const nw = this.config.transformViewToSourceMapFn([mercWest, mercNorth]);
    const se = this.config.transformViewToSourceMapFn([mercEast, mercSouth]);

    // Calculate bounding box from transformed corners
    const tileSrcWest = Math.min(bounds.minX, sw[0], ne[0], nw[0], se[0]);
    const tileSrcEast = Math.max(bounds.maxX, sw[0], ne[0], nw[0], se[0]);
    const tileSrcSouth = Math.min(bounds.minY, sw[1], ne[1], nw[1], se[1]);
    const tileSrcNorth = Math.max(bounds.maxY, sw[1], ne[1], nw[1], se[1]);

    return { tileSrcWest, tileSrcEast, tileSrcSouth, tileSrcNorth };
  }

  /**
   * Calculate pixel window for reading from GeoTIFF
   */
  private calculateReadWindow(
    tileSrcBounds: {
      tileSrcWest: number;
      tileSrcEast: number;
      tileSrcSouth: number;
      tileSrcNorth: number;
    },
    ovWidth: number,
    ovHeight: number,
  ): ReadWindow | null {
    const [srcWest, srcSouth, srcEast, srcNorth] = this.config.sourceBounds;
    const srcWidth = srcEast - srcWest;
    const srcHeight = srcNorth - srcSouth;

    const { tileSrcWest, tileSrcEast, tileSrcSouth, tileSrcNorth } =
      tileSrcBounds;

    // Calculate pixel window for this tile area
    const pixelXMin = Math.floor(
      ((tileSrcWest - srcWest) / srcWidth) * ovWidth,
    );
    const pixelXMax = Math.ceil(((tileSrcEast - srcWest) / srcWidth) * ovWidth);
    const pixelYMin = Math.floor(
      ((srcNorth - tileSrcNorth) / srcHeight) * ovHeight,
    );
    const pixelYMax = Math.ceil(
      ((srcNorth - tileSrcSouth) / srcHeight) * ovHeight,
    );

    // Bounds check with 2-pixel padding
    const readXMin = Math.min(ovWidth, Math.max(0, pixelXMin - 2));
    const readXMax = Math.max(0, Math.min(ovWidth, pixelXMax + 2));
    const readYMin = Math.min(ovHeight, Math.max(0, pixelYMin - 2));
    const readYMax = Math.max(0, Math.min(ovHeight, pixelYMax + 2));

    const readWidth = readXMax - readXMin;
    const readHeight = readYMax - readYMin;

    if (readWidth <= 0 || readHeight <= 0) {
      warn('Invalid read window for tile', {
        readXMin,
        readXMax,
        readYMin,
        readYMax,
        ovWidth,
        ovHeight,
      });
      return null;
    }

    return {
      readXMin,
      readXMax,
      readYMin,
      readYMax,
      readWidth,
      readHeight,
    };
  }

  /**
   * Load and convert raster data from GeoTIFF image
   */
  private async loadAndConvertRasterData(
    image: GeoTIFFImage,
    window: ReadWindow,
  ): Promise<{
    rasterBands: TypedArray[];
    arrayType: string;
  }> {
    const { readXMin, readYMin, readXMax, readYMax } = window;

    // Read only the needed area from GeoTIFF (COG-optimized!)
    const rasters = await image.readRasters({
      window: [readXMin, readYMin, readXMax, readYMax],
    });

    // Convert to TypedArray array and detect type
    const rasterBands: TypedArray[] = [];
    let arrayType = '';

    for (let i = 0; i < rasters.length; i++) {
      const raster = rasters[i];
      if (typeof raster === 'number') {
        warn('Unexpected number in rasters array');
        continue;
      }
      rasterBands.push(raster as TypedArray);
      if (i === 0) {
        arrayType = raster.constructor.name;
      }
    }

    return { rasterBands, arrayType };
  }

  /**
   * Render tile pixels using triangulation-based reprojection
   */
  private renderTilePixels(params: {
    sampleSize: number;
    mercatorBounds: [number, number, number, number];
    triangulation: Triangulation;
    rasterBands: TypedArray[];
    arrayType: string;
    readWindow: ReadWindow;
    ovWidth: number;
    ovHeight: number;
    resampleMethod: 'near' | 'bilinear';
    colorStops?: ColorStop[];
  }): Uint8ClampedArray {
    const {
      sampleSize,
      mercatorBounds,
      triangulation,
      rasterBands,
      arrayType,
      readWindow,
      ovWidth,
      ovHeight,
      resampleMethod,
      colorStops,
    } = params;

    const [mercWest, mercSouth, mercEast, mercNorth] = mercatorBounds;
    const [srcWest, srcSouth, srcEast, srcNorth] = this.config.sourceBounds;
    const srcWidth = srcEast - srcWest;
    const srcHeight = srcNorth - srcSouth;

    const outputData = new Uint8ClampedArray(sampleSize * sampleSize * 4); // RGBA

    let tri: TriResult = null;
    for (let py = 0; py < sampleSize; py++) {
      for (let px = 0; px < sampleSize; px++) {
        const idx = (py * sampleSize + px) * 4; // RGBA index

        // Pixel position in Mercator
        const mercX = mercWest + (px / sampleSize) * (mercEast - mercWest);
        const mercY = mercNorth - (py / sampleSize) * (mercNorth - mercSouth);

        // Find triangle containing this pixel
        const targetPoint: [number, number] = [mercX, mercY];
        tri = triangulation.findSourceTriangleForTargetPoint(targetPoint, tri);

        if (tri) {
          // Transform using affine transformation
          const [srcX, srcY] = triangulation.applyAffineTransform(
            mercX,
            mercY,
            tri.transform,
          );

          // Check if point is within source bounds
          if (
            srcX < srcWest ||
            srcX > srcEast ||
            srcY < srcSouth ||
            srcY > srcNorth
          ) {
            // Outside bounds - transparent
            outputData[idx] = 0;
            outputData[idx + 1] = 0;
            outputData[idx + 2] = 0;
            outputData[idx + 3] = 0;
          } else {
            // Convert source coordinates to pixel coordinates (in overview image)
            const imgX = ((srcX - srcWest) / srcWidth) * ovWidth;
            const imgY = ((srcNorth - srcY) / srcHeight) * ovHeight;

            // Sample pixel from source raster
            const rgba =
              resampleMethod === 'near'
                ? sampleNearest(
                    imgX,
                    imgY,
                    rasterBands,
                    arrayType as TypedArrayType,
                    readWindow.readWidth,
                    readWindow.readHeight,
                    readWindow.readXMin,
                    readWindow.readYMin,
                    colorStops,
                  )
                : sampleBilinear(
                    imgX,
                    imgY,
                    rasterBands,
                    arrayType as TypedArrayType,
                    readWindow.readWidth,
                    readWindow.readHeight,
                    readWindow.readXMin,
                    readWindow.readYMin,
                    colorStops,
                  );

            if (rgba) {
              outputData[idx] = rgba[0];
              outputData[idx + 1] = rgba[1];
              outputData[idx + 2] = rgba[2];
              outputData[idx + 3] = rgba[3];
            } else {
              // No data
              outputData[idx] = 0;
              outputData[idx + 1] = 0;
              outputData[idx + 2] = 0;
              outputData[idx + 3] = 0;
            }
          }
        } else {
          // Pixel not in any triangle (should not happen)
          outputData[idx] = 0;
          outputData[idx + 1] = 0;
          outputData[idx + 2] = 0;
          outputData[idx + 3] = 0;
        }
      }
    }

    return outputData;
  }

  /**
   * Generate tile data with triangulation-based reprojection
   *
   * This is the main method that orchestrates the entire tile rendering process.
   */
  public async getTileData(
    params: TileDataParams,
  ): Promise<Uint8ClampedArray | null> {
    const { x, y, z, tileSize, resolution, resampleMethod, colorStops } =
      params;

    // 1. Calculate Web Mercator bounds for the tile
    const mercatorBounds = this.getTileBounds(x, y, z);

    // 2. Calculate sampling resolution
    const sampleSize = Math.ceil(tileSize * resolution);

    // 3. Get or create triangulation
    let triangulation: Triangulation;
    if (!this.globalTriangulation) {
      warn('Global triangulation not available, creating fallback for tile');
      triangulation = new Triangulation(
        this.config.transformViewToSourceMapFn,
        mercatorBounds,
        0.5,
      );
    } else {
      triangulation = this.globalTriangulation;
    }

    // 4. Calculate source bounds for this tile
    const tileSrcBounds = this.calculateTileSourceBounds(mercatorBounds);

    // 5. Select best overview image based on zoom
    const { bestImage, bestResolution, imageLevel } = this.selectOverviewImage(
      z,
      tileSize,
    );
    const ovWidth = bestImage.getWidth();
    const ovHeight = bestImage.getHeight();

    // 6. Calculate pixel window for reading
    const readWindow = this.calculateReadWindow(
      tileSrcBounds,
      ovWidth,
      ovHeight,
    );
    if (!readWindow) {
      return new Uint8ClampedArray(sampleSize * sampleSize * 4);
    }

    // 7. Load and convert raster data
    const { rasterBands, arrayType } = await this.loadAndConvertRasterData(
      bestImage,
      readWindow,
    );

    const bandCount = rasterBands.length;
    log(
      `Read window: [${readWindow.readXMin}, ${readWindow.readYMin}, ${readWindow.readXMax}, ${readWindow.readYMax}] (${readWindow.readWidth}x${readWindow.readHeight} pixels), ${bandCount} bands, type: ${arrayType}, imageLevel: ${imageLevel}, resolution: ${bestResolution}`,
    );

    // 8. Render tile pixels
    const outputData = this.renderTilePixels({
      sampleSize,
      mercatorBounds,
      triangulation,
      rasterBands,
      arrayType,
      readWindow,
      ovWidth,
      ovHeight,
      resampleMethod,
      colorStops,
    });

    return outputData;
  }
}
