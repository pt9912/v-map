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
  };
  return { helperMock };
});

vi.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: vi.fn().mockImplementation(() => helperMock),
}));

import { VMapLayerWcs } from './v-map-layer-wcs';

describe('<v-map-layer-wcs>', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
  });

  it('renders with defaults', async () => {
    const { root } = await render(
      h('v-map-layer-wcs', { url: 'https://example.com/wcs', 'coverage-name': 'DEM' }),
    );

    expect(root?.getAttribute('coverage-name')).toBe('DEM');
    expect(root?.getAttribute('url')).toBe('https://example.com/wcs');
    expect(root?.getAttribute('format')).toBe('image/tiff');
    expect(root?.getAttribute('version')).toBe('1.1.0');
    expect(root?.classList.contains('hydrated')).toBe(true);
  });

  it('initializes layer and sets didLoad on componentDidLoad', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-wcs'),
      didLoad: false,
      createLayerConfig: VMapLayerWcs.prototype['createLayerConfig'],
      url: 'https://example.com/wcs',
      coverageName: 'DEM',
      format: 'image/tiff',
      version: '1.1.0',
      projection: undefined,
      resolutions: undefined,
      params: undefined,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      parseParams: VMapLayerWcs.prototype['parseParams'],
      parseResolutions: VMapLayerWcs.prototype['parseResolutions'],
    } as any;
    component.el.id = 'wcs1';

    await VMapLayerWcs.prototype.componentDidLoad.call(component);

    expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'wcs1');
    expect(component.didLoad).toBe(true);
  });

  it('isReady returns didLoad state', async () => {
    expect(await VMapLayerWcs.prototype.isReady.call({ didLoad: false })).toBe(false);
    expect(await VMapLayerWcs.prototype.isReady.call({ didLoad: true })).toBe(true);
  });

  it('skips watcher calls before didLoad', async () => {
    const ctx = { didLoad: false, helper: helperMock, visible: false, opacity: 0.5, zIndex: 5 };
    await VMapLayerWcs.prototype.onVisibleChanged.call(ctx);
    await VMapLayerWcs.prototype.onOpacityChanged.call(ctx);
    await VMapLayerWcs.prototype.onZIndexChanged.call(ctx);
    await VMapLayerWcs.prototype.onSourceChanged.call(ctx);

    expect(helperMock.setVisible).not.toHaveBeenCalled();
    expect(helperMock.setOpacity).not.toHaveBeenCalled();
    expect(helperMock.setZIndex).not.toHaveBeenCalled();
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('updates helper via watchers after didLoad', async () => {
    await VMapLayerWcs.prototype.onVisibleChanged.call({
      didLoad: true, visible: false, helper: helperMock,
    });
    await VMapLayerWcs.prototype.onOpacityChanged.call({
      didLoad: true, opacity: 0.4, helper: helperMock,
    });
    await VMapLayerWcs.prototype.onZIndexChanged.call({
      didLoad: true, zIndex: 77, helper: helperMock,
    });

    expect(helperMock.setVisible).toHaveBeenCalledWith(false);
    expect(helperMock.setOpacity).toHaveBeenCalledWith(0.4);
    expect(helperMock.setZIndex).toHaveBeenCalledWith(77);
  });

  it('updates layer on source property change after didLoad', async () => {
    const component = {
      didLoad: true,
      helper: helperMock,
      url: 'https://new.com/wcs',
      coverageName: 'NewDEM',
      format: 'image/png',
      version: '2.0.1',
      projection: 'EPSG:4326',
      resolutions: '[1000,500]',
      params: '{"subset":"time=2024"}',
      visible: true,
      opacity: 1,
      zIndex: 1000,
      createLayerConfig: VMapLayerWcs.prototype['createLayerConfig'],
      parseParams: VMapLayerWcs.prototype['parseParams'],
      parseResolutions: VMapLayerWcs.prototype['parseResolutions'],
    } as any;

    await VMapLayerWcs.prototype.onSourceChanged.call(component);

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'wcs',
      data: expect.objectContaining({
        type: 'wcs',
        url: 'https://new.com/wcs',
        coverageName: 'NewDEM',
      }),
    });
  });

  it('parseParams returns parsed JSON object', () => {
    const result = VMapLayerWcs.prototype['parseParams'].call({ params: '{"key":"val"}' });
    expect(result).toEqual({ key: 'val' });
  });

  it('parseParams returns undefined for invalid JSON', () => {
    const result = VMapLayerWcs.prototype['parseParams'].call({ params: '{bad' });
    expect(result).toBeUndefined();
  });

  it('parseParams returns undefined when not set', () => {
    const result = VMapLayerWcs.prototype['parseParams'].call({ params: undefined });
    expect(result).toBeUndefined();
  });

  it('parseParams returns undefined for non-object JSON', () => {
    const result = VMapLayerWcs.prototype['parseParams'].call({ params: '42' });
    expect(result).toBeUndefined();
  });

  it('parseResolutions returns parsed array', () => {
    const result = VMapLayerWcs.prototype['parseResolutions'].call({ resolutions: '[1000,500,250]' });
    expect(result).toEqual([1000, 500, 250]);
  });

  it('parseResolutions returns undefined for invalid JSON', () => {
    const result = VMapLayerWcs.prototype['parseResolutions'].call({ resolutions: '[bad' });
    expect(result).toBeUndefined();
  });

  it('parseResolutions returns undefined when not set', () => {
    const result = VMapLayerWcs.prototype['parseResolutions'].call({ resolutions: undefined });
    expect(result).toBeUndefined();
  });

  it('parseResolutions returns undefined for non-number array', () => {
    const result = VMapLayerWcs.prototype['parseResolutions'].call({ resolutions: '["a","b"]' });
    expect(result).toBeUndefined();
  });

  it('parseResolutions returns undefined for non-array JSON', () => {
    const result = VMapLayerWcs.prototype['parseResolutions'].call({ resolutions: '{"key":1}' });
    expect(result).toBeUndefined();
  });

  it('creates layer config with all properties', () => {
    const component = {
      url: 'https://example.com/wcs',
      coverageName: 'DEM',
      format: 'image/tiff',
      version: '1.1.0',
      projection: 'EPSG:4326',
      resolutions: '[500,250]',
      params: '{"subset":"band=1"}',
      visible: true,
      opacity: 0.8,
      zIndex: 500,
      parseParams: VMapLayerWcs.prototype['parseParams'],
      parseResolutions: VMapLayerWcs.prototype['parseResolutions'],
    } as any;

    const config = VMapLayerWcs.prototype['createLayerConfig'].call(component);

    expect(config).toEqual({
      type: 'wcs',
      url: 'https://example.com/wcs',
      coverageName: 'DEM',
      format: 'image/tiff',
      version: '1.1.0',
      projection: 'EPSG:4326',
      resolutions: [500, 250],
      params: { subset: 'band=1' },
      visible: true,
      opacity: 0.8,
      zIndex: 500,
    });
  });

  it('removes layer on disconnect', async () => {
    await VMapLayerWcs.prototype.disconnectedCallback.call({ helper: helperMock });
    expect(helperMock.removeLayer).toHaveBeenCalledTimes(1);
  });
});
