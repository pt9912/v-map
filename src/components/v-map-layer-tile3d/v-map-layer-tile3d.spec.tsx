const helperMock = {
  initLayer: jest.fn(),
  removeLayer: jest.fn(),
  updateLayer: jest.fn(),
  setVisible: jest.fn(),
  setOpacity: jest.fn(),
  setZIndex: jest.fn(),
};

jest.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: jest.fn().mockImplementation(() => helperMock),
}));

import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerTile3d } from './v-map-layer-tile3d';

describe('v-map-layer-tile3d', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as jest.Mock).mockClear();
      }
    });
  });

  it('renders a slot and parses valid tileset options', async () => {
    const page = await newSpecPage({
      components: [VMapLayerTile3d],
      html: `<v-map-layer-tile3d url="https://example.com/tileset.json" tileset-options='{"maximumScreenSpaceError":8}'></v-map-layer-tile3d>`,
    });

    expect(page.root?.shadowRoot?.querySelector('slot')).not.toBeNull();
    expect(page.root?.getAttribute('tileset-options')).toBe(
      '{"maximumScreenSpaceError":8}',
    );
    expect((page.rootInstance as any).parseTilesetOptions()).toEqual({
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
});
