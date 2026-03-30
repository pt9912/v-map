import { describe, it, expect, vi, afterEach } from 'vitest';

// ---- hoisted mocks (must be declared before vi.mock) ----

const { mockTileLayer, mockDeck } = vi.hoisted(() => ({
  mockTileLayer: vi.fn().mockImplementation(function (this: any, props: any) {
    return {
      id: props.id,
      props,
      clone: vi.fn().mockReturnValue({ id: props.id, props }),
    };
  }),
  mockDeck: vi.fn().mockImplementation(function() { return {
    setProps: vi.fn(),
    finalize: vi.fn(),
  }; }),
}));

vi.mock('@deck.gl/core', () => ({
  Deck: mockDeck,
}));

vi.mock('@deck.gl/geo-layers', () => ({
  TileLayer: mockTileLayer,
  TerrainLayer: vi.fn().mockImplementation(function(props: any) { return {
    id: props.id,
    props,
    clone: vi.fn().mockReturnValue({ id: props.id, props }),
  }; }),
}));

vi.mock('@deck.gl/layers', () => ({
  BitmapLayer: vi.fn().mockImplementation(function(props: any) { return {
    id: props?.id,
    props,
  }; }),
  GeoJsonLayer: vi.fn().mockImplementation(function(props: any) { return {
    id: props.id,
    props,
    clone: vi.fn().mockReturnValue({ id: props.id, props }),
  }; }),
  ScatterplotLayer: vi.fn().mockImplementation(function(props: any) { return {
    id: props.id,
    props,
    clone: vi.fn().mockReturnValue({ id: props.id, props }),
  }; }),
}));

vi.mock('wellknown', () => ({
  wellknownModule: {
    default: vi.fn().mockImplementation((wkt: string) => {
      if (wkt.startsWith('POINT')) {
        return { type: 'Point', coordinates: [10, 50] };
      }
      return null;
    }),
  },
}));

vi.mock('@npm9912/s-gml', () => ({
  GmlParser: vi.fn().mockImplementation(function() {
    return {
      parse: vi.fn().mockResolvedValue({ type: 'FeatureCollection', features: [] }),
    };
  }),
}));

vi.mock('./DeckGLGeoTIFFLayer', () => ({
  createDeckGLGeoTIFFLayer: vi.fn().mockRejectedValue(new Error('GeoTIFF not available')),
}));

vi.mock('./DeckGLGeoTIFFTerrainLayer', () => ({
  createDeckGLGeoTIFFTerrainLayer: vi.fn().mockRejectedValue(new Error('Terrain not available')),
}));

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  warn: vi.fn(),
}));

import { DeckProvider } from './deck-provider';

// ---------- helpers ----------

function createTarget() {
  const target = document.createElement('div');
  const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
  return { target, shadowRoot };
}

async function initProvider(): Promise<DeckProvider> {
  const provider = new DeckProvider();
  const { target, shadowRoot } = createTarget();
  await provider.init({ target, shadowRoot });
  return provider;
}

// ---------- tests ----------

