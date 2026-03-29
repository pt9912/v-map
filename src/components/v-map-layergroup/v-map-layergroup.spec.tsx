import { vi, describe, it, expect } from 'vitest';
import { VMapLayerGroup } from './v-map-layergroup';

describe('v-map-layergroup', () => {
  it('renders with default attributes', async () => {
    const component = new (VMapLayerGroup as any)();

    expect(component.visible).toBe(true);
    expect(component.opacity).toBe(1);
    expect(component.basemapid).toBeNull();
    expect(VMapLayerGroup.prototype.render.call(component)).toBeTruthy();
  });

  it('returns a group id via getGroupId', async () => {
    const component = { groupId: 'test-uuid-123' } as any;
    const result = await VMapLayerGroup.prototype.getGroupId.call(component);
    expect(result).toBe('test-uuid-123');
  });

  it('calls setGroupVisible on visibility change when provider supports it', async () => {
    const mapProvider = {
      setGroupVisible: vi.fn(),
    };
    const component = {
      mapProvider,
      groupId: 'grp-1',
      visible: false,
    } as any;

    await VMapLayerGroup.prototype.onVisibleChanged.call(component);
    expect(mapProvider.setGroupVisible).toHaveBeenCalledWith('grp-1', false);
  });

  it('handles visibility change when mapProvider has no setGroupVisible', async () => {
    const component = {
      mapProvider: {},
      groupId: 'grp-1',
      visible: true,
    } as any;

    // Should not throw
    await VMapLayerGroup.prototype.onVisibleChanged.call(component);
  });

  it('handles visibility change when mapProvider is null', async () => {
    const component = {
      mapProvider: null,
      groupId: 'grp-1',
      visible: true,
    } as any;

    // Should not throw
    await VMapLayerGroup.prototype.onVisibleChanged.call(component);
  });

  it('calls setBaseLayer on basemapid change when provider supports it', async () => {
    const mapProvider = {
      setBaseLayer: vi.fn(),
    };
    const component = {
      mapProvider,
      groupId: 'grp-2',
      basemapid: 'osm-base',
    } as any;

    await VMapLayerGroup.prototype.onBaseMapIdChanged.call(component);
    expect(mapProvider.setBaseLayer).toHaveBeenCalledWith('grp-2', 'osm-base');
  });

  it('handles basemapid change when mapProvider has no setBaseLayer', async () => {
    const component = {
      mapProvider: {},
      groupId: 'grp-2',
      basemapid: 'osm',
    } as any;

    // Should not throw
    await VMapLayerGroup.prototype.onBaseMapIdChanged.call(component);
  });

  it('init sets up the map provider and calls ensureGroup, setGroupVisible, setBaseLayer', async () => {
    const mapProvider = {
      ensureGroup: vi.fn(),
      setGroupVisible: vi.fn(),
      setBaseLayer: vi.fn(),
    };
    const component = {
      mapProvider: null,
      groupId: 'grp-3',
      visible: true,
      basemapid: 'satellite',
    } as any;

    await VMapLayerGroup.prototype['init'].call(component, mapProvider);

    expect(component.mapProvider).toBe(mapProvider);
    expect(mapProvider.ensureGroup).toHaveBeenCalledWith('grp-3', true, {
      basemapid: 'satellite',
    });
    expect(mapProvider.setGroupVisible).toHaveBeenCalledWith('grp-3', true);
    expect(mapProvider.setBaseLayer).toHaveBeenCalledWith('grp-3', 'satellite');
  });

  it('init does nothing if mapProvider is already set', async () => {
    const existingProvider = { ensureGroup: vi.fn() };
    const newProvider = { ensureGroup: vi.fn() };
    const component = {
      mapProvider: existingProvider,
      groupId: 'grp-4',
      visible: true,
      basemapid: null,
    } as any;

    await VMapLayerGroup.prototype['init'].call(component, newProvider);

    expect(newProvider.ensureGroup).not.toHaveBeenCalled();
    expect(component.mapProvider).toBe(existingProvider);
  });

  it('init handles null mapProvider argument', async () => {
    const component = {
      mapProvider: null,
      groupId: 'grp-5',
      visible: true,
      basemapid: null,
    } as any;

    // null is assigned but then early-returns because mapProvider === null
    await VMapLayerGroup.prototype['init'].call(component, null);
    expect(component.mapProvider).toBeNull();
  });

  it('init works without ensureGroup on the provider', async () => {
    const mapProvider = {
      setGroupVisible: vi.fn(),
      setBaseLayer: vi.fn(),
    };
    const component = {
      mapProvider: null,
      groupId: 'grp-6',
      visible: false,
      basemapid: null,
    } as any;

    await VMapLayerGroup.prototype['init'].call(component, mapProvider);

    expect(mapProvider.setGroupVisible).toHaveBeenCalledWith('grp-6', false);
    expect(mapProvider.setBaseLayer).toHaveBeenCalledWith('grp-6', null);
  });

  it('connectedCallback registers event listeners on the v-map parent', async () => {
    const whenDefinedSpy = vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);

    const mapProvider = { ensureGroup: vi.fn(), setGroupVisible: vi.fn(), setBaseLayer: vi.fn() };
    const mapEl = document.createElement('v-map') as HTMLVMapElement & { __vMapProvider?: unknown };
    mapEl.__vMapProvider = mapProvider;
    Object.defineProperty(mapEl, 'isMapProviderReady', { value: vi.fn().mockResolvedValue(true), writable: true, configurable: true });
    const addEventListenerSpy = vi.spyOn(mapEl, 'addEventListener');

    const groupEl = document.createElement('v-map-layergroup');
    mapEl.appendChild(groupEl);
    document.body.appendChild(mapEl);

    const component = {
      el: groupEl,
      groupId: 'grp-test',
      visible: true,
      basemapid: null,
      mapProvider: null,
      init: vi.fn(),
    } as any;

    await VMapLayerGroup.prototype.connectedCallback.call(component);

    expect(whenDefinedSpy).toHaveBeenCalledWith('v-map');
    expect((mapEl as any).isMapProviderReady).toHaveBeenCalled();
    expect(component.init).toHaveBeenCalledWith(mapProvider);
    expect(addEventListenerSpy).toHaveBeenCalledWith('map-provider-ready', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('map-provider-will-shutdown', expect.any(Function));

    whenDefinedSpy.mockRestore();
    document.body.innerHTML = '';
  });

  it('connectedCallback skips init when map provider is not ready', async () => {
    const whenDefinedSpy = vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);

    const mapEl = document.createElement('v-map');
    Object.defineProperty(mapEl, 'isMapProviderReady', { value: vi.fn().mockResolvedValue(false), writable: true, configurable: true });

    const groupEl = document.createElement('v-map-layergroup');
    mapEl.appendChild(groupEl);
    document.body.appendChild(mapEl);

    const component = {
      el: groupEl,
      groupId: 'grp-test',
      visible: true,
      basemapid: null,
      mapProvider: null,
      init: vi.fn(),
    } as any;

    await VMapLayerGroup.prototype.connectedCallback.call(component);

    expect(component.init).not.toHaveBeenCalled();

    whenDefinedSpy.mockRestore();
    document.body.innerHTML = '';
  });

  it('MapProviderWillShutdown sets mapProvider to null', async () => {
    const whenDefinedSpy = vi.spyOn(customElements, 'whenDefined').mockResolvedValue(undefined as any);

    const mapEl = document.createElement('v-map');
    Object.defineProperty(mapEl, 'isMapProviderReady', { value: vi.fn().mockResolvedValue(false), writable: true, configurable: true });
    const registeredHandlers: Record<string, Function> = {};
    vi.spyOn(mapEl, 'addEventListener').mockImplementation((event: string, handler: any) => {
      registeredHandlers[event] = handler;
    });

    const groupEl = document.createElement('v-map-layergroup');
    mapEl.appendChild(groupEl);
    document.body.appendChild(mapEl);

    const component = {
      el: groupEl,
      groupId: 'grp-test',
      visible: true,
      basemapid: null,
      mapProvider: { some: 'provider' },
      init: vi.fn(),
    } as any;

    await VMapLayerGroup.prototype.connectedCallback.call(component);

    // Invoke the registered shutdown handler directly
    expect(registeredHandlers['map-provider-will-shutdown']).toBeDefined();
    await registeredHandlers['map-provider-will-shutdown'](new CustomEvent('map-provider-will-shutdown', { detail: {} }));

    expect(component.mapProvider).toBeNull();

    whenDefinedSpy.mockRestore();
    document.body.innerHTML = '';
  });

  /* ------------------------------------------------------------------ */
  /*  Prototype-based unit tests for source function coverage            */
  /* ------------------------------------------------------------------ */
  describe('prototype-based source coverage', () => {

    it('render returns a virtual DOM node', () => {
      const result = VMapLayerGroup.prototype.render.call({});
      expect(result).toBeTruthy();
    });

    it('componentWillRender runs without error', async () => {
      await VMapLayerGroup.prototype.componentWillRender.call({});
    });

    it('componentWillLoad runs without error', async () => {
      await VMapLayerGroup.prototype.componentWillLoad.call({});
    });

    it('componentDidLoad runs without error', async () => {
      await VMapLayerGroup.prototype.componentDidLoad.call({});
    });
  });
});
