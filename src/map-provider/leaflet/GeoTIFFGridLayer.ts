import * as L from 'leaflet';
import type { Coords, DoneCallback } from 'leaflet';

import { GeoTIFFTileProcessor } from '../geotiff/utils/GeoTIFFTileProcessor';
import type { ColorStop } from '../geotiff/utils/colormap-utils';
import { getColorStops } from '../geotiff/utils/colormap-utils';
import { loadGeoTIFFSource } from '../geotiff/geotiff-source';

export interface GeoTIFFGridLayerOptions extends L.GridLayerOptions {
  url: string;
  colorMap?: Parameters<typeof getColorStops>[0];
  valueRange?: [number, number];
  nodata?: number;
  resolution?: number;
  resampleMethod?: 'near' | 'bilinear';
  tileSize?: number;
  opacity?: number;
  zIndex?: number;
}

export class GeoTIFFGridLayer extends L.GridLayer {
  private readonly geotiffOptions: GeoTIFFGridLayerOptions;
  private tileProcessor: GeoTIFFTileProcessor | null = null;
  private colorStops?: ColorStop[];
  private loadingPromise?: Promise<void>;
  private readonly defaultResolution = 1;
  private readonly defaultResample: 'near' | 'bilinear' = 'bilinear';

  constructor(options: GeoTIFFGridLayerOptions) {
    super(options);
    this.geotiffOptions = { ...options };
  }

  onAdd(map: L.Map): this {
    super.onAdd(map);
    void this.ensureReady().then(() => (this as any).redraw());
    return this;
  }

  createTile(coords: Coords, done: DoneCallback): HTMLCanvasElement {
    const size = (this as any).getTileSize();
    const canvas = L.DomUtil.create('canvas', 'leaflet-tile') as HTMLCanvasElement;
    canvas.width = size.x;
    canvas.height = size.y;

    this.ensureReady()
      .then(async () => {
        if (!this.tileProcessor) {
          done(null, canvas);
          return;
        }

        try {
          const rgba = await this.tileProcessor.getTileData({
            x: coords.x,
            y: coords.y,
            z: coords.z,
            tileSize: size.x,
            resolution: this.geotiffOptions.resolution ?? this.defaultResolution,
            resampleMethod: this.geotiffOptions.resampleMethod ?? this.defaultResample,
            colorStops: this.colorStops,
          });

          if (!rgba) {
            done(null, canvas);
            return;
          }

          const ctx = canvas.getContext('2d');
          if (ctx) {
            const imageData = ctx.createImageData(size.x, size.y);
            imageData.data.set(rgba);
            ctx.putImageData(imageData, 0, 0);
          }

          done(null, canvas);
        } catch (err) {
          done(err as Error, canvas);
        }
      })
      .catch(err => {
        done(err as Error, canvas);
      });

    return canvas;
  }

  private async ensureReady(): Promise<void> {
    if (!this.loadingPromise) {
      this.loadingPromise = this.initializeProcessor();
    }
    return this.loadingPromise;
  }

  async updateSource(options: Partial<GeoTIFFGridLayerOptions>): Promise<void> {
    Object.assign(this.geotiffOptions, options);
    this.tileProcessor = null;
    this.colorStops = undefined;
    this.loadingPromise = undefined;
    await this.ensureReady();
    (this as any).redraw();
  }

  private async initializeProcessor(): Promise<void> {
    if (this.tileProcessor) return;

    const [geotiffModule, proj4Module, geokeysModule] = await Promise.all([
      import('geotiff'),
      import('proj4'),
      import('geotiff-geokeys-to-proj4'),
    ]);

    const proj4 = (proj4Module as any).default ?? proj4Module;

    const source = await loadGeoTIFFSource(
      this.geotiffOptions.url,
      {
        projection: undefined,
        forceProjection: false,
        nodata: this.geotiffOptions.nodata,
      },
      {
        geotiff: geotiffModule,
        proj4,
        geokeysToProj4: geokeysModule,
      },
    );

    const transformViewToSourceMapFn = (
      coord: [number, number],
    ): [number, number] => {
      const result = source.proj4(source.toProjection, source.fromProjection, coord);
      return [Number(result[0]), Number(result[1])];
    };
    const transformSourceMapToViewFn = (
      coord: [number, number],
    ): [number, number] => {
      const result = source.proj4(source.fromProjection, source.toProjection, coord);
      return [Number(result[0]), Number(result[1])];
    };

    this.tileProcessor = new GeoTIFFTileProcessor({
      transformViewToSourceMapFn,
      transformSourceMapToViewFn,
      sourceBounds: source.sourceBounds,
      sourceRef: source.sourceRef,
      resolution: source.resolution,
      imageWidth: source.width,
      imageHeight: source.height,
      fromProjection: source.fromProjection,
      toProjection: source.toProjection,
      baseImage: source.baseImage,
      overviewImages: source.overviewImages ?? [],
    });
    this.tileProcessor.createGlobalTriangulation();

    if (this.geotiffOptions.colorMap) {
      const { stops } = getColorStops(
        this.geotiffOptions.colorMap,
        this.geotiffOptions.valueRange,
      );
      this.colorStops = stops;
    }
  }
}
