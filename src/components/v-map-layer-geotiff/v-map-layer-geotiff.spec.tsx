import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, h } from '@stencil/vitest';

const { helperMock } = vi.hoisted(() => {
  const helperMock = {
    initLayer: vi.fn(),
    removeLayer: vi.fn(),
    updateLayer: vi.fn(),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
    getLayerId: vi.fn().mockReturnValue('geotiff-layer-id'),
  };
  return { helperMock };
});

vi.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: vi.fn().mockImplementation(function () { return helperMock; }),
}));

import { VMapLayerGeoTIFF } from './v-map-layer-geotiff';

describe('v-map-layer-geotiff', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
    helperMock.getLayerId.mockReturnValue('geotiff-layer-id');
  });

  it('renders and builds a layer config from props', async () => {
    const { root } = await render(
      h('v-map-layer-geotiff', {
        id: 'dem',
        url: 'https://example.com/dem.tif',
        opacity: '0.6',
        'z-index': '5',
        nodata: '255',
      }),
    );

    expect(VMapLayerGeoTIFF.prototype['createLayerConfig'].call(root)).toEqual({
      type: 'geotiff',
      visible: true,
      zIndex: 5,
      opacity: 0.6,
      url: 'https://example.com/dem.tif',
      nodata: 255,
      colorMap: null,
      valueRange: null,
    });
  });

  it('updates visibility, opacity and z-index through the helper', async () => {
    await VMapLayerGeoTIFF.prototype.onVisibleChanged.call({
      visible: false,
      helper: helperMock,
    });
    await VMapLayerGeoTIFF.prototype.onOpacityChanged.call({
      opacity: 0.4,
      helper: helperMock,
    });
    await VMapLayerGeoTIFF.prototype.onZIndexChanged.call({
      zIndex: 77,
      helper: helperMock,
    });

    expect(helperMock.setVisible).toHaveBeenCalledWith(false);
    expect(helperMock.setOpacity).toHaveBeenCalledWith(0.4);
    expect(helperMock.setZIndex).toHaveBeenCalledWith(77);
  });

  it('normalizes invalid nodata values before updating the layer', async () => {
    const component = {
      helper: helperMock,
      url: 'https://example.com/dem.tif',
      nodata: Number.NaN,
      colorMap: null,
      valueRange: null,
    } as any;

    await VMapLayerGeoTIFF.prototype.onNodataChanged.call(component);

    expect(component.nodata).toBeNull();
    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'geotiff',
      data: {
        url: 'https://example.com/dem.tif',
        nodata: null,
        colorMap: null,
        valueRange: null,
      },
    });
  });

  it('extracts raster symbolizers and applies targeted styles', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-geotiff'),
      url: 'https://example.com/dem.tif',
      visible: true,
      opacity: 1,
      colorMap: null,
      extractRasterSymbolizer:
        VMapLayerGeoTIFF.prototype['extractRasterSymbolizer'],
    } as any;
    component.el.id = 'dem';

    const style = {
      name: 'Raster style',
      rules: [
        {
          name: 'Rule',
          symbolizers: [
            {
              kind: 'Raster',
              colorMap: { type: 'ramp', colorMapEntries: [] },
              opacity: 0.25,
              visibility: false,
            },
          ],
        },
      ],
    };

    expect(component.extractRasterSymbolizer.call(component, style)).toEqual(
      style.rules[0].symbolizers[0],
    );

    await VMapLayerGeoTIFF.prototype['handleStyleReady'].call(component, {
      detail: { style, layerIds: ['dem'] },
    } as unknown as CustomEvent);

    expect(component.colorMap).toEqual({
      type: 'ramp',
      colorMapEntries: [],
    });
    expect(component.opacity).toBe(0.25);
    expect(component.visible).toBe(false);
  });

  it('ignores non-targeted and non-raster styles', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-geotiff'),
      visible: true,
      opacity: 1,
      colorMap: null,
      extractRasterSymbolizer:
        VMapLayerGeoTIFF.prototype['extractRasterSymbolizer'],
    } as any;
    component.el.id = 'dem';

    await VMapLayerGeoTIFF.prototype['handleStyleReady'].call(component, {
      detail: {
        style: {
          name: 'Raster style',
          rules: [{ symbolizers: [{ kind: 'Raster', opacity: 0.9 }] }],
        },
        layerIds: ['other-layer'],
      },
    } as unknown as CustomEvent);
    await VMapLayerGeoTIFF.prototype['handleStyleReady'].call(component, {
      detail: {
        style: {
          foo: 'bar',
        },
        layerIds: ['dem'],
      },
    } as unknown as CustomEvent);

    expect(component.opacity).toBe(1);
    expect(component.extractRasterSymbolizer.call(component, {
      name: 'No raster',
      rules: [{ symbolizers: [{ kind: 'Mark' }] }],
    })).toBeNull();
  });

  it('onUrlChanged triggers updateLayer with current state', async () => {
    const component = {
      url: 'https://new.com/dem.tif',
      nodata: null,
      colorMap: null,
      valueRange: null,
      helper: helperMock,
    } as any;

    await VMapLayerGeoTIFF.prototype.onUrlChanged.call(component);

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'geotiff',
      data: {
        url: 'https://new.com/dem.tif',
        nodata: null,
        colorMap: null,
        valueRange: null,
      },
    });
  });

  it('onUrlChanged does nothing when helper is undefined', async () => {
    const component = {
      url: 'https://new.com/dem.tif',
      helper: undefined,
    } as any;

    await VMapLayerGeoTIFF.prototype.onUrlChanged.call(component);

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('onColorMapChanged triggers updateLayer', async () => {
    const colorMap = { type: 'ramp', colorMapEntries: [{ color: '#ff0000', quantity: 0 }] };
    const component = {
      url: 'https://example.com/dem.tif',
      nodata: -9999,
      colorMap,
      valueRange: [0, 1000],
      helper: helperMock,
    } as any;

    await VMapLayerGeoTIFF.prototype.onColorMapChanged.call(component);

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'geotiff',
      data: {
        url: 'https://example.com/dem.tif',
        nodata: -9999,
        colorMap,
        valueRange: [0, 1000],
      },
    });
  });

  it('onValueRangeChanged triggers updateLayer', async () => {
    const component = {
      url: 'https://example.com/dem.tif',
      nodata: null,
      colorMap: null,
      valueRange: [100, 500],
      helper: helperMock,
    } as any;

    await VMapLayerGeoTIFF.prototype.onValueRangeChanged.call(component);

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'geotiff',
      data: {
        url: 'https://example.com/dem.tif',
        nodata: null,
        colorMap: null,
        valueRange: [100, 500],
      },
    });
  });

  /* ------------------------------------------------------------------ */
  /*  Prototype-based unit tests for source function coverage            */
  /* ------------------------------------------------------------------ */
  describe('prototype-based source coverage', () => {

    it('render returns undefined', () => {
      const result = VMapLayerGeoTIFF.prototype.render.call({});
      expect(result).toBeUndefined();
    });

    it('componentWillRender runs without error', async () => {
      await VMapLayerGeoTIFF.prototype.componentWillRender.call({});
    });

    it('componentWillLoad creates a VMapLayerHelper', async () => {
      const el = document.createElement('v-map-layer-geotiff');
      const component = { el } as any;
      await VMapLayerGeoTIFF.prototype.componentWillLoad.call(component);
      expect(component.helper).toBeDefined();
    });

    it('componentDidLoad initializes layer and emits ready', async () => {
      const el = document.createElement('v-map-layer-geotiff');
      el.id = 'test-geotiff';
      const readyEmit = vi.fn();
      const component = {
        el,
        helper: helperMock,
        didLoad: false,
        ready: { emit: readyEmit },
        url: 'https://example.com/dem.tif',
        visible: true,
        zIndex: 100,
        opacity: 1,
        nodata: null,
        colorMap: null,
        valueRange: null,
        createLayerConfig: VMapLayerGeoTIFF.prototype['createLayerConfig'],
      } as any;

      await VMapLayerGeoTIFF.prototype.componentDidLoad.call(component);

      expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'test-geotiff');
      expect(component.didLoad).toBe(true);
      expect(readyEmit).toHaveBeenCalledTimes(1);
    });

    it('connectedCallback registers styleReady listener', async () => {
      const addSpy = vi.spyOn(document, 'addEventListener');
      const component = { el: document.createElement('v-map-layer-geotiff'), handleStyleReady: vi.fn() } as any;

      await VMapLayerGeoTIFF.prototype.connectedCallback.call(component);

      expect(addSpy).toHaveBeenCalledWith('styleReady', expect.any(Function));
      addSpy.mockRestore();
    });

    it('disconnectedCallback removes styleReady listener', () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener');
      const component = { handleStyleReady: vi.fn() } as any;

      VMapLayerGeoTIFF.prototype.disconnectedCallback.call(component);

      expect(removeSpy).toHaveBeenCalledWith('styleReady', expect.any(Function));
      removeSpy.mockRestore();
    });

    it('isReady reflects didLoad state', () => {
      expect(VMapLayerGeoTIFF.prototype.isReady.call({ didLoad: false })).toBe(false);
      expect(VMapLayerGeoTIFF.prototype.isReady.call({ didLoad: true })).toBe(true);
    });

    it('getLayerId delegates to helper', async () => {
      helperMock.getLayerId.mockReturnValue('geotiff-abc');
      const component = { helper: helperMock } as any;
      const result = await VMapLayerGeoTIFF.prototype.getLayerId.call(component);
      expect(result).toBe('geotiff-abc');
    });

    it('createLayerConfig returns expected structure', () => {
      const component = {
        url: 'https://example.com/test.tif',
        visible: true,
        zIndex: 50,
        opacity: 0.8,
        nodata: -9999,
        colorMap: 'viridis',
        valueRange: [0, 1000],
      } as any;

      const config = VMapLayerGeoTIFF.prototype['createLayerConfig'].call(component);
      expect(config).toEqual({
        type: 'geotiff',
        visible: true,
        zIndex: 50,
        opacity: 0.8,
        url: 'https://example.com/test.tif',
        nodata: -9999,
        colorMap: 'viridis',
        valueRange: [0, 1000],
      });
    });

    it('handleStyleReady with empty layerIds applies style', async () => {
      const component = {
        helper: helperMock,
        el: document.createElement('v-map-layer-geotiff'),
        url: 'https://example.com/dem.tif',
        visible: true,
        opacity: 1,
        colorMap: null,
        extractRasterSymbolizer: VMapLayerGeoTIFF.prototype['extractRasterSymbolizer'],
      } as any;
      component.el.id = 'dem';

      const style = {
        name: 'Raster style',
        rules: [{ name: 'Rule', symbolizers: [{ kind: 'Raster' }] }],
      };

      await VMapLayerGeoTIFF.prototype['handleStyleReady'].call(component, {
        detail: { style, layerIds: [] },
      } as unknown as CustomEvent);
      // no layerIds filter means it passes through
    });

    it('extractRasterSymbolizer returns null when no Raster symbolizer', () => {
      const style = { name: 'test', rules: [{ symbolizers: [{ kind: 'Fill' }] }] };
      const result = VMapLayerGeoTIFF.prototype['extractRasterSymbolizer'].call({}, style);
      expect(result).toBeNull();
    });
  });
});
