import { vi, describe, it, expect, beforeEach } from 'vitest';

const {
  mockGeoTIFFSource,
  mockGetProjection,
  mockRegister,
  mockProj4,
  mockToProj4Fn,
} = vi.hoisted(() => {
  const hoistedMockGetView = vi.fn().mockResolvedValue({});
  const hoistedMockGetProjectionFn = vi.fn().mockReturnValue({
    getCode: () => 'EPSG:32632',
  });

  const hoistedMockGeoTIFFSource = vi.fn().mockImplementation(function (this: any, _options: any) {
    this.getView = hoistedMockGetView;
    this.getProjection = hoistedMockGetProjectionFn;
    this.sourceImagery_ = null;
  });

  const hoistedMockGetProjection = vi.fn().mockReturnValue(null);
  const hoistedMockRegister = vi.fn();

  const hoistedMockProj4: any = vi.fn();
  hoistedMockProj4.defs = vi.fn();

  const hoistedMockToProj4Fn = vi.fn().mockReturnValue({
    proj4: '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
  });

  return {
    mockGeoTIFFSource: hoistedMockGeoTIFFSource,
    mockGetProjection: hoistedMockGetProjection,
    mockRegister: hoistedMockRegister,
    mockProj4: hoistedMockProj4,
    mockToProj4Fn: hoistedMockToProj4Fn,
  };
});

vi.mock('ol/source/GeoTIFF', () => ({
  default: mockGeoTIFFSource,
}));

vi.mock('ol/proj', () => ({
  get: mockGetProjection,
}));

vi.mock('ol/proj/proj4', () => ({
  register: mockRegister,
}));

vi.mock('proj4', () => ({
  default: mockProj4,
}));

vi.mock('geotiff-geokeys-to-proj4', () => ({
  default: { toProj4: mockToProj4Fn },
  toProj4: mockToProj4Fn,
}));

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

import { createCustomGeoTiff } from './CustomGeoTiff';

