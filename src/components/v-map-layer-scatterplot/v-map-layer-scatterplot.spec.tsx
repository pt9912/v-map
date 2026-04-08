import { vi, describe, it, expect, beforeEach } from 'vitest';

const { helperMock } = vi.hoisted(() => {
  const helperMock = {
    // Invoke the factory so the arrow wrapper `() => this.createLayerConfig()`
    // actually executes during the test, which closes a small gap in
    // function coverage for every layer component that uses this mock shape.
    initLayer: vi.fn((factory?: () => unknown) => {
      if (typeof factory === 'function') factory();
    }),
    removeLayer: vi.fn(),
    updateLayer: vi.fn(),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
    getLayerId: vi.fn().mockReturnValue('scatter-layer-id'),
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

import { VMapLayerScatterplot } from './v-map-layer-scatterplot';

describe('<v-map-layer-scatterplot>', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
  });

  it('renders with default attributes', () => {
    const component = new (VMapLayerScatterplot as any)();
    expect(component.visible).toBe(true);
    expect(component.opacity).toBe(1);
    expect(component.getFillColor).toBe('#3388ff');
    expect(component.getRadius).toBe(1000);
  });

  it('creates the expected layer config and emits ready on load', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-scatterplot'),
      data: '[{"lon":11,"lat":48}]',
      url: undefined,
      getFillColor: '#ff0000',
      getRadius: 500,
      opacity: 0.7,
      visible: true,
      hasLoadedOnce: false,
      ready: { emit: vi.fn() },
      createLayerConfig: VMapLayerScatterplot.prototype['createLayerConfig'],
    } as any;
    component.el.id = 'scatter1';

    await VMapLayerScatterplot.prototype.componentDidLoad.call(component);

    expect(helperMock.startLoading).toHaveBeenCalled();
    expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'scatter1');
    expect(component.createLayerConfig.call(component)).toEqual({
      type: 'scatterplot',
      data: '[{"lon":11,"lat":48}]',
      getFillColor: '#ff0000',
      getRadius: 500,
      opacity: 0.7,
      visible: true,
    });
    expect(component.hasLoadedOnce).toBe(true);
    expect(component.ready.emit).toHaveBeenCalledTimes(1);
  });

  it('disposes layer on disconnect', async () => {
    await VMapLayerScatterplot.prototype.disconnectedCallback.call({ helper: helperMock });
    expect(helperMock.dispose).toHaveBeenCalledTimes(1);
  });

  describe('prototype-based source coverage', () => {
    it('render returns undefined', () => {
      const result = VMapLayerScatterplot.prototype.render.call({});
      expect(result).toBeUndefined();
    });

    it('componentWillLoad creates a VMapLayerHelper', async () => {
      const el = document.createElement('v-map-layer-scatterplot');
      const component = { el } as any;
      await VMapLayerScatterplot.prototype.componentWillLoad.call(component);
      expect(component.helper).toBeDefined();
    });

    it('connectedCallback skips when hasLoadedOnce is false', async () => {
      const component = { hasLoadedOnce: false } as any;
      await VMapLayerScatterplot.prototype.connectedCallback.call(component);
      expect(helperMock.startLoading).not.toHaveBeenCalled();
    });

    it('connectedCallback re-initializes when hasLoadedOnce is true', async () => {
      const component = {
        hasLoadedOnce: true,
        helper: helperMock,
        el: document.createElement('v-map-layer-scatterplot'),
        data: '[]',
        url: undefined,
        getFillColor: '#3388ff',
        getRadius: 1000,
        opacity: 1,
        visible: true,
        createLayerConfig: VMapLayerScatterplot.prototype['createLayerConfig'],
      } as any;
      component.el.id = 'scatter2';

      await VMapLayerScatterplot.prototype.connectedCallback.call(component);

      expect(helperMock.startLoading).toHaveBeenCalled();
      expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'scatter2');
    });

    it('disconnectedCallback handles undefined helper', async () => {
      const component = { helper: undefined } as any;
      await VMapLayerScatterplot.prototype.disconnectedCallback.call(component);
    });
  });

  describe('Error-API', () => {
    it('initializes loadState as idle', () => {
      const component = new (VMapLayerScatterplot as any)();
      expect(component.loadState).toBe('idle');
    });

    it('setLoadState updates loadState', () => {
      const component = new (VMapLayerScatterplot as any)();
      VMapLayerScatterplot.prototype.setLoadState.call(component, 'loading');
      expect(component.loadState).toBe('loading');
      VMapLayerScatterplot.prototype.setLoadState.call(component, 'error');
      expect(component.loadState).toBe('error');
      VMapLayerScatterplot.prototype.setLoadState.call(component, 'ready');
      expect(component.loadState).toBe('ready');
    });

    it('getError delegates to helper.getError', async () => {
      const errorDetail = { type: 'provider' as const, message: 'test error' };
      helperMock.getError.mockReturnValue(errorDetail);
      const component = { helper: helperMock } as any;
      const result = await VMapLayerScatterplot.prototype.getError.call(component);
      expect(result).toEqual(errorDetail);
    });

    it('componentDidLoad calls startLoading before initLayer', async () => {
      const callOrder: string[] = [];
      helperMock.startLoading.mockImplementation(() => { callOrder.push('startLoading'); });
      helperMock.initLayer.mockImplementation(() => { callOrder.push('initLayer'); });

      const component = {
        helper: helperMock,
        el: document.createElement('v-map-layer-scatterplot'),
        data: '[]',
        url: undefined,
        getFillColor: '#3388ff',
        getRadius: 1000,
        opacity: 1,
        visible: true,
        didLoad: false,
        hasLoadedOnce: false,
        ready: { emit: vi.fn() },
        createLayerConfig: VMapLayerScatterplot.prototype['createLayerConfig'],
      } as any;

      await VMapLayerScatterplot.prototype.componentDidLoad.call(component);

      expect(callOrder[0]).toBe('startLoading');
      expect(callOrder[1]).toBe('initLayer');
    });
  });
});
