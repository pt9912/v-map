import { vi, describe, it, expect, beforeEach } from 'vitest';

const {
  mockFromUrl,
  mockProj4,
  mockToProj4,
  mockBaseImage,
  mockTiff,
} = vi.hoisted(() => {
  const hoistedMockBaseImage = {
    getWidth: vi.fn().mockReturnValue(512),
    getHeight: vi.fn().mockReturnValue(256),
    getSamplesPerPixel: vi.fn().mockReturnValue(4),
    getGeoKeys: vi.fn().mockReturnValue(null),
    getGDALNoData: vi.fn().mockReturnValue(-9999),
    getBoundingBox: vi.fn().mockReturnValue([10, 20, 30, 40]),
    getResolution: vi.fn().mockReturnValue([0.5, -0.5]),
  };

  const hoistedMockTiff = {
    getImage: vi.fn().mockImplementation(function (index: number) {
      if (index === 0) return Promise.resolve(hoistedMockBaseImage);
      return Promise.resolve({ ...hoistedMockBaseImage, _overview: index });
    }),
    getImageCount: vi.fn().mockResolvedValue(1),
  };

  const hoistedMockFromUrl = vi.fn().mockResolvedValue(hoistedMockTiff);

  const hoistedMockProj4Fn: any = vi.fn().mockImplementation(
    (_from: string, _to: string, coord: [number, number]) => coord,
  );
  hoistedMockProj4Fn.defs = vi.fn().mockReturnValue(undefined);

  const hoistedMockToProj4 = vi.fn().mockReturnValue({
    proj4: '+proj=longlat +datum=WGS84 +no_defs',
  });

  return {
    mockFromUrl: hoistedMockFromUrl,
    mockProj4: hoistedMockProj4Fn,
    mockToProj4: hoistedMockToProj4,
    mockBaseImage: hoistedMockBaseImage,
    mockTiff: hoistedMockTiff,
  };
});

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

import { loadGeoTIFFSource } from './geotiff-source';
import type { GeoTIFFLoaderDeps, GeoTIFFSourceOptions } from './geotiff-source';

function createDeps(): GeoTIFFLoaderDeps {
  return {
    geotiff: { fromUrl: mockFromUrl } as any,
    proj4: mockProj4 as any,
    geokeysToProj4: { toProj4: mockToProj4 } as any,
  };
}