describe('CustomGeoTiff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetProjection.mockReturnValue(null);
  });

  describe('createCustomGeoTiff', () => {
    it('should return a class constructor', async () => {
      const CustomClass = await createCustomGeoTiff({
        sources: [{ url: 'https://example.com/test.tiff' }],
      });

      expect(typeof CustomClass).toBe('function');
    });

    it('should create an instance that extends GeoTIFF source', async () => {
      const CustomClass = await createCustomGeoTiff({
        sources: [{ url: 'https://example.com/test.tiff' }],
      });

      const instance = new CustomClass();
      expect(instance).toBeDefined();
      expect(mockGeoTIFFSource).toHaveBeenCalled();
    });
  });

  describe('instance methods', () => {
    let instance: any;

    beforeEach(async () => {
      vi.clearAllMocks();
      const CustomClass = await createCustomGeoTiff({
        sources: [{ url: 'https://example.com/test.tiff' }],
      });
      instance = new CustomClass();
    });

    describe('getGeoKeys', () => {
      it('should return null when no sources are available', async () => {
        instance.sourceImagery_ = null;

        const result = await instance.getGeoKeys();

        expect(result).toBeNull();
      });

      it('should return null when sources array is empty', async () => {
        instance.sourceImagery_ = [];

        const result = await instance.getGeoKeys();

        expect(result).toBeNull();
      });

      it('should extract geoKeys from source images', async () => {
        const mockGeoKeys = { ProjectedCSTypeGeoKey: 32632 };
        instance.sourceImagery_ = [
          [
            { getGeoKeys: () => mockGeoKeys },
          ],
        ];

        const result = await instance.getGeoKeys();

        expect(result).toEqual(mockGeoKeys);
      });

      it('should iterate source images in reverse to find geoKeys', async () => {
        const mockGeoKeys = { ProjectedCSTypeGeoKey: 32632 };
        instance.sourceImagery_ = [
          [
            { getGeoKeys: () => null },
            { getGeoKeys: () => mockGeoKeys },
          ],
        ];

        const result = await instance.getGeoKeys();

        expect(result).toEqual(mockGeoKeys);
      });

      it('should cache geoKeys after first retrieval', async () => {
        const mockGeoKeys = { ProjectedCSTypeGeoKey: 32632 };
        instance.sourceImagery_ = [
          [{ getGeoKeys: () => mockGeoKeys }],
        ];

        const result1 = await instance.getGeoKeys();
        // Modify sourceImagery_ after caching
        instance.sourceImagery_ = [
          [{ getGeoKeys: () => ({ ProjectedCSTypeGeoKey: 99999 }) }],
        ];
        const result2 = await instance.getGeoKeys();

        expect(result1).toEqual(result2);
        expect(result2).toEqual(mockGeoKeys);
      });

      it('should fall back to geoKeys property when getGeoKeys method is absent', async () => {
        const mockGeoKeys = { GeographicTypeGeoKey: 4326 };
        instance.sourceImagery_ = [
          [{ geoKeys: mockGeoKeys }],
        ];

        const result = await instance.getGeoKeys();

        expect(result).toEqual(mockGeoKeys);
      });
    });

    describe('getProjectionParameters', () => {
      it('should return null when no geoKeys available', async () => {
        instance.sourceImagery_ = null;

        const result = await instance.getProjectionParameters();

        expect(result).toBeNull();
      });

      it('should return projection parameters from geoKeys', async () => {
        const expectedParams = {
          proj4: '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
        };
        mockToProj4Fn.mockReturnValue(expectedParams);
        instance.sourceImagery_ = [
          [{ getGeoKeys: () => ({ ProjectedCSTypeGeoKey: 32632 }) }],
        ];

        const result = await instance.getProjectionParameters();

        expect(result).toEqual(expectedParams);
        expect(mockToProj4Fn).toHaveBeenCalled();
      });
    });

    describe('getProj4String', () => {
      it('should return null when no projection parameters', async () => {
        instance.sourceImagery_ = null;

        const result = await instance.getProj4String();

        expect(result).toBeNull();
      });

      it('should return proj4 string from projection parameters', async () => {
        mockToProj4Fn.mockReturnValue({
          proj4: '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
        });
        instance.sourceImagery_ = [
          [{ getGeoKeys: () => ({ ProjectedCSTypeGeoKey: 32632 }) }],
        ];

        const result = await instance.getProj4String();

        expect(result).toBe('+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs');
      });

      it('should return null when proj4 string is empty', async () => {
        mockToProj4Fn.mockReturnValue({ proj4: '' });
        instance.sourceImagery_ = [
          [{ getGeoKeys: () => ({ ProjectedCSTypeGeoKey: 32632 }) }],
        ];

        const result = await instance.getProj4String();

        expect(result).toBeNull();
      });
    });

    describe('registerProjectionIfNeeded', () => {
      it('should return existing projection if already registered', async () => {
        const existingProjection = { getCode: () => 'EPSG:32632' };
        mockGetProjection.mockReturnValue(existingProjection);

        const result = await instance.registerProjectionIfNeeded();

        expect(result).toEqual(existingProjection);
        expect(mockProj4.defs).not.toHaveBeenCalled();
      });

      it('should register and return new projection', async () => {
        const newProjection = { getCode: () => 'EPSG:32632' };
        mockGetProjection
          .mockReturnValueOnce(null) // First call: not found
          .mockReturnValueOnce(newProjection); // Second call after registration

        mockToProj4Fn.mockReturnValue({
          proj4: '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
        });
        instance.sourceImagery_ = [
          [{ getGeoKeys: () => ({ ProjectedCSTypeGeoKey: 32632 }) }],
        ];

        const result = await instance.registerProjectionIfNeeded();

        expect(mockProj4.defs).toHaveBeenCalled();
        expect(mockRegister).toHaveBeenCalledWith(mockProj4);
        expect(result).toEqual(newProjection);
      });

      it('should return null when proj4 string is not available', async () => {
        mockGetProjection.mockReturnValue(null);
        instance.sourceImagery_ = null;

        const result = await instance.registerProjectionIfNeeded();

        expect(result).toBeNull();
      });

      it('should return null and log error on exception', async () => {
        mockGetProjection.mockImplementation(() => {
          throw new Error('Projection error');
        });

        const result = await instance.registerProjectionIfNeeded();

        expect(result).toBeNull();
      });
    });
  });
});
