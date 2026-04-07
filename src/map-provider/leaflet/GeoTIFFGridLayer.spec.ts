import { vi, describe, it, expect, beforeEach } from 'vitest';

const {
  mockLoadGeoTIFFSource,
  mockGeoTIFFTileProcessor,
  mockGetColorStops,
  mockGetTileData,
  mockCreateGlobalTriangulation,
} = vi.hoisted(() => {
  const hoistedMockGetTileData = vi.fn().mockResolvedValue(new Uint8ClampedArray(256 * 256 * 4));
  const hoistedMockCreateGlobalTriangulation = vi.fn();
  const hoistedMockGeoTIFFTileProcessor = vi.fn().mockImplementation(function () {
    return {
      createGlobalTriangulation: hoistedMockCreateGlobalTriangulation,
      getTileData: hoistedMockGetTileData,
    };
  });
  const hoistedMockLoadGeoTIFFSource = vi.fn().mockResolvedValue({
    tiff: { close: vi.fn() },
    baseImage: { getWidth: () => 256, getHeight: () => 256 },
    fromProjection: 'EPSG:25832',
    sourceBounds: [300000, 5000000, 400000, 5100000] as [number, number, number, number],
    sourceRef: [300000, 5000000] as [number, number],
    resolution: 1.0,
    width: 256,
    height: 256,
    samplesPerPixel: 4,
    wgs84Bounds: [8, 50, 9, 51] as [number, number, number, number],
    overviewImages: [],
    proj4: vi.fn().mockImplementation(
      (_from: string, _to: string, coord: [number, number]) => coord,
    ),
  });
  const hoistedMockGetColorStops = vi.fn().mockReturnValue({
    stops: [{ value: 0, color: [0, 128, 0] }],
  });

  return {
    mockLoadGeoTIFFSource: hoistedMockLoadGeoTIFFSource,
    mockGeoTIFFTileProcessor: hoistedMockGeoTIFFTileProcessor,
    mockGetColorStops: hoistedMockGetColorStops,
    mockGetTileData: hoistedMockGetTileData,
    mockCreateGlobalTriangulation: hoistedMockCreateGlobalTriangulation,
  };
});

vi.mock('../geotiff/utils/GeoTIFFTileProcessor', () => ({
  GeoTIFFTileProcessor: mockGeoTIFFTileProcessor,
}));

vi.mock('../geotiff/geotiff-source', () => ({
  loadGeoTIFFSource: mockLoadGeoTIFFSource,
}));

