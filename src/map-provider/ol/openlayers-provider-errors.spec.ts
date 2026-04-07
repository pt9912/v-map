import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const {
  mockMap,
  mockView,
  mockVectorLayer,
  mockLayerGroup,
  mockTileLayer,
  mockImageLayer,
  mockWebGLTileLayer,
  mockVectorSource,
  mockTileWMS,
  mockOSM,
  mockXYZ,
  mockGoogle,
  mockTileArcGISRest,
  mockGeoJSON,
  mockGML2,
  mockGML3,
  mockGML32,
  mockWKT,
  mockControl,
  mockFromLonLat,
  mockBboxStrategy,
  mockImageSource,
} = vi.hoisted(() => {
  const layerProto = {
    set: vi.fn(),
    get: vi.fn(),
    setOpacity: vi.fn(),
    setVisible: vi.fn(),
    setZIndex: vi.fn(),
    setSource: vi.fn(),
    setStyle: vi.fn(),
    getSource: vi.fn(),
    on: vi.fn(),
    un: vi.fn(),
  };

  const hoistedMockTileLayer = vi.fn().mockImplementation(function (options: any) {
    return { ...layerProto, ...options, set: vi.fn(), get: vi.fn(), setOpacity: vi.fn(), setVisible: vi.fn(), setZIndex: vi.fn(), setSource: vi.fn(), getSource: vi.fn(), on: vi.fn(), un: vi.fn() };
  });

  const hoistedMockImageLayer = vi.fn().mockImplementation(function (options: any) {
    return { ...layerProto, ...options, set: vi.fn(), get: vi.fn(), setOpacity: vi.fn(), setVisible: vi.fn(), setZIndex: vi.fn(), setSource: vi.fn(), getSource: vi.fn(), on: vi.fn(), un: vi.fn() };
  });

  const hoistedMockVectorLayer = vi.fn().mockImplementation(function (options: any) {
    return { ...layerProto, ...options, set: vi.fn(), get: vi.fn(), setOpacity: vi.fn(), setVisible: vi.fn(), setZIndex: vi.fn(), setSource: vi.fn(), setStyle: vi.fn(), getSource: vi.fn(), on: vi.fn(), un: vi.fn() };
  });

  const hoistedMockLayerGroup = vi.fn().mockImplementation(function (options: any) {
    const layers: any[] = [];
    return {
      ...options,
      get: vi.fn((key: string) => {
        if (key === 'groupId') return options?.properties?.groupId;
        return undefined;
      }),
      set: vi.fn(),
      getLayers: vi.fn(() => ({
        getArray: vi.fn(() => layers),
        push: vi.fn((l: any) => layers.push(l)),
        remove: vi.fn((l: any) => {
          const idx = layers.indexOf(l);
          if (idx >= 0) layers.splice(idx, 1);
        }),
        clear: vi.fn(() => layers.length = 0),
      })),
      setVisible: vi.fn(),
    };
  });

  const hoistedMockWebGLTileLayer = vi.fn().mockImplementation(function (options: any) {
    return { ...layerProto, ...options, set: vi.fn(), get: vi.fn() };
  });

  const mapLayerGroup = {
    getLayers: vi.fn(() => ({
      getArray: vi.fn(() => []),
    })),
    get: vi.fn(() => undefined),
  };

  const viewInstance = {
    animate: vi.fn(),
    getProjection: vi.fn(() => 'EPSG:3857'),
    getResolution: vi.fn(() => 1),
  };

  const hoistedMockView = vi.fn().mockImplementation(function () {
    return viewInstance;
  });

  const mapInstance = {
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    addControl: vi.fn(),
    setTarget: vi.fn(),
    getView: vi.fn(() => viewInstance),
    getLayerGroup: vi.fn(() => mapLayerGroup),
    getTargetElement: vi.fn(() => ({
      dispatchEvent: vi.fn(),
    })),
    updateSize: vi.fn(),
  };

  const hoistedMockMap = vi.fn().mockImplementation(function () {
    return mapInstance;
  });

  return {
    mockMap: hoistedMockMap,
    mockView: hoistedMockView,
    mockVectorLayer: hoistedMockVectorLayer,
    mockLayerGroup: hoistedMockLayerGroup,
    mockTileLayer: hoistedMockTileLayer,
    mockImageLayer: hoistedMockImageLayer,
    mockWebGLTileLayer: hoistedMockWebGLTileLayer,
    mockVectorSource: vi.fn().mockImplementation(function (options: any) {
      return { ...options, on: vi.fn(), un: vi.fn() };
    }),
    mockTileWMS: vi.fn().mockImplementation(function (options: any) {
      return { ...options, on: vi.fn(), un: vi.fn() };
    }),
    mockOSM: vi.fn().mockImplementation(function (options: any) {
      return { ...options, on: vi.fn(), un: vi.fn() };
    }),
    mockXYZ: vi.fn().mockImplementation(function (options: any) {
      return { ...options, on: vi.fn(), un: vi.fn() };
    }),
    mockGoogle: vi.fn().mockImplementation(function (options: any) {
      return {
        ...options,
        on: vi.fn(),
        un: vi.fn(),
        getState: vi.fn(() => 'ready'),
        getError: vi.fn(),
      };
    }),
    mockTileArcGISRest: vi.fn().mockImplementation(function (options: any) {
      return {
        ...options,
        on: vi.fn(),
        un: vi.fn(),
        getParams: vi.fn(() => options?.params ?? {}),
        getUrls: vi.fn(() => [options?.url]),
      };
    }),
    mockGeoJSON: vi.fn().mockImplementation(function () {
      return { readFeatures: vi.fn(() => [{ type: 'Feature' }]) };
    }),
    mockGML2: vi.fn(),
    mockGML3: vi.fn(),
    mockGML32: vi.fn(),
    mockWKT: vi.fn().mockImplementation(function () {
      return { readFeature: vi.fn(() => ({ type: 'Feature' })) };
    }),
    mockControl: vi.fn(),
    mockFromLonLat: vi.fn((c: any) => c),
    mockBboxStrategy: vi.fn(),
    mockImageSource: vi.fn().mockImplementation(function () { /* preserved for subclasses */ }),
  };
});

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock('ol/Map', () => ({ __esModule: true, default: mockMap }));
vi.mock('ol/View', () => ({ __esModule: true, default: mockView }));
vi.mock('ol/layer/Vector', () => ({ __esModule: true, default: mockVectorLayer }));
vi.mock('ol/layer/Group', () => ({ __esModule: true, default: mockLayerGroup }));
vi.mock('ol/layer/Tile', () => ({ __esModule: true, default: mockTileLayer }));
vi.mock('ol/layer/Image', () => ({ __esModule: true, default: mockImageLayer }));
vi.mock('ol/layer/WebGLTile', () => ({ __esModule: true, default: mockWebGLTileLayer }));
vi.mock('ol/source/Vector', () => ({ __esModule: true, default: mockVectorSource }));
vi.mock('ol/source/TileWMS', () => ({ __esModule: true, default: mockTileWMS }));
vi.mock('ol/source/OSM', () => ({ __esModule: true, default: mockOSM }));
vi.mock('ol/source/XYZ', () => ({ __esModule: true, default: mockXYZ }));
vi.mock('ol/source/Google', () => ({ __esModule: true, default: mockGoogle }));
vi.mock('ol/source/TileArcGISRest', () => ({ __esModule: true, default: mockTileArcGISRest }));
vi.mock('ol/source/Image', () => ({ __esModule: true, default: mockImageSource }));
vi.mock('ol/Image', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(function () {
    return { load: vi.fn(), getImage: vi.fn(() => ({ src: '', crossOrigin: '' })) };
  }),
}));
vi.mock('ol/format/GeoJSON', () => ({ __esModule: true, default: mockGeoJSON }));
vi.mock('ol/format/GML2', () => ({ __esModule: true, default: mockGML2 }));
vi.mock('ol/format/GML3', () => ({ __esModule: true, default: mockGML3 }));
vi.mock('ol/format/GML32', () => ({ __esModule: true, default: mockGML32 }));
vi.mock('ol/format/WKT', () => ({ __esModule: true, default: mockWKT }));
vi.mock('ol/control/Control', () => ({ __esModule: true, default: mockControl }));
vi.mock('ol/style/Style', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Fill', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Stroke', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Circle', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Icon', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Text', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/loadingstrategy', () => ({ __esModule: true, bbox: mockBboxStrategy }));
vi.mock('ol/proj', () => ({
  __esModule: true,
  fromLonLat: mockFromLonLat,
}));

