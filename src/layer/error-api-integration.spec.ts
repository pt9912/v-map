/**
 * Integration tests for the Error-API using real Stencil layer components.
 *
 * These tests verify the full component → VMapLayerHelper → provider path
 * for every cross-cutting Error-API scenario from docs/dev/CONCEPT-ERROR-API.md:
 *
 * 1. Event bubbling: vmap-error dispatched by the helper on the component's
 *    element bubbles up to a parent v-map element
 * 2. Reattach: disconnectedCallback (dispose) resets state to idle,
 *    connectedCallback re-initialises the layer
 * 3. Provider shutdown + recovery: MapProviderWillShutdown → idle,
 *    MapProviderReady → layer rebuilt
 * 4. Mixed error states: multiple components in different states,
 *    CSS selector [load-state="error"] finds exactly the faulty ones
 */
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

import { VMapLayerOSM } from '../components/v-map-layer-osm/v-map-layer-osm';
import { VMapLayerWms } from '../components/v-map-layer-wms/v-map-layer-wms';
import { VMapLayerXyz } from '../components/v-map-layer-xyz/v-map-layer-xyz';

/* ------------------------------------------------------------------ */
/*  Infrastructure helpers                                             */
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
  const vmap = document.createElement('v-map');
  // Attach mock API to the real DOM element
  Object.assign(vmap, {
    __vMapProvider: mapProvider,
    isMapProviderReady: vi.fn().mockResolvedValue(
      mapProvider !== null && mapProvider !== undefined,
    ),
  });
  // Override addEventListener/removeEventListener to track map-provider events
  const origAdd = vmap.addEventListener.bind(vmap);
  const origRemove = vmap.removeEventListener.bind(vmap);
  vmap.addEventListener = vi.fn((event: string, handler: EventListener, opts?: any) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(handler);
    origAdd(event, handler, opts);
  }) as any;
  vmap.removeEventListener = vi.fn((event: string, handler: EventListener, opts?: any) => {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter(h => h !== handler);
    }
    origRemove(event, handler, opts);
  }) as any;
  (vmap as any)._fireEvent = (eventName: string, detail: unknown) => {
    for (const h of listeners[eventName] || []) {
      h(new CustomEvent(eventName, { detail }) as any);
    }
  };
  return vmap;
}

function createMockLayerGroup() {
  const group = document.createElement('v-map-layergroup');
  Object.assign(group, {
    getGroupId: vi.fn().mockResolvedValue('test-group-id'),
    visible: true,
    basemapid: '',
  });
  return group;
}

/**
 * Build a realistic DOM tree:  v-map > v-map-layergroup > layerEl
 * and return references to all three.
 */
function buildMapDom(
  layerTag: string,
  provider: ReturnType<typeof createMockMapProvider>,
) {
  const vmap = createMockVMap(provider);
  const group = createMockLayerGroup();
  const layer = document.createElement(layerTag);

  group.appendChild(layer);
  vmap.appendChild(group);
  document.body.appendChild(vmap);

  return { vmap, group, layer };
}

/**
 * Wire a component class instance to a DOM element and run its lifecycle
 * (componentWillLoad → componentDidLoad).
 *
 * Returns the component context object that can be passed to further
 * prototype calls.
 */
