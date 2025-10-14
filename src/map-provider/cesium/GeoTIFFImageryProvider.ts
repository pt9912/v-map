import type { ColorStop } from '../geotiff/utils/colormap-utils';
import {
  GeoTIFFTileProcessor,
  type TileDataParams,
} from '../geotiff/utils/GeoTIFFTileProcessor';
import { warn } from '../../utils/logger';

type CesiumModule = typeof import('cesium');
import type {
  Credit,
  Event as CesiumEvent,
  ImageryProvider,
  Rectangle,
  TileDiscardPolicy,
  TilingScheme,
} from 'cesium';

export interface CesiumGeoTIFFImageryOptions {
  Cesium: CesiumModule;
  rectangleDegrees: [number, number, number, number];
  tileProcessor: GeoTIFFTileProcessor;
  tileSize: number;
  resolution: number;
  resampleMethod: 'near' | 'bilinear';
  colorStops?: ColorStop[];
  minimumLevel?: number;
  maximumLevel?: number;
}

/**
 * Custom ImageryProvider that renders GeoTIFF tiles on demand using
 * the shared GeoTIFFTileProcessor (triangulation-based reprojection).
 */
export class GeoTIFFImageryProvider implements ImageryProvider {
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly tilingScheme: TilingScheme;
  readonly rectangle: Rectangle;
  readonly errorEvent: CesiumEvent;
  readonly credit: Credit | undefined = undefined;
  readonly tileDiscardPolicy: TileDiscardPolicy | undefined = undefined;
  readonly proxy: undefined = undefined;
  readonly hasAlphaChannel = true;
  readonly minimumLevel: number;
  readonly maximumLevel: number | undefined;

  private readonly Cesium: CesiumModule;
  private readonly tileProcessor: GeoTIFFTileProcessor;
  private readonly resolution: number;
  private readonly resampleMethod: 'near' | 'bilinear';
  private readonly colorStops?: ColorStop[];
  private readonly readyPromiseInternal: Promise<boolean>;

  ready: boolean = false;

  constructor(options: CesiumGeoTIFFImageryOptions) {
    const {
      Cesium,
      rectangleDegrees,
      tileProcessor,
      tileSize,
      resolution,
      resampleMethod,
      colorStops,
      minimumLevel,
      maximumLevel,
    } = options;

    this.Cesium = Cesium;
    this.tileProcessor = tileProcessor;
    this.tileWidth = tileSize;
    this.tileHeight = tileSize;
    this.resolution = resolution;
    this.resampleMethod = resampleMethod;
    this.colorStops = colorStops;
    this.minimumLevel = minimumLevel ?? 0;
    this.maximumLevel = maximumLevel;
    this.rectangle = Cesium.Rectangle.fromDegrees(
      rectangleDegrees[0],
      rectangleDegrees[1],
      rectangleDegrees[2],
      rectangleDegrees[3],
    );

    this.tilingScheme = new Cesium.WebMercatorTilingScheme();

    this.errorEvent = new Cesium.Event();
    this.ready = true;
    this.readyPromiseInternal = Promise.resolve(true);
  }

  get tilingSchemeName(): string | undefined {
    // Expose helper for debugging if needed.
    return this.tilingScheme instanceof this.Cesium.WebMercatorTilingScheme
      ? 'WebMercator'
      : undefined;
  }

  get readyPromise(): Promise<boolean> {
    return this.readyPromiseInternal;
  }

  get tileCredits(): import('cesium').Credit[] | undefined {
    return undefined;
  }

  getTileCredits(
    _x: number,
    _y: number,
    _level: number,
  ): import('cesium').Credit[] | undefined {
    return undefined;
  }

  get url(): string | undefined {
    return undefined;
  }

  /**
   * Flips a canvas vertically (Y-axis inversion) for Cesium.
   * Creates a new canvas with the flipped content.
   *
   * @param sourceCanvas - The canvas to flip
   * @param width - Width of the canvas
   * @param height - Height of the canvas
   * @returns A new canvas with vertically flipped content, or the source canvas if flipping fails
   */
  private flipCanvasVertically(
    sourceCanvas: HTMLCanvasElement,
    width: number,
    height: number,
  ): HTMLCanvasElement {
    const flippedCanvas = document.createElement('canvas');
    flippedCanvas.width = width;
    flippedCanvas.height = height;
    const flippedCtx = flippedCanvas.getContext('2d');

    if (!flippedCtx) {
      warn('v-map - cesium - failed to get 2d context for flip');
      return sourceCanvas; // Fallback to source canvas
    }

    flippedCtx.translate(0, height);
    flippedCtx.scale(1, -1);
    flippedCtx.drawImage(sourceCanvas, 0, 0);

    return flippedCanvas;
  }

