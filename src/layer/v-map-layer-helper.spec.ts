import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../utils/logger', () => ({
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}));

vi.mock('../utils/events', () => ({
  VMapEvents: {
    Ready: 'ready',
    Error: 'vmap-error',
    MapProviderReady: 'map-provider-ready',
    MapProviderWillShutdown: 'map-provider-will-shutdown',
    MapMouseMove: 'map-mousemove',
  },
}));

import { VMapLayerHelper, type VMapErrorHost } from './v-map-layer-helper';
import { warn } from '../utils/logger';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function createMockMapProvider(overrides: Record<string, unknown> = {}) {
  return {
    addBaseLayer: vi.fn().mockResolvedValue('base-layer-id'),
    addLayerToGroup: vi.fn().mockResolvedValue('group-layer-id'),
    removeLayer: vi.fn().mockResolvedValue(undefined),
    setVisible: vi.fn().mockResolvedValue(undefined),
    setOpacity: vi.fn().mockResolvedValue(undefined),
    setZIndex: vi.fn().mockResolvedValue(undefined),
    updateLayer: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function createMockVMap(mapProvider: unknown) {
  const listeners: Record<string, EventListener[]> = {};
  return {
    __vMapProvider: mapProvider,
    isMapProviderReady: vi.fn().mockResolvedValue(mapProvider !== null && mapProvider !== undefined),
    addEventListener: vi.fn((event: string, handler: EventListener) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    }),
    removeEventListener: vi.fn((event: string, handler: EventListener) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(h => h !== handler);
      }
    }),
    _fireEvent(eventName: string, detail: unknown) {
      const handlers = listeners[eventName] || [];
      for (const h of handlers) {
        h(new CustomEvent(eventName, { detail }) as any);
      }
    },
  };
}

function createMockLayerGroup(overrides: Record<string, unknown> = {}) {
  return {
    getGroupId: vi.fn().mockResolvedValue('test-group-id'),
    visible: true,
    basemapid: '',
    ...overrides,
  };
}

function createMockElement(closest: Record<string, unknown> = {}) {
  const el = {
    nodeName: 'V-MAP-LAYER-XYZ',
    closest: vi.fn((selector: string) => {
      return closest[selector] ?? null;
    }),
    dispatchEvent: vi.fn(),
  } as unknown as HTMLElement;
  return el;
}

