const helperMock = {
  initLayer: jest.fn(),
  removeLayer: jest.fn(),
  updateLayer: jest.fn(),
  setVisible: jest.fn(),
  setOpacity: jest.fn(),
  setZIndex: jest.fn(),
  getLayerId: jest.fn().mockReturnValue('geotiff-layer-id'),
};

jest.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: jest.fn().mockImplementation(() => helperMock),
}));

import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerGeoTIFF } from './v-map-layer-geotiff';

describe('v-map-layer-geotiff', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as jest.Mock).mockClear();
      }
    });
    helperMock.getLayerId.mockReturnValue('geotiff-layer-id');
  });

  it('renders and builds a layer config from props', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGeoTIFF],
      html: `<v-map-layer-geotiff
        id="dem"
        url="https://example.com/dem.tif"
        opacity="0.6"
        z-index="5"
        nodata="255"
      ></v-map-layer-geotiff>`,
    });

    expect((page.rootInstance as any).createLayerConfig()).toEqual({
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
    });

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
    });
    await VMapLayerGeoTIFF.prototype['handleStyleReady'].call(component, {
      detail: {
        style: {
          foo: 'bar',
        },
        layerIds: ['dem'],
      },
    });

    expect(component.opacity).toBe(1);
    expect(component.extractRasterSymbolizer.call(component, {
      name: 'No raster',
      rules: [{ symbolizers: [{ kind: 'Mark' }] }],
    })).toBeNull();
  });
});
