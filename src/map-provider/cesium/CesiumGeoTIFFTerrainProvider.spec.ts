import { vi, describe, it, expect, beforeEach } from 'vitest';

const {
  mockLoadGeoTIFFSource,
  mockCesium,
  mockReadRasters,
} = vi.hoisted(() => {
  const hoistedMockReadRasters = vi.fn().mockResolvedValue([
    new Float32Array(65 * 65).fill(100),
  ]);

  const hoistedMockLoadGeoTIFFSource = vi.fn().mockResolvedValue({
    tiff: { close: vi.fn() },
    baseImage: { readRasters: hoistedMockReadRasters },
    fromProjection: 'EPSG:32632',
    sourceBounds: [300000, 5000000, 400000, 5100000] as [number, number, number, number],
    sourceRef: [300000, 5000000] as [number, number],
    resolution: 1.0,
    width: 1000,
    height: 1000,
    samplesPerPixel: 1,
    wgs84Bounds: [8, 50, 9, 51] as [number, number, number, number],
    overviewImages: [],
    noDataValue: -9999,
    proj4: vi.fn().mockImplementation(
      (_from: string, _to: string, coord: [number, number]) => coord,
    ),
  });

  const hoistedMockCesium = {
    GeographicTilingScheme: vi.fn().mockImplementation(function () {
      return {
        tileXYToRectangle: vi.fn().mockReturnValue({
          west: 0.14,
          south: 0.87,
          east: 0.16,
          north: 0.89,
        }),
        ellipsoid: {
          maximumRadius: 6378137,
        },
      };
    }),
    Rectangle: {
      fromDegrees: vi.fn().mockImplementation(
        (w: number, s: number, e: number, n: number) => ({ west: w, south: s, east: e, north: n }),
      ),
      MAX_VALUE: { west: -180, south: -90, east: 180, north: 90 },
    },
    Math: {
      toDegrees: vi.fn().mockImplementation((rad: number) => rad * (180 / Math.PI)),
    },
    HeightmapTerrainData: vi.fn().mockImplementation(function (opts: any) {
      return { _type: 'HeightmapTerrainData', ...opts };
    }),
    Credit: vi.fn().mockImplementation(function (text: string) {
      return { text };
    }),
    Event: vi.fn().mockImplementation(function () {
      return { raiseEvent: vi.fn() };
    }),
  } as any;

  return {
    mockLoadGeoTIFFSource: hoistedMockLoadGeoTIFFSource,
    mockCesium: hoistedMockCesium,
    mockReadRasters: hoistedMockReadRasters,
  };
});

vi.mock('../geotiff/geotiff-source', () => ({
  loadGeoTIFFSource: mockLoadGeoTIFFSource,
}));

vi.mock('geotiff', () => ({
  default: {},
  fromUrl: vi.fn(),
}));

vi.mock('proj4', () => ({
  default: vi.fn().mockImplementation(
    (_from: string, _to: string, coord: [number, number]) => coord,
  ),
}));

vi.mock('geotiff-geokeys-to-proj4', () => ({
  default: { toProj4: vi.fn() },
  toProj4: vi.fn(),
}));

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

import {
  CesiumGeoTIFFTerrainProvider,
  createCesiumGeoTIFFTerrainProvider,
} from './CesiumGeoTIFFTerrainProvider';

