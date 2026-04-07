import { vi, describe, it, expect, beforeEach } from 'vitest';

const { helperMock } = vi.hoisted(() => {
  const helperMock = {
    initLayer: vi.fn(),
    removeLayer: vi.fn(),
    updateLayer: vi.fn(),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
    getLayerId: vi.fn().mockReturnValue('osm-layer-id'),
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

import { VMapLayerOSM } from './v-map-layer-osm';

describe('v-map-layer-osm', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
    helperMock.getLayerId.mockReturnValue('osm-layer-id');
  });

  it('renders with default attributes', async () => {
    const component = new (VMapLayerOSM as any)();

    expect(component.visible).toBe(true);
    expect(component.opacity).toBe(1);
    expect(component.zIndex).toBe(10);
    expect(component.url).toBe('https://tile.openstreetmap.org');
  });

  it('creates the expected layer config and emits ready on load', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-osm'),
      url: 'https://tiles.example.com',
      visible: true,
      opacity: 0.7,
      zIndex: 15,
      didLoad: false,
      ready: { emit: vi.fn() },
      createLayerConfig: VMapLayerOSM.prototype['createLayerConfig'],
    } as any;
    component.el.id = 'base';

    await VMapLayerOSM.prototype.componentDidLoad.call(component);

    expect(helperMock.initLayer).toHaveBeenCalledWith(
      expect.any(Function),
      'base',
    );
    expect(component.createLayerConfig.call(component)).toEqual({
      type: 'osm',
      url: 'https://tiles.example.com',
      visible: true,
      zIndex: 15,
      opacity: 0.7,
    });
    expect(VMapLayerOSM.prototype.isReady.call(component)).toBe(true);
    expect(component.ready.emit).toHaveBeenCalledTimes(1);
  });

  it('updates helper methods through watchers', async () => {
    await VMapLayerOSM.prototype.onVisibleChanged.call({
      visible: false,
      helper: helperMock,
    });
    await VMapLayerOSM.prototype.onOpacityChanged.call({
      opacity: 0.5,
      helper: helperMock,
    });
    await VMapLayerOSM.prototype.onZIndexChanged.call({
      zIndex: 99,
      helper: helperMock,
    });

    expect(helperMock.setVisible).toHaveBeenCalledWith(false);
    expect(helperMock.setOpacity).toHaveBeenCalledWith(0.5);
    expect(helperMock.setZIndex).toHaveBeenCalledWith(99);
  });

  it('updates the layer URL only when the value changes', async () => {
    await VMapLayerOSM.prototype.onUrlChanged.call(
      {
        url: 'https://tiles.example.com',
        helper: helperMock,
      },
      'https://tile.openstreetmap.org',
      'https://tiles.example.com',
    );
    await VMapLayerOSM.prototype.onUrlChanged.call(
      {
        url: 'https://tiles.example.com',
        helper: helperMock,
      },
      'https://tiles.example.com',
      'https://tiles.example.com',
    );

    expect(helperMock.updateLayer).toHaveBeenCalledTimes(1);
    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'osm',
      data: {
        url: 'https://tiles.example.com',
      },
    });
  });

  it('handles watcher calls gracefully when helper is undefined', async () => {
    const ctx = { helper: undefined, visible: false, opacity: 0.5, zIndex: 5, url: 'https://test.com' } as any;
    await VMapLayerOSM.prototype.onVisibleChanged.call(ctx);
    await VMapLayerOSM.prototype.onOpacityChanged.call(ctx);
    await VMapLayerOSM.prototype.onZIndexChanged.call(ctx);
    await VMapLayerOSM.prototype.onUrlChanged.call(ctx, 'https://old.com', 'https://test.com');

    expect(helperMock.setVisible).not.toHaveBeenCalled();
    expect(helperMock.setOpacity).not.toHaveBeenCalled();
    expect(helperMock.setZIndex).not.toHaveBeenCalled();
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('proxies getLayerId and disposes the layer on disconnect', async () => {
    const component = { helper: helperMock } as any;

    expect(await VMapLayerOSM.prototype.getLayerId.call(component)).toBe(
      'osm-layer-id',
    );

    await VMapLayerOSM.prototype.disconnectedCallback.call(component);

    expect(helperMock.dispose).toHaveBeenCalledTimes(1);
  });

  /* ------------------------------------------------------------------ */
  /*  Prototype-based unit tests for source function coverage            */
  /* ------------------------------------------------------------------ */
  describe('prototype-based source coverage', () => {

    it('render returns undefined', () => {
      const result = VMapLayerOSM.prototype.render.call({});
      expect(result).toBeUndefined();
    });

    it('componentWillRender runs without error', async () => {
      await VMapLayerOSM.prototype.componentWillRender.call({});
    });

    it('componentWillLoad creates a VMapLayerHelper', async () => {
      const el = document.createElement('v-map-layer-osm');
      const component = { el } as any;
      await VMapLayerOSM.prototype.componentWillLoad.call(component);
      expect(component.helper).toBeDefined();
    });

    it('connectedCallback runs without error when hasLoadedOnce is false', async () => {
      await VMapLayerOSM.prototype.connectedCallback.call({});
    });

    it('connectedCallback re-initializes when hasLoadedOnce is true', async () => {
      const component = {
        hasLoadedOnce: true,
        helper: helperMock,
        el: document.createElement('v-map-layer-osm'),
        url: 'https://tile.openstreetmap.org',
        visible: true,
        opacity: 1,
        zIndex: 10,
        createLayerConfig: VMapLayerOSM.prototype['createLayerConfig'],
      } as any;
      component.el.id = 'osm-reconnect';
      await VMapLayerOSM.prototype.connectedCallback.call(component);
      expect(helperMock.startLoading).toHaveBeenCalled();
      expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'osm-reconnect');
    });

    it('isReady reflects didLoad state', () => {
      expect(VMapLayerOSM.prototype.isReady.call({ didLoad: false })).toBe(false);
      expect(VMapLayerOSM.prototype.isReady.call({ didLoad: true })).toBe(true);
    });

    it('createLayerConfig returns expected structure', () => {
      const component = {
        url: 'https://tile.openstreetmap.org',
        visible: true,
        zIndex: 10,
        opacity: 0.8,
      } as any;

      const config = VMapLayerOSM.prototype['createLayerConfig'].call(component);
      expect(config).toEqual({
        type: 'osm',
        url: 'https://tile.openstreetmap.org',
        visible: true,
        zIndex: 10,
        opacity: 0.8,
      });
    });

    it('disconnectedCallback handles undefined helper', async () => {
      const component = { helper: undefined } as any;
      await VMapLayerOSM.prototype.disconnectedCallback.call(component);
      // Should not throw
    });

    it('getLayerId returns undefined when helper is undefined', async () => {
      const component = { helper: undefined } as any;
      const result = await VMapLayerOSM.prototype.getLayerId.call(component);
      expect(result).toBeUndefined();
    });
  });

  describe('Error-API', () => {
    it('initializes loadState as idle', () => {
      const component = new (VMapLayerOSM as any)();
      expect(component.loadState).toBe('idle');
    });

    it('setLoadState updates loadState', () => {
      const component = new (VMapLayerOSM as any)();
      VMapLayerOSM.prototype.setLoadState.call(component, 'loading');
      expect(component.loadState).toBe('loading');
      VMapLayerOSM.prototype.setLoadState.call(component, 'error');
      expect(component.loadState).toBe('error');
      VMapLayerOSM.prototype.setLoadState.call(component, 'ready');
      expect(component.loadState).toBe('ready');
    });

    it('getError delegates to helper.getError', async () => {
      const errorDetail = { type: 'provider' as const, message: 'test error' };
      helperMock.getError.mockReturnValue(errorDetail);
      const component = { helper: helperMock } as any;
      const result = await VMapLayerOSM.prototype.getError.call(component);
      expect(result).toEqual(errorDetail);
    });
  });
});
