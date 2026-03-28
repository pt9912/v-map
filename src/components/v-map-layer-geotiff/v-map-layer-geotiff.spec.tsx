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
  VMapLayerHelper: vi.fn().mockImplementation(() => helperMock),
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
});