function wireComponent(
  ComponentClass: any,
  el: HTMLElement,
  extraProps: Record<string, unknown> = {},
) {
  const component = {
    el,
    helper: undefined as any,
    loadState: 'idle' as string,
    didLoad: false,
    hasLoadedOnce: false,
    ready: { emit: vi.fn() },
    ...extraProps,
  } as any;

  // Bind all prototype methods so they close over the component context
  for (const key of Object.getOwnPropertyNames(ComponentClass.prototype)) {
    if (key === 'constructor') continue;
    const desc = Object.getOwnPropertyDescriptor(ComponentClass.prototype, key);
    if (desc && typeof desc.value === 'function') {
      component[key] = ComponentClass.prototype[key].bind(component);
    }
  }

  return component;
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe('Error-API component-level integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    if (globalThis.customElements) {
      vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);
    }
  });

  /* ================================================================ */
  /*  1. Event bubbling through real component elements                */
  /* ================================================================ */
  describe('event bubbling', () => {
    it('vmap-error dispatched by VMapLayerOSM helper bubbles to v-map', async () => {
      const provider = createMockMapProvider({
        addLayerToGroup: vi.fn().mockRejectedValue(new Error('OSM load failed')),
      });
      const { vmap, layer } = buildMapDom('v-map-layer-osm', provider);
      layer.id = 'osm-bubble';

      const received: CustomEvent[] = [];
      vmap.addEventListener('vmap-error', ((e: CustomEvent) => {
        received.push(e);
      }) as EventListener);

      const comp = wireComponent(VMapLayerOSM, layer, {
        url: 'https://tile.openstreetmap.org',
        visible: true, opacity: 1, zIndex: 10,
      });

      await comp.componentWillLoad();
      await comp.componentDidLoad();

      expect(received.length).toBeGreaterThanOrEqual(1);
      expect(received[0].detail.type).toBe('provider');
      expect(received[0].detail.message).toContain('OSM load failed');
      // Event target is the layer element, not the v-map
      expect(received[0].target).toBe(layer);
    });

    it('errors from multiple component types bubble to same v-map', async () => {
      const provider = createMockMapProvider({
        addLayerToGroup: vi.fn().mockRejectedValue(new Error('boom')),
      });
      const vmap = createMockVMap(provider);
      const group = createMockLayerGroup();

      const osmEl = document.createElement('v-map-layer-osm');
      osmEl.id = 'osm-multi';
      const wmsEl = document.createElement('v-map-layer-wms');
      wmsEl.id = 'wms-multi';

      group.appendChild(osmEl);
      group.appendChild(wmsEl);
      vmap.appendChild(group);
      document.body.appendChild(vmap);

      const errors: Array<{ target: EventTarget; detail: any }> = [];
      vmap.addEventListener('vmap-error', ((e: CustomEvent) => {
        errors.push({ target: e.target!, detail: e.detail });
      }) as EventListener);

      const osmComp = wireComponent(VMapLayerOSM, osmEl, {
        url: 'https://tile.openstreetmap.org',
        visible: true, opacity: 1, zIndex: 10,
      });
      await osmComp.componentWillLoad();
      await osmComp.componentDidLoad();

      const wmsComp = wireComponent(VMapLayerWms, wmsEl, {
        url: 'https://example.com/wms', layers: 'topo',
        format: 'image/png', transparent: true, tiled: true,
        visible: true, opacity: 1, zIndex: 20, styles: undefined,
      });
      await wmsComp.componentWillLoad();
      await wmsComp.componentDidLoad();

      expect(errors.length).toBe(2);
      expect(errors[0].target).toBe(osmEl);
      expect(errors[1].target).toBe(wmsEl);
    });
  });

  /* ================================================================ */
  /*  2. Full state transitions through component lifecycle            */
  /* ================================================================ */
  describe('state transitions', () => {
    it('VMapLayerOSM: idle → loading → ready on successful add', async () => {
      const provider = createMockMapProvider();
      const { layer } = buildMapDom('v-map-layer-osm', provider);
      layer.id = 'osm-transition';

      const comp = wireComponent(VMapLayerOSM, layer, {
        url: 'https://tile.openstreetmap.org',
        visible: true, opacity: 1, zIndex: 10,
      });

      expect(comp.loadState).toBe('idle');

      await comp.componentWillLoad();
      await comp.componentDidLoad();

      // Helper calls startLoading() → 'loading', then markReady() → 'ready'
      expect(comp.loadState).toBe('ready');
      expect(await comp.getError()).toBeUndefined();
    });

    it('VMapLayerWms: idle → loading → error on failed add', async () => {
      const provider = createMockMapProvider({
        addLayerToGroup: vi.fn().mockRejectedValue(new Error('WMS timeout')),
      });
      const { layer } = buildMapDom('v-map-layer-wms', provider);
      layer.id = 'wms-fail';

      const comp = wireComponent(VMapLayerWms, layer, {
        url: 'https://example.com/wms', layers: 'topo',
        format: 'image/png', transparent: true, tiled: true,
        visible: true, opacity: 1, zIndex: 10, styles: undefined,
      });

      await comp.componentWillLoad();
      await comp.componentDidLoad();

      expect(comp.loadState).toBe('error');
      const err = await comp.getError();
      expect(err).toBeDefined();
      expect(err.type).toBe('provider');
      expect(err.message).toContain('WMS timeout');
    });
  });

  /* ================================================================ */
  /*  3. Provider shutdown and recovery                                */
  /* ================================================================ */
  describe('provider shutdown and recovery', () => {
    it('VMapLayerOSM resets to idle on shutdown, rebuilds on new provider', async () => {
      const provider = createMockMapProvider();
      const { vmap, layer } = buildMapDom('v-map-layer-osm', provider);
      layer.id = 'osm-recovery';

      const comp = wireComponent(VMapLayerOSM, layer, {
        url: 'https://tile.openstreetmap.org',
        visible: true, opacity: 1, zIndex: 10,
      });

      await comp.componentWillLoad();
      await comp.componentDidLoad();
      expect(comp.loadState).toBe('ready');

      // Shutdown
      (vmap as any)._fireEvent('map-provider-will-shutdown', {});
      await new Promise(r => setTimeout(r, 10));

      expect(comp.loadState).toBe('idle');

      // Recovery with new provider
      const newProvider = createMockMapProvider({
        addLayerToGroup: vi.fn().mockResolvedValue('recovered-layer-id'),
      });
      (vmap as any).__vMapProvider = newProvider;
      (vmap as any).isMapProviderReady = vi.fn().mockResolvedValue(true);

      (vmap as any)._fireEvent('map-provider-ready', { mapProvider: newProvider });

      await vi.waitFor(() => {
        expect(comp.loadState).toBe('ready');
      });
    });
  });

  /* ================================================================ */
  /*  4. Reattach (dispose + connectedCallback)                        */
  /* ================================================================ */
  describe('reattach lifecycle', () => {
    it('VMapLayerOSM: dispose → idle, re-init → ready', async () => {
      const provider = createMockMapProvider();
      const { layer } = buildMapDom('v-map-layer-osm', provider);
      layer.id = 'osm-reattach';

      const comp = wireComponent(VMapLayerOSM, layer, {
        url: 'https://tile.openstreetmap.org',
        visible: true, opacity: 1, zIndex: 10,
      });

      await comp.componentWillLoad();
      await comp.componentDidLoad();
      expect(comp.loadState).toBe('ready');
      expect(comp.hasLoadedOnce).toBe(true);

      // Simulate disconnectedCallback
      await comp.disconnectedCallback();
      expect(comp.loadState).toBe('idle');

      // Simulate connectedCallback (reattach)
      await comp.connectedCallback();

      expect(comp.loadState).toBe('ready');
    });
  });

  /* ================================================================ */
  /*  5. Mixed error states with CSS selectors                         */
  /* ================================================================ */
  describe('mixed error states', () => {
    it('[load-state="error"] finds exactly the components that failed', async () => {
      const goodProvider = createMockMapProvider();
      const badProvider = createMockMapProvider({
        addLayerToGroup: vi.fn().mockRejectedValue(new Error('fail')),
      });

      // Build two separate map trees — one with good provider, one with bad
      const vmap = createMockVMap(goodProvider);
      const group = createMockLayerGroup();
      vmap.appendChild(group);
      document.body.appendChild(vmap);

      // Good layer (OSM)
      const osmEl = document.createElement('v-map-layer-osm');
      osmEl.id = 'osm-good';
      group.appendChild(osmEl);

      const osmComp = wireComponent(VMapLayerOSM, osmEl, {
        url: 'https://tile.openstreetmap.org',
        visible: true, opacity: 1, zIndex: 10,
      });
      await osmComp.componentWillLoad();
      await osmComp.componentDidLoad();
      // Reflect loadState to DOM attribute (Stencil does this automatically)
      osmEl.setAttribute('load-state', osmComp.loadState);

      // Bad layer (XYZ) — use badProvider by swapping
      (vmap as any).__vMapProvider = badProvider;
      (vmap as any).isMapProviderReady = vi.fn().mockResolvedValue(true);

      const xyzEl = document.createElement('v-map-layer-xyz');
      xyzEl.id = 'xyz-bad';
      group.appendChild(xyzEl);

      const xyzComp = wireComponent(VMapLayerXyz, xyzEl, {
        url: 'https://broken/{z}/{x}/{y}.png',
        visible: true, opacity: 1,
      });
      await xyzComp.componentWillLoad();
      await xyzComp.componentDidLoad();
      xyzEl.setAttribute('load-state', xyzComp.loadState);

      // Verify CSS selectors
      expect(osmComp.loadState).toBe('ready');
      expect(xyzComp.loadState).toBe('error');

      const errorLayers = document.querySelectorAll('[load-state="error"]');
      expect(errorLayers).toHaveLength(1);
      expect(errorLayers[0].id).toBe('xyz-bad');

      const readyLayers = document.querySelectorAll('[load-state="ready"]');
      expect(readyLayers).toHaveLength(1);
      expect(readyLayers[0].id).toBe('osm-good');
    });
  });
});
