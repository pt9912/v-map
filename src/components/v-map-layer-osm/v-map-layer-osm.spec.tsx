const helperMock = {
  initLayer: jest.fn(),
  removeLayer: jest.fn(),
  updateLayer: jest.fn(),
  setVisible: jest.fn(),
  setOpacity: jest.fn(),
  setZIndex: jest.fn(),
  getLayerId: jest.fn().mockReturnValue('osm-layer-id'),
};

jest.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: jest.fn().mockImplementation(() => helperMock),
}));

import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerOSM } from './v-map-layer-osm';

describe('v-map-layer-osm', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as jest.Mock).mockClear();
      }
    });
    helperMock.getLayerId.mockReturnValue('osm-layer-id');
  });

  it('renders with default attributes', async () => {
    const page = await newSpecPage({
      components: [VMapLayerOSM],
      html: `<v-map-layer-osm></v-map-layer-osm>`,
    });

    expect(page.root).toEqualHtml(`
      <v-map-layer-osm opacity="1" url="https://tile.openstreetmap.org" visible="" z-index="10">
        <mock:shadow-root></mock:shadow-root>
      </v-map-layer-osm>
    `);
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
      ready: { emit: jest.fn() },
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

  it('proxies getLayerId and removes the layer on disconnect', async () => {
    const component = { helper: helperMock } as any;

    expect(await VMapLayerOSM.prototype.getLayerId.call(component)).toBe(
      'osm-layer-id',
    );

    await VMapLayerOSM.prototype.disconnectedCallback.call(component);

    expect(helperMock.removeLayer).toHaveBeenCalledTimes(1);
  });
});
