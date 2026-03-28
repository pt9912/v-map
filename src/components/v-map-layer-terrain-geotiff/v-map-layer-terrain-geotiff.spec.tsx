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
    getLayerId: vi.fn(),
  };
  return { helperMock };
});

vi.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: vi.fn().mockImplementation(function () { return helperMock; }),
}));

import { VMapLayerTerrainGeotiff } from './v-map-layer-terrain-geotiff';

describe('v-map-layer-terrain-geotiff', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
  });

  it('renders default markup', async () => {
    const { root } = await render(
      h('v-map-layer-terrain-geotiff', { url: 'https://example.com/elevation.tif' }),
    );
    await expect(root).toEqualHtml(`
      <v-map-layer-terrain-geotiff class="hydrated">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </v-map-layer-terrain-geotiff>
    `);
  });

  it('accepts url property', async () => {
    const { root } = await render(
      h('v-map-layer-terrain-geotiff', { url: 'https://example.com/test.tif' }),
    );
    expect((root as any).url).toBe('https://example.com/test.tif');
  });

  it('accepts optional terrain properties', async () => {
    const { root } = await render(
      h('v-map-layer-terrain-geotiff', {
        url: 'https://example.com/elevation.tif',
        'mesh-max-error': '2.0',
        wireframe: 'true',
        'elevation-scale': '2.5',
      }),
    );
    expect((root as any).url).toBe('https://example.com/elevation.tif');
    expect((root as any).meshMaxError).toBe(2.0);
    expect((root as any).wireframe).toBe(true);
    expect((root as any).elevationScale).toBe(2.5);
  });

  it('accepts renderMode and includes it in the layer config', async () => {
    const { root } = await render(
      h('v-map-layer-terrain-geotiff', {
        url: 'https://example.com/elevation.tif',
        'render-mode': 'colormap',
      }),
    );

    expect((root as any).renderMode).toBe('colormap');
    expect(VMapLayerTerrainGeotiff.prototype['createLayerConfig'].call(root)).toEqual(
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

  /* ------------------------------------------------------------------ */
  /*  Prototype-based unit tests for source function coverage            */
  /* ------------------------------------------------------------------ */
  describe('prototype-based source coverage', () => {

    it('render returns a virtual DOM node', () => {
      const result = VMapLayerTerrainGeotiff.prototype.render.call({});
      expect(result).toBeTruthy();
    });

    it('componentWillRender runs without error', async () => {
      await VMapLayerTerrainGeotiff.prototype.componentWillRender.call({});
    });

    it('componentWillLoad creates a VMapLayerHelper', async () => {
      const el = document.createElement('v-map-layer-terrain-geotiff');
      const component = { el } as any;
      await VMapLayerTerrainGeotiff.prototype.componentWillLoad.call(component);
      expect(component.helper).toBeDefined();
    });

    it('componentDidLoad initializes layer and emits ready', async () => {
      const el = document.createElement('v-map-layer-terrain-geotiff');
      el.id = 'terrain-1';
      const readyEmit = vi.fn();
      const component = {
        el,
        helper: helperMock,
        didLoad: false,
        ready: { emit: readyEmit },
        url: 'https://example.com/elevation.tif',
        visible: true,
        zIndex: 100,
        opacity: 1,
        projection: null,
        forceProjection: false,
        nodata: null,
        meshMaxError: 4.0,
        wireframe: false,
        texture: null,
        color: null,
        colorMap: null,
        valueRange: null,
        elevationScale: 1.0,
        renderMode: 'terrain',
        minZoom: 0,
        maxZoom: 24,
        tileSize: 256,
        createLayerConfig: VMapLayerTerrainGeotiff.prototype['createLayerConfig'],
      } as any;

      await VMapLayerTerrainGeotiff.prototype.componentDidLoad.call(component);

      expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'terrain-1');
      expect(component.didLoad).toBe(true);
      expect(readyEmit).toHaveBeenCalledTimes(1);
    });

    it('connectedCallback runs without error', async () => {
      await VMapLayerTerrainGeotiff.prototype.connectedCallback.call({});
    });

    it('disconnectedCallback runs without error', () => {
      VMapLayerTerrainGeotiff.prototype.disconnectedCallback.call({});
    });

    it('createLayerConfig returns full terrain config', () => {
      const component = {
        url: 'https://example.com/dem.tif',
        visible: true,
        zIndex: 100,
        opacity: 0.9,
        projection: 'EPSG:4326',
        forceProjection: true,
        nodata: -9999,
        meshMaxError: 2.0,
        wireframe: true,
        texture: 'https://example.com/tex.png',
        color: [255, 0, 0],
        colorMap: 'viridis',
        valueRange: [0, 5000],
        elevationScale: 2.0,
        renderMode: 'colormap',
        minZoom: 1,
        maxZoom: 18,
        tileSize: 512,
      } as any;

      const config = VMapLayerTerrainGeotiff.prototype['createLayerConfig'].call(component);
      expect(config.type).toBe('terrain-geotiff');
      expect(config.projection).toBe('EPSG:4326');
      expect(config.meshMaxError).toBe(2.0);
    });

    it('onUrlChanged does nothing when helper is undefined', async () => {
      const component = {
        url: 'https://new.com/elevation.tif',
        helper: undefined,
        createLayerConfig: VMapLayerTerrainGeotiff.prototype['createLayerConfig'],
      } as any;

      await VMapLayerTerrainGeotiff.prototype.onUrlChanged.call(component);
      expect(helperMock.updateLayer).not.toHaveBeenCalled();
    });

    it('onVisibleChanged does nothing when helper is undefined', async () => {
      await VMapLayerTerrainGeotiff.prototype.onVisibleChanged.call({ visible: true, helper: undefined });
      expect(helperMock.setVisible).not.toHaveBeenCalled();
    });

    it('onOpacityChanged does nothing when helper is undefined', async () => {
      await VMapLayerTerrainGeotiff.prototype.onOpacityChanged.call({ opacity: 0.5, helper: undefined });
      expect(helperMock.setOpacity).not.toHaveBeenCalled();
    });

    it('onZIndexChanged does nothing when helper is undefined', async () => {
      await VMapLayerTerrainGeotiff.prototype.onZIndexChanged.call({ zIndex: 10, helper: undefined });
      expect(helperMock.setZIndex).not.toHaveBeenCalled();
    });
  });
});
