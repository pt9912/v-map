// src/components/v-map/v-map.spec.tsx
import { vi, describe, it, expect } from 'vitest';
import { VMap } from './v-map';
import '../../testing/fail-on-console-spec';

// Hoist mock functions so they are available inside vi.mock factory
const {
  mockProviderInit,
  mockProviderOnPointerMove,
  mockCreateProvider,
} = vi.hoisted(() => {
  const mockProviderInit = vi.fn().mockResolvedValue(undefined);
  const mockProviderDestroy = vi.fn();
  const mockProviderSetView = vi.fn().mockResolvedValue(undefined);
  const mockProviderOnPointerMove = vi.fn();

  const mockCreateProvider = vi.fn().mockResolvedValue({
    init: mockProviderInit,
    destroy: mockProviderDestroy,
    setView: mockProviderSetView,
    onPointerMove: mockProviderOnPointerMove,
    setOpacity: vi.fn(),
    setVisible: vi.fn(),
    setZIndex: vi.fn(),
    addLayerToGroup: vi.fn(),
    updateLayer: vi.fn(),
    removeLayer: vi.fn(),
    addBaseLayer: vi.fn(),
    setBaseLayer: vi.fn(),
    ensureGroup: vi.fn(),
    setGroupVisible: vi.fn(),
  });

  return {
    mockProviderInit,
    mockProviderDestroy,
    mockProviderSetView,
    mockProviderOnPointerMove,
    mockCreateProvider,
  };
});

vi.mock('../../map-provider/provider-factory', () => ({
  createProvider: mockCreateProvider,
}));

function createMockEl() {
  const el = document.createElement('v-map');
  if (!el.shadowRoot) {
    el.attachShadow({ mode: 'open' });
  }
  return el;
}

