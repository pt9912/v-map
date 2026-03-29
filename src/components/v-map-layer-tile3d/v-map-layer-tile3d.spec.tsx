import { vi, describe, it, expect, beforeEach } from 'vitest';

const { helperMock } = vi.hoisted(() => {
  const helperMock = {
    initLayer: vi.fn(),
    removeLayer: vi.fn(),
    updateLayer: vi.fn(),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
    getLayerId: vi.fn(),
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

import { VMapLayerTile3d } from './v-map-layer-tile3d';

describe('v-map-layer-tile3d', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
  });

  it('renders a slot and parses valid tileset options', async () => {
    const component = new (VMapLayerTile3d as any)();
    component.url = 'https://example.com/tileset.json';
    component.tilesetOptions = '{"maximumScreenSpaceError":8}';

    expect(component.url).toBe('https://example.com/tileset.json');
    expect(VMapLayerTile3d.prototype.render.call(component)).toBeTruthy();
    expect(VMapLayerTile3d.prototype['parseTilesetOptions'].call(component)).toEqual({
      maximumScreenSpaceError: 8,
    });
  });

  it('returns undefined for invalid tileset options json', async () => {
    const component = {
      tilesetOptions: '{invalid-json',
    } as any;

    expect(
      VMapLayerTile3d.prototype['parseTilesetOptions'].call(component),
    ).toBeUndefined();
  });

  it('updates helper state through watchers', async () => {
    await VMapLayerTile3d.prototype.onVisibleChanged.call({
      visible: false,
      helper: helperMock,
    });
    await VMapLayerTile3d.prototype.onOpacityChanged.call({
      opacity: 0.35,
      helper: helperMock,
    });
    await VMapLayerTile3d.prototype.onZIndexChanged.call({
      zIndex: 50,
      helper: helperMock,
    });
    await VMapLayerTile3d.prototype.onTilesetOptionsChanged.call({
      url: 'https://example.com/tileset.json',
      tilesetOptions: { maximumMemoryUsage: 64 },
      appliedCesiumStyle: undefined,
      helper: helperMock,
      parseTilesetOptions: VMapLayerTile3d.prototype['parseTilesetOptions'],
    });

    expect(helperMock.setVisible).toHaveBeenCalledWith(false);
    expect(helperMock.setOpacity).toHaveBeenCalledWith(0.35);
    expect(helperMock.setZIndex).toHaveBeenCalledWith(50);
    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'tile3d',
      data: {
        url: 'https://example.com/tileset.json',
        tilesetOptions: { maximumMemoryUsage: 64 },
        style: undefined,
      },
    });
  });

  it('applies targeted Cesium styles and ignores unrelated events', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-tile3d'),
      appliedCesiumStyle: undefined,
      isTargetedByStyle:
        VMapLayerTile3d.prototype['isTargetedByStyle'],
      updateLayerWithCesiumStyle:
        VMapLayerTile3d.prototype['updateLayerWithCesiumStyle'],
    } as any;
    component.el.id = 'tileset';

    await VMapLayerTile3d.prototype.onStyleReady.call(component, {
      detail: {
        style: { color: 'color("red")' },
        layerIds: ['tileset'],
      },
    } as CustomEvent<any>);

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'tile3d-style',
      data: {
        style: { color: 'color("red")' },
      },
    });

    helperMock.updateLayer.mockClear();

    await VMapLayerTile3d.prototype.onStyleReady.call(component, {
      detail: {
        style: {
          name: 'GeoStyler',
          rules: [{ symbolizers: [{ kind: 'Raster' }] }],
        },
        layerIds: ['tileset'],
      },
    } as CustomEvent<any>);
    await VMapLayerTile3d.prototype.onStyleReady.call(component, {
      detail: {
        style: { color: 'color("blue")' },
        layerIds: ['other'],
      },
    } as CustomEvent<any>);

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('includes an applied Cesium style in the layer config', async () => {
    const component = {
      url: 'https://example.com/tileset.json',
      visible: true,
      opacity: 1,
      zIndex: 1000,
      appliedCesiumStyle: { show: true },
      parseTilesetOptions: () => undefined,
    } as any;

    expect(
      VMapLayerTile3d.prototype['createLayerConfig'].call(component),
    ).toEqual(
      expect.objectContaining({
        type: 'tile3d',
        url: 'https://example.com/tileset.json',
        cesiumStyle: { show: true },
      }),
    );
  });

  it('isReady returns didLoad state', async () => {
    const component = { didLoad: false } as any;
    expect(await VMapLayerTile3d.prototype.isReady.call(component)).toBe(false);
    component.didLoad = true;
    expect(await VMapLayerTile3d.prototype.isReady.call(component)).toBe(true);
  });

  it('applyExistingStyles applies cesium styles from v-map-style elements', async () => {
    const cesiumStyle = { color: 'color("red")' };
    const styleEl = document.createElement('v-map-style');
    Object.defineProperty(styleEl, 'getStyle', { value: vi.fn().mockResolvedValue(cesiumStyle), writable: true, configurable: true });
    Object.defineProperty(styleEl, 'getLayerTargetIds', { value: vi.fn().mockResolvedValue(['tileset']), writable: true, configurable: true });
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-tile3d'),
      helper: helperMock,
      appliedCesiumStyle: undefined,
      isTargetedByStyle: VMapLayerTile3d.prototype['isTargetedByStyle'],
      updateLayerWithCesiumStyle: VMapLayerTile3d.prototype['updateLayerWithCesiumStyle'],
      url: 'https://example.com/tileset.json',
      parseTilesetOptions: () => undefined,
    } as any;
    component.el.id = 'tileset';

    await VMapLayerTile3d.prototype['applyExistingStyles'].call(component);

    expect(component.appliedCesiumStyle).toEqual(cesiumStyle);
    expect(helperMock.updateLayer).toHaveBeenCalled();

    document.body.innerHTML = '';
  });

  it('applyExistingStyles skips styles without getStyle', async () => {
    const styleEl = document.createElement('v-map-style');
    // No getStyle method
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-tile3d'),
      helper: helperMock,
      appliedCesiumStyle: undefined,
      isTargetedByStyle: VMapLayerTile3d.prototype['isTargetedByStyle'],
      updateLayerWithCesiumStyle: VMapLayerTile3d.prototype['updateLayerWithCesiumStyle'],
    } as any;
    component.el.id = 'tileset';

    await VMapLayerTile3d.prototype['applyExistingStyles'].call(component);

    expect(component.appliedCesiumStyle).toBeUndefined();

    document.body.innerHTML = '';
  });

  it('applyExistingStyles skips GeoStyler styles', async () => {
    const geostylerStyle = { name: 'test', rules: [{ name: 'r', symbolizers: [] }] };
    const styleEl = document.createElement('v-map-style');
    Object.defineProperty(styleEl, 'getStyle', { value: vi.fn().mockResolvedValue(geostylerStyle), writable: true, configurable: true });
    Object.defineProperty(styleEl, 'getLayerTargetIds', { value: vi.fn().mockResolvedValue(['tileset']), writable: true, configurable: true });
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-tile3d'),
      helper: helperMock,
      appliedCesiumStyle: undefined,
      isTargetedByStyle: VMapLayerTile3d.prototype['isTargetedByStyle'],
      updateLayerWithCesiumStyle: VMapLayerTile3d.prototype['updateLayerWithCesiumStyle'],
    } as any;
    component.el.id = 'tileset';

    await VMapLayerTile3d.prototype['applyExistingStyles'].call(component);

    // GeoStyler styles should be skipped for tile3d
    expect(component.appliedCesiumStyle).toBeUndefined();

    document.body.innerHTML = '';
  });

  it('onUrlChanged skips update when values are identical', async () => {
    await VMapLayerTile3d.prototype.onUrlChanged.call(
      { helper: helperMock } as any,
      'https://same.com/tileset.json',
      'https://same.com/tileset.json',
    );
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('onUrlChanged skips update when helper is undefined', async () => {
    await VMapLayerTile3d.prototype.onUrlChanged.call(
      { helper: undefined } as any,
      'https://old.com/tileset.json',
      'https://new.com/tileset.json',
    );
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('onUrlChanged updates layer when url actually changes', async () => {
    const component = {
      helper: helperMock,
      url: 'https://new.com/tileset.json',
      appliedCesiumStyle: undefined,
      parseTilesetOptions: () => ({ maxError: 4 }),
    } as any;

    await VMapLayerTile3d.prototype.onUrlChanged.call(
      component,
      'https://old.com/tileset.json',
      'https://new.com/tileset.json',
    );
    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'tile3d',
      data: {
        url: 'https://new.com/tileset.json',
        tilesetOptions: { maxError: 4 },
        cesiumStyle: undefined,
      },
    });
  });

  it('applyExistingStyles skips styles without getLayerTargetIds', async () => {
    const cesiumStyle = { color: 'color("red")' };
    const styleEl = document.createElement('v-map-style');
    Object.defineProperty(styleEl, 'getStyle', { value: vi.fn().mockResolvedValue(cesiumStyle), writable: true, configurable: true });
    Object.defineProperty(styleEl, 'getLayerTargetIds', { value: undefined, writable: true, configurable: true });
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-tile3d'),
      helper: helperMock,
      appliedCesiumStyle: undefined,
      isTargetedByStyle: VMapLayerTile3d.prototype['isTargetedByStyle'],
      updateLayerWithCesiumStyle: VMapLayerTile3d.prototype['updateLayerWithCesiumStyle'],
    } as any;
    component.el.id = 'tileset';

    await VMapLayerTile3d.prototype['applyExistingStyles'].call(component);

    expect(component.appliedCesiumStyle).toBeUndefined();

    document.body.innerHTML = '';
  });

  it('watchers handle undefined helper gracefully', async () => {
    await VMapLayerTile3d.prototype.onVisibleChanged.call({
      visible: false,
      helper: undefined,
    });
    await VMapLayerTile3d.prototype.onOpacityChanged.call({
      opacity: 0.5,
      helper: undefined,
    });
    await VMapLayerTile3d.prototype.onZIndexChanged.call({
      zIndex: 10,
      helper: undefined,
    });
    await VMapLayerTile3d.prototype.onTilesetOptionsChanged.call({
      helper: undefined,
    });

    expect(helperMock.setVisible).not.toHaveBeenCalled();
    expect(helperMock.setOpacity).not.toHaveBeenCalled();
    expect(helperMock.setZIndex).not.toHaveBeenCalled();
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('updateLayerWithCesiumStyle does nothing without style or helper', async () => {
    await VMapLayerTile3d.prototype['updateLayerWithCesiumStyle'].call({
      appliedCesiumStyle: undefined,
      helper: helperMock,
    });
    await VMapLayerTile3d.prototype['updateLayerWithCesiumStyle'].call({
      appliedCesiumStyle: { color: 'red' },
      helper: undefined,
    });

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('parseTilesetOptions returns object as-is', () => {
    const opts = { maxError: 4 };
    expect(
      VMapLayerTile3d.prototype['parseTilesetOptions'].call({ tilesetOptions: opts }),
    ).toBe(opts);
  });

  it('applyExistingStyles skips non-targeted styles', async () => {
    const cesiumStyle = { color: 'color("red")' };
    const styleEl = document.createElement('v-map-style');
    Object.defineProperty(styleEl, 'getStyle', { value: vi.fn().mockResolvedValue(cesiumStyle), writable: true, configurable: true });
    Object.defineProperty(styleEl, 'getLayerTargetIds', {
      value: vi.fn().mockResolvedValue(['other-layer']),
      writable: true,
      configurable: true,
    });
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-tile3d'),
      helper: helperMock,
      appliedCesiumStyle: undefined,
      isTargetedByStyle: VMapLayerTile3d.prototype['isTargetedByStyle'],
      updateLayerWithCesiumStyle: VMapLayerTile3d.prototype['updateLayerWithCesiumStyle'],
    } as any;
    component.el.id = 'tileset';

    await VMapLayerTile3d.prototype['applyExistingStyles'].call(component);

    expect(component.appliedCesiumStyle).toBeUndefined();

    document.body.innerHTML = '';
  });

  /* ------------------------------------------------------------------ */
  /*  Prototype-based unit tests for source function coverage            */
  /* ------------------------------------------------------------------ */
  describe('prototype-based source coverage', () => {

    it('render returns a virtual DOM node', () => {
      const result = VMapLayerTile3d.prototype.render.call({});
      expect(result).toBeTruthy();
    });

    it('componentWillLoad creates a VMapLayerHelper', async () => {
      const el = document.createElement('v-map-layer-tile3d');
      const component = { el } as any;
      await VMapLayerTile3d.prototype.componentWillLoad.call(component);
      expect(component.helper).toBeDefined();
    });

    it('componentDidLoad initializes layer and emits ready', async () => {
      const el = document.createElement('v-map-layer-tile3d');
      el.id = 'tile3d-1';
      const readyEmit = vi.fn();
      const component = {
        el,
        helper: helperMock,
        didLoad: false,
        ready: { emit: readyEmit },
        url: 'https://example.com/tileset.json',
        visible: true,
        opacity: 1,
        zIndex: 1000,
        tilesetOptions: undefined,
        appliedCesiumStyle: undefined,
        createLayerConfig: VMapLayerTile3d.prototype['createLayerConfig'],
        applyExistingStyles: vi.fn().mockResolvedValue(undefined),
        parseTilesetOptions: VMapLayerTile3d.prototype['parseTilesetOptions'],
      } as any;

      await VMapLayerTile3d.prototype.componentDidLoad.call(component);

      expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'tile3d-1');
      expect(component.didLoad).toBe(true);
      expect(readyEmit).toHaveBeenCalledTimes(1);
    });

    it('connectedCallback re-initializes when hasLoadedOnce is true', async () => {
      const component = {
        hasLoadedOnce: true,
        helper: helperMock,
        el: document.createElement('v-map-layer-tile3d'),
        url: 'https://example.com/tileset.json',
        visible: true,
        opacity: 1,
        zIndex: 1000,
        tilesetOptions: undefined,
        appliedCesiumStyle: undefined,
        createLayerConfig: VMapLayerTile3d.prototype['createLayerConfig'],
        parseTilesetOptions: VMapLayerTile3d.prototype['parseTilesetOptions'],
      } as any;
      component.el.id = 'tile3d-reconnect';
      await VMapLayerTile3d.prototype.connectedCallback.call(component);
      expect(helperMock.startLoading).toHaveBeenCalled();
      expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'tile3d-reconnect');
    });

    it('connectedCallback skips when hasLoadedOnce is false', async () => {
      const component = { hasLoadedOnce: false } as any;
      await VMapLayerTile3d.prototype.connectedCallback.call(component);
      expect(helperMock.startLoading).not.toHaveBeenCalled();
    });

    it('disconnectedCallback calls helper.dispose', async () => {
      const component = { helper: helperMock } as any;
      await VMapLayerTile3d.prototype.disconnectedCallback.call(component);
      expect(helperMock.dispose).toHaveBeenCalled();
    });

    it('disconnectedCallback handles undefined helper', async () => {
      const component = { helper: undefined } as any;
      await VMapLayerTile3d.prototype.disconnectedCallback.call(component);
      // Should not throw
    });

    it('parseTilesetOptions returns undefined for falsy input', () => {
      const result = VMapLayerTile3d.prototype['parseTilesetOptions'].call({ tilesetOptions: undefined });
      expect(result).toBeUndefined();
    });

    it('createLayerConfig returns full config', () => {
      const component = {
        url: 'https://example.com/tileset.json',
        visible: true,
        opacity: 0.8,
        zIndex: 500,
        tilesetOptions: undefined,
        appliedCesiumStyle: { show: true },
        parseTilesetOptions: VMapLayerTile3d.prototype['parseTilesetOptions'],
      } as any;

      const config = VMapLayerTile3d.prototype['createLayerConfig'].call(component);
      expect(config.type).toBe('tile3d');
      expect(config.cesiumStyle).toEqual({ show: true });
    });

    it('isTargetedByStyle returns false for undefined layerIds', () => {
      const component = { el: document.createElement('div') } as any;
      expect(VMapLayerTile3d.prototype['isTargetedByStyle'].call(component, undefined)).toBe(false);
    });

    it('isTargetedByStyle returns true for empty layerIds', () => {
      const component = { el: document.createElement('div') } as any;
      component.el.id = 'test';
      expect(VMapLayerTile3d.prototype['isTargetedByStyle'].call(component, [])).toBe(true);
    });

    it('onStyleReady ignores null style', async () => {
      const component = {
        helper: helperMock,
        el: document.createElement('v-map-layer-tile3d'),
        appliedCesiumStyle: undefined,
        isTargetedByStyle: VMapLayerTile3d.prototype['isTargetedByStyle'],
        updateLayerWithCesiumStyle: VMapLayerTile3d.prototype['updateLayerWithCesiumStyle'],
      } as any;
      component.el.id = 'tileset';

      await VMapLayerTile3d.prototype.onStyleReady.call(component, {
        detail: { style: null, layerIds: ['tileset'] },
      } as CustomEvent<any>);

      expect(component.appliedCesiumStyle).toBeUndefined();
    });
  });

  describe('Error-API', () => {
    it('initializes loadState as idle', () => {
      const component = new (VMapLayerTile3d as any)();
      expect(component.loadState).toBe('idle');
    });

    it('setLoadState updates loadState', () => {
      const component = new (VMapLayerTile3d as any)();
      VMapLayerTile3d.prototype.setLoadState.call(component, 'loading');
      expect(component.loadState).toBe('loading');
      VMapLayerTile3d.prototype.setLoadState.call(component, 'error');
      expect(component.loadState).toBe('error');
      VMapLayerTile3d.prototype.setLoadState.call(component, 'ready');
      expect(component.loadState).toBe('ready');
    });

    it('getError delegates to helper.getError', async () => {
      const errorDetail = { type: 'provider' as const, message: 'test error' };
      helperMock.getError.mockReturnValue(errorDetail);
      const component = { helper: helperMock } as any;
      const result = await VMapLayerTile3d.prototype.getError.call(component);
      expect(result).toEqual(errorDetail);
    });

    it('parseTilesetOptions calls helper.setError on invalid JSON', () => {
      const component = { tilesetOptions: '{invalid', helper: helperMock } as any;
      VMapLayerTile3d.prototype['parseTilesetOptions'].call(component);
      expect(helperMock.setError).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'parse', attribute: 'tilesetOptions' }),
      );
    });
  });
});
