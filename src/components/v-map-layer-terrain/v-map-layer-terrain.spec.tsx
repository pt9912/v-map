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
  VMapLayerHelper: vi.fn().mockImplementation(() => helperMock),
}));

import { VMapLayerTerrain } from './v-map-layer-terrain';

describe('<v-map-layer-terrain>', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
  });

  it('renders default markup', async () => {
    const component = new (VMapLayerTerrain as any)();
    component.elevationData = 'https://example.com/height.png';

    expect(component.elevationData).toBe('https://example.com/height.png');
    expect(component.visible).toBe(true);
    expect(component.opacity).toBe(1);
    expect(component.zIndex).toBe(1000);
    expect(VMapLayerTerrain.prototype.render.call(component)).toBeTruthy();
  });

  it('initializes layer and sets didLoad on componentDidLoad', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-terrain'),
      didLoad: false,
      elevationData: 'https://example.com/height.png',
      texture: undefined,
      elevationDecoder: undefined,
      wireframe: undefined,
      color: undefined,
      minZoom: undefined,
      maxZoom: undefined,
      meshMaxError: undefined,
      opacity: 1,
      visible: true,
      zIndex: 1000,
      createLayerConfig: VMapLayerTerrain.prototype['createLayerConfig'],
      getElevationDecoder: VMapLayerTerrain.prototype['getElevationDecoder'],
      getColorArray: VMapLayerTerrain.prototype['getColorArray'],
    } as any;
    component.el.id = 'terrain1';

    await VMapLayerTerrain.prototype.componentDidLoad.call(component);

    expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'terrain1');
    expect(component.didLoad).toBe(true);
  });

  it('isReady returns didLoad state', async () => {
    expect(await VMapLayerTerrain.prototype.isReady.call({ didLoad: false })).toBe(false);
    expect(await VMapLayerTerrain.prototype.isReady.call({ didLoad: true })).toBe(true);
  });

  it('skips watcher calls before didLoad', async () => {
    const ctx = { didLoad: false, helper: helperMock, visible: false, opacity: 0.5, zIndex: 5 };
    await VMapLayerTerrain.prototype.onVisibleChanged.call(ctx);
    await VMapLayerTerrain.prototype.onOpacityChanged.call(ctx);
    await VMapLayerTerrain.prototype.onZIndexChanged.call(ctx);
    await VMapLayerTerrain.prototype.onTerrainConfigChanged.call(ctx);

    expect(helperMock.setVisible).not.toHaveBeenCalled();
    expect(helperMock.setOpacity).not.toHaveBeenCalled();
    expect(helperMock.setZIndex).not.toHaveBeenCalled();
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('updates helper via watchers after didLoad', async () => {
    await VMapLayerTerrain.prototype.onVisibleChanged.call({
      didLoad: true, visible: false, helper: helperMock,
    });
    await VMapLayerTerrain.prototype.onOpacityChanged.call({
      didLoad: true, opacity: 0.6, helper: helperMock,
    });
    await VMapLayerTerrain.prototype.onZIndexChanged.call({
      didLoad: true, zIndex: 55, helper: helperMock,
    });

    expect(helperMock.setVisible).toHaveBeenCalledWith(false);
    expect(helperMock.setOpacity).toHaveBeenCalledWith(0.6);
    expect(helperMock.setZIndex).toHaveBeenCalledWith(55);
  });

  it('pushes terrain update on config change after didLoad', async () => {
    const component = {
      didLoad: true,
      helper: helperMock,
      elevationData: 'https://example.com/height.png',
      texture: 'https://example.com/tex.jpg',
      elevationDecoder: '{"r":1,"g":256,"b":65536,"offset":0}',
      wireframe: false,
      color: '#ff0000',
      minZoom: 2,
      maxZoom: 14,
      meshMaxError: 4,
      opacity: 0.8,
      visible: true,
      zIndex: 1000,
      pushTerrainUpdate: VMapLayerTerrain.prototype['pushTerrainUpdate'],
      getElevationDecoder: VMapLayerTerrain.prototype['getElevationDecoder'],
      getColorArray: VMapLayerTerrain.prototype['getColorArray'],
    } as any;

    await VMapLayerTerrain.prototype.onTerrainConfigChanged.call(component);

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'terrain',
      data: expect.objectContaining({
        type: 'terrain',
        elevationData: 'https://example.com/height.png',
        texture: 'https://example.com/tex.jpg',
        elevationDecoder: { r: 1, g: 256, b: 65536, offset: 0 },
        wireframe: false,
        color: [255, 0, 0],
        minZoom: 2,
        maxZoom: 14,
        meshMaxError: 4,
      }),
    });
  });

  // ========== getColorArray tests ==========

  it('parses color hex into rgb array', () => {
    const component = { color: '#336699' } as any;
    expect(VMapLayerTerrain.prototype['getColorArray'].call(component)).toEqual([51, 102, 153]);
  });

  it('parses short hex into rgb array', () => {
    const component = { color: '#f0a' } as any;
    expect(VMapLayerTerrain.prototype['getColorArray'].call(component)).toEqual([255, 0, 170]);
  });

  it('parses comma-separated color string', () => {
    const component = { color: '128, 64, 32' } as any;
    expect(VMapLayerTerrain.prototype['getColorArray'].call(component)).toEqual([128, 64, 32]);
  });

  it('parses JSON array color', () => {
    const component = { color: '[10,20,30]' } as any;
    expect(VMapLayerTerrain.prototype['getColorArray'].call(component)).toEqual([10, 20, 30]);
  });

  it('returns undefined for invalid JSON array color', () => {
    const component = { color: '[bad]' } as any;
    expect(VMapLayerTerrain.prototype['getColorArray'].call(component)).toBeUndefined();
  });

  it('returns undefined for JSON array with wrong length', () => {
    const component = { color: '[1,2]' } as any;
    expect(VMapLayerTerrain.prototype['getColorArray'].call(component)).toBeUndefined();
  });

  it('returns undefined for JSON array with non-numbers', () => {
    const component = { color: '["a","b","c"]' } as any;
    expect(VMapLayerTerrain.prototype['getColorArray'].call(component)).toBeUndefined();
  });

  it('returns undefined for undefined color', () => {
    const component = { color: undefined } as any;
    expect(VMapLayerTerrain.prototype['getColorArray'].call(component)).toBeUndefined();
  });

  it('returns undefined for empty color string', () => {
    const component = { color: '   ' } as any;
    expect(VMapLayerTerrain.prototype['getColorArray'].call(component)).toBeUndefined();
  });

  it('returns undefined for unsupported color format', () => {
    const component = { color: 'rgb(255,0,0)' } as any;
    expect(VMapLayerTerrain.prototype['getColorArray'].call(component)).toBeUndefined();
  });

  // ========== getElevationDecoder tests ==========

  it('parses valid elevation decoder JSON', () => {
    const component = { elevationDecoder: '{"r":1,"g":256,"b":65536,"offset":0}' } as any;
    expect(VMapLayerTerrain.prototype['getElevationDecoder'].call(component)).toEqual({
      r: 1, g: 256, b: 65536, offset: 0,
    });
  });

  it('returns undefined for undefined elevationDecoder', () => {
    const component = { elevationDecoder: undefined } as any;
    expect(VMapLayerTerrain.prototype['getElevationDecoder'].call(component)).toBeUndefined();
  });

  it('returns undefined for invalid elevationDecoder JSON', () => {
    const component = { elevationDecoder: '{bad' } as any;
    expect(VMapLayerTerrain.prototype['getElevationDecoder'].call(component)).toBeUndefined();
  });

  it('returns undefined for elevationDecoder missing required keys', () => {
    const component = { elevationDecoder: '{"r":1,"g":2}' } as any;
    expect(VMapLayerTerrain.prototype['getElevationDecoder'].call(component)).toBeUndefined();
  });

  // ========== createLayerConfig tests ==========

  it('creates complete layer config', () => {
    const component = {
      elevationData: 'https://example.com/terrain',
      texture: 'https://example.com/texture.jpg',
      elevationDecoder: '{"r":1,"g":256,"b":65536,"offset":0}',
      wireframe: true,
      color: '100,200,50',
      minZoom: 0,
      maxZoom: 18,
      meshMaxError: 8,
      opacity: 0.9,
      visible: true,
      zIndex: 2000,
      getElevationDecoder: VMapLayerTerrain.prototype['getElevationDecoder'],
      getColorArray: VMapLayerTerrain.prototype['getColorArray'],
    } as any;

    const config = VMapLayerTerrain.prototype['createLayerConfig'].call(component);

    expect(config).toEqual({
      type: 'terrain',
      elevationData: 'https://example.com/terrain',
      texture: 'https://example.com/texture.jpg',
      elevationDecoder: { r: 1, g: 256, b: 65536, offset: 0 },
      wireframe: true,
      color: [100, 200, 50],
      minZoom: 0,
      maxZoom: 18,
      meshMaxError: 8,
      opacity: 0.9,
      visible: true,
      zIndex: 2000,
    });
  });

  it('removes layer on disconnect', async () => {
    await VMapLayerTerrain.prototype.disconnectedCallback.call({ helper: helperMock });
    expect(helperMock.removeLayer).toHaveBeenCalledTimes(1);
  });
});