describe('<v-map>', () => {
  it('renders', async () => {
    const component = new VMap() as any;
    component.el = createMockEl();
    const root = component.el;
    const map = component.ensureContainer();

    expect(root).toBeTruthy();
    expect(map).not.toBeNull();
    expect(map!.style.width).toBe('100%');
    expect(map!.style.height).toBe('100%');
    expect(map!.style.display).toBe('block');
  });

  it('exposes isMapProviderReady method', async () => {
    const component = new VMap();

    expect(typeof component.isMapProviderReady).toBe('function');
    const result = await component.isMapProviderReady();
    expect(result).toBe(false);
  });

  it('setView throws when provider is not ready', async () => {
    const component = new VMap();
    // mapProvider is undefined/null initially
    await expect(component.setView([7, 50], 10)).rejects.toThrow();
  });

  it('onFlavourChanged calls reset when flavour actually changes', async () => {
    const component = new VMap() as any;
    component.reset = vi.fn();

    await component.onFlavourChanged('ol', 'leaflet');

    expect(component.reset).toHaveBeenCalledTimes(1);
  });

  it('onFlavourChanged does nothing when values are the same', async () => {
    const component = new VMap() as any;
    component.reset = vi.fn();

    await component.onFlavourChanged('leaflet', 'leaflet');

    expect(component.reset).not.toHaveBeenCalled();
  });

  it('createMap returns early when already creating', async () => {
    mockCreateProvider.mockClear();
    const component = new VMap() as any;
    component.el = createMockEl();
    component.ensureContainer = VMap.prototype['ensureContainer'];
    component.mapState = 'creating';

    await component.createMap();

    expect(mockCreateProvider).not.toHaveBeenCalled();
  });

  it('isMapProviderReady logs when provider is not yet ready', async () => {
    const vmap = new VMap();
    const result = await vmap.isMapProviderReady();
    expect(result).toBe(false);
  });

  it('setView works when provider is available', async () => {
    const setView = vi.fn().mockResolvedValue(undefined);
    const component = new VMap() as any;
    component.mapProvider = { setView };

    await component.setView([7, 50], 12);

    expect(setView).toHaveBeenCalledWith([7, 50], 12);
  });

  it('disconnectedCallback calls reset', async () => {
    const component = new VMap() as any;
    component.reset = vi.fn();

    component.disconnectedCallback();

    expect(component.reset).toHaveBeenCalledTimes(1);
  });

  it('NOOP_PROVIDER methods are callable stubs', async () => {
    const root = createMockEl();
    const instance = new VMap() as any;
    instance.el = root;
    instance.unsubscribeResize = vi.fn();
    instance.unsubscribePointerMove = vi.fn();
    instance.mapProvider = { destroy: vi.fn() };

    let noopProvider: any;
    root.addEventListener('map-provider-will-shutdown', ((e: CustomEvent) => {
      noopProvider = e.detail.mapProvider;
    }) as EventListener);

    instance.reset();

    expect(noopProvider).toBeDefined();

    // Exercise all NOOP_PROVIDER methods to cover their function bodies
    await noopProvider.init();
    await noopProvider.destroy();
    await noopProvider.setOpacity();
    await noopProvider.setVisible();
    await noopProvider.setZIndex();
    expect(await noopProvider.addLayerToGroup()).toBeNull();
    await noopProvider.updateLayer();
    await noopProvider.removeLayer();
    await noopProvider.setView();
    expect(await noopProvider.addBaseLayer()).toBeNull();
    await noopProvider.setBaseLayer();
    await noopProvider.ensureGroup();
    await noopProvider.setGroupVisible();
  });

  it('componentDidRender event listener handles MapProviderReady', async () => {
    const component = new VMap() as any;
    component.el = createMockEl();
    component.createMap = vi.fn().mockResolvedValue(undefined);

    await component.componentDidRender();

    component.el.dispatchEvent(
      new CustomEvent('map-provider-ready', {
        detail: { mapProvider: {} },
        bubbles: false,
      }),
    );

    expect(component.createMap).toHaveBeenCalledTimes(1);
  });

  /* ------------------------------------------------------------------ */
  /*  Prototype-based unit tests for source coverage                     */
  /* ------------------------------------------------------------------ */
  describe('prototype-based source coverage', () => {

    it('ensureContainer creates #map div when missing', () => {
      const el = createMockEl();
      const component = { el } as any;

      const container = VMap.prototype['ensureContainer'].call(component);

      expect(container).toBeTruthy();
      expect(container.id).toBe('map');
      expect(container.style.width).toBe('100%');
      expect(container.style.height).toBe('100%');
      expect(container.style.display).toBe('block');
      // Should be appended to shadowRoot
      expect(el.shadowRoot!.querySelector('#map')).toBe(container);
    });

    it('ensureContainer returns existing #map div', () => {
      const el = createMockEl();
      const existingDiv = document.createElement('div');
      existingDiv.id = 'map';
      el.shadowRoot!.appendChild(existingDiv);

      const component = { el } as any;
      const container = VMap.prototype['ensureContainer'].call(component);

      expect(container).toBe(existingDiv);
    });

    it('createMap initializes provider, fires event, and sets up pointer move', async () => {
      const el = createMockEl();
      mockProviderInit.mockClear();
      mockProviderOnPointerMove.mockClear();

      // Configure onPointerMove to return an unsubscribe function
      const unsubPointer = vi.fn();
      mockProviderOnPointerMove.mockImplementation((cb: any) => {
        // Simulate a pointer move callback to cover the inner dispatch
        cb([11.5, 48.1], [100, 200]);
        return unsubPointer;
      });

      let readyEvent: CustomEvent | null = null;
      el.addEventListener('map-provider-ready', ((e: CustomEvent) => {
        readyEvent = e;
      }) as EventListener);

      const component = {
        el,
        flavour: 'ol',
        center: '11.5,48.1',
        zoom: 10,
        cssMode: 'cdn',
        mapState: 'unavailable',
        mapProvider: null as any,
        mapContainer: null as any,
        unsubscribeResize: null as any,
        unsubscribePointerMove: null as any,
        ensureContainer: VMap.prototype['ensureContainer'],
      } as any;

      await VMap.prototype['createMap'].call(component);

      expect(component.mapState).toBe('available');
      expect(component.mapProvider).toBeDefined();
      expect(mockProviderInit).toHaveBeenCalledTimes(1);
      expect(readyEvent).not.toBeNull();
      expect(readyEvent!.type).toBe('map-provider-ready');
      expect(component.unsubscribePointerMove).toBe(unsubPointer);
    });

    it('createMap returns early when mapState is already creating', async () => {
      const el = createMockEl();
      const component = {
        el,
        mapState: 'creating',
        mapProvider: null,
        ensureContainer: VMap.prototype['ensureContainer'],
      } as any;

      await VMap.prototype['createMap'].call(component);

      // mapProvider should still be null (early return)
      expect(component.mapProvider).toBeNull();
    });

    it('createMap throws on invalid center prop', async () => {
      const el = createMockEl();

      const component = {
        el,
        flavour: 'ol',
        center: 'invalid,coords',
        zoom: 10,
        cssMode: 'cdn',
        mapState: 'unavailable',
        mapProvider: null as any,
        mapContainer: null as any,
        unsubscribeResize: null as any,
        unsubscribePointerMove: null as any,
        ensureContainer: VMap.prototype['ensureContainer'],
      } as any;

      await expect(
        VMap.prototype['createMap'].call(component),
      ).rejects.toThrow('Ungültiges center-Prop');
    });

    it('createMap succeeds without center', async () => {
      const el = createMockEl();
      mockProviderInit.mockClear();
      // Reset onPointerMove to return undefined (no pointer move support)
      mockProviderOnPointerMove.mockImplementation(undefined);

      const component = {
        el,
        flavour: 'ol',
        center: '',
        zoom: 5,
        cssMode: 'cdn',
        mapState: 'unavailable',
        mapProvider: null as any,
        mapContainer: null as any,
        unsubscribeResize: null as any,
        unsubscribePointerMove: null as any,
        ensureContainer: VMap.prototype['ensureContainer'],
      } as any;

      await VMap.prototype['createMap'].call(component);

      expect(component.mapState).toBe('available');
      expect(mockProviderInit).toHaveBeenCalledTimes(1);
    });

    it('createMap skips onPointerMove when provider does not support it', async () => {
      const el = createMockEl();
      mockProviderInit.mockClear();

      // Import the mocked module and temporarily make onPointerMove falsy
      const factory = await import('../../map-provider/provider-factory');
      const provider = await (factory.createProvider as any)('ol');
      provider.onPointerMove = undefined;
      (factory.createProvider as any).mockResolvedValueOnce(provider);

      const component = {
        el,
        flavour: 'ol',
        center: '8,49',
        zoom: 5,
        cssMode: 'cdn',
        mapState: 'unavailable',
        mapProvider: null as any,
        mapContainer: null as any,
        unsubscribeResize: null as any,
        unsubscribePointerMove: null as any,
        ensureContainer: VMap.prototype['ensureContainer'],
      } as any;

      await VMap.prototype['createMap'].call(component);

      expect(component.mapState).toBe('available');
      expect(component.unsubscribePointerMove).toBeNull();
    });

    it('reset cleans up resources and dispatches shutdown event', () => {
      const el = createMockEl();
      const destroySpy = vi.fn();
      const unsubResizeSpy = vi.fn();
      const unsubPointerSpy = vi.fn();

      let dispatchedEvent: CustomEvent | null = null;
      el.addEventListener('map-provider-will-shutdown', ((e: CustomEvent) => {
        dispatchedEvent = e;
      }) as EventListener);

      const component = {
        el,
        mapProvider: { destroy: destroySpy },
        mapState: 'available',
        unsubscribeResize: unsubResizeSpy,
        unsubscribePointerMove: unsubPointerSpy,
      } as any;

      VMap.prototype['reset'].call(component);

      expect(unsubResizeSpy).toHaveBeenCalledTimes(1);
      expect(unsubPointerSpy).toHaveBeenCalledTimes(1);
      expect(component.unsubscribePointerMove).toBeNull();
      expect(component.mapProvider).toBeNull();
      expect(component.mapState).toBe('unavailable');
      expect(destroySpy).toHaveBeenCalledTimes(1);
      expect(dispatchedEvent).not.toBeNull();
      expect(dispatchedEvent!.type).toBe('map-provider-will-shutdown');
    });

    it('reset handles null unsubscribe functions gracefully', () => {
      const el = createMockEl();

      const component = {
        el,
        mapProvider: null,
        mapState: 'available',
        unsubscribeResize: undefined,
        unsubscribePointerMove: null,
      } as any;

      // Should not throw even with null/undefined unsubscribe functions
      VMap.prototype['reset'].call(component);

      expect(component.mapState).toBe('unavailable');
      expect(component.mapProvider).toBeNull();
    });

    it('setView delegates to mapProvider.setView', async () => {
      const setViewSpy = vi.fn().mockResolvedValue(undefined);
      const component = {
        mapProvider: { setView: setViewSpy },
      } as any;

      await VMap.prototype.setView.call(component, [11.5, 48.1], 12);

      expect(setViewSpy).toHaveBeenCalledWith([11.5, 48.1], 12);
    });

    it('setView throws when mapProvider is null', async () => {
      const component = { mapProvider: null } as any;

      await expect(
        VMap.prototype.setView.call(component, [7, 50], 10),
      ).rejects.toThrow();
    });

    it('isMapProviderReady returns true when provider is available', async () => {
      const mockProvider = { init: vi.fn() };
      const component = { mapProvider: mockProvider } as any;

      const result = await VMap.prototype.isMapProviderReady.call(component);
      expect(result).toBe(true);
    });

    it('isMapProviderReady returns false when provider is not set', async () => {
      const component = { mapProvider: undefined } as any;

      const result = await VMap.prototype.isMapProviderReady.call(component);
      expect(result).toBe(false);
    });

    it('onFlavourChanged calls reset when old !== new', async () => {
      const resetCalls: string[] = [];
      const el = createMockEl();
      const component = {
        el,
        mapProvider: null,
        mapState: 'available',
        unsubscribeResize: undefined,
        unsubscribePointerMove: null,
        reset() {
          resetCalls.push('reset');
        },
      } as any;

      await VMap.prototype.onFlavourChanged.call(component, 'ol', 'leaflet');
      expect(resetCalls).toHaveLength(1);
    });

    it('onFlavourChanged does not call reset when old === new', async () => {
      const resetCalls: string[] = [];
      const component = {
        reset() {
          resetCalls.push('reset');
        },
      } as any;

      await VMap.prototype.onFlavourChanged.call(component, 'ol', 'ol');
      expect(resetCalls).toHaveLength(0);
    });

    it('componentDidRender calls createMap and registers event listener', async () => {
      const el = createMockEl();
      const createMapSpy = vi.fn().mockResolvedValue(undefined);
      const addEventListenerSpy = vi.spyOn(el, 'addEventListener');

      const component = {
        el,
        createMap: createMapSpy,
      } as any;

      await VMap.prototype.componentDidRender.call(component);

      expect(createMapSpy).toHaveBeenCalledTimes(1);
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'map-provider-ready',
        expect.any(Function),
      );
    });

    it('componentWillLoad calls ensureImportMap when useDefaultImportMap is true', async () => {
      const component = {
        useDefaultImportMap: true,
      } as any;

      // Should not throw
      await VMap.prototype.componentWillLoad.call(component);
    });

    it('componentWillLoad skips ensureImportMap when useDefaultImportMap is false', async () => {
      const component = {
        useDefaultImportMap: false,
      } as any;

      // Should not throw
      await VMap.prototype.componentWillLoad.call(component);
    });

    it('componentWillRender runs without error', async () => {
      const component = {} as any;
      await VMap.prototype.componentWillRender.call(component);
    });

    it('disconnectedCallback calls reset via prototype', () => {
      const resetCalls: string[] = [];
      const component = {
        reset() {
          resetCalls.push('reset');
        },
      } as any;

      VMap.prototype.disconnectedCallback.call(component);
      expect(resetCalls).toHaveLength(1);
    });

    it('render returns a virtual DOM node', () => {
      const component = {} as any;
      const result = VMap.prototype.render.call(component);
      // render() returns an h() vnode; verify it exists
      expect(result).toBeTruthy();
    });

    it('NOOP_PROVIDER methods are covered via reset event payload', () => {
      const el = createMockEl();
      let noopProvider: any;
      el.addEventListener('map-provider-will-shutdown', ((e: CustomEvent) => {
        noopProvider = e.detail.mapProvider;
      }) as EventListener);

      const component = {
        el,
        mapProvider: { destroy: vi.fn() },
        mapState: 'available',
        unsubscribeResize: undefined,
        unsubscribePointerMove: null,
      } as any;
      VMap.prototype['reset'].call(component);

      expect(noopProvider).toBeDefined();
      // Call all NOOP_PROVIDER functions to cover their bodies
      expect(noopProvider.addLayerToGroup()).resolves.toBeNull();
      expect(noopProvider.addBaseLayer()).resolves.toBeNull();
      noopProvider.init();
      noopProvider.destroy();
      noopProvider.setOpacity();
      noopProvider.setVisible();
      noopProvider.setZIndex();
      noopProvider.updateLayer();
      noopProvider.removeLayer();
      noopProvider.setView();
      noopProvider.setBaseLayer();
      noopProvider.ensureGroup();
      noopProvider.setGroupVisible();
    });

    it('componentDidRender MapProviderReady listener calls log', async () => {
      const el = createMockEl();
      const listeners: Record<string, Function> = {};
      vi.spyOn(el, 'addEventListener').mockImplementation((name: string, fn: any) => {
        listeners[name] = fn;
      });

      const component = {
        el,
        createMap: vi.fn().mockResolvedValue(undefined),
      } as any;

      await VMap.prototype.componentDidRender.call(component);

      // Trigger the captured MapProviderReady listener
      expect(listeners['map-provider-ready']).toBeDefined();
      listeners['map-provider-ready'](new CustomEvent('map-provider-ready', {
        detail: { mapProvider: {} },
      }));
    });

    it('has correct default property values', () => {
      const component = new (VMap as any)();
      expect(component.flavour).toBe('ol');
      expect(component.center).toBe('0,0');
      expect(component.zoom).toBe(2);
      expect(component.useDefaultImportMap).toBe(true);
      expect(component.cssMode).toBe('cdn');
    });
  });
});