vi.mock('./openlayers-helper', () => ({
  __esModule: true,
  injectOlCss: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./CustomGeoTiff', () => ({
  __esModule: true,
  createCustomGeoTiff: vi.fn().mockResolvedValue(
    vi.fn().mockImplementation(function () {
      return { registerProjectionIfNeeded: vi.fn().mockResolvedValue(undefined) };
    }),
  ),
}));

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  error: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Import under test AFTER all mocks
// ---------------------------------------------------------------------------
import { OpenLayersProvider } from './openlayers-provider';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function createInitializedProvider(): Promise<OpenLayersProvider> {
  const provider = new OpenLayersProvider();
  const target = document.createElement('div');
  const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
  vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(function () {
    return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
  }));
  await provider.init({ target, shadowRoot } as any);
  return provider;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('OpenLayersProvider – onLayerError / offLayerError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue('test-uuid'),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('onLayerError', () => {
    it('stores the callback in layerErrorCallbacks', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();

      provider.onLayerError('layer-1', callback);

      expect((provider as any).layerErrorCallbacks.get('layer-1')).toBe(callback);
    });

    it('calls attachSourceErrorListeners after resolving the layer', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();
      const spy = vi.spyOn(provider as any, 'attachSourceErrorListeners');

      // Mock _getLayerById to return a fake layer
      const fakeLayer = { getSource: vi.fn(() => null), on: vi.fn(), un: vi.fn() };
      vi.spyOn(provider as any, '_getLayerById').mockResolvedValue(fakeLayer);

      provider.onLayerError('layer-1', callback);

      // Wait for the async .then() to resolve
      await vi.waitFor(() => {
        expect(spy).toHaveBeenCalledWith('layer-1', fakeLayer);
      });
    });

    it('does not call attachSourceErrorListeners when layer is not found', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();
      const spy = vi.spyOn(provider as any, 'attachSourceErrorListeners');

      vi.spyOn(provider as any, '_getLayerById').mockResolvedValue(null);

      provider.onLayerError('missing-layer', callback);

      await new Promise(r => setTimeout(r, 10));
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('offLayerError', () => {
    it('removes callback and cleanup', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();
      const cleanup = vi.fn();

      (provider as any).layerErrorCallbacks.set('layer-1', callback);
      (provider as any).layerErrorCleanups.set('layer-1', cleanup);

      provider.offLayerError('layer-1');

      expect(cleanup).toHaveBeenCalledTimes(1);
      expect((provider as any).layerErrorCallbacks.has('layer-1')).toBe(false);
      expect((provider as any).layerErrorCleanups.has('layer-1')).toBe(false);
    });

    it('calling offLayerError twice does not throw', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();
      const cleanup = vi.fn();

      (provider as any).layerErrorCallbacks.set('layer-1', callback);
      (provider as any).layerErrorCleanups.set('layer-1', cleanup);

      provider.offLayerError('layer-1');
      // Second call with no entries should not throw
      expect(() => provider.offLayerError('layer-1')).not.toThrow();
    });

    it('calling offLayerError for unknown layer does not throw', async () => {
      const provider = await createInitializedProvider();

      expect(() => provider.offLayerError('nonexistent')).not.toThrow();
    });
  });

  describe('attachSourceErrorListeners', () => {
    it('attaches tileloaderror listener for tile sources', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();
      (provider as any).layerErrorCallbacks.set('layer-1', callback);

      const sourceOn = vi.fn();
      const sourceUn = vi.fn();
      // Create a mock tile source that has getTile
      const mockSource = { getTile: vi.fn(), on: sourceOn, un: sourceUn };
      const fakeLayer = { getSource: vi.fn(() => mockSource), on: vi.fn(), un: vi.fn() };

      (provider as any).attachSourceErrorListeners('layer-1', fakeLayer);

      // tileloaderror should be registered on the source
      expect(sourceOn).toHaveBeenCalledWith('tileloaderror', expect.any(Function));
      // change:source should be registered on the layer
      expect(fakeLayer.on).toHaveBeenCalledWith('change:source', expect.any(Function));
    });

    it('tileloaderror handler invokes the stored callback', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();
      (provider as any).layerErrorCallbacks.set('layer-1', callback);

      let tileErrorHandler: () => void;
      const sourceOn = vi.fn((event: string, handler: () => void) => {
        if (event === 'tileloaderror') tileErrorHandler = handler;
      });
      const mockSource = { getTile: vi.fn(), on: sourceOn, un: vi.fn() };
      const fakeLayer = { getSource: vi.fn(() => mockSource), on: vi.fn(), un: vi.fn() };

      (provider as any).attachSourceErrorListeners('layer-1', fakeLayer);

      // Fire the handler
      tileErrorHandler!();

      expect(callback).toHaveBeenCalledWith({
        type: 'network',
        message: 'Tile load error',
      });
    });

    it('cleanup function removes all listeners', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();
      (provider as any).layerErrorCallbacks.set('layer-1', callback);

      const sourceUn = vi.fn();
      const sourceOn = vi.fn();
      const mockSource = { getTile: vi.fn(), on: sourceOn, un: sourceUn };
      const layerUn = vi.fn();
      const fakeLayer = { getSource: vi.fn(() => mockSource), on: vi.fn(), un: layerUn };

      (provider as any).attachSourceErrorListeners('layer-1', fakeLayer);

      // Get the cleanup function and call it
      const cleanup = (provider as any).layerErrorCleanups.get('layer-1');
      expect(cleanup).toBeTypeOf('function');

      cleanup();

      // Source and layer .un() should have been called
      expect(sourceUn).toHaveBeenCalledWith('tileloaderror', expect.any(Function));
      expect(layerUn).toHaveBeenCalledWith('change:source', expect.any(Function));
    });

    it('cleans up previous listeners before re-attaching', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();
      (provider as any).layerErrorCallbacks.set('layer-1', callback);

      const previousCleanup = vi.fn();
      (provider as any).layerErrorCleanups.set('layer-1', previousCleanup);

      const mockSource = { getTile: vi.fn(), on: vi.fn(), un: vi.fn() };
      const fakeLayer = { getSource: vi.fn(() => mockSource), on: vi.fn(), un: vi.fn() };

      (provider as any).attachSourceErrorListeners('layer-1', fakeLayer);

      expect(previousCleanup).toHaveBeenCalledTimes(1);
    });

    it('does nothing when no callback is registered for layerId', async () => {
      const provider = await createInitializedProvider();
      const fakeLayer = { getSource: vi.fn(), on: vi.fn(), un: vi.fn() };

      // Should not throw
      (provider as any).attachSourceErrorListeners('unknown', fakeLayer);

      expect(fakeLayer.getSource).not.toHaveBeenCalled();
    });

    it('does nothing when source is null', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();
      (provider as any).layerErrorCallbacks.set('layer-1', callback);

      const fakeLayer = { getSource: vi.fn(() => null), on: vi.fn(), un: vi.fn() };

      (provider as any).attachSourceErrorListeners('layer-1', fakeLayer);

      // No cleanup should be registered (only for change:source on the layer)
      // But since source is null, no source listeners attached
      expect(fakeLayer.on).not.toHaveBeenCalled();
    });
  });
});