  /**
   * Creates a flipped ImageBitmap from RGBA data.
   * Uses ImageBitmap for better performance when available.
   *
   * @param rgbaData - The RGBA pixel data
   * @param sampleSize - Size of the tile (width and height)
   * @returns A flipped ImageBitmap, or undefined if creation fails
   */
  private async createFlippedImageBitmap(
    rgbaData: Uint8ClampedArray,
    sampleSize: number,
  ): Promise<ImageBitmap | undefined> {
    if (typeof createImageBitmap !== 'function') {
      return undefined;
    }

    try {
      // Create temporary canvas for Y-axis flip
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = sampleSize;
      tempCanvas.height = sampleSize;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        throw new Error('Failed to get 2d context');
      }
      const imageData = tempCtx.createImageData(sampleSize, sampleSize);
      imageData.data.set(rgbaData);
      tempCtx.putImageData(imageData, 0, 0);

      // Flip vertically for Cesium
      const flippedCanvas = this.flipCanvasVertically(
        tempCanvas,
        sampleSize,
        sampleSize,
      );

      return await createImageBitmap(flippedCanvas);
    } catch (err) {
      warn('v-map - cesium - createImageBitmap failed, falling back', err);
      return undefined;
    }
  }

  /**
   * Creates a flipped image (ImageBitmap or Canvas) from RGBA data.
   * Prefers ImageBitmap for better performance, falls back to Canvas.
   *
   * @param rgbaData - The RGBA pixel data
   * @returns A flipped ImageBitmap or Canvas, or undefined if creation fails
   */
  private async createFlippedImageFromRGBA(
    rgbaData: Uint8ClampedArray,
  ): Promise<HTMLCanvasElement | ImageBitmap | undefined> {
    // Calculate actual sample size (may differ from tileWidth due to resolution)
    const sampleSize = Math.ceil(this.tileWidth * this.resolution);

    // Prefer ImageBitmap when available for better performance
    const imageBitmap = await this.createFlippedImageBitmap(
      rgbaData,
      sampleSize,
    );
    if (imageBitmap) {
      return imageBitmap;
    }

    // Fallback to Canvas
    const canvas = document.createElement('canvas');
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      warn('v-map - cesium - unable to acquire canvas 2d context');
      return undefined;
    }
    const imageData = ctx.createImageData(sampleSize, sampleSize);
    imageData.data.set(rgbaData);
    ctx.putImageData(imageData, 0, 0);

    // Flip the canvas vertically for Cesium (Y-axis inversion)
    return this.flipCanvasVertically(canvas, sampleSize, sampleSize);
  }

  async requestImage(
    x: number,
    y: number,
    level: number,
  ): Promise<HTMLCanvasElement | ImageBitmap | undefined> {
    if (!this.ready) return undefined;
    if (
      level < this.minimumLevel ||
      (this.maximumLevel !== undefined && level > this.maximumLevel)
    ) {
      return undefined;
    }

    const params: TileDataParams = {
      x,
      y,
      z: level,
      tileSize: this.tileWidth,
      resolution: this.resolution,
      resampleMethod: this.resampleMethod,
      colorStops: this.colorStops,
    };

    let rgbaData: Uint8ClampedArray = null;
    try {
      rgbaData = await this.tileProcessor.getTileData(params);
      if (!rgbaData) {
        return undefined;
      }
    } catch (err) {
      this.errorEvent.raiseEvent(err);
      warn('v-map - cesium - getTileData - GeoTIFF tile request failed', err);
      return undefined;
    }

    try {
      return await this.createFlippedImageFromRGBA(rgbaData);
    } catch (err) {
      this.errorEvent.raiseEvent(err);
      warn(
        'v-map - cesium - createFlippedImageFromRGBA - GeoTIFF tile request failed',
        err,
      );
      return undefined;
    }
  }

  pickFeatures(): undefined {
    return undefined;
  }
}
