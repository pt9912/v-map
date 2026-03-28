import { vi, describe, it, expect, beforeEach } from 'vitest';

const { helperMock } = vi.hoisted(() => {
  const helperMock = {
    initLayer: vi.fn(),
    removeLayer: vi.fn(),
    updateLayer: vi.fn(),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
  };
  return { helperMock };
});

vi.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: vi.fn().mockImplementation(function () { return helperMock; }),
}));

import { VMapLayerWms } from './v-map-layer-wms';

describe('<v-map-layer-wms>', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
  });

  it('renders with required attributes', async () => {
    const component = new (VMapLayerWms as any)();
    component.url = 'https://example.com/wms';
    component.layers = 'topo';

    expect(component.url).toBe('https://example.com/wms');
    expect(component.layers).toBe('topo');
    expect(component.format).toBe('image/png');
    expect(component.transparent).toBe(true);
    expect(component.tiled).toBe(true);
  });

  it('initializes layer, emits ready, and calls initLayer on componentDidLoad', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-wms'),
      url: 'https://example.com/wms',
      layers: 'topo',
      styles: undefined,
      format: 'image/png',
      transparent: true,
      tiled: true,
      visible: true,
      opacity: 1,
      zIndex: 10,
      ready: { emit: vi.fn() },
      createLayerConfig: VMapLayerWms.prototype['createLayerConfig'],
    } as any;
    component.el.id = 'wms1';

    await VMapLayerWms.prototype.componentDidLoad.call(component);

    expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'wms1');
    expect(component.ready.emit).toHaveBeenCalledTimes(1);
  });

  it('updates helper via visibility watcher', async () => {
    await VMapLayerWms.prototype.onVisibleChanged.call({
      visible: false, helper: helperMock,
    });
    expect(helperMock.setVisible).toHaveBeenCalledWith(false);
  });

  it('updates helper via opacity watcher', async () => {
    await VMapLayerWms.prototype.onOpacityChanged.call({
      opacity: 0.5, helper: helperMock,
    });
    expect(helperMock.setOpacity).toHaveBeenCalledWith(0.5);
  });

  it('updates helper via zIndex watcher', async () => {
    await VMapLayerWms.prototype.onZIndexChanged.call({
      zIndex: 99, helper: helperMock,
    });
    expect(helperMock.setZIndex).toHaveBeenCalledWith(99);
  });

  it('updates layer when url changes', async () => {
    const component = {
      helper: helperMock,
      url: 'https://new.com/wms',
      layers: 'layer1',
      styles: 'default',
      format: 'image/png',
      transparent: true,
      updateLayer: VMapLayerWms.prototype['updateLayer'],
    } as any;

    await VMapLayerWms.prototype.onUrlChanged.call(
      component,
      'https://old.com/wms',
      'https://new.com/wms',
    );

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'wms',
      data: {
        url: 'https://new.com/wms',
        layers: 'layer1',
        styles: 'default',
        format: 'image/png',
        transparent: 'true',
      },
    });
  });

  it('does not update layer when url value is identical', async () => {
    const component = {
      helper: helperMock,
      updateLayer: VMapLayerWms.prototype['updateLayer'],
    } as any;

    await VMapLayerWms.prototype.onUrlChanged.call(
      component,
      'https://same.com/wms',
      'https://same.com/wms',
    );

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('updates layer when layers change', async () => {
    const component = {
      helper: helperMock,
      url: 'https://example.com/wms',
      layers: 'newLayer',
      styles: undefined,
      format: 'image/jpeg',
      transparent: false,
      updateLayer: VMapLayerWms.prototype['updateLayer'],
    } as any;

    await VMapLayerWms.prototype.onLayersChanged.call(
      component,
      'oldLayer',
      'newLayer',
    );

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'wms',
      data: {
        url: 'https://example.com/wms',
        layers: 'newLayer',
        styles: undefined,
        format: 'image/jpeg',
        transparent: 'false',
      },
    });
  });

  it('does not update layer when layers value is identical', async () => {
    const component = {
      helper: helperMock,
      updateLayer: VMapLayerWms.prototype['updateLayer'],
    } as any;

    await VMapLayerWms.prototype.onLayersChanged.call(component, 'same', 'same');
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('updates layer when styles change', async () => {
    const component = {
      helper: helperMock,
      url: 'https://example.com/wms',
      layers: 'layer1',
      styles: 'newStyle',
      format: 'image/png',
      transparent: true,
      updateLayer: VMapLayerWms.prototype['updateLayer'],
    } as any;

    await VMapLayerWms.prototype.onStylesChanged.call(
      component,
      'oldStyle',
      'newStyle',
    );

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'wms',
      data: expect.objectContaining({ styles: 'newStyle' }),
    });
  });

  it('does not update layer when styles value is identical', async () => {
    const component = {
      helper: helperMock,
      updateLayer: VMapLayerWms.prototype['updateLayer'],
    } as any;

    await VMapLayerWms.prototype.onStylesChanged.call(component, 'same', 'same');
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('creates the expected layer config', () => {
    const component = {
      url: 'https://example.com/wms',
      layers: 'topo,rivers',
      styles: 'default',
      format: 'image/png',
      transparent: true,
      tiled: true,
      visible: true,
      opacity: 0.7,
      zIndex: 20,
    } as any;

    const config = VMapLayerWms.prototype['createLayerConfig'].call(component);

    expect(config).toEqual({
      type: 'wms',
      url: 'https://example.com/wms',
      layers: 'topo,rivers',
      transparent: 'true',
      styles: 'default',
      format: 'image/png',
      extraParams: { tiled: 'true' },
      visible: true,
      opacity: 0.7,
      zIndex: 20,
    });
  });

  it('removes layer on disconnect', async () => {
    await VMapLayerWms.prototype.disconnectedCallback.call({ helper: helperMock });
    expect(helperMock.removeLayer).toHaveBeenCalledTimes(1);
  });

  it('handles watcher calls gracefully when helper is undefined', async () => {
    await VMapLayerWms.prototype.onVisibleChanged.call({
      visible: false, helper: undefined,
    });
    await VMapLayerWms.prototype.onOpacityChanged.call({
      opacity: 0.5, helper: undefined,
    });
    await VMapLayerWms.prototype.onZIndexChanged.call({
      zIndex: 10, helper: undefined,
    });

    expect(helperMock.setVisible).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  /*  Prototype-based unit tests for source function coverage            */
  /* ------------------------------------------------------------------ */
  describe('prototype-based source coverage', () => {

    it('render returns undefined', () => {
      const result = VMapLayerWms.prototype.render.call({});
      expect(result).toBeUndefined();
    });

    it('componentWillLoad creates a VMapLayerHelper', async () => {
      const el = document.createElement('v-map-layer-wms');
      const component = { el } as any;
      await VMapLayerWms.prototype.componentWillLoad.call(component);
      expect(component.helper).toBeDefined();
    });

    it('connectedCallback runs without error', async () => {
      await VMapLayerWms.prototype.connectedCallback.call({});
    });

    it('disconnectedCallback handles undefined helper', async () => {
      const component = { helper: undefined } as any;
      await VMapLayerWms.prototype.disconnectedCallback.call(component);
      // Should not throw
    });

    it('updateLayer delegates to helper.updateLayer', async () => {
      const component = {
        helper: helperMock,
        url: 'https://example.com/wms',
        layers: 'topo',
        styles: 'default',
        format: 'image/png',
        transparent: true,
      } as any;

      await VMapLayerWms.prototype['updateLayer'].call(component);

      expect(helperMock.updateLayer).toHaveBeenCalledWith({
        type: 'wms',
        data: {
          url: 'https://example.com/wms',
          layers: 'topo',
          styles: 'default',
          format: 'image/png',
          transparent: 'true',
        },
      });
    });

    it('updateLayer handles undefined helper', async () => {
      const component = {
        helper: undefined,
        url: 'https://example.com/wms',
        layers: 'topo',
      } as any;

      await VMapLayerWms.prototype['updateLayer'].call(component);
      // Should not throw
    });
  });
});
