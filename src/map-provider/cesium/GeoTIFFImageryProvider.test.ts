import { describe, expect, it, vi } from 'vitest';

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

import {
  GeoTIFFImageryProvider,
  type CesiumGeoTIFFImageryOptions,
} from './GeoTIFFImageryProvider';
import type { GeoTIFFTileProcessor } from '../geotiff/utils/GeoTIFFTileProcessor';

const mockTileProcessor = {
  getTileData: vi.fn().mockResolvedValue(new Uint8ClampedArray(16 * 16 * 4)),
  createGlobalTriangulation: vi.fn(),
};

const mockCesium = {
  Rectangle: {
    fromDegrees: vi.fn().mockImplementation(
      (w: number, s: number, e: number, n: number) => ({
        west: w,
        south: s,
        east: e,
        north: n,
      }),
    ),
  },
  WebMercatorTilingScheme: vi.fn().mockImplementation(function () {
    return { _type: 'WebMercatorTilingScheme' };
  }),
  Event: vi.fn().mockImplementation(function () {
    return { raiseEvent: vi.fn() };
  }),
} as unknown as CesiumGeoTIFFImageryOptions['Cesium'];

describe('GeoTIFFImageryProvider browser example', () => {
  it('renders tile data through real browser canvas APIs', async () => {
    const provider = new GeoTIFFImageryProvider({
      Cesium: mockCesium,
      rectangleDegrees: [8, 50, 9, 51],
      tileProcessor: mockTileProcessor as unknown as GeoTIFFTileProcessor,
      tileSize: 16,
      resolution: 1,
      resampleMethod: 'bilinear',
    });

    const result = await provider.requestImage(1, 2, 5);

    expect(mockTileProcessor.getTileData).toHaveBeenCalledWith(
      expect.objectContaining({
        x: 1,
        y: 2,
        z: 5,
        tileSize: 16,
      }),
    );
    expect(result).toBeTruthy();
    expect(
      result instanceof HTMLCanvasElement || result instanceof ImageBitmap,
    ).toBe(true);

    if (result instanceof HTMLCanvasElement) {
      expect(result.width).toBe(16);
      expect(result.height).toBe(16);
    } else {
      expect(result.width).toBe(16);
      expect(result.height).toBe(16);
      result.close();
    }
  });
});