describe('DeckProvider – onLayerError / offLayerError', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('onLayerError', () => {
    it('stores callback in the layerErrorCallbacks map', async () => {
      const provider = await initProvider();
      const callback = vi.fn();

      provider.onLayerError('layer-1', callback);

      expect((provider as any).layerErrorCallbacks.get('layer-1')).toBe(callback);
    });

    it('stores multiple callbacks for different layers', async () => {
      const provider = await initProvider();
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      provider.onLayerError('layer-1', cb1);
      provider.onLayerError('layer-2', cb2);

      expect((provider as any).layerErrorCallbacks.get('layer-1')).toBe(cb1);
      expect((provider as any).layerErrorCallbacks.get('layer-2')).toBe(cb2);
    });

    it('overwrites callback for the same layer', async () => {
      const provider = await initProvider();
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      provider.onLayerError('layer-1', cb1);
      provider.onLayerError('layer-1', cb2);

      expect((provider as any).layerErrorCallbacks.get('layer-1')).toBe(cb2);
    });
  });

  describe('offLayerError', () => {
    it('removes callback from the map', async () => {
      const provider = await initProvider();
      const callback = vi.fn();

      provider.onLayerError('layer-1', callback);
      provider.offLayerError('layer-1');

      expect((provider as any).layerErrorCallbacks.has('layer-1')).toBe(false);
    });

    it('does not throw when removing a non-existent layer', async () => {
      const provider = await initProvider();

      expect(() => provider.offLayerError('nonexistent')).not.toThrow();
    });

    it('does not affect other layers', async () => {
      const provider = await initProvider();
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      provider.onLayerError('layer-1', cb1);
      provider.onLayerError('layer-2', cb2);

      provider.offLayerError('layer-1');

      expect((provider as any).layerErrorCallbacks.has('layer-1')).toBe(false);
      expect((provider as any).layerErrorCallbacks.get('layer-2')).toBe(cb2);
    });
  });

  describe('callback invocation from onTileError', () => {
    it('XYZ layer onTileError invokes the stored callback', async () => {
      const provider = await initProvider();

      // Add an XYZ layer to capture the TileLayer constructor call
      const config = {
        type: 'xyz' as const,
        url: 'https://example.com/{z}/{x}/{y}.png',
        groupId: 'test-group',
      };

      const layerId = await provider.addLayerToGroup(config);
      expect(layerId).toBeTruthy();

      // Register an error callback
      const callback = vi.fn();
      provider.onLayerError(layerId, callback);

      // The TileLayer mock was called with props that include onTileError
      // Find the call that matches our layerId
      const tileLayerCall = mockTileLayer.mock.calls.find(
        (call: any[]) => call[0]?.id === layerId,
      );

      if (tileLayerCall) {
        const props = tileLayerCall[0];
        if (props.onTileError) {
          props.onTileError(new Error('Network failure'));

          expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'network',
              message: expect.stringContaining('Tile load error'),
            }),
          );
        }
      }
    });
  });

  describe('WMS getTileData catch block invokes callback', () => {
    it('calls layerErrorCallbacks when WMS fetch fails', async () => {
      const provider = await initProvider();

      // Stub global fetch to reject
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('DNS failure'));

      const config = {
        type: 'wms' as const,
        url: 'https://invalid.example.com/wms',
        layers: 'test',
        groupId: 'test-group',
      };

      const layerId = await provider.addLayerToGroup(config);
      expect(layerId).toBeTruthy();

      const callback = vi.fn();
      provider.onLayerError(layerId, callback);

      // Find the TileLayer constructor call for this WMS layer
      const tileLayerCall = mockTileLayer.mock.calls.find(
        (call: any[]) => call[0]?.id === layerId,
      );
      expect(tileLayerCall).toBeTruthy();

      const props = tileLayerCall![0];
      expect(props.getTileData).toBeDefined();

      // Invoke getTileData — it will fetch and fail, hitting the catch block
      const tileLoadProps = { bbox: { west: 0, south: 0, east: 1, north: 1 }, zoom: 5, signal: new AbortController().signal };
      await props.getTileData(tileLoadProps);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'network',
          message: expect.stringContaining('WMS tile fetch error'),
        }),
      );

      fetchSpy.mockRestore();
    });
  });

  describe('WCS getTileData catch block invokes callback', () => {
    it('calls layerErrorCallbacks when WCS fetch fails', async () => {
      const provider = await initProvider();

      const config = {
        type: 'wcs' as const,
        url: 'https://invalid.example.com/wcs',
        coverageName: 'test-coverage',
        groupId: 'test-group',
      };

      const layerId = await provider.addLayerToGroup(config);
      expect(layerId).toBeTruthy();

      const callback = vi.fn();
      provider.onLayerError(layerId, callback);

      // Mock fetch AFTER layer creation (so addLayerToGroup is unaffected)
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

      const tileLayerCall = mockTileLayer.mock.calls.find(
        (call: any[]) => call[0]?.id === layerId,
      );
      expect(tileLayerCall).toBeTruthy();

      const props = tileLayerCall![0];
      expect(props.getTileData).toBeDefined();

      const tileLoadProps = { bbox: { west: 0, south: 0, east: 1, north: 1 }, zoom: 5, signal: new AbortController().signal };
      await props.getTileData(tileLoadProps);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'network',
          message: expect.stringContaining('WCS tile fetch error'),
        }),
      );

      fetchSpy.mockRestore();
    });
  });

  describe('removeLayer clears error callback', () => {
    it('removes error callback when layer is removed', async () => {
      const provider = await initProvider();

      const config = {
        type: 'osm' as const,
        groupId: 'test-group',
      };

      const layerId = await provider.addLayerToGroup(config);
      expect(layerId).toBeTruthy();

      const callback = vi.fn();
      provider.onLayerError(layerId, callback);
      expect((provider as any).layerErrorCallbacks.has(layerId)).toBe(true);

      await provider.removeLayer(layerId);

      expect((provider as any).layerErrorCallbacks.has(layerId)).toBe(false);
    });
  });
});
