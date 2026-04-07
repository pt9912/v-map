import { vi, describe, it, expect, beforeEach } from 'vitest';

const { helperMock } = vi.hoisted(() => {
  const helperMock = {
    initLayer: vi.fn(),
    removeLayer: vi.fn(),
    updateLayer: vi.fn(),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
    getLayerId: vi.fn().mockReturnValue('xyz-layer-id'),
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

import { VMapLayerXyz } from './v-map-layer-xyz';

describe('<v-map-layer-xyz>', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
  });

  it('renders with default attributes', () => {
    const component = new (VMapLayerXyz as any)();
    expect(component.visible).toBe(true);
    expect(component.opacity).toBe(1);
  });

  it('creates the expected layer config and emits ready on load', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-xyz'),
      url: 'https://tiles/{z}/{x}/{y}.png',
      attributions: 'Test',
      maxZoom: 19,
      tileSize: 256,
      subdomains: 'a,b,c',
      visible: true,
      opacity: 0.8,
      hasLoadedOnce: false,
      ready: { emit: vi.fn() },
      createLayerConfig: VMapLayerXyz.prototype['createLayerConfig'],
    } as any;
    component.el.id = 'xyz1';

    await VMapLayerXyz.prototype.componentDidLoad.call(component);

    expect(helperMock.startLoading).toHaveBeenCalled();
    expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'xyz1');
    expect(component.createLayerConfig.call(component)).toEqual({
      type: 'xyz',
      url: 'https://tiles/{z}/{x}/{y}.png',
      attributions: 'Test',
      maxZoom: 19,
      visible: true,
      opacity: 0.8,
      options: { tileSize: 256, subdomains: 'a,b,c' },
    });
    expect(component.hasLoadedOnce).toBe(true);
    expect(component.ready.emit).toHaveBeenCalledTimes(1);
  });

  it('disposes layer on disconnect', async () => {
    await VMapLayerXyz.prototype.disconnectedCallback.call({ helper: helperMock });
    expect(helperMock.dispose).toHaveBeenCalledTimes(1);
  });

  describe('prototype-based source coverage', () => {
    it('render returns undefined', () => {
      const result = VMapLayerXyz.prototype.render.call({});
      expect(result).toBeUndefined();
    });

    it('componentWillLoad creates a VMapLayerHelper', async () => {
      const el = document.createElement('v-map-layer-xyz');
      const component = { el } as any;
      await VMapLayerXyz.prototype.componentWillLoad.call(component);
      expect(component.helper).toBeDefined();
    });

    it('connectedCallback skips when hasLoadedOnce is false', async () => {
      const component = { hasLoadedOnce: false } as any;
      await VMapLayerXyz.prototype.connectedCallback.call(component);
      expect(helperMock.startLoading).not.toHaveBeenCalled();
    });

    it('connectedCallback re-initializes when hasLoadedOnce is true', async () => {
      const component = {
        hasLoadedOnce: true,
        helper: helperMock,
        el: document.createElement('v-map-layer-xyz'),
        url: 'https://tiles/{z}/{x}/{y}.png',
        visible: true,
        opacity: 1,
        createLayerConfig: VMapLayerXyz.prototype['createLayerConfig'],
      } as any;
      component.el.id = 'xyz2';

      await VMapLayerXyz.prototype.connectedCallback.call(component);

      expect(helperMock.startLoading).toHaveBeenCalled();
      expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'xyz2');
    });

    it('disconnectedCallback handles undefined helper', async () => {
      const component = { helper: undefined } as any;
      await VMapLayerXyz.prototype.disconnectedCallback.call(component);
    });
  });

  describe('Error-API', () => {
    it('initializes loadState as idle', () => {
      const component = new (VMapLayerXyz as any)();
      expect(component.loadState).toBe('idle');
    });

    it('setLoadState updates loadState', () => {
      const component = new (VMapLayerXyz as any)();
      VMapLayerXyz.prototype.setLoadState.call(component, 'loading');
      expect(component.loadState).toBe('loading');
      VMapLayerXyz.prototype.setLoadState.call(component, 'error');
      expect(component.loadState).toBe('error');
      VMapLayerXyz.prototype.setLoadState.call(component, 'ready');
      expect(component.loadState).toBe('ready');
    });

    it('getError delegates to helper.getError', async () => {
      const errorDetail = { type: 'provider' as const, message: 'test error' };
      helperMock.getError.mockReturnValue(errorDetail);
      const component = { helper: helperMock } as any;
      const result = await VMapLayerXyz.prototype.getError.call(component);
      expect(result).toEqual(errorDetail);
    });

    it('componentDidLoad calls startLoading before initLayer', async () => {
      const callOrder: string[] = [];
      helperMock.startLoading.mockImplementation(() => { callOrder.push('startLoading'); });
      helperMock.initLayer.mockImplementation(() => { callOrder.push('initLayer'); });

      const component = {
        helper: helperMock,
        el: document.createElement('v-map-layer-xyz'),
        url: 'https://tiles/{z}/{x}/{y}.png',
        visible: true,
        opacity: 1,
        didLoad: false,
        hasLoadedOnce: false,
        ready: { emit: vi.fn() },
        createLayerConfig: VMapLayerXyz.prototype['createLayerConfig'],
      } as any;

      await VMapLayerXyz.prototype.componentDidLoad.call(component);

      expect(callOrder[0]).toBe('startLoading');
      expect(callOrder[1]).toBe('initLayer');
    });
  });
});
