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
    MapProviderReady: 'map-provider-ready',
    MapProviderWillShutdown: 'map-provider-will-shutdown',
    MapMouseMove: 'map-mousemove',
  },
}));

import { VMapLayerHelper } from './v-map-layer-helper';
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
    getMapProvider: vi.fn().mockResolvedValue(mapProvider),
    addEventListener: vi.fn((event: string, handler: EventListener) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
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
  return {
    nodeName: 'V-MAP-LAYER-XYZ',
    closest: vi.fn((selector: string) => {
      return closest[selector] ?? null;
    }),
  } as unknown as HTMLElement;
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */
describe('VMapLayerHelper', () => {
  let helper: VMapLayerHelper;
  let mockEl: HTMLElement;
  let mockProvider: ReturnType<typeof createMockMapProvider>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockProvider = createMockMapProvider();
    mockEl = createMockElement();
    helper = new VMapLayerHelper(mockEl);
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
  /*  setVisible / setOpacity / setZIndex when no provider            */
  /* ================================================================ */
  describe('setVisible', () => {
    it('does nothing when mapProvider is null', async () => {
      // Should not throw
      await helper.setVisible(true);
    });

    it('delegates to mapProvider.setVisible', async () => {
      (helper as any).mapProvider = mockProvider;
      (helper as any).layerId = 'layer-1';

      await helper.setVisible(false);

      expect(mockProvider.setVisible).toHaveBeenCalledWith('layer-1', false);
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
    it('delegates to mapProvider.updateLayer', async () => {
      (helper as any).mapProvider = mockProvider;
      (helper as any).layerId = 'layer-1';

      const update = { type: 'geojson', data: { url: 'new.json' } } as any;
      await helper.updateLayer(update);

      expect(mockProvider.updateLayer).toHaveBeenCalledWith('layer-1', update);
    });

    it('does nothing when mapProvider is null', async () => {
      await helper.updateLayer({ type: 'geojson', data: {} } as any);
      // no throw
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

    it('defers layer add via MapProviderReady event', async () => {
      // Map provider NOT available initially
      const mockVMap = createMockVMap(null);
      const mockGroup = createMockLayerGroup();
      const createLayerConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await (helper as any).addToMapInternal(
        mockGroup,
        mockVMap,
        createLayerConfig,
      );

      // Layer should not be added yet
      expect(helper.getLayerId()).toBeNull();

      // Fire the MapProviderReady event
      mockVMap._fireEvent('map-provider-ready', { mapProvider: mockProvider });

      // Wait for async handler
      await vi.waitFor(() => {
        expect(helper.getLayerId()).toBe('group-layer-id');
      });
    });

    it('does not add layer twice on deferred event if already added', async () => {
      const mockVMap = createMockVMap(mockProvider);
      const mockGroup = createMockLayerGroup();
      const createLayerConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await (helper as any).addToMapInternal(
        mockGroup,
        mockVMap,
        createLayerConfig,
      );

      // layerId is already set from initial add
      expect(helper.getLayerId()).toBe('group-layer-id');

      // Fire MapProviderReady event - should not add again
      mockProvider.addLayerToGroup.mockClear();
      mockVMap._fireEvent('map-provider-ready', { mapProvider: mockProvider });

      await new Promise(r => setTimeout(r, 10));
      expect(mockProvider.addLayerToGroup).not.toHaveBeenCalled();
    });

    it('catches and warns on addLayer failure during immediate add', async () => {
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

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('failed to add layer: add failed'),
      );
      expect(helper.getLayerId()).toBeNull();
    });

    it('catches and warns on addLayer failure during deferred add', async () => {
      const failProvider = createMockMapProvider({
        addLayerToGroup: vi.fn().mockRejectedValue(new Error('deferred fail')),
      });
      const mockVMap = createMockVMap(null);
      const mockGroup = createMockLayerGroup();
      const createLayerConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await (helper as any).addToMapInternal(
        mockGroup,
        mockVMap,
        createLayerConfig,
      );

      // Fire deferred event
      mockVMap._fireEvent('map-provider-ready', { mapProvider: failProvider });

      await vi.waitFor(() => {
        expect(warn).toHaveBeenCalledWith(
          expect.stringContaining('failed to add layer: deferred fail'),
        );
      });
    });
  });

  /* ================================================================ */
  /*  initLayer                                                        */
  /* ================================================================ */
  describe('initLayer', () => {
    it('warns when element is not inside a v-map-layergroup', async () => {
      const el = createMockElement({});
      const h = new VMapLayerHelper(el);

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
      const h = new VMapLayerHelper(el);

      // We need customElements.whenDefined to be a mock
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

    it('adds MapProviderWillShutdown listener and calls addToMapInternal', async () => {
      const mockGroup = createMockLayerGroup();
      const mockVMap = createMockVMap(mockProvider);
      const el = createMockElement({
        'v-map-layergroup': mockGroup,
        'v-map': mockVMap,
      });

      // Ensure customElements.whenDefined is available
      if (!globalThis.customElements) {
        (globalThis as any).customElements = {
          whenDefined: vi.fn().mockResolvedValue(undefined),
        };
      } else {
        vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);
      }

      const h = new VMapLayerHelper(el);
      const createConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await h.initLayer(createConfig, 'el-id');

      // Should have registered MapProviderWillShutdown listener
      expect(mockVMap.addEventListener).toHaveBeenCalledWith(
        'map-provider-will-shutdown',
        expect.any(Function),
      );

      // Layer should have been added
      expect(h.getLayerId()).toBe('group-layer-id');
    });

    it('MapProviderWillShutdown clears mapProvider and layerId', async () => {
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

      const h = new VMapLayerHelper(el);
      const createConfig = vi.fn().mockReturnValue({ type: 'osm' });

      await h.initLayer(createConfig);

      expect(h.getMapProvider()).not.toBeNull();
      expect(h.getLayerId()).not.toBeNull();

      // Fire the shutdown event
      mockVMap._fireEvent('map-provider-will-shutdown', {});

      await new Promise(r => setTimeout(r, 10));

      expect(h.getMapProvider()).toBeNull();
      expect(h.getLayerId()).toBeNull();
    });
  });
});
