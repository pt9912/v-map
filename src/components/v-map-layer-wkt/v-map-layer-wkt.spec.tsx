import { vi, describe, it, expect, beforeEach } from 'vitest';

const { helperMock } = vi.hoisted(() => {
  const helperMock = {
    initLayer: vi.fn(),
    removeLayer: vi.fn(),
    updateLayer: vi.fn(),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
    getLayerId: vi.fn().mockReturnValue('wkt-layer-id'),
    startLoading: vi.fn(),
    dispose: vi.fn(),
    setError: vi.fn(),
    clearError: vi.fn(),
    getError: vi.fn().mockReturnValue(undefined),
    markReady: vi.fn(),
    markUpdated: vi.fn(),
    recreateLayer: vi.fn(),
  };
  return { helperMock };
});

vi.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: vi.fn().mockImplementation(function () { return helperMock; }),
}));

import { VMapLayerWkt } from './v-map-layer-wkt';

describe('v-map-layer-wkt', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
    helperMock.getLayerId.mockReturnValue('wkt-layer-id');
  });

  it('renders with default attributes', async () => {
    const component = new (VMapLayerWkt as any)();
    component.wkt = 'POINT(8 49)';

    expect(component.wkt).toBe('POINT(8 49)');
    expect(component.visible).toBe(true);
    expect(component.opacity).toBe(1);
    expect(component.zIndex).toBe(1000);
  });

  it('creates the expected layer config and emits ready on load', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-wkt'),
      wkt: 'POINT(11.57 48.14)',
      url: undefined,
      visible: true,
      opacity: 0.8,
      zIndex: 500,
      didLoad: false,
      appliedGeostylerStyle: undefined,
      ready: { emit: vi.fn() },
      createLayerConfig: VMapLayerWkt.prototype['createLayerConfig'],
      applyExistingStyles: vi.fn(),
    } as any;
    component.el.id = 'wkt-test';

    await VMapLayerWkt.prototype.componentDidLoad.call(component);

    expect(helperMock.initLayer).toHaveBeenCalledWith(
      expect.any(Function),
      'wkt-test',
    );
    expect(component.didLoad).toBe(true);
    expect(component.ready.emit).toHaveBeenCalledTimes(1);
  });

  it('creates layer config with styling properties', () => {
    const component = {
      wkt: 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))',
      url: undefined,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      fillColor: 'red',
      fillOpacity: 0.5,
      strokeColor: 'blue',
      strokeWidth: 3,
      strokeOpacity: 0.9,
      pointRadius: 10,
      pointColor: 'green',
      iconUrl: 'icon.png',
      iconSize: '24,24',
      textProperty: 'name',
      textColor: '#333',
      textSize: 14,
      appliedGeostylerStyle: undefined,
    } as any;

    const config = VMapLayerWkt.prototype['createLayerConfig'].call(component);

    expect(config).toEqual({
      type: 'wkt',
      wkt: 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))',
      url: undefined,
      visible: true,
      zIndex: 1000,
      opacity: 1,
      style: {
        fillColor: 'red',
        fillOpacity: 0.5,
        strokeColor: 'blue',
        strokeWidth: 3,
        strokeOpacity: 0.9,
        pointRadius: 10,
        pointColor: 'green',
        iconUrl: 'icon.png',
        iconSize: [24, 24],
        textProperty: 'name',
        textColor: '#333',
        textSize: 14,
      },
    });
  });

  it('includes geostyler style in layer config when applied', () => {
    const geostylerStyle = { name: 'test', rules: [] };
    const component = {
      wkt: 'POINT(0 0)',
      url: undefined,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      appliedGeostylerStyle: geostylerStyle,
    } as any;

    const config = VMapLayerWkt.prototype['createLayerConfig'].call(component);
    expect(config.geostylerStyle).toEqual(geostylerStyle);
  });

  it('creates layer config without iconSize when not set', () => {
    const component = {
      wkt: 'POINT(0 0)',
      url: undefined,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      iconSize: undefined,
      appliedGeostylerStyle: undefined,
    } as any;

    const config = VMapLayerWkt.prototype['createLayerConfig'].call(component);
    expect(config.style.iconSize).toBeUndefined();
  });

  it('updates helper methods through watchers', async () => {
    await VMapLayerWkt.prototype.onVisibleChanged.call({
      visible: false,
      helper: helperMock,
    });
    await VMapLayerWkt.prototype.onOpacityChanged.call({
      opacity: 0.5,
      helper: helperMock,
    });
    await VMapLayerWkt.prototype.onZIndexChanged.call({
      zIndex: 99,
      helper: helperMock,
    });

    expect(helperMock.setVisible).toHaveBeenCalledWith(false);
    expect(helperMock.setOpacity).toHaveBeenCalledWith(0.5);
    expect(helperMock.setZIndex).toHaveBeenCalledWith(99);
  });

  it('updates the layer when wkt changes', async () => {
    await VMapLayerWkt.prototype.onWktChanged.call(
      { wkt: 'POINT(1 1)', url: undefined, helper: helperMock },
      'POINT(0 0)',
      'POINT(1 1)',
    );

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'wkt',
      data: { wkt: 'POINT(1 1)', url: undefined },
    });
  });

  it('does not update the layer when wkt value is identical', async () => {
    await VMapLayerWkt.prototype.onWktChanged.call(
      { wkt: 'POINT(0 0)', url: undefined, helper: helperMock },
      'POINT(0 0)',
      'POINT(0 0)',
    );

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('updates the layer when url changes', async () => {
    await VMapLayerWkt.prototype.onUrlChanged.call(
      { wkt: undefined, url: 'https://new.com/data.wkt', helper: helperMock },
      'https://old.com/data.wkt',
      'https://new.com/data.wkt',
    );

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'wkt',
      data: { wkt: undefined, url: 'https://new.com/data.wkt' },
    });
  });

  it('does not update the layer when url value is identical', async () => {
    await VMapLayerWkt.prototype.onUrlChanged.call(
      { wkt: undefined, url: 'https://same.com', helper: helperMock },
      'https://same.com',
      'https://same.com',
    );

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('triggers layer update on style property change', async () => {
    await VMapLayerWkt.prototype.onStyleChanged.call({
      wkt: 'POINT(0 0)',
      url: undefined,
      helper: helperMock,
    });

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'wkt',
      data: { wkt: 'POINT(0 0)', url: undefined },
    });
  });

  it('proxies getLayerId and removes the layer on disconnect', async () => {
    const component = { helper: helperMock } as any;

    expect(await VMapLayerWkt.prototype.getLayerId.call(component)).toBe(
      'wkt-layer-id',
    );

    await VMapLayerWkt.prototype.disconnectedCallback.call(component);
    expect(helperMock.dispose).toHaveBeenCalledTimes(1);
  });

  it('isReady reflects didLoad state', () => {
    expect(
      VMapLayerWkt.prototype.isReady.call({ didLoad: false }),
    ).toBe(false);
    expect(
      VMapLayerWkt.prototype.isReady.call({ didLoad: true }),
    ).toBe(true);
  });

  it('applies geostyler style from styleReady event when targeted', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-wkt'),
      wkt: 'POINT(0 0)',
      url: undefined,
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWkt.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWkt.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'wkt1';

    const geostylerStyle = { name: 'Test Style', rules: [{ name: 'rule1', symbolizers: [] }] };
    await VMapLayerWkt.prototype.onStyleReady.call(component, {
      detail: {
        style: geostylerStyle,
        layerIds: ['wkt1'],
      },
    } as CustomEvent<any>);

    expect(component.appliedGeostylerStyle).toEqual(geostylerStyle);
    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'wkt',
      data: {
        wkt: 'POINT(0 0)',
        url: undefined,
        geostylerStyle: geostylerStyle,
      },
    });
  });

  it('ignores styleReady event when not targeted', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-wkt'),
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWkt.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWkt.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'wkt1';

    await VMapLayerWkt.prototype.onStyleReady.call(component, {
      detail: {
        style: { name: 'Style', rules: [] },
        layerIds: ['other-layer'],
      },
    } as CustomEvent<any>);

    expect(component.appliedGeostylerStyle).toBeUndefined();
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('isTargetedByStyle returns false when layerIds is undefined', () => {
    const component = {
      el: document.createElement('v-map-layer-wkt'),
    } as any;

    expect(
      VMapLayerWkt.prototype['isTargetedByStyle'].call(component, undefined),
    ).toBe(false);
  });

  it('isTargetedByStyle returns true for empty layerIds', () => {
    const component = {
      el: document.createElement('v-map-layer-wkt'),
    } as any;
    component.el.id = 'test';

    expect(
      VMapLayerWkt.prototype['isTargetedByStyle'].call(component, []),
    ).toBe(true);
  });

  it('updateLayerWithGeostylerStyle does nothing without style or helper', async () => {
    await VMapLayerWkt.prototype['updateLayerWithGeostylerStyle'].call({
      appliedGeostylerStyle: undefined,
      helper: helperMock,
    });
    await VMapLayerWkt.prototype['updateLayerWithGeostylerStyle'].call({
      appliedGeostylerStyle: { name: 'x', rules: [] },
      helper: undefined,
    });

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('ignores non-geostyler styles in styleReady event', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-wkt'),
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWkt.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWkt.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'wkt1';

    // A Cesium-style object (not GeoStyler)
    await VMapLayerWkt.prototype.onStyleReady.call(component, {
      detail: {
        style: { color: 'color("red")' },
        layerIds: ['wkt1'],
      },
    } as CustomEvent<any>);

    expect(component.appliedGeostylerStyle).toBeUndefined();
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('applyExistingStyles applies geostyler style from v-map-style elements', async () => {
    const geostylerStyle = { name: 'Test', rules: [{ name: 'r', symbolizers: [] }] };
    const styleEl = document.createElement('v-map-style');
    Object.defineProperty(styleEl, 'getStyle', { value: vi.fn().mockResolvedValue(geostylerStyle), writable: true, configurable: true });
    Object.defineProperty(styleEl, 'getLayerTargetIds', { value: vi.fn().mockResolvedValue(['wkt1']), writable: true, configurable: true });
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-wkt'),
      helper: helperMock,
      wkt: 'POINT(0 0)',
      url: undefined,
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWkt.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWkt.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'wkt1';

    await VMapLayerWkt.prototype['applyExistingStyles'].call(component);

    expect(component.appliedGeostylerStyle).toEqual(geostylerStyle);
    expect(helperMock.updateLayer).toHaveBeenCalled();

    document.body.innerHTML = '';
  });

  it('applyExistingStyles skips styles without getStyle', async () => {
    const styleEl = document.createElement('v-map-style');
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-wkt'),
      helper: helperMock,
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWkt.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWkt.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'wkt1';

    await VMapLayerWkt.prototype['applyExistingStyles'].call(component);

    expect(component.appliedGeostylerStyle).toBeUndefined();

    document.body.innerHTML = '';
  });

  it('applyExistingStyles skips non-targeted styles', async () => {
    const geostylerStyle = { name: 'Test', rules: [{ name: 'r', symbolizers: [] }] };
    const styleEl = document.createElement('v-map-style');
    Object.defineProperty(styleEl, 'getStyle', { value: vi.fn().mockResolvedValue(geostylerStyle), writable: true, configurable: true });
    Object.defineProperty(styleEl, 'getLayerTargetIds', { value: vi.fn().mockResolvedValue(['other-layer']), writable: true, configurable: true });
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-wkt'),
      helper: helperMock,
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWkt.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWkt.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'wkt1';

    await VMapLayerWkt.prototype['applyExistingStyles'].call(component);

    expect(component.appliedGeostylerStyle).toBeUndefined();

    document.body.innerHTML = '';
  });

  it('applyExistingStyles skips styles without getLayerTargetIds', async () => {
    const geostylerStyle = { name: 'Test', rules: [{ name: 'r', symbolizers: [] }] };
    const styleEl = document.createElement('v-map-style');
    Object.defineProperty(styleEl, 'getStyle', { value: vi.fn().mockResolvedValue(geostylerStyle), writable: true, configurable: true });
    // Override getLayerTargetIds to simulate it being absent (returns undefined)
    Object.defineProperty(styleEl, 'getLayerTargetIds', { value: undefined, writable: true, configurable: true });
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-wkt'),
      helper: helperMock,
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWkt.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWkt.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'wkt1';

    await VMapLayerWkt.prototype['applyExistingStyles'].call(component);

    expect(component.appliedGeostylerStyle).toBeUndefined();

    document.body.innerHTML = '';
  });

  it('handles watcher calls gracefully when helper is undefined', async () => {
    await VMapLayerWkt.prototype.onVisibleChanged.call({
      visible: false,
      helper: undefined,
    });
    await VMapLayerWkt.prototype.onOpacityChanged.call({
      opacity: 0.5,
      helper: undefined,
    });
    await VMapLayerWkt.prototype.onZIndexChanged.call({
      zIndex: 10,
      helper: undefined,
    });
    await VMapLayerWkt.prototype.onWktChanged.call(
      { wkt: 'POINT(1 1)', url: undefined, helper: undefined },
      'POINT(0 0)',
      'POINT(1 1)',
    );
    await VMapLayerWkt.prototype.onStyleChanged.call({
      wkt: 'POINT(0 0)',
      url: undefined,
      helper: undefined,
    });

    // No errors thrown, nothing called on helperMock
    expect(helperMock.setVisible).not.toHaveBeenCalled();
  });

  it('componentWillLoad creates a VMapLayerHelper', async () => {
    const el = document.createElement('v-map-layer-wkt');
    const component = { el } as any;
    await VMapLayerWkt.prototype.componentWillLoad.call(component);
    expect(component.helper).toBeDefined();
  });

  it('connectedCallback re-initializes when hasLoadedOnce is true', async () => {
    const component = {
      hasLoadedOnce: true,
      helper: helperMock,
      el: document.createElement('v-map-layer-wkt'),
      wkt: 'POINT(11 48)',
      url: undefined,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      appliedGeostylerStyle: undefined,
      createLayerConfig: VMapLayerWkt.prototype['createLayerConfig'],
    } as any;
    component.el.id = 'wkt-reconnect';
    await VMapLayerWkt.prototype.connectedCallback.call(component);
    expect(helperMock.startLoading).toHaveBeenCalled();
    expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'wkt-reconnect');
  });

  it('connectedCallback skips when hasLoadedOnce is false', async () => {
    const component = { hasLoadedOnce: false } as any;
    await VMapLayerWkt.prototype.connectedCallback.call(component);
    expect(helperMock.startLoading).not.toHaveBeenCalled();
  });

  it('render returns undefined', () => {
    const result = VMapLayerWkt.prototype.render.call({});
    expect(result).toBeUndefined();
  });

  describe('Error-API', () => {
    it('initializes loadState as idle', () => {
      const component = new (VMapLayerWkt as any)();
      expect(component.loadState).toBe('idle');
    });

    it('setLoadState updates loadState', () => {
      const component = new (VMapLayerWkt as any)();
      VMapLayerWkt.prototype.setLoadState.call(component, 'loading');
      expect(component.loadState).toBe('loading');
      VMapLayerWkt.prototype.setLoadState.call(component, 'error');
      expect(component.loadState).toBe('error');
      VMapLayerWkt.prototype.setLoadState.call(component, 'ready');
      expect(component.loadState).toBe('ready');
    });

    it('getError delegates to helper.getError', async () => {
      const errorDetail = { type: 'provider' as const, message: 'test error' };
      helperMock.getError.mockReturnValue(errorDetail);
      const component = { helper: helperMock } as any;
      const result = await VMapLayerWkt.prototype.getError.call(component);
      expect(result).toEqual(errorDetail);
    });
  });
});
