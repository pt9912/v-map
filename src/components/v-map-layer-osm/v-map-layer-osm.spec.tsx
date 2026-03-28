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
    getLayerId: vi.fn().mockReturnValue('osm-layer-id'),
  };
  return { helperMock };
});

vi.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: vi.fn().mockImplementation(() => helperMock),
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
    const { root } = await render(
      <v-map-layer-osm></v-map-layer-osm>,
    );

    await expect(root).toEqualHtml(`
      <v-map-layer-osm visible opacity="1" z-index="10" url="https://tile.openstreetmap.org" class="hydrated">
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

  it('proxies getLayerId and removes the layer on disconnect', async () => {
    const component = { helper: helperMock } as any;

    expect(await VMapLayerOSM.prototype.getLayerId.call(component)).toBe(
      'osm-layer-id',
    );

    await VMapLayerOSM.prototype.disconnectedCallback.call(component);

    expect(helperMock.removeLayer).toHaveBeenCalledTimes(1);
  });
});