describe('CesiumGeoTIFFTerrainProvider', () => {
  let provider: CesiumGeoTIFFTerrainProvider;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockLoadGeoTIFFSource.mockResolvedValue({
      tiff: { close: vi.fn() },
      baseImage: { readRasters: mockReadRasters },
      fromProjection: 'EPSG:32632',
      sourceBounds: [300000, 5000000, 400000, 5100000] as [number, number, number, number],
      sourceRef: [300000, 5000000] as [number, number],
      resolution: 1.0,
      width: 1000,
      height: 1000,
      samplesPerPixel: 1,
      wgs84Bounds: [8, 50, 9, 51] as [number, number, number, number],
      overviewImages: [],
      noDataValue: -9999,
      proj4: vi.fn().mockImplementation(
        (_from: string, _to: string, coord: [number, number]) => coord,
      ),
    });
    provider = new CesiumGeoTIFFTerrainProvider({
      url: 'https://example.com/terrain.tiff',
      Cesium: mockCesium,
    });
    await provider.readyPromise;
  });

  describe('constructor', () => {
    it('should create a provider with GeographicTilingScheme', () => {
      expect(mockCesium.GeographicTilingScheme).toHaveBeenCalled();
      expect(provider.tilingScheme).toBeDefined();
    });

    it('should start initialization and set ready promise', () => {
      expect(provider.readyPromise).toBeInstanceOf(Promise);
    });
  });

  describe('initialization', () => {
    it('should load GeoTIFF source successfully', async () => {
      expect(mockLoadGeoTIFFSource).toHaveBeenCalled();
    });

    it('should handle initialization failure gracefully', async () => {
      mockLoadGeoTIFFSource.mockRejectedValueOnce(new Error('Load failed'));

      const failingProvider = new CesiumGeoTIFFTerrainProvider({
        url: 'https://example.com/bad.tiff',
        Cesium: mockCesium,
      });

      const result = await failingProvider.readyPromise;
      expect(result).toBe(false);
    });

    it('should pass projection options to loadGeoTIFFSource', async () => {
      vi.clearAllMocks();
      const p = new CesiumGeoTIFFTerrainProvider({
        url: 'https://example.com/terrain.tiff',
        projection: 'EPSG:32633',
        forceProjection: true,
        nodata: -32768,
        Cesium: mockCesium,
      });
      await p.readyPromise;

      expect(mockLoadGeoTIFFSource).toHaveBeenCalledWith(
        'https://example.com/terrain.tiff',
        expect.objectContaining({
          projection: 'EPSG:32633',
          forceProjection: true,
          nodata: -32768,
        }),
        expect.any(Object),
      );
    });
  });

  describe('rectangle', () => {
    it('should return rectangle from WGS84 bounds when ready', () => {
      const rect = provider.rectangle;

      expect(mockCesium.Rectangle.fromDegrees).toHaveBeenCalledWith(8, 50, 9, 51);
      expect(rect).toBeDefined();
    });

    it('should return MAX_VALUE rectangle when not ready', () => {
      const unreadyProvider = new CesiumGeoTIFFTerrainProvider({
        url: 'https://example.com/terrain.tiff',
        Cesium: mockCesium,
      });
      // Access before ready (don't await)
      // The ready flag is false until initialize completes
      // Access it synchronously right after construction
      (unreadyProvider as any).ready = false;
      const rect = unreadyProvider.rectangle;

      expect(rect).toBe(mockCesium.Rectangle.MAX_VALUE);
    });
  });

  describe('requestTileGeometry', () => {
    it('should return undefined when not ready', async () => {
      (provider as any).ready = false;

      const result = await provider.requestTileGeometry(0, 0, 1);

      expect(result).toBeUndefined();
    });

    it('should return flat heightmap for tiles outside bounds', async () => {
      // Configure toDegrees to return values well outside the GeoTIFF bounds [8,50,9,51]
      mockCesium.Math.toDegrees
        .mockReturnValueOnce(100) // west
        .mockReturnValueOnce(60)  // south
        .mockReturnValueOnce(110) // east
        .mockReturnValueOnce(70); // north

      const result = await provider.requestTileGeometry(100, 100, 5);

      expect(result).toBeDefined();
      expect(mockCesium.HeightmapTerrainData).toHaveBeenCalled();
    });

    it('should read raster data for tiles within bounds', async () => {
      // Configure toDegrees to return values within bounds [8,50,9,51]
      mockCesium.Math.toDegrees
        .mockReturnValueOnce(8.2)  // west
        .mockReturnValueOnce(50.2) // south
        .mockReturnValueOnce(8.8)  // east
        .mockReturnValueOnce(50.8); // north

      mockReadRasters.mockResolvedValueOnce([
        new Float32Array(65 * 65).fill(150),
      ]);

      const result = await provider.requestTileGeometry(0, 0, 5);

      expect(result).toBeDefined();
      expect(mockReadRasters).toHaveBeenCalled();
      expect(mockCesium.HeightmapTerrainData).toHaveBeenCalledWith(
        expect.objectContaining({
          width: 65,
          height: 65,
        }),
      );
    });

    it('should replace nodata values with 0 in heightmap', async () => {
      mockCesium.Math.toDegrees
        .mockReturnValueOnce(8.2)
        .mockReturnValueOnce(50.2)
        .mockReturnValueOnce(8.8)
        .mockReturnValueOnce(50.8);

      const dataWithNodata = new Float32Array(65 * 65);
      dataWithNodata[0] = -9999; // nodata value
      dataWithNodata[1] = 500;
      dataWithNodata[2] = Infinity; // non-finite
      mockReadRasters.mockResolvedValueOnce([dataWithNodata]);

      await provider.requestTileGeometry(0, 0, 5);

      const callArgs = mockCesium.HeightmapTerrainData.mock.calls[0][0];
      expect(callArgs.buffer[0]).toBe(0); // nodata replaced
      expect(callArgs.buffer[1]).toBe(500); // valid value preserved
      expect(callArgs.buffer[2]).toBe(0); // Infinity replaced
    });

    it('should return flat heightmap on raster read error', async () => {
      mockCesium.Math.toDegrees
        .mockReturnValueOnce(8.5)
        .mockReturnValueOnce(50.5)
        .mockReturnValueOnce(8.6)
        .mockReturnValueOnce(50.6);

      mockReadRasters.mockRejectedValueOnce(new Error('Read error'));

      const result = await provider.requestTileGeometry(0, 0, 5);

      expect(result).toBeDefined();
      // Should have created a flat heightmap as fallback
      expect(mockCesium.HeightmapTerrainData).toHaveBeenCalled();
    });
  });

  describe('getTilingScheme', () => {
    it('should return the tiling scheme', () => {
      const scheme = provider.getTilingScheme();

      expect(scheme).toBe(provider.tilingScheme);
    });
  });

  describe('getLevelMaximumGeometricError', () => {
    it('should return decreasing error with increasing level', () => {
      const error0 = provider.getLevelMaximumGeometricError(0);
      const error5 = provider.getLevelMaximumGeometricError(5);
      const error10 = provider.getLevelMaximumGeometricError(10);

      expect(error0).toBeGreaterThan(error5);
      expect(error5).toBeGreaterThan(error10);
    });

    it('should calculate error based on ellipsoid radius', () => {
      const error = provider.getLevelMaximumGeometricError(0);
      const ellipsoid = provider.tilingScheme.ellipsoid;
      const expectedError = ellipsoid.maximumRadius / (65 * Math.pow(2, 0));

      expect(error).toBeCloseTo(expectedError);
    });
  });

  describe('getTileDataAvailable', () => {
    it('should return false when not ready', () => {
      (provider as any).ready = false;

      const result = provider.getTileDataAvailable(0, 0, 1);

      expect(result).toBe(false);
    });

    it('should return true for tiles within bounds', () => {
      // Tile within bounds [8,50,9,51]
      mockCesium.Math.toDegrees
        .mockReturnValueOnce(8.2) // west
        .mockReturnValueOnce(50.2) // south
        .mockReturnValueOnce(8.8) // east
        .mockReturnValueOnce(50.8); // north

      const result = provider.getTileDataAvailable(0, 0, 5);

      expect(result).toBe(true);
    });

    it('should return false for tiles completely outside bounds', () => {
      // Tile completely outside [8,50,9,51]
      mockCesium.Math.toDegrees
        .mockReturnValueOnce(100) // west
        .mockReturnValueOnce(60)  // south
        .mockReturnValueOnce(110) // east
        .mockReturnValueOnce(70); // north

      const result = provider.getTileDataAvailable(100, 100, 5);

      expect(result).toBe(false);
    });
  });

  describe('loadTileDataAvailability', () => {
    it('should return undefined', () => {
      const result = provider.loadTileDataAvailability(0, 0, 1);

      expect(result).toBeUndefined();
    });
  });

  describe('property getters', () => {
    it('should return a credit', () => {
      const credit = provider.credit;

      expect(mockCesium.Credit).toHaveBeenCalledWith('GeoTIFF Terrain');
      expect(credit).toBeDefined();
    });

    it('should report no water mask', () => {
      expect(provider.hasWaterMask).toBe(false);
    });

    it('should report no vertex normals', () => {
      expect(provider.hasVertexNormals).toBe(false);
    });

    it('should return undefined availability', () => {
      expect(provider.availability).toBeUndefined();
    });

    it('should return an error event', () => {
      const event = provider.errorEvent;

      expect(event).toBeDefined();
    });
  });

  describe('createCesiumGeoTIFFTerrainProvider', () => {
    it('should create and await provider ready', async () => {
      const p = await createCesiumGeoTIFFTerrainProvider({
        url: 'https://example.com/terrain.tiff',
        Cesium: mockCesium,
      });

      expect(p).toBeDefined();
    });
  });
});
