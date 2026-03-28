import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerTerrainGeotiff } from './v-map-layer-terrain-geotiff';

const helperMock = {
  initLayer: jest.fn(),
  removeLayer: jest.fn(),
  updateLayer: jest.fn(),
  setVisible: jest.fn(),
  setOpacity: jest.fn(),
  setZIndex: jest.fn(),
  getLayerId: jest.fn(),
};

jest.mock('../../layer/v-map-layer-helper', () => {
  return {
    VMapLayerHelper: jest.fn().mockImplementation(() => helperMock),
  };
});

describe('v-map-layer-terrain-geotiff', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as jest.Mock).mockClear();
      }
    });
  });

  it('renders default markup', async () => {
    const page = await newSpecPage({
      components: [VMapLayerTerrainGeotiff],
      html: `<v-map-layer-terrain-geotiff url="https://example.com/elevation.tif"></v-map-layer-terrain-geotiff>`,
    });
    expect(page.root).toEqualHtml(`
      <v-map-layer-terrain-geotiff url="https://example.com/elevation.tif">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </v-map-layer-terrain-geotiff>
    `);
  });

  it('accepts url property', async () => {
    const page = await newSpecPage({
      components: [VMapLayerTerrainGeotiff],
      html: `<v-map-layer-terrain-geotiff url="https://example.com/test.tif"></v-map-layer-terrain-geotiff>`,
    });
    expect(page.rootInstance.url).toBe('https://example.com/test.tif');
  });

  it('accepts optional terrain properties', async () => {
    const page = await newSpecPage({
      components: [VMapLayerTerrainGeotiff],
      html: `<v-map-layer-terrain-geotiff
        url="https://example.com/elevation.tif"
        mesh-max-error="2.0"
        wireframe="true"
        elevation-scale="2.5"
      ></v-map-layer-terrain-geotiff>`,
    });
    expect(page.rootInstance.url).toBe('https://example.com/elevation.tif');
    expect(page.rootInstance.meshMaxError).toBe(2.0);
    expect(page.rootInstance.wireframe).toBe(true);
    expect(page.rootInstance.elevationScale).toBe(2.5);
  });

  it('accepts renderMode and includes it in the layer config', async () => {
    const page = await newSpecPage({
      components: [VMapLayerTerrainGeotiff],
      html: `<v-map-layer-terrain-geotiff
        url="https://example.com/elevation.tif"
        render-mode="colormap"
      ></v-map-layer-terrain-geotiff>`,
    });

    expect(page.rootInstance.renderMode).toBe('colormap');
    expect((page.rootInstance as any).createLayerConfig()).toEqual(
      expect.objectContaining({
        renderMode: 'colormap',
      }),
    );
  });

  it('uses setVisible for visibility changes instead of updateLayer', async () => {
    await VMapLayerTerrainGeotiff.prototype.onVisibleChanged.call({
      visible: false,
      helper: helperMock,
    });

    expect(helperMock.setVisible).toHaveBeenCalledWith(false);
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('onUrlChanged triggers updateLayer with full config', async () => {
    const component = {
      url: 'https://new.com/elevation.tif',
      helper: helperMock,
      createLayerConfig: VMapLayerTerrainGeotiff.prototype['createLayerConfig'],
      projection: undefined,
      forceProjection: undefined,
      nodata: undefined,
      meshMaxError: 4.0,
      wireframe: false,
      texture: undefined,
      color: undefined,
      colorMap: undefined,
      valueRange: undefined,
      elevationScale: 1,
      renderMode: undefined,
      minZoom: undefined,
      maxZoom: undefined,
      tileSize: undefined,
      visible: true,
      opacity: 1,
      zIndex: 1000,
    } as any;

    await VMapLayerTerrainGeotiff.prototype.onUrlChanged.call(component);
    expect(helperMock.updateLayer).toHaveBeenCalledWith(expect.objectContaining({
      type: 'terrain-geotiff',
    }));
  });

  it('onOpacityChanged calls helper.setOpacity', async () => {
    await VMapLayerTerrainGeotiff.prototype.onOpacityChanged.call({
      opacity: 0.5,
      helper: helperMock,
    });
    expect(helperMock.setOpacity).toHaveBeenCalledWith(0.5);
  });

  it('onZIndexChanged calls helper.setZIndex', async () => {
    await VMapLayerTerrainGeotiff.prototype.onZIndexChanged.call({
      zIndex: 42,
      helper: helperMock,
    });
    expect(helperMock.setZIndex).toHaveBeenCalledWith(42);
  });

  it('onPropertyChanged triggers updateLayer for any watched property change', async () => {
    const component = {
      url: 'https://example.com/dem.tif',
      helper: helperMock,
      createLayerConfig: VMapLayerTerrainGeotiff.prototype['createLayerConfig'],
      projection: 'EPSG:4326',
      forceProjection: true,
      nodata: -9999,
      meshMaxError: 2.0,
      wireframe: true,
      texture: 'https://example.com/texture.png',
      color: '#ff0000',
      colorMap: 'viridis',
      valueRange: '0,100',
      elevationScale: 2.5,
      renderMode: 'colormap',
      minZoom: 1,
      maxZoom: 18,
      tileSize: 256,
      visible: true,
      opacity: 0.8,
      zIndex: 500,
    } as any;

    await VMapLayerTerrainGeotiff.prototype.onPropertyChanged.call(component);
    expect(helperMock.updateLayer).toHaveBeenCalledWith(expect.objectContaining({
      type: 'terrain-geotiff',
    }));
  });

  it('isReady reflects didLoad state', () => {
    expect(
      VMapLayerTerrainGeotiff.prototype.isReady.call({ didLoad: false }),
    ).toBe(false);
    expect(
      VMapLayerTerrainGeotiff.prototype.isReady.call({ didLoad: true }),
    ).toBe(true);
  });

  it('getLayerId delegates to helper', async () => {
    helperMock.getLayerId.mockReturnValue('geotiff-123');
    const component = { helper: helperMock } as any;
    expect(
      await VMapLayerTerrainGeotiff.prototype.getLayerId.call(component),
    ).toBe('geotiff-123');
  });

  it('onPropertyChanged does nothing when helper is undefined', async () => {
    const component = {
      helper: undefined,
      createLayerConfig: VMapLayerTerrainGeotiff.prototype['createLayerConfig'],
    } as any;

    // Should not throw
    await VMapLayerTerrainGeotiff.prototype.onPropertyChanged.call(component);
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });
});
