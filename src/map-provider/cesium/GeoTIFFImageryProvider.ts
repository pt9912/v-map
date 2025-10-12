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

    try {
      const rgbaData = await this.tileProcessor.getTileData(params);
      if (!rgbaData) {
        return undefined;
      }

      // Calculate actual sample size (may differ from tileWidth due to resolution)
      const sampleSize = Math.ceil(this.tileWidth * this.resolution);

      // Prefer ImageBitmap when available for better performance
      if (typeof createImageBitmap === 'function') {
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
          const flippedCanvas = document.createElement('canvas');
          flippedCanvas.width = sampleSize;
          flippedCanvas.height = sampleSize;
          const flippedCtx = flippedCanvas.getContext('2d');
          if (!flippedCtx) {
            throw new Error('Failed to get 2d context for flip');
          }
          flippedCtx.translate(0, sampleSize);
          flippedCtx.scale(1, -1);
          flippedCtx.drawImage(tempCanvas, 0, 0);

          return await createImageBitmap(flippedCanvas);
        } catch (err) {
          warn('v-map - cesium - createImageBitmap failed, falling back', err);
        }
      }

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
      const flippedCanvas = document.createElement('canvas');
      flippedCanvas.width = sampleSize;
      flippedCanvas.height = sampleSize;
      const flippedCtx = flippedCanvas.getContext('2d');
      if (!flippedCtx) {
        return canvas; // Fallback to non-flipped
      }
      flippedCtx.translate(0, sampleSize);
      flippedCtx.scale(1, -1);
      flippedCtx.drawImage(canvas, 0, 0);

      return flippedCanvas;
    } catch (err) {
      this.errorEvent.raiseEvent(err);
      warn('v-map - cesium - GeoTIFF tile request failed', err);
      return undefined;
    }
  }

  pickFeatures(): undefined {
    return undefined;
  }
}
