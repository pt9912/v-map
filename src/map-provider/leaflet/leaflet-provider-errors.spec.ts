import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const {
  mockMap,
  mapInstance,
  MockLayerGroup,
  mockLayerGroup,
  mockTileLayer,
  mockUtilStamp,
} = vi.hoisted(() => {
  class HoistedMockLayerGroup {
    _groupId?: string;
    visible?: boolean;
    addTo = vi.fn().mockReturnThis();
    addLayer = vi.fn();
    clearLayers = vi.fn();
    getLayers = vi.fn(() => []);
  }

  const inst = {
    setView: vi.fn().mockReturnThis(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    eachLayer: vi.fn(),
    invalidateSize: vi.fn(),
    remove: vi.fn(),
  };

  return {
    mapInstance: inst,
    mockMap: vi.fn(() => inst),
    MockLayerGroup: HoistedMockLayerGroup,
    mockLayerGroup: vi.fn(() => new HoistedMockLayerGroup()),
    mockTileLayer: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      setUrl: vi.fn(),
      setOpacity: vi.fn(),
      setZIndex: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    })),
    mockUtilStamp: vi.fn(() => 42),
  };
});

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock('leaflet', () => {
  class MockPath {}
  class MockMarker {}
  class MockGeoJSON {}

  return {
    map: mockMap,
    geoJSON: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      clearLayers: vi.fn(),
      addData: vi.fn(),
      eachLayer: vi.fn(),
      setStyle: vi.fn(),
    })),
    GeoJSON: MockGeoJSON,
    layerGroup: mockLayerGroup,
    LayerGroup: MockLayerGroup,
    tileLayer: Object.assign(mockTileLayer, {
      wms: vi.fn(() => ({
        addTo: vi.fn().mockReturnThis(),
        setOpacity: vi.fn(),
        setZIndex: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
      })),
    }),
    Path: MockPath,
    Marker: MockMarker,
    circleMarker: vi.fn(() => ({})),
    marker: vi.fn(() => ({})),
    icon: vi.fn(() => ({})),
    GridLayer: class {
      options: any = {};
      constructor() {}
    },
    Util: {
      stamp: mockUtilStamp,
      setOptions: vi.fn((instance: any, opts: any) => {
        instance.options = { ...(instance.options ?? {}), ...opts };
      }),
    },
  };
});

vi.mock('../../utils/dom-env', () => ({
  isBrowser: () => true,
  watchElementResize: vi.fn(() => vi.fn()),
  supportsAdoptedStyleSheets: () => false,
}));

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  error: vi.fn(),
}));

vi.mock('./leaflet-helpers', () => ({
  ensureLeafletCss: vi.fn(() => null),
  removeInjectedCss: vi.fn(),
  ensureGoogleLogo: vi.fn(),
}));

vi.mock('./google-map-tiles-layer', () => ({
  GoogleMapTilesLayer: vi.fn(),
}));

vi.mock('./GeoTIFFGridLayer', () => ({
  GeoTIFFGridLayer: vi.fn(),
}));

vi.mock('./WCSGridLayer', () => ({
  WCSGridLayer: vi.fn(),
}));

vi.mock('wellknown', () => ({
  wellknown: { parse: vi.fn() },
}));

vi.mock('@npm9912/s-gml', () => ({
  GmlParser: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Import under test AFTER all mocks
// ---------------------------------------------------------------------------
import { LeafletProvider } from './leaflet-provider';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function createInitializedProvider(): Promise<LeafletProvider> {
  const provider = new LeafletProvider();
  const target = document.createElement('div');
  const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
  await provider.init({ target, shadowRoot } as any);
  return provider;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('LeafletProvider – onLayerError / offLayerError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mapInstance.setView.mockClear();
    mapInstance.setView.mockReturnThis();
    mapInstance.addLayer.mockClear();
    mapInstance.removeLayer.mockClear();
    mapInstance.eachLayer.mockClear();
    mapInstance.invalidateSize.mockClear();
    mapInstance.remove.mockClear();
    mockUtilStamp.mockReturnValue(42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('onLayerError', () => {
    it('stores callback in layerErrorCallbacks', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();

      provider.onLayerError('layer-1', callback);

      expect((provider as any).layerErrorCallbacks.get('layer-1')).toBe(callback);
    });

    it('attaches tileerror listener when layer is found', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();

      const mockLayer = { on: vi.fn(), off: vi.fn() };
      vi.spyOn(provider as any, '_getLayerById').mockResolvedValue(mockLayer);

      provider.onLayerError('layer-1', callback);

      await vi.waitFor(() => {
        expect(mockLayer.on).toHaveBeenCalledWith('tileerror', expect.any(Function));
      });
    });

    it('tileerror handler invokes the callback', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();

      let capturedHandler: () => void;
      const mockLayer = {
        on: vi.fn((event: string, handler: () => void) => {
          if (event === 'tileerror') capturedHandler = handler;
        }),
        off: vi.fn(),
      };
      vi.spyOn(provider as any, '_getLayerById').mockResolvedValue(mockLayer);

      provider.onLayerError('layer-1', callback);

      await vi.waitFor(() => {
        expect(mockLayer.on).toHaveBeenCalled();
      });

      // Fire the tileerror handler
      capturedHandler!();

      expect(callback).toHaveBeenCalledWith({
        type: 'network',
        message: 'Tile load error',
      });
    });

    it('does not attach listener when layer is not found', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();

      vi.spyOn(provider as any, '_getLayerById').mockResolvedValue(null);

      provider.onLayerError('missing', callback);

      await new Promise(r => setTimeout(r, 10));

      // No cleanup should have been registered
      expect((provider as any).layerErrorCleanups.has('missing')).toBe(false);
    });
  });

  describe('offLayerError', () => {
    it('removes callback and invokes cleanup', async () => {
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
      const cleanup = vi.fn();

      (provider as any).layerErrorCallbacks.set('layer-1', vi.fn());
      (provider as any).layerErrorCleanups.set('layer-1', cleanup);

      provider.offLayerError('layer-1');
      expect(() => provider.offLayerError('layer-1')).not.toThrow();

      expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it('does not throw for non-existent layer', async () => {
      const provider = await createInitializedProvider();

      expect(() => provider.offLayerError('nonexistent')).not.toThrow();
    });
  });

  describe('removeLayer calls offLayerError', () => {
    it('cleans up error listener when a layer is removed', async () => {
      const provider = await createInitializedProvider();
      const callback = vi.fn();
      const cleanup = vi.fn();

      (provider as any).layerErrorCallbacks.set('42', callback);
      (provider as any).layerErrorCleanups.set('42', cleanup);

      // Mock layer lookup so removeLayer can find it
      const mockLayer = { on: vi.fn(), off: vi.fn() };
      mapInstance.eachLayer.mockImplementation((fn: any) => fn(mockLayer));
      vi.spyOn(provider as any, '_getLayerById').mockResolvedValue(mockLayer);

      await provider.removeLayer('42');

      expect(cleanup).toHaveBeenCalled();
      expect((provider as any).layerErrorCallbacks.has('42')).toBe(false);
    });
  });
});
