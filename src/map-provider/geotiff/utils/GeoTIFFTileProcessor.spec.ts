import { vi, type Mock } from 'vitest';
import {
  GeoTIFFTileProcessor,
  getTileProcessorConfig,
  type GeoTIFFTileProcessorConfig,
} from './GeoTIFFTileProcessor';
import type { GeoTIFFImage } from 'geotiff';

// Mock GeoTIFFImage
const createMockImage = (
  width: number,
  height: number,
  resolution: number[] = [1.0, 1.0],
  rasterData: any = new Uint8Array(width * height),
): GeoTIFFImage => {
  return {
    getWidth: () => width,
    getHeight: () => height,
    getResolution: () => resolution,
    readRasters: vi.fn().mockResolvedValue([rasterData]),
  } as unknown as GeoTIFFImage;
};

describe('GeoTIFFTileProcessor', () => {
  let mockConfig: GeoTIFFTileProcessorConfig;
  let mockTransformViewToSourceMapFn: Mock<(coord: [number, number]) => [number, number]>;
  let mockTransformSourceMapToViewFn: Mock<(coord: [number, number]) => [number, number]>;

  beforeEach(() => {
    // Mock transformation function (identity transform for testing)
    mockTransformViewToSourceMapFn = vi.fn(
      (coord: [number, number]) => coord,
    );
    mockTransformSourceMapToViewFn = vi.fn(
      (coord: [number, number]) => coord,
    );

    mockConfig = {
      transformViewToSourceMapFn: mockTransformViewToSourceMapFn,
      transformSourceMapToViewFn: mockTransformSourceMapToViewFn,
      sourceBounds: [0, 0, 100, 100],
      sourceRef: [0, 0],
      resolution: 1.0,
      imageWidth: 100,
      imageHeight: 100,
      fromProjection: 'EPSG:4326',
      toProjection: 'EPSG:3857',
      baseImage: createMockImage(100, 100),
      overviewImages: [],
    };
  });

  describe('Constructor', () => {
    it('should create a processor with valid config', () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      expect(processor).toBeDefined();
    });

    it('should use custom worldSize if provided', () => {
      const customConfig = {
        ...mockConfig,
        worldSize: 50000000,
      };
      const processor = new GeoTIFFTileProcessor(customConfig);
      expect(processor).toBeDefined();
    });
  });

  describe('createGlobalTriangulation', () => {
    it('should create triangulation without errors', () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      expect(() => processor.createGlobalTriangulation()).not.toThrow();
    });

    it('should make triangulation available', () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();
      const triangulation = processor.getGlobalTriangulation();
      expect(triangulation).toBeDefined();
    });

    it('should return undefined before triangulation is created', () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      const triangulation = processor.getGlobalTriangulation();
      expect(triangulation).toBeUndefined();
    });

    it('should call transform function during triangulation', () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();
      expect(mockTransformViewToSourceMapFn).toHaveBeenCalled();
    });
  });

  describe('getTileData', () => {
    it('should return Uint8ClampedArray for valid tile', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeInstanceOf(Uint8ClampedArray);
      expect(result?.length).toBe(256 * 256 * 4); // RGBA
    });

    it('should handle different tile sizes', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const result512 = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 512,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result512?.length).toBe(512 * 512 * 4);

      const result128 = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 128,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result128?.length).toBe(128 * 128 * 4);
    });

    it('should handle different resolutions', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      // Half resolution
      const resultHalf = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 0.5,
        resampleMethod: 'near',
      });

      expect(resultHalf?.length).toBe(128 * 128 * 4); // 256 * 0.5 = 128

      // Quarter resolution
      const resultQuarter = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 0.25,
        resampleMethod: 'near',
      });

      expect(resultQuarter?.length).toBe(64 * 64 * 4); // 256 * 0.25 = 64
    });

    it('should work without global triangulation (fallback)', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      // Don't create global triangulation - should create fallback

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeInstanceOf(Uint8ClampedArray);
    });

    it('should use nearest neighbor sampling when specified', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
    });

    it('should use bilinear sampling when specified', async () => {
      // Use small worldSize so tile pixels actually map inside source bounds
      // triggering the bilinear sampling branch
      const raster = new Uint8Array(10 * 10).fill(128);
      const bilinearConfig: GeoTIFFTileProcessorConfig = {
        ...mockConfig,
        baseImage: createMockImage(10, 10, [1.0, 1.0], raster),
        worldSize: 200,
      };

      const processor = new GeoTIFFTileProcessor(bilinearConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 0,
        tileSize: 8,
        resolution: 1.0,
        resampleMethod: 'bilinear',
      });

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Uint8ClampedArray);
    });

    it('should apply colorStops when provided', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const colorStops = [
        { value: 0.0, color: [0, 0, 255] as [number, number, number] },
        { value: 1.0, color: [255, 0, 0] as [number, number, number] },
      ];

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
        colorStops,
      });

      expect(result).toBeDefined();
    });

    it('should handle different zoom levels', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      for (let z = 0; z <= 5; z++) {
        const result = await processor.getTileData({
          x: 0,
          y: 0,
          z,
          tileSize: 256,
          resolution: 1.0,
          resampleMethod: 'near',
        });

        expect(result).toBeDefined();
        expect(result?.length).toBe(256 * 256 * 4);
      }
    });

    it('should handle different tile positions', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const positions = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      for (const pos of positions) {
        const result = await processor.getTileData({
          x: pos.x,
          y: pos.y,
          z: 1,
          tileSize: 256,
          resolution: 1.0,
          resampleMethod: 'near',
        });

        expect(result).toBeDefined();
      }
    });
  });

  describe('Overview Image Selection', () => {
    it('should use base image when no overviews are available', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
    });

    it('should select appropriate overview for lower zoom levels', async () => {
      const configWithOverviews = {
        ...mockConfig,
        overviewImages: [
          createMockImage(50, 50, [2.0, 2.0]), // 2x downsampled
          createMockImage(25, 25, [4.0, 4.0]), // 4x downsampled
        ],
      };

      const processor = new GeoTIFFTileProcessor(configWithOverviews);
      processor.createGlobalTriangulation();

      // Low zoom should potentially use overview
      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
    });

    it('should use base image for high zoom levels', async () => {
      const configWithOverviews = {
        ...mockConfig,
        overviewImages: [createMockImage(50, 50)],
      };

      const processor = new GeoTIFFTileProcessor(configWithOverviews);
      processor.createGlobalTriangulation();

      // High zoom should use base image
      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 10,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
    });

    it('should break early when ratio <= 1.0 for an overview image', async () => {
      // ratio = tileResolution / (resolution * 2.0)
      // tileResolution = (worldSize / 2^z) / tileSize
      // With worldSize=200, z=0, tileSize=256: tileResolution = 200/256 = 0.78125
      // baseResolution = 1.0, so ratio = 0.78125 / (1.0 * 2.0) = 0.39 <= 1.0 -> BREAK on base
      const configWithOverviews = {
        ...mockConfig,
        overviewImages: [
          createMockImage(50, 50, [2.0, 2.0]),
          createMockImage(25, 25, [4.0, 4.0]),
        ],
        worldSize: 200,
      };

      const processor = new GeoTIFFTileProcessor(configWithOverviews);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 0,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should return transparent tile when calculateReadWindow returns null (getTileData)', async () => {
      // To trigger calculateReadWindow returning null (lines 336-345, 628):
      // tileIntersectsSource must return true, but the pixel window must be degenerate.
      //
      // We use a resettable counter in the transform. During createGlobalTriangulation
      // the counter accumulates. We reset before calling getTileData.
      // During getTileData: first 4 calls are from tileIntersectsSource (returns inside),
      // subsequent calls from calculateTileSourceBounds return far outside.
      const counter = { value: 0, active: false };
      const trickTransform = function (_coord: [number, number]): [number, number] {
        if (!counter.active) return [1000.5, 1000.5]; // during triangulation setup
        counter.value++;
        if (counter.value <= 4) {
          return [1000.5, 1000.5]; // inside sourceBounds [1000,1000,1001,1001]
        }
        return [9999, 9999]; // far outside -> tileSrcWest >> srcEast -> readWidth=0
      };

      const nullWindowConfig: GeoTIFFTileProcessorConfig = {
        ...mockConfig,
        sourceBounds: [1000, 1000, 1001, 1001],
        baseImage: createMockImage(1, 1),
        transformViewToSourceMapFn: trickTransform as any,
        transformSourceMapToViewFn: vi.fn((coord: [number, number]) => coord),
        worldSize: 200,
      };

      const processor = new GeoTIFFTileProcessor(nullWindowConfig);
      processor.createGlobalTriangulation();

      // Activate the counter and reset before getTileData
      counter.active = true;
      counter.value = 0;

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 0,
        tileSize: 16,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      // Should return a transparent tile when readWindow is null
      expect(result).toBeInstanceOf(Uint8ClampedArray);
      expect(result!.length).toBe(16 * 16 * 4);
    });

    it('should return empty Float32Array when calculateReadWindow returns null (getElevationData)', async () => {
      const counter = { value: 0, active: false };
      const trickTransform = function (_coord: [number, number]): [number, number] {
        if (!counter.active) return [1000.5, 1000.5];
        counter.value++;
        if (counter.value <= 4) {
          return [1000.5, 1000.5];
        }
        return [9999, 9999];
      };

      const nullWindowConfig: GeoTIFFTileProcessorConfig = {
        ...mockConfig,
        sourceBounds: [1000, 1000, 1001, 1001],
        baseImage: createMockImage(1, 1),
        transformViewToSourceMapFn: trickTransform as any,
        transformSourceMapToViewFn: vi.fn((coord: [number, number]) => coord),
        worldSize: 200,
      };

      const processor = new GeoTIFFTileProcessor(nullWindowConfig);
      processor.createGlobalTriangulation();

      counter.active = true;
      counter.value = 0;

      const result = await processor.getElevationData({
        x: 0,
        y: 0,
        z: 0,
        tileSize: 16,
      });

      // Should return empty Float32Array when readWindow is null
      expect(result).toBeInstanceOf(Float32Array);
      expect(result!.length).toBe(17 * 17);
      expect(result!.every(v => v === 0)).toBe(true);
    });

    it('should handle readRasters failure and rethrow after retries', async () => {
      const failingImage = {
        getWidth: () => 100,
        getHeight: () => 100,
        getResolution: () => [1.0, 1.0],
        readRasters: vi.fn().mockRejectedValue(new Error('network error')),
      } as unknown as GeoTIFFImage;

      const failConfig: GeoTIFFTileProcessorConfig = {
        ...mockConfig,
        baseImage: failingImage,
      };

      const processor = new GeoTIFFTileProcessor(failConfig);
      processor.createGlobalTriangulation();

      await expect(
        processor.getTileData({
          x: 0,
          y: 0,
          z: 1,
          tileSize: 16,
          resolution: 1.0,
          resampleMethod: 'near',
        }),
      ).rejects.toThrow('network error');

      // readRasters should be called 3 times (initial + 2 retries)
      expect(failingImage.readRasters).toHaveBeenCalledTimes(3);
    });

    it('should skip number entries in rasters array', async () => {
      // readRasters returns a mix of TypedArrays and numbers
      const mixedImage = {
        getWidth: () => 100,
        getHeight: () => 100,
        getResolution: () => [1.0, 1.0],
        readRasters: vi.fn().mockResolvedValue([
          42, // unexpected number - should be skipped
          new Uint8Array(100 * 100),
        ]),
      } as unknown as GeoTIFFImage;

      const mixedConfig: GeoTIFFTileProcessorConfig = {
        ...mockConfig,
        baseImage: mixedImage,
      };

      const processor = new GeoTIFFTileProcessor(mixedConfig);
      processor.createGlobalTriangulation();

      // Should not throw - number entries are skipped
      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 16,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeInstanceOf(Uint8ClampedArray);
    });

    it('should handle tiles outside source bounds gracefully', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      // Tile far outside source bounds
      const result = await processor.getTileData({
        x: 1000,
        y: 1000,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
      // Should be mostly transparent/empty
    });

    it('should handle very small tiles', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 16,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
      expect(result?.length).toBe(16 * 16 * 4);
    });

    it('should handle very low resolution', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 0.1,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
      // 256 * 0.1 = 25.6, ceil = 26
      expect(result?.length).toBe(26 * 26 * 4);
    });

    it('should handle negative source bounds', async () => {
      const negativeConfig = {
        ...mockConfig,
        sourceBounds: [-100, -100, 0, 0] as [number, number, number, number],
      };

      const processor = new GeoTIFFTileProcessor(negativeConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
    });

    it('should handle large source bounds', async () => {
      const largeConfig = {
        ...mockConfig,
        sourceBounds: [0, 0, 10000, 10000] as [number, number, number, number],
        imageWidth: 10000,
        imageHeight: 10000,
        baseImage: createMockImage(10000, 10000),
      };

      const processor = new GeoTIFFTileProcessor(largeConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
    });
  });

  describe('Integration with Transformation Function', () => {
    it('should call transform function for coordinate transformation', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      mockTransformViewToSourceMapFn.mockClear();

      await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      // Transform function should be called during processing
      expect(mockTransformViewToSourceMapFn).toHaveBeenCalled();
    });

    it('should handle transform function that returns different coordinates', async () => {
      // Create a transform function that actually transforms
      const transformFn = vi.fn(
        (coord: [number, number]): [number, number] => {
          return [coord[0] * 2, coord[1] * 2]; // Scale by 2
        },
      );
      const transformInversFn = vi.fn(
        (coord: [number, number]): [number, number] => {
          return [coord[0] / 2, coord[1] / 2]; // Scale by 0.5 (inverse)
        },
      );

      const configWithTransform = {
        ...mockConfig,
        transformViewToSourceMapFn: transformFn,
        transformSourceMapToViewFn: transformInversFn,
      };

      const processor = new GeoTIFFTileProcessor(configWithTransform);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
      expect(transformFn).toHaveBeenCalled();
    });
  });

  describe('Performance Considerations', () => {
    it('should reuse global triangulation for multiple tiles', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const triangulation = processor.getGlobalTriangulation();

      // Process multiple tiles
      await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      await processor.getTileData({
        x: 1,
        y: 0,
        z: 1,
        tileSize: 256,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      // Triangulation should remain the same
      expect(processor.getGlobalTriangulation()).toBe(triangulation);
    });

    it('should handle concurrent tile requests', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      // Request multiple tiles concurrently
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          processor.getTileData({
            x: i,
            y: 0,
            z: 1,
            tileSize: 256,
            resolution: 1.0,
            resampleMethod: 'near',
          }),
        );
      }

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result?.length).toBe(256 * 256 * 4);
      });
    });
  });

  describe('renderTilePixels rgba branch', () => {
    it('should write RGBA pixel data when source point maps inside bounds and sampling succeeds', async () => {
      // Set up a config where the tile fully overlaps the source data
      // so that renderTilePixels hits the rgba truthy branch (lines 512-515).
      // Use a small worldSize so tile bounds align with source bounds.
      const raster = new Uint8Array(10 * 10).fill(128);
      const smallConfig: GeoTIFFTileProcessorConfig = {
        transformViewToSourceMapFn: vi.fn((coord: [number, number]) => coord),
        transformSourceMapToViewFn: vi.fn((coord: [number, number]) => coord),
        sourceBounds: [0, 0, 100, 100],
        sourceRef: [0, 0],
        resolution: 1.0,
        imageWidth: 10,
        imageHeight: 10,
        fromProjection: 'EPSG:4326',
        toProjection: 'EPSG:3857',
        baseImage: createMockImage(10, 10, [1.0, 1.0], raster),
        overviewImages: [],
        worldSize: 200, // small worldSize so tile covers [-100,-100,100,100]
      };

      const processor = new GeoTIFFTileProcessor(smallConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 0,
        tileSize: 8, // small tile for fast test
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeInstanceOf(Uint8ClampedArray);
      expect(result!.length).toBe(8 * 8 * 4);
      // Some pixels should have non-zero alpha (those that mapped inside source bounds)
      const hasNonTransparentPixel = Array.from(result!).some(
        (val, i) => i % 4 === 3 && val > 0,
      );
      expect(hasNonTransparentPixel).toBe(true);
    });
  });

  describe('Data Validation', () => {
    it('should produce RGBA data with correct dimensions', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const tileSize = 256;
      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize,
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeInstanceOf(Uint8ClampedArray);
      expect(result?.length).toBe(tileSize * tileSize * 4);

      // Check that values are in valid range (0-255)
      if (result) {
        for (let i = 0; i < result.length; i++) {
          expect(result[i]).toBeGreaterThanOrEqual(0);
          expect(result[i]).toBeLessThanOrEqual(255);
        }
      }
    });

    it('should have RGBA structure (every 4th value is alpha)', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getTileData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 16, // Small for easier testing
        resolution: 1.0,
        resampleMethod: 'near',
      });

      expect(result).toBeDefined();
      if (result) {
        // Check structure: [R, G, B, A, R, G, B, A, ...]
        expect(result.length % 4).toBe(0);
      }
    });
  });

  describe('getElevationData', () => {
    it('returns Float32Array of size (tileSize+1)^2', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getElevationData({ x: 0, y: 0, z: 1, tileSize: 16 });

      expect(result).toBeInstanceOf(Float32Array);
      expect(result!.length).toBe(17 * 17); // (16+1)^2
    });

    it('returns Float32Array of zeros when tile does not intersect source', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      // Tile far outside source bounds [0,0,100,100]
      const result = await processor.getElevationData({ x: 9999, y: 9999, z: 5, tileSize: 16 });

      expect(result).toBeInstanceOf(Float32Array);
      expect(result!.length).toBe(17 * 17);
      expect(result!.every(v => v === 0)).toBe(true);
    });

    it('replaces nodata elevation samples with zero', async () => {
      const processor = new GeoTIFFTileProcessor({
        ...mockConfig,
        noDataValue: -9999,
        baseImage: createMockImage(
          10,
          10,
          [1.0, 1.0],
          new Float32Array(10 * 10).fill(-9999),
        ),
        worldSize: 200, // small worldSize so tile z=0 covers [-100,-100,100,100]
      });
      processor.createGlobalTriangulation();

      const result = await processor.getElevationData({
        x: 0,
        y: 0,
        z: 0,
        tileSize: 16,
      });

      expect(result).toBeInstanceOf(Float32Array);
      expect(result!.every(v => v === 0)).toBe(true);
    });

    it('backfills right border column', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const tileSize = 16;
      const gridSize = tileSize + 1;
      const result = await processor.getElevationData({ x: 0, y: 0, z: 1, tileSize });

      expect(result).not.toBeNull();
      // Right border: column index tileSize should equal tileSize-1 for each row
      for (let row = 0; row < tileSize; row++) {
        expect(result![row * gridSize + tileSize]).toBe(result![row * gridSize + tileSize - 1]);
      }
    });

    it('backfills bottom border row', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const tileSize = 16;
      const gridSize = tileSize + 1;
      const result = await processor.getElevationData({ x: 0, y: 0, z: 1, tileSize });

      expect(result).not.toBeNull();
      // Bottom border: row tileSize should equal row tileSize-1
      for (let col = 0; col <= tileSize; col++) {
        expect(result![tileSize * gridSize + col]).toBe(result![(tileSize - 1) * gridSize + col]);
      }
    });

    it('returns different size for different tileSize', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      processor.createGlobalTriangulation();

      const result256 = await processor.getElevationData({ x: 0, y: 0, z: 1, tileSize: 256 });
      const result512 = await processor.getElevationData({ x: 0, y: 0, z: 1, tileSize: 512 });

      expect(result256!.length).toBe(257 * 257);
      expect(result512!.length).toBe(513 * 513);
    });

    it('sanitizes Infinity elevation values to zero', async () => {
      const processor = new GeoTIFFTileProcessor({
        ...mockConfig,
        baseImage: createMockImage(
          10,
          10,
          [1.0, 1.0],
          new Float32Array(10 * 10).fill(Infinity),
        ),
        worldSize: 200, // small worldSize so tile z=0 covers [-100,-100,100,100]
      });
      processor.createGlobalTriangulation();

      const result = await processor.getElevationData({
        x: 0,
        y: 0,
        z: 0,
        tileSize: 16,
      });

      expect(result).toBeInstanceOf(Float32Array);
      expect(result!.every(v => v === 0)).toBe(true);
    });

    it('sanitizes NaN elevation values to zero', async () => {
      const processor = new GeoTIFFTileProcessor({
        ...mockConfig,
        baseImage: createMockImage(
          10,
          10,
          [1.0, 1.0],
          new Float32Array(10 * 10).fill(NaN),
        ),
        worldSize: 200,
      });
      processor.createGlobalTriangulation();

      const result = await processor.getElevationData({
        x: 0,
        y: 0,
        z: 0,
        tileSize: 16,
      });

      expect(result).toBeInstanceOf(Float32Array);
      expect(result!.every(v => v === 0)).toBe(true);
    });

    it('preserves valid finite elevation values', async () => {
      const rasterData = new Float32Array(10 * 10).fill(42.5);
      const processor = new GeoTIFFTileProcessor({
        ...mockConfig,
        baseImage: createMockImage(10, 10, [1.0, 1.0], rasterData),
        worldSize: 200, // small worldSize so tile [0,0,z=0] covers [-100,-100,100,100]
      });
      processor.createGlobalTriangulation();

      const result = await processor.getElevationData({
        x: 0,
        y: 0,
        z: 0,
        tileSize: 16,
      });

      expect(result).toBeInstanceOf(Float32Array);
      // At least some values should be 42.5 (those that fall within source bounds)
      const nonZeroValues = Array.from(result!).filter(v => v !== 0);
      expect(nonZeroValues.length).toBeGreaterThan(0);
      for (const v of nonZeroValues) {
        expect(v).toBe(42.5);
      }
    });

    it('creates fallback triangulation when global is not available', async () => {
      const processor = new GeoTIFFTileProcessor(mockConfig);
      // Do NOT create global triangulation

      const result = await processor.getElevationData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 16,
      });

      expect(result).toBeInstanceOf(Float32Array);
      expect(result!.length).toBe(17 * 17);
    });

    it('returns empty Float32Array when readWindow is null', async () => {
      // Configure so that calculateReadWindow returns null
      const farConfig: GeoTIFFTileProcessorConfig = {
        ...mockConfig,
        sourceBounds: [0, 0, 1, 1],
        baseImage: createMockImage(1, 1),
        transformViewToSourceMapFn: vi.fn(() => [5000, 5000] as [number, number]),
        transformSourceMapToViewFn: vi.fn((coord: [number, number]) => coord),
      };

      const processor = new GeoTIFFTileProcessor(farConfig);
      processor.createGlobalTriangulation();

      const result = await processor.getElevationData({
        x: 0,
        y: 0,
        z: 1,
        tileSize: 16,
      });

      expect(result).toBeInstanceOf(Float32Array);
      expect(result!.length).toBe(17 * 17);
      expect(result!.every(v => v === 0)).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

vi.mock('proj4', () => ({
  default: vi.fn((_fromProj: string, _toProj: string, coord: [number, number]) => coord),
}));

describe('getTileProcessorConfig', () => {
  const createMockSource = () => ({
    tiff: {} as any,
    baseImage: {
      getWidth: () => 256,
      getHeight: () => 256,
      getResolution: () => [1.0, 1.0],
      readRasters: vi.fn().mockResolvedValue([new Uint8Array(256 * 256)]),
    } as any,
    fromProjection: 'EPSG:25832',
    sourceBounds: [300000, 5000000, 400000, 5100000] as [number, number, number, number],
    sourceRef: [350000, 5050000] as [number, number],
    resolution: 2.5,
    width: 256,
    height: 256,
    overviewImages: [],
    noDataValue: -9999,
  });

  it('gibt eine GeoTIFFTileProcessorConfig zurück', async () => {
    const source = createMockSource();
    const config = await getTileProcessorConfig(source as any, 'EPSG:3857');

    expect(config).toBeDefined();
    expect(config).toHaveProperty('transformViewToSourceMapFn');
    expect(config).toHaveProperty('transformSourceMapToViewFn');
    expect(config).toHaveProperty('sourceBounds');
    expect(config).toHaveProperty('sourceRef');
    expect(config).toHaveProperty('resolution');
    expect(config).toHaveProperty('imageWidth');
    expect(config).toHaveProperty('imageHeight');
    expect(config).toHaveProperty('fromProjection');
    expect(config).toHaveProperty('toProjection');
    expect(config).toHaveProperty('baseImage');
    expect(config).toHaveProperty('overviewImages');
    expect(config).toHaveProperty('noDataValue', -9999);
  });

  it('übernimmt sourceBounds, sourceRef und resolution aus der Quelle', async () => {
    const source = createMockSource();
    const config = await getTileProcessorConfig(source as any, 'EPSG:3857');

    expect(config.sourceBounds).toEqual([300000, 5000000, 400000, 5100000]);
    expect(config.sourceRef).toEqual([350000, 5050000]);
    expect(config.resolution).toBe(2.5);
  });

  it('setzt fromProjection und toProjection korrekt', async () => {
    const source = createMockSource();
    const config = await getTileProcessorConfig(source as any, 'EPSG:3857');

    expect(config.fromProjection).toBe('EPSG:25832');
    expect(config.toProjection).toBe('EPSG:3857');
  });

  it('setzt imageWidth und imageHeight aus dem Basisbild', async () => {
    const source = createMockSource();
    const config = await getTileProcessorConfig(source as any, 'EPSG:3857');

    expect(config.imageWidth).toBe(256);
    expect(config.imageHeight).toBe(256);
  });

  it('übernimmt overviewImages aus der Quelle', async () => {
    const source = createMockSource();
    source.overviewImages = [];
    const config = await getTileProcessorConfig(source as any, 'EPSG:3857');

    expect(config.overviewImages).toEqual([]);
  });

  it('transformViewToSourceMapFn ist eine Funktion', async () => {
    const source = createMockSource();
    const config = await getTileProcessorConfig(source as any, 'EPSG:3857');

    expect(typeof config.transformViewToSourceMapFn).toBe('function');
  });

  it('transformSourceMapToViewFn ist eine Funktion (inverse)', async () => {
    const source = createMockSource();
    const config = await getTileProcessorConfig(source as any, 'EPSG:3857');

    expect(typeof config.transformSourceMapToViewFn).toBe('function');
  });

  it('funktioniert mit verschiedenen viewProjections', async () => {
    const source = createMockSource();
    const config4326 = await getTileProcessorConfig(source as any, 'EPSG:4326');
    const config3857 = await getTileProcessorConfig(source as any, 'EPSG:3857');

    expect(config4326.toProjection).toBe('EPSG:4326');
    expect(config3857.toProjection).toBe('EPSG:3857');
  });

  it('transformViewToSourceMapFn calls proj4 and returns numeric coordinates', async () => {
    const source = createMockSource();
    const config = await getTileProcessorConfig(source as any, 'EPSG:3857');

    const result = config.transformViewToSourceMapFn([10, 20]);

    expect(result).toEqual([10, 20]); // identity because proj4 is mocked
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });

  it('transformSourceMapToViewFn calls proj4 and returns numeric coordinates', async () => {
    const source = createMockSource();
    const config = await getTileProcessorConfig(source as any, 'EPSG:3857');

    const result = config.transformSourceMapToViewFn([30, 40]);

    expect(result).toEqual([30, 40]); // identity because proj4 is mocked
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });

  it('handles undefined overviewImages by defaulting to empty array', async () => {
    const source = createMockSource();
    (source as any).overviewImages = undefined;
    const config = await getTileProcessorConfig(source as any, 'EPSG:3857');

    expect(config.overviewImages).toEqual([]);
  });
});