describe('geotiff-source', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTiff.getImageCount.mockResolvedValue(1);
    mockTiff.getImage.mockImplementation((index: number) => {
      if (index === 0) return Promise.resolve(mockBaseImage);
      return Promise.resolve({ ...mockBaseImage, _overview: index });
    });
    mockFromUrl.mockResolvedValue(mockTiff);
    mockBaseImage.getGeoKeys.mockReturnValue(null);
    mockBaseImage.getGDALNoData.mockReturnValue(-9999);
    mockBaseImage.getBoundingBox.mockReturnValue([10, 20, 30, 40]);
    mockBaseImage.getResolution.mockReturnValue([0.5, -0.5]);
    mockBaseImage.getWidth.mockReturnValue(512);
    mockBaseImage.getHeight.mockReturnValue(256);
    mockBaseImage.getSamplesPerPixel.mockReturnValue(4);
    mockProj4.defs.mockReturnValue(undefined);
    mockProj4.mockImplementation(
      (_from: string, _to: string, coord: [number, number]) => coord,
    );
  });

  describe('loadGeoTIFFSource', () => {
    it('should load a GeoTIFF source with basic options', async () => {
      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(mockFromUrl).toHaveBeenCalledWith('https://example.com/test.tiff', expect.objectContaining({
        allowFullFile: true,
        blockSize: 1024 * 1024,
        cacheSize: 100,
      }));
      expect(result.width).toBe(512);
      expect(result.height).toBe(256);
      expect(result.samplesPerPixel).toBe(4);
      expect(result.fromProjection).toBe('EPSG:4326');
      expect(result.sourceBounds).toEqual([10, 20, 30, 40]);
      expect(result.sourceRef).toEqual([10, 20]);
      expect(result.resolution).toBe(0.5);
      expect(result.noDataValue).toBe(-9999);
    });

    it('should use provided projection when forceProjection is true', async () => {
      const options: GeoTIFFSourceOptions = {
        projection: 'EPSG:32632',
        forceProjection: true,
      };
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.fromProjection).toBe('EPSG:32632');
    });

    it('should use default EPSG:4326 projection when none specified', async () => {
      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.fromProjection).toBe('EPSG:4326');
    });

    it('should use provided projection as fallback when not forced', async () => {
      const options: GeoTIFFSourceOptions = {
        projection: 'EPSG:3857',
        forceProjection: false,
      };
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.fromProjection).toBe('EPSG:3857');
    });

    it('should extract projection from GeoKeys when not forced', async () => {
      mockBaseImage.getGeoKeys.mockReturnValue({
        ProjectedCSTypeGeoKey: 32632,
      });
      mockToProj4.mockReturnValue({
        proj4: '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
      });

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.fromProjection).toBe('EPSG:32632');
    });

    it('should use GeographicTypeGeoKey when ProjectedCSTypeGeoKey is absent', async () => {
      mockBaseImage.getGeoKeys.mockReturnValue({
        GeographicTypeGeoKey: 4326,
      });
      mockToProj4.mockReturnValue({
        proj4: '+proj=longlat +datum=WGS84 +no_defs',
      });

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.fromProjection).toBe('EPSG:4326');
    });

    it('should skip GeoKeys parsing when forceProjection is true', async () => {
      mockBaseImage.getGeoKeys.mockReturnValue({
        ProjectedCSTypeGeoKey: 32632,
      });

      const options: GeoTIFFSourceOptions = {
        projection: 'EPSG:3857',
        forceProjection: true,
      };
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.fromProjection).toBe('EPSG:3857');
      expect(mockToProj4).not.toHaveBeenCalled();
    });

    it('should handle GeoKeys parsing failure gracefully', async () => {
      mockBaseImage.getGeoKeys.mockReturnValue({
        ProjectedCSTypeGeoKey: 99999,
      });
      mockToProj4.mockImplementation(() => {
        throw new Error('Unknown projection');
      });

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      // Should fall back to default
      expect(result.fromProjection).toBe('EPSG:4326');
    });

    it('should use options.nodata when provided', async () => {
      const options: GeoTIFFSourceOptions = { nodata: -32768 };
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.noDataValue).toBe(-32768);
    });

    it('should use GDAL nodata value when options.nodata is not provided', async () => {
      mockBaseImage.getGDALNoData.mockReturnValue(-9999);
      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.noDataValue).toBe(-9999);
    });

    it('should handle undefined GDAL nodata', async () => {
      mockBaseImage.getGDALNoData.mockReturnValue(undefined);
      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.noDataValue).toBeUndefined();
    });

    it('should load overview images when present', async () => {
      mockTiff.getImageCount.mockResolvedValue(3);
      const overviewImage1 = { ...mockBaseImage, _overview: 1 };
      const overviewImage2 = { ...mockBaseImage, _overview: 2 };
      mockTiff.getImage.mockImplementation((index: number) => {
        if (index === 0) return Promise.resolve(mockBaseImage);
        if (index === 1) return Promise.resolve(overviewImage1);
        return Promise.resolve(overviewImage2);
      });

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.overviewImages).toHaveLength(2);
    });

    it('should retry up to 3 times on fromUrl failure', async () => {
      mockFromUrl
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockTiff);

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(mockFromUrl).toHaveBeenCalledTimes(3);
      expect(result.width).toBe(512);
    });

    it('should throw after 3 failed fromUrl attempts', async () => {
      const netError = new Error('Network error');
      mockFromUrl.mockRejectedValue(netError);

      const options: GeoTIFFSourceOptions = {};
      await expect(
        loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps()),
      ).rejects.toThrow('Network error');

      expect(mockFromUrl).toHaveBeenCalledTimes(3);
    });

    it('should compute wgs84Bounds correctly for EPSG:4326 source', async () => {
      mockBaseImage.getBoundingBox.mockReturnValue([10, 20, 30, 40]);

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      // For EPSG:4326, transformToWgs84 is identity
      expect(result.wgs84Bounds[0]).toBeCloseTo(10); // west
      expect(result.wgs84Bounds[1]).toBeCloseTo(20); // south
      expect(result.wgs84Bounds[2]).toBeCloseTo(30); // east
      expect(result.wgs84Bounds[3]).toBeCloseTo(40); // north
    });

    it('should clamp wgs84Bounds to valid ranges', async () => {
      mockBaseImage.getBoundingBox.mockReturnValue([-200, -100, 200, 100]);

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.wgs84Bounds[0]).toBeGreaterThanOrEqual(-180);
      expect(result.wgs84Bounds[1]).toBeGreaterThanOrEqual(-90);
      expect(result.wgs84Bounds[2]).toBeLessThanOrEqual(180);
      expect(result.wgs84Bounds[3]).toBeLessThanOrEqual(90);
    });

    it('should return identity transform for EPSG:4326 projection', async () => {
      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      const input: [number, number] = [15, 30];
      const output = result.transformToWgs84(input);
      expect(output).toEqual(input);
    });

    it('should use proj4 transform for non-WGS84 projection', async () => {
      mockProj4.mockImplementation(
        (_from: string, _to: string, coord: [number, number]) => [coord[0] + 1, coord[1] + 1],
      );
      mockBaseImage.getGeoKeys.mockReturnValue({
        ProjectedCSTypeGeoKey: 32632,
      });
      mockToProj4.mockReturnValue({
        proj4: '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
      });

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.fromProjection).toBe('EPSG:32632');
      const output = result.transformToWgs84([500000, 5000000]);
      expect(output).toEqual([500001, 5000001]);
    });

    it('should handle transform failure gracefully', async () => {
      mockProj4.mockImplementation(
        (_from: string, _to: string, _coord: [number, number]) => {
          throw new Error('Transform failed');
        },
      );
      mockBaseImage.getGeoKeys.mockReturnValue({
        ProjectedCSTypeGeoKey: 32632,
      });
      mockToProj4.mockReturnValue({
        proj4: '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
      });

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      const input: [number, number] = [500000, 5000000];
      const output = result.transformToWgs84(input);
      // Should fall back to returning the input coordinate
      expect(output).toEqual(input);
    });

    it('should register proj4 definitions for known EPSG codes', async () => {
      mockBaseImage.getGeoKeys.mockReturnValue(null);
      // fromProjection defaults to EPSG:4326, proj4String for 4326 is known
      const options: GeoTIFFSourceOptions = {};
      await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      // proj4.defs should have been called to check/register the projection
      expect(mockProj4.defs).toHaveBeenCalled();
    });

    it('should handle getSamplesPerPixel returning undefined', async () => {
      mockBaseImage.getSamplesPerPixel.mockReturnValue(undefined);

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      // Should fall back to 1
      expect(result.samplesPerPixel).toBe(1);
    });

    it('should handle baseImage without getGeoKeys method', async () => {
      mockBaseImage.getGeoKeys = undefined as any;

      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.fromProjection).toBe('EPSG:4326');

      // Restore
      mockBaseImage.getGeoKeys = vi.fn().mockReturnValue(null);
    });

    it('should assign well-known proj4 strings for EPSG:3857', async () => {
      const options: GeoTIFFSourceOptions = {
        projection: 'EPSG:3857',
      };
      await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      // Check proj4.defs was called with the known EPSG:3857 definition
      expect(mockProj4.defs).toHaveBeenCalledWith(
        'EPSG:3857',
        expect.stringContaining('+proj=merc'),
      );
    });

    it('should assign well-known proj4 strings for EPSG:32632', async () => {
      const options: GeoTIFFSourceOptions = {
        projection: 'EPSG:32632',
      };
      await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(mockProj4.defs).toHaveBeenCalledWith(
        'EPSG:32632',
        expect.stringContaining('+proj=utm'),
      );
    });

    it('should return the tiff object in the result', async () => {
      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.tiff).toBe(mockTiff);
    });

    it('should return the proj4 instance in the result', async () => {
      const options: GeoTIFFSourceOptions = {};
      const result = await loadGeoTIFFSource('https://example.com/test.tiff', options, createDeps());

      expect(result.proj4).toBe(mockProj4);
    });
  });
});