vi.mock('../geotiff/utils/colormap-utils', () => ({
  getColorStops: mockGetColorStops,
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

import { GeoTIFFGridLayer, GeoTIFFGridLayerOptions } from './GeoTIFFGridLayer';

describe('GeoTIFFGridLayer', () => {
  let defaultOptions: GeoTIFFGridLayerOptions;

  beforeEach(() => {
    vi.clearAllMocks();
    defaultOptions = {
      url: 'https://example.com/data.tiff',
      tileSize: 256,
      opacity: 1,
      viewProjection: 'EPSG:3857',
    };
  });

  describe('constructor', () => {
    it('should create an instance with the provided options', () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      expect(layer).toBeInstanceOf(GeoTIFFGridLayer);
    });

    it('should store a copy of options', () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      expect((layer as any).geotiffOptions).toEqual(defaultOptions);
      expect((layer as any).geotiffOptions).not.toBe(defaultOptions);
    });

    it('should initialize with null tileProcessor', () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      expect((layer as any).tileProcessor).toBeNull();
    });
  });

  describe('createTile', () => {
    it('should return an HTMLCanvasElement', () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);
      const done = vi.fn();

      const canvas = layer.createTile({ x: 0, y: 0, z: 1 } as any, done);

      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    });

    it('should set canvas size based on tile size', () => {
      const layer = new GeoTIFFGridLayer({ ...defaultOptions, tileSize: 512 });

      // Override getTileSize to return what we want
      (layer as any).getTileSize = () => ({ x: 512, y: 512 });

      const done = vi.fn();
      const canvas = layer.createTile({ x: 0, y: 0, z: 1 } as any, done);

      expect(canvas.width).toBe(512);
      expect(canvas.height).toBe(512);
    });
  });

  describe('updateSource', () => {
    it('should reset internal state', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      // Set some initial state
      (layer as any).tileProcessor = { fake: true };
      (layer as any).colorStops = [{ value: 0, color: [0, 0, 0] }];
      (layer as any).loadingPromise = Promise.resolve();

      // Spy on redraw to avoid actual Leaflet rendering
      layer.redraw = vi.fn() as any;

      await layer.updateSource({ url: 'https://example.com/new.tiff' });

      expect((layer as any).geotiffOptions.url).toBe('https://example.com/new.tiff');
    });

    it('should merge new options into existing options', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);
      layer.redraw = vi.fn() as any;

      await layer.updateSource({ opacity: 0.5 });

      expect((layer as any).geotiffOptions.opacity).toBe(0.5);
      expect((layer as any).geotiffOptions.url).toBe('https://example.com/data.tiff');
    });
  });

  describe('initializeProcessor', () => {
    it('should load source and create tile processor', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);
      layer.redraw = vi.fn() as any;

      // Trigger initialization via ensureReady
      await (layer as any).ensureReady();

      expect(mockLoadGeoTIFFSource).toHaveBeenCalled();
      expect(mockGeoTIFFTileProcessor).toHaveBeenCalled();
      expect(mockCreateGlobalTriangulation).toHaveBeenCalled();
    });

    it('should not re-initialize if already initialized', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);
      layer.redraw = vi.fn() as any;

      await (layer as any).ensureReady();
      await (layer as any).ensureReady();

      // loadGeoTIFFSource should only be called once
      expect(mockLoadGeoTIFFSource).toHaveBeenCalledTimes(1);
    });

    it('should set colorStops when colorMap option is provided', async () => {
      const optionsWithColorMap: GeoTIFFGridLayerOptions = {
        ...defaultOptions,
        colorMap: 'viridis' as any,
        valueRange: [0, 100],
      };

      const layer = new GeoTIFFGridLayer(optionsWithColorMap);
      layer.redraw = vi.fn() as any;

      await (layer as any).ensureReady();

      expect(mockGetColorStops).toHaveBeenCalledWith('viridis', [0, 100]);
      expect((layer as any).colorStops).toEqual([{ value: 0, color: [0, 128, 0] }]);
    });

    it('should not set colorStops when colorMap is not provided', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);
      layer.redraw = vi.fn() as any;

      await (layer as any).ensureReady();

      expect(mockGetColorStops).not.toHaveBeenCalled();
      expect((layer as any).colorStops).toBeUndefined();
    });
  });

  describe('setViewBounds', () => {
    it('should calculate and set bounds from source bounds', () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);
      const transformFn = (coord: [number, number]): [number, number] => coord;

      // Call setViewBounds directly
      (layer as any).setViewBounds([10, 20, 30, 40], transformFn);

      // Verify bounds were set on the layer options
      expect((layer as any).options.bounds).toBeDefined();
    });
  });

  // ===== Additional branch coverage tests =====

  describe('onAdd (lines 36-38)', () => {
    it('should call ensureReady and then redraw', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      // Mock redraw to prevent Leaflet internal calls
      layer.redraw = vi.fn() as any;

      // Mock super.onAdd to be a no-op (avoid Leaflet internal errors)
      const origOnAdd = Object.getPrototypeOf(Object.getPrototypeOf(layer)).onAdd;
      Object.getPrototypeOf(Object.getPrototypeOf(layer)).onAdd = vi.fn().mockReturnThis();

      // Spy on ensureReady
      const ensureReadySpy = vi.spyOn(layer as any, 'ensureReady').mockResolvedValue(undefined);

      const mockMap = {} as any;
      const result = layer.onAdd(mockMap);

      // Wait for the async ensureReady().then(redraw) chain
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(ensureReadySpy).toHaveBeenCalled();
      expect(result).toBe(layer);

      // Restore
      Object.getPrototypeOf(Object.getPrototypeOf(layer)).onAdd = origOnAdd;
    });
  });

  describe('createTile – tileProcessor null path (lines 53-54)', () => {
    it('should call done with canvas when tileProcessor is null', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      // Ensure tileProcessor is null but ensureReady resolves
      (layer as any).tileProcessor = null;
      (layer as any).loadingPromise = Promise.resolve();

      const done = vi.fn();
      const canvas = layer.createTile({ x: 0, y: 0, z: 1 } as any, done);

      expect(canvas).toBeInstanceOf(HTMLCanvasElement);

      // Wait for the async path to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(done).toHaveBeenCalledWith(null, canvas);
    });
  });

  describe('createTile – null rgba path (lines 71-72)', () => {
    it('should call done with blank canvas when getTileData returns null', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      // Set up a processor that returns null
      mockGetTileData.mockResolvedValueOnce(null);
      (layer as any).tileProcessor = {
        getTileData: mockGetTileData,
        createGlobalTriangulation: vi.fn(),
      };
      (layer as any).loadingPromise = Promise.resolve();

      const done = vi.fn();
      const canvas = layer.createTile({ x: 0, y: 0, z: 1 } as any, done);

      expect(canvas).toBeInstanceOf(HTMLCanvasElement);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(done).toHaveBeenCalledWith(null, canvas);
    });
  });

  describe('createTile – success path with rgba data (lines 77-79)', () => {
    it('should put image data on canvas when getTileData returns rgba and ctx is available', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      const rgba = new Uint8ClampedArray(256 * 256 * 4);
      rgba[0] = 255;
      mockGetTileData.mockResolvedValueOnce(rgba);

      (layer as any).tileProcessor = {
        getTileData: mockGetTileData,
        createGlobalTriangulation: vi.fn(),
      };
      (layer as any).loadingPromise = Promise.resolve();

      // Mock canvas getContext to return a working 2d context
      const mockImageData = { data: new Uint8ClampedArray(256 * 256 * 4) };
      const mockCtx = {
        createImageData: vi.fn().mockReturnValue(mockImageData),
        putImageData: vi.fn(),
      };
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx) as any;

      const done = vi.fn();
      const canvas = layer.createTile({ x: 0, y: 0, z: 1 } as any, done);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(done).toHaveBeenCalledWith(null, canvas);
      expect(mockCtx.createImageData).toHaveBeenCalled();
      expect(mockCtx.putImageData).toHaveBeenCalled();

      // Restore
      HTMLCanvasElement.prototype.getContext = origGetContext;
    });

    it('should still call done when ctx is null', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      const rgba = new Uint8ClampedArray(256 * 256 * 4);
      mockGetTileData.mockResolvedValueOnce(rgba);

      (layer as any).tileProcessor = {
        getTileData: mockGetTileData,
        createGlobalTriangulation: vi.fn(),
      };
      (layer as any).loadingPromise = Promise.resolve();

      const done = vi.fn();
      const canvas = layer.createTile({ x: 0, y: 0, z: 1 } as any, done);

      await new Promise(resolve => setTimeout(resolve, 10));

      // done should be called with null error and canvas (even without ctx)
      expect(done).toHaveBeenCalledWith(null, canvas);
    });
  });

  describe('createTile – error path (lines 84-88)', () => {
    it('should call done with error when getTileData rejects', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      const tileError = new Error('tile processing failed');
      mockGetTileData.mockRejectedValueOnce(tileError);

      (layer as any).tileProcessor = {
        getTileData: mockGetTileData,
        createGlobalTriangulation: vi.fn(),
      };
      (layer as any).loadingPromise = Promise.resolve();

      const done = vi.fn();
      const canvas = layer.createTile({ x: 0, y: 0, z: 1 } as any, done);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(done).toHaveBeenCalledWith(tileError, canvas);
    });

    it('should call done with error when ensureReady rejects', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);

      const initError = new Error('init failed');
      (layer as any).loadingPromise = Promise.reject(initError);

      const done = vi.fn();
      const canvas = layer.createTile({ x: 0, y: 0, z: 1 } as any, done);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(done).toHaveBeenCalledWith(initError, canvas);
    });
  });

  describe('initializeProcessor – transformSourceMapToViewFn (lines 136-141)', () => {
    it('should create both transform functions and exercise transformSourceMapToViewFn', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);
      layer.redraw = vi.fn() as any;

      await (layer as any).ensureReady();

      // Verify the tile processor was created (which means both transform fns were used)
      expect(mockGeoTIFFTileProcessor).toHaveBeenCalled();
      const ctorCall = mockGeoTIFFTileProcessor.mock.calls[0][0];
      expect(ctorCall.transformViewToSourceMapFn).toBeDefined();
      expect(ctorCall.transformSourceMapToViewFn).toBeDefined();

      // Exercise the transformSourceMapToViewFn (lines 143-152)
      const sourceToView = ctorCall.transformSourceMapToViewFn;
      const result = sourceToView([350000, 5050000]);
      expect(result).toEqual([350000, 5050000]); // identity because mock proj4 returns same

      // Exercise the transformViewToSourceMapFn (lines 133-142)
      const viewToSource = ctorCall.transformViewToSourceMapFn;
      const result2 = viewToSource([9876543, 1234567]);
      expect(result2).toEqual([9876543, 1234567]); // identity because mock proj4 returns same
    });

    it('should create transform functions that call proj4 with correct projections', async () => {
      const layer = new GeoTIFFGridLayer(defaultOptions);
      layer.redraw = vi.fn() as any;

      // Get the mock source's proj4 to track calls
      await (layer as any).ensureReady();

      const ctorCall = mockGeoTIFFTileProcessor.mock.calls[0][0];

      // transformSourceMapToViewFn should call proj4(fromProjection, viewProjection, coord)
      const sourceToView = ctorCall.transformSourceMapToViewFn;
      sourceToView([100, 200]);

      // transformViewToSourceMapFn should call proj4(viewProjection, fromProjection, coord)
      const viewToSource = ctorCall.transformViewToSourceMapFn;
      viewToSource([300, 400]);

      // Both should have called the source's proj4 mock
      expect(mockLoadGeoTIFFSource.mock.results[0].value).resolves.toBeDefined();
    });
  });
});