function createMockHost(): VMapErrorHost & { states: string[] } {
  return {
    states: [] as string[],
    setLoadState(state: 'idle' | 'loading' | 'ready' | 'error') {
      this.states.push(state);
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */
describe('VMapLayerHelper', () => {
  let helper: VMapLayerHelper;
  let mockEl: HTMLElement;
  let mockProvider: ReturnType<typeof createMockMapProvider>;
  let mockHost: ReturnType<typeof createMockHost>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockProvider = createMockMapProvider();
    mockEl = createMockElement();
    mockHost = createMockHost();
    helper = new VMapLayerHelper(mockEl, mockHost);
  });

  /* ================================================================ */
  /*  getLayerId / getMapProvider basics                               */
  /* ================================================================ */
  describe('getLayerId', () => {
    it('returns null when no layer has been added', () => {
      expect(helper.getLayerId()).toBeNull();
    });
  });

  describe('getMapProvider', () => {
    it('returns null when no provider has been set', () => {
      expect(helper.getMapProvider()).toBeNull();
    });
  });

  /* ================================================================ */
  /*  Error / State management                                         */
  /* ================================================================ */
  describe('error management', () => {
    it('setError stores error, sets state, dispatches event and warns', () => {
      const detail = { type: 'provider' as const, message: 'test error' };

      helper.setError(detail);

      expect(helper.getError()).toEqual(detail);
      expect(mockHost.states).toContain('error');
      expect(mockEl.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'vmap-error',
          detail,
          bubbles: true,
          composed: true,
        }),
      );
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('test error'),
      );
    });

    it('clearError removes stored error', () => {
      helper.setError({ type: 'provider', message: 'err' });
      helper.clearError();
      expect(helper.getError()).toBeUndefined();
    });

    it('getError returns undefined when no error', () => {
      expect(helper.getError()).toBeUndefined();
    });

    it('startLoading sets loading state but keeps last error', () => {
      helper.setError({ type: 'provider', message: 'old error' });
      mockHost.states = [];

      helper.startLoading();

      expect(mockHost.states).toEqual(['loading']);
      expect(helper.getError()).toBeDefined();
    });

    it('markReady clears error and sets ready state', () => {
      helper.setError({ type: 'provider', message: 'err' });
      mockHost.states = [];

      helper.markReady();

      expect(helper.getError()).toBeUndefined();
      expect(mockHost.states).toEqual(['ready']);
    });

    it('markUpdated delegates to markReady', () => {
      helper.setError({ type: 'provider', message: 'err' });
      mockHost.states = [];

      helper.markUpdated();

      expect(helper.getError()).toBeUndefined();
      expect(mockHost.states).toEqual(['ready']);
    });
  });

  /* ================================================================ */
  /*  setVisible / setOpacity / setZIndex                              */
  /* ================================================================ */
  describe('setVisible', () => {
    it('does nothing when mapProvider is null', async () => {
      await helper.setVisible(true);
    });

    it('does nothing when layerId is null', async () => {
      (helper as any).mapProvider = mockProvider;
      await helper.setVisible(true);
      expect(mockProvider.setVisible).not.toHaveBeenCalled();
    });

    it('delegates to mapProvider.setVisible', async () => {
      (helper as any).mapProvider = mockProvider;
      (helper as any).layerId = 'layer-1';

      await helper.setVisible(false);

      expect(mockProvider.setVisible).toHaveBeenCalledWith('layer-1', false);
    });

    it('sets error on provider failure', async () => {
      (helper as any).mapProvider = createMockMapProvider({
        setVisible: vi.fn().mockRejectedValue(new Error('vis fail')),
      });
      (helper as any).layerId = 'layer-1';

      await helper.setVisible(true);

      expect(helper.getError()?.type).toBe('provider');
      expect(helper.getError()?.message).toContain('setVisible failed');
    });

    it('does NOT set ready state on success', async () => {
      (helper as any).mapProvider = mockProvider;
      (helper as any).layerId = 'layer-1';
      mockHost.states = [];

      await helper.setVisible(true);

      expect(mockHost.states).not.toContain('ready');
    });
  });

  describe('setOpacity', () => {
    it('does nothing when mapProvider is null', async () => {
      await helper.setOpacity(0.5);
    });

    it('delegates to mapProvider.setOpacity', async () => {
      (helper as any).mapProvider = mockProvider;
      (helper as any).layerId = 'layer-1';

      await helper.setOpacity(0.75);

      expect(mockProvider.setOpacity).toHaveBeenCalledWith('layer-1', 0.75);
    });

    it('sets error on provider failure', async () => {
      (helper as any).mapProvider = createMockMapProvider({
        setOpacity: vi.fn().mockRejectedValue(new Error('opacity fail')),
      });
      (helper as any).layerId = 'layer-1';

      await helper.setOpacity(0.5);

      expect(helper.getError()?.message).toContain('setOpacity failed');
    });
  });

  describe('setZIndex', () => {
    it('does nothing when mapProvider is null', async () => {
      await helper.setZIndex(5);
    });

    it('delegates to mapProvider.setZIndex', async () => {
      (helper as any).mapProvider = mockProvider;
      (helper as any).layerId = 'layer-1';

      await helper.setZIndex(10);

      expect(mockProvider.setZIndex).toHaveBeenCalledWith('layer-1', 10);
    });

    it('sets error on provider failure', async () => {
      (helper as any).mapProvider = createMockMapProvider({
        setZIndex: vi.fn().mockRejectedValue(new Error('z fail')),
      });
      (helper as any).layerId = 'layer-1';

      await helper.setZIndex(5);

      expect(helper.getError()?.message).toContain('setZIndex failed');
    });
  });

  /* ================================================================ */
  /*  removeLayer                                                      */
  /* ================================================================ */
  describe('removeLayer', () => {
    it('calls mapProvider.removeLayer and resets layerId', async () => {
      (helper as any).mapProvider = mockProvider;
      (helper as any).layerId = 'layer-1';

      await helper.removeLayer();

      expect(mockProvider.removeLayer).toHaveBeenCalledWith('layer-1');
      expect(helper.getLayerId()).toBeNull();
    });

    it('does nothing when mapProvider is null', async () => {
      (helper as any).layerId = 'layer-1';

      await helper.removeLayer();

      expect(helper.getLayerId()).toBeNull();
    });
  });

  /* ================================================================ */
  /*  updateLayer                                                      */
  /* ================================================================ */
  describe('updateLayer', () => {
    it('delegates to mapProvider.updateLayer and marks updated', async () => {
      (helper as any).mapProvider = mockProvider;
      (helper as any).layerId = 'layer-1';
      mockHost.states = [];

      const update = { type: 'geojson', data: { url: 'new.json' } } as any;
      await helper.updateLayer(update);

      expect(mockProvider.updateLayer).toHaveBeenCalledWith('layer-1', update);
      expect(mockHost.states).toContain('ready');
    });

    it('triggers recreateLayer when layerId is missing', async () => {
      // Set up initContext so recreateLayer can work
      const mockVMap = createMockVMap(mockProvider);
      const mockGroup = createMockLayerGroup();
      (helper as any).initContext = { group: mockGroup, vmap: mockVMap, createLayerConfig: () => ({ type: 'osm' }), elementId: 'el' };
      (helper as any).mapProvider = null;

      await helper.updateLayer({ type: 'geojson', data: {} } as any);

      // recreateLayer should have been called, which calls addToMapInternal
      expect(mockHost.states).toContain('loading');
    });

    it('sets error on provider failure', async () => {
      (helper as any).mapProvider = createMockMapProvider({
        updateLayer: vi.fn().mockRejectedValue(new Error('update fail')),
      });
      (helper as any).layerId = 'layer-1';

      await helper.updateLayer({ type: 'geojson', data: {} } as any);

      expect(helper.getError()?.message).toContain('updateLayer failed');
    });
  });

  /* ================================================================ */
  /*  addLayer (private) - tested through addToMapInternal             */
  /* ================================================================ */
  describe('addLayer (private, via addToMapInternal)', () => {
    it('warns and returns null when mapProvider is not set', async () => {
      // Access private method directly for focused testing
      const result = await (helper as any).addLayer('', 'g1', true, { type: 'osm' });

      expect(warn).toHaveBeenCalledWith('Map provider not available.');
      expect(result).toBeNull();
    });

    it('calls addBaseLayer when basemapid is provided', async () => {
      (helper as any).mapProvider = mockProvider;

      const config = { type: 'osm' };
      const result = await (helper as any).addLayer(
        'my-basemap',
        'g1',
        true,
        config,
        'element-1',
      );

      expect(mockProvider.addBaseLayer).toHaveBeenCalledWith(
        { ...config, groupId: 'g1', groupVisible: true },
        'my-basemap',
        'element-1',
      );
      expect(result).toBe('base-layer-id');
    });

    it('calls addLayerToGroup when basemapid is empty', async () => {
      (helper as any).mapProvider = mockProvider;

      const config = { type: 'osm' };
      const result = await (helper as any).addLayer('', 'g1', false, config);

      expect(mockProvider.addLayerToGroup).toHaveBeenCalledWith({
        ...config,
        groupId: 'g1',
        groupVisible: false,
      });
      expect(result).toBe('group-layer-id');
    });
  });

  /* ================================================================ */
  /*  addToMapInternal                                                 */
  /* ================================================================ */
  describe('addToMapInternal', () => {
    it('adds layer immediately when map provider is already available', async () => {
      const mockVMap = createMockVMap(mockProvider);
      const mockGroup = createMockLayerGroup();

      const createLayerConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await (helper as any).addToMapInternal(
        mockGroup,
        mockVMap,
        createLayerConfig,
        'el-1',
      );

      expect(mockProvider.addLayerToGroup).toHaveBeenCalled();
      expect(helper.getLayerId()).toBe('group-layer-id');
      expect(mockHost.states).toContain('ready');
    });

    it('adds layer with basemapid when available', async () => {
      const mockVMap = createMockVMap(mockProvider);
      const mockGroup = createMockLayerGroup({ basemapid: 'base-1' });

      const createLayerConfig = vi.fn().mockReturnValue({ type: 'xyz', url: 'test' });

      await (helper as any).addToMapInternal(
        mockGroup,
        mockVMap,
        createLayerConfig,
        'el-1',
      );

      expect(mockProvider.addBaseLayer).toHaveBeenCalled();
      expect(helper.getLayerId()).toBe('base-layer-id');
    });

    it('removes existing layer before adding new one', async () => {
      (helper as any).layerId = 'old-layer';
      (helper as any).mapProvider = mockProvider;

      const mockVMap = createMockVMap(mockProvider);
      const mockGroup = createMockLayerGroup();
      const createLayerConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await (helper as any).addToMapInternal(
        mockGroup,
        mockVMap,
        createLayerConfig,
      );

      expect(mockProvider.removeLayer).toHaveBeenCalledWith('old-layer');
    });

    it('sets error on addLayer failure', async () => {
      const failProvider = createMockMapProvider({
        addLayerToGroup: vi.fn().mockRejectedValue(new Error('add failed')),
      });
      const mockVMap = createMockVMap(failProvider);
      const mockGroup = createMockLayerGroup();
      const createLayerConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await (helper as any).addToMapInternal(
        mockGroup,
        mockVMap,
        createLayerConfig,
      );

      expect(helper.getError()?.type).toBe('provider');
      expect(helper.getError()?.message).toContain('Layer could not be added');
      expect(helper.getError()?.message).toContain('add failed');
      expect(mockHost.states).toContain('error');
    });

    it('sets error when addLayer returns falsy layerId', async () => {
      const nullProvider = createMockMapProvider({
        addLayerToGroup: vi.fn().mockResolvedValue(null),
      });
      const mockVMap = createMockVMap(nullProvider);
      const mockGroup = createMockLayerGroup();
      const createLayerConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await (helper as any).addToMapInternal(
        mockGroup,
        mockVMap,
        createLayerConfig,
      );

      expect(helper.getError()?.message).toContain('provider returned no layer ID');
      expect(mockHost.states).toContain('error');
    });
  });

  /* ================================================================ */
  /*  initLayer                                                        */
  /* ================================================================ */
  describe('initLayer', () => {
    it('warns when element is not inside a v-map-layergroup', async () => {
      const el = createMockElement({});
      const h = new VMapLayerHelper(el, mockHost);

      await h.initLayer(() => ({ type: 'osm' }) as any);

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('is not inside a v-map-layergroup'),
      );
    });

    it('warns when no parent v-map component found', async () => {
      const mockGroup = createMockLayerGroup();
      const el = createMockElement({
        'v-map-layergroup': mockGroup,
        // no v-map
      });
      const h = new VMapLayerHelper(el, mockHost);

      if (!globalThis.customElements) {
        (globalThis as any).customElements = {
          whenDefined: vi.fn().mockResolvedValue(undefined),
        };
      }

      await h.initLayer(() => ({ type: 'osm' }) as any);

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('No parent v-map component found'),
      );
    });

    it('binds map events and calls addToMapInternal', async () => {
      const mockGroup = createMockLayerGroup();
      const mockVMap = createMockVMap(mockProvider);
      const el = createMockElement({
        'v-map-layergroup': mockGroup,
        'v-map': mockVMap,
      });

      if (!globalThis.customElements) {
        (globalThis as any).customElements = {
          whenDefined: vi.fn().mockResolvedValue(undefined),
        };
      } else {
        vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);
      }

      const h = new VMapLayerHelper(el, mockHost);
      const createConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await h.initLayer(createConfig, 'el-id');

      // Should have registered both event listeners
      expect(mockVMap.addEventListener).toHaveBeenCalledWith(
        'map-provider-ready',
        expect.any(Function),
      );
      expect(mockVMap.addEventListener).toHaveBeenCalledWith(
        'map-provider-will-shutdown',
        expect.any(Function),
      );

      // Layer should have been added
      expect(h.getLayerId()).toBe('group-layer-id');
    });

    it('defers layer add via MapProviderReady event', async () => {
      const mockGroup = createMockLayerGroup();
      const mockVMap = createMockVMap(null);
      const el = createMockElement({
        'v-map-layergroup': mockGroup,
        'v-map': mockVMap,
      });

      if (!globalThis.customElements) {
        (globalThis as any).customElements = {
          whenDefined: vi.fn().mockResolvedValue(undefined),
        };
      } else {
        vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);
      }

      const h = new VMapLayerHelper(el, mockHost);
      const createConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await h.initLayer(createConfig);

      // Layer should not be added yet
      expect(h.getLayerId()).toBeNull();

      // Fire the MapProviderReady event
      mockVMap.__vMapProvider = mockProvider;
      mockVMap.isMapProviderReady.mockResolvedValue(true);
      mockVMap._fireEvent('map-provider-ready', { mapProvider: mockProvider });

      await vi.waitFor(() => {
        expect(h.getLayerId()).toBe('group-layer-id');
      });

      // Should have set loading before adding
      expect(mockHost.states).toContain('loading');
    });

    it('sets error on addLayer failure during deferred add', async () => {
      const failProvider = createMockMapProvider({
        addLayerToGroup: vi.fn().mockRejectedValue(new Error('deferred fail')),
      });
      const mockGroup = createMockLayerGroup();
      const mockVMap = createMockVMap(null);
      const el = createMockElement({
        'v-map-layergroup': mockGroup,
        'v-map': mockVMap,
      });

      if (!globalThis.customElements) {
        (globalThis as any).customElements = {
          whenDefined: vi.fn().mockResolvedValue(undefined),
        };
      } else {
        vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);
      }

      const h = new VMapLayerHelper(el, mockHost);
      const createConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await h.initLayer(createConfig);

      // Fire deferred event — update mock so addToMapInternal sees the provider
      mockVMap.__vMapProvider = failProvider;
      mockVMap.isMapProviderReady.mockResolvedValue(true);
      mockVMap._fireEvent('map-provider-ready', { mapProvider: failProvider });

      await vi.waitFor(() => {
        expect(h.getError()?.message).toContain('Layer could not be added');
        expect(h.getError()?.message).toContain('deferred fail');
      });
    });

    it('MapProviderWillShutdown clears state to idle', async () => {
      const mockGroup = createMockLayerGroup();
      const mockVMap = createMockVMap(mockProvider);
      const el = createMockElement({
        'v-map-layergroup': mockGroup,
        'v-map': mockVMap,
      });

      if (!globalThis.customElements) {
        (globalThis as any).customElements = {
          whenDefined: vi.fn().mockResolvedValue(undefined),
        };
      } else {
        vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);
      }

      const h = new VMapLayerHelper(el, mockHost);
      const createConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await h.initLayer(createConfig);

      expect(h.getMapProvider()).not.toBeNull();
      expect(h.getLayerId()).not.toBeNull();

      mockHost.states = [];
      mockVMap._fireEvent('map-provider-will-shutdown', {});

      await new Promise(r => setTimeout(r, 10));

      expect(h.getMapProvider()).toBeNull();
      expect(h.getLayerId()).toBeNull();
      expect(h.getError()).toBeUndefined();
      expect(mockHost.states).toContain('idle');
    });
  });

  /* ================================================================ */
  /*  recreateLayer                                                    */
  /* ================================================================ */
  describe('recreateLayer', () => {
    it('does nothing without initContext', async () => {
      mockHost.states = [];
      await helper.recreateLayer();
      expect(mockHost.states).toEqual([]);
    });

    it('calls addToMapInternal with stored context', async () => {
      const mockVMap = createMockVMap(mockProvider);
      const mockGroup = createMockLayerGroup();
      const createConfig = vi.fn().mockReturnValue({ type: 'osm' });
      (helper as any).initContext = { group: mockGroup, vmap: mockVMap, createLayerConfig: createConfig, elementId: 'el' };

      mockHost.states = [];
      await helper.recreateLayer();

      expect(mockHost.states).toContain('loading');
      expect(helper.getLayerId()).toBe('group-layer-id');
    });

    it('guards against parallel calls via recreateInFlight', async () => {
      const mockVMap = createMockVMap(mockProvider);
      const mockGroup = createMockLayerGroup();
      const createConfig = vi.fn().mockReturnValue({ type: 'osm' });
      (helper as any).initContext = { group: mockGroup, vmap: mockVMap, createLayerConfig: createConfig, elementId: 'el' };

      // Call twice in parallel
      const p1 = helper.recreateLayer();
      const p2 = helper.recreateLayer();
      await Promise.all([p1, p2]);

      // addLayerToGroup should only be called once
      expect(mockProvider.addLayerToGroup).toHaveBeenCalledTimes(1);
    });

    it('resets recreateInFlight even on error', async () => {
      const failProvider = createMockMapProvider({
        addLayerToGroup: vi.fn().mockRejectedValue(new Error('fail')),
      });
      const mockVMap = createMockVMap(failProvider);
      const mockGroup = createMockLayerGroup();
      const createConfig = vi.fn().mockReturnValue({ type: 'osm' });
      (helper as any).initContext = { group: mockGroup, vmap: mockVMap, createLayerConfig: createConfig };

      await helper.recreateLayer();

      // Should be able to call again (recreateInFlight was reset)
      expect((helper as any).recreateInFlight).toBe(false);
    });
  });

  /* ================================================================ */
  /*  dispose                                                          */
  /* ================================================================ */
  describe('dispose', () => {
    it('removes event listeners, layer, error, and sets idle', async () => {
      const mockGroup = createMockLayerGroup();
      const mockVMap = createMockVMap(mockProvider);
      const el = createMockElement({
        'v-map-layergroup': mockGroup,
        'v-map': mockVMap,
      });

      if (!globalThis.customElements) {
        (globalThis as any).customElements = {
          whenDefined: vi.fn().mockResolvedValue(undefined),
        };
      } else {
        vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);
      }

      const h = new VMapLayerHelper(el, mockHost);
      await h.initLayer(() => ({ type: 'osm' }) as any);

      expect(h.getLayerId()).toBe('group-layer-id');

      // Set an error to verify it gets cleared
      h.setError({ type: 'provider', message: 'some error' });
      mockHost.states = [];

      await h.dispose();

      expect(mockVMap.removeEventListener).toHaveBeenCalledWith(
        'map-provider-ready',
        expect.any(Function),
      );
      expect(mockVMap.removeEventListener).toHaveBeenCalledWith(
        'map-provider-will-shutdown',
        expect.any(Function),
      );
      expect(h.getLayerId()).toBeNull();
      expect(h.getError()).toBeUndefined();
      expect(mockHost.states).toContain('idle');
    });

    it('allows re-binding after dispose via initLayer', async () => {
      const mockGroup = createMockLayerGroup();
      const mockVMap = createMockVMap(mockProvider);
      const el = createMockElement({
        'v-map-layergroup': mockGroup,
        'v-map': mockVMap,
      });

      if (!globalThis.customElements) {
        (globalThis as any).customElements = {
          whenDefined: vi.fn().mockResolvedValue(undefined),
        };
      } else {
        vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);
      }

      const h = new VMapLayerHelper(el, mockHost);
      await h.initLayer(() => ({ type: 'osm' }) as any);
      await h.dispose();

      // Re-init should work (listenersBound was reset)
      mockProvider.addLayerToGroup.mockClear();
      await h.initLayer(() => ({ type: 'osm' }) as any);

      expect(h.getLayerId()).toBe('group-layer-id');
      expect(mockVMap.addEventListener).toHaveBeenCalledWith(
        'map-provider-ready',
        expect.any(Function),
      );
    });
  });

  /* ================================================================ */
  /*  host-less usage (backward compatibility)                         */
  /* ================================================================ */
  describe('without host', () => {
    it('works without host parameter', async () => {
      const hostlessHelper = new VMapLayerHelper(mockEl);

      // Should not throw
      hostlessHelper.startLoading();
      hostlessHelper.markReady();
      hostlessHelper.setError({ type: 'provider', message: 'test' });
      expect(hostlessHelper.getError()?.message).toBe('test');
    });
  });
});
