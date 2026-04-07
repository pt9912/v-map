import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';

/* ------------------------------------------------------------------ */
/*  vi.hoisted mocks                                                   */
/* ------------------------------------------------------------------ */
const {
  mockCesium,
} = vi.hoisted(() => {
  const hoistedMockUrlTemplateImageryProvider = vi
    .fn()
    .mockImplementation(function(options: any) { return { ...options }; });

  const hoistedMockOpenStreetMapImageryProvider = vi
    .fn()
    .mockImplementation(function(options: any) { return { ...options }; });

  const hoistedMockWebMapServiceImageryProvider = vi
    .fn()
    .mockImplementation(function(options: any) { return { ...options }; });

  const hoistedMockImageryLayer = vi
    .fn()
    .mockImplementation(function(_provider: any, options: any) { return {
      options,
      setOptions: vi.fn(),
      setOpacity: vi.fn(),
      setVisible: vi.fn(),
      setZIndex: vi.fn(),
      getOptions: vi.fn().mockReturnValue(options ?? {}),
    }; });

  const mockFromCssColorString = vi.fn().mockImplementation((css: string) => ({
    _css: css,
    withAlpha: vi.fn().mockImplementation((a: number) => ({
      _css: css,
      _alpha: a,
    })),
  }));

  const hoistedMockCesium = {
    Viewer: vi.fn().mockImplementation(function() { return {
      scene: {
        imageryLayers: { add: vi.fn(), remove: vi.fn() },
        primitives: { removeAll: vi.fn() },
        backgroundColor: null,
        globe: {
          baseColor: null,
          depthTestAgainstTerrain: false,
          show: true,
          translucency: null,
        },
      },
      container: document.createElement('div'),
      destroy: vi.fn(),
      terrainProvider: {},
      clock: { currentTime: 0 },
    }; }),
    UrlTemplateImageryProvider: hoistedMockUrlTemplateImageryProvider,
    OpenStreetMapImageryProvider: hoistedMockOpenStreetMapImageryProvider,
    WebMapServiceImageryProvider: hoistedMockWebMapServiceImageryProvider,
    ImageryLayer: hoistedMockImageryLayer,
    GeoJsonDataSource: {
      load: vi.fn().mockResolvedValue({ entities: { values: [] } }),
    },
    GlobeTranslucency: vi.fn().mockImplementation(function() { return {
      enabled: false,
      frontFaceAlpha: 1,
    }; }),
    CesiumTerrainProvider: {
      fromUrl: vi.fn().mockResolvedValue({ _type: 'CesiumTerrainProvider' }),
    },
    createWorldTerrainAsync: vi.fn().mockResolvedValue({ _type: 'WorldTerrain' }),
    Cesium3DTileset: {
      fromUrl: vi.fn().mockResolvedValue({ style: null }),
    },
    Cesium3DTileStyle: vi.fn().mockImplementation(function(s: unknown) { return { _style: s }; }),
    ConstantProperty: vi.fn().mockImplementation(function(v: unknown) { return { _value: v }; }),
    ColorMaterialProperty: vi.fn().mockImplementation(function(c: unknown) { return { _color: c }; }),
    NearFarScalar: vi.fn().mockImplementation(function(a: number, b: number, c: number, d: number) { return { near: a, nearValue: b, far: c, farValue: d }; }),
    Cartesian2: Object.assign(
      vi.fn().mockImplementation(function(x: number, y: number) { return { x, y }; }),
      { ZERO: { x: 0, y: 0 } },
    ),
    HeightReference: {
      CLAMP_TO_GROUND: 'CLAMP_TO_GROUND',
      RELATIVE_TO_GROUND: 'RELATIVE_TO_GROUND',
    },
    Color: {
      WHITE: { withAlpha: vi.fn().mockReturnValue({ _name: 'WHITE' }) },
      BLUE: { withAlpha: vi.fn().mockReturnValue({ _name: 'BLUE_ALPHA' }) },
      BLACK: { withAlpha: vi.fn().mockReturnValue({ _name: 'BLACK' }) },
      fromCssColorString: mockFromCssColorString,
    },
    BillboardGraphics: vi.fn(),
    LabelGraphics: vi.fn(),
    VerticalOrigin: { BOTTOM: 0 },
    ClassificationType: { BOTH: 0 },
    Cartesian3: { fromDegrees: vi.fn().mockReturnValue({ x: 0, y: 0, z: 0 }) },
    Math: {
      toDegrees: vi.fn((rad: number) => rad * (180 / Math.PI)),
      toRadians: vi.fn((deg: number) => deg * (Math.PI / 180)),
    },
    EllipsoidTerrainProvider: vi.fn(),
    GeographicTilingScheme: vi.fn().mockImplementation(function() { return {}; }),
    WebMercatorTilingScheme: vi.fn().mockImplementation(function() { return {}; }),
    Resource: vi.fn().mockImplementation(function(opts: any) { return { ...opts }; }),
    SingleTileImageryProvider: vi.fn().mockImplementation(function() { return {}; }),
    Rectangle: { fromDegrees: vi.fn().mockReturnValue({}) },
    ArcGisMapServerImageryProvider: {
      fromUrl: vi.fn().mockResolvedValue({ _type: 'ArcGIS' }),
    },
  };

  return {
    mockUrlTemplateImageryProvider: hoistedMockUrlTemplateImageryProvider,
    mockOpenStreetMapImageryProvider: hoistedMockOpenStreetMapImageryProvider,
    mockWebMapServiceImageryProvider: hoistedMockWebMapServiceImageryProvider,
    mockImageryLayer: hoistedMockImageryLayer,
    mockCesium: hoistedMockCesium,
  };
});

vi.mock('../../lib/cesium-loader', () => ({
  loadCesium: vi.fn().mockResolvedValue(mockCesium),
  injectWidgetsCss: vi.fn().mockResolvedValue(undefined),
}));

import { CesiumProvider } from './cesium-provider';

/* ------------------------------------------------------------------ */
/*  Test suite                                                         */
/* ------------------------------------------------------------------ */
describe('CesiumProvider – onLayerError / offLayerError', () => {
  let provider: CesiumProvider;

  const mockWrapper = {
    setOptions: vi.fn(),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn().mockResolvedValue(undefined),
    getOptions: vi.fn().mockReturnValue({}),
    getVisible: vi.fn().mockReturnValue(true),
    getOpacity: vi.fn().mockReturnValue(1),
    remove: vi.fn(),
  };

  beforeAll(() => {
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue('test-layer-id'),
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new CesiumProvider();
    (provider as any).Cesium = mockCesium;
    (global as any).Cesium = mockCesium;
    (provider as any).viewer = mockCesium.Viewer();
    (provider as any).layerManager = {
      addLayer: vi.fn().mockReturnValue(mockWrapper),
      addCustomLayer: vi.fn().mockReturnValue(mockWrapper),
      replaceLayer: vi.fn().mockReturnValue(mockWrapper),
      removeLayer: vi.fn(),
      getLayer: vi.fn().mockReturnValue(mockWrapper),
      setOpacity: vi.fn(),
      setVisible: vi.fn(),
      setZIndex: vi.fn(),
    };
    (provider as any).layerGroups = {
      addLayerToGroup: vi.fn().mockReturnValue('test-layer-id'),
      removeLayer: vi.fn(),
      setBasemap: vi.fn(),
      setGroupVisible: vi.fn(),
      setVisible: vi.fn(),
      setOpacity: vi.fn(),
      ensureGroup: vi.fn(),
      apply: vi.fn(),
    };
  });

  /* ================================================================ */
  /*  onLayerError                                                     */
  /* ================================================================ */
  describe('onLayerError', () => {
    it('stores callback in layerErrorCallbacks', () => {
      const callback = vi.fn();

      provider.onLayerError('layer-1', callback);

      expect((provider as any).layerErrorCallbacks.get('layer-1')).toBe(callback);
    });

    it('calls attachCesiumErrorListeners', () => {
      const spy = vi.spyOn(provider as any, 'attachCesiumErrorListeners');
      const callback = vi.fn();

      provider.onLayerError('layer-1', callback);

      expect(spy).toHaveBeenCalledWith('layer-1');
    });

    it('attaches errorEvent listener for imagery layers', () => {
      const unsubscribe = vi.fn();
      const errorEvent = { addEventListener: vi.fn().mockReturnValue(unsubscribe) };

      (provider as any).layerManager.getLayer.mockReturnValue({
        _imageryLayer: {
          imageryProvider: { errorEvent },
        },
      });

      const callback = vi.fn();
      provider.onLayerError('layer-1', callback);

      expect(errorEvent.addEventListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('errorEvent handler invokes the stored callback', () => {
      const unsubscribe = vi.fn();
      let capturedHandler: () => void;
      const errorEvent = {
        addEventListener: vi.fn().mockImplementation((handler: () => void) => {
          capturedHandler = handler;
          return unsubscribe;
        }),
      };

      (provider as any).layerManager.getLayer.mockReturnValue({
        _imageryLayer: {
          imageryProvider: { errorEvent },
        },
      });

      const callback = vi.fn();
      provider.onLayerError('layer-1', callback);

      // Fire the error handler
      capturedHandler!();

      expect(callback).toHaveBeenCalledWith({
        type: 'network',
        message: 'Tile load error',
      });
    });

    it('attaches tileFailed listener for 3D tilesets', () => {
      const unsubscribe = vi.fn();
      const tileFailed = { addEventListener: vi.fn().mockReturnValue(unsubscribe) };

      (provider as any).layerManager.getLayer.mockReturnValue({
        _tileset: { tileFailed },
      });

      const callback = vi.fn();
      provider.onLayerError('layer-1', callback);

      expect(tileFailed.addEventListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('tileFailed handler invokes the stored callback', () => {
      const unsubscribe = vi.fn();
      let capturedHandler: () => void;
      const tileFailed = {
        addEventListener: vi.fn().mockImplementation((handler: () => void) => {
          capturedHandler = handler;
          return unsubscribe;
        }),
      };

      (provider as any).layerManager.getLayer.mockReturnValue({
        _tileset: { tileFailed },
      });

      const callback = vi.fn();
      provider.onLayerError('layer-1', callback);

      capturedHandler!();

      expect(callback).toHaveBeenCalledWith({
        type: 'network',
        message: 'Tile load error',
      });
    });

    it('does not attach listeners when layer is not found', () => {
      (provider as any).layerManager.getLayer.mockReturnValue(null);

      const callback = vi.fn();
      provider.onLayerError('missing-layer', callback);

      // Callback should be stored even though no listeners were attached
      expect((provider as any).layerErrorCallbacks.get('missing-layer')).toBe(callback);
      // No cleanups registered
      expect((provider as any).layerErrorCleanups.has('missing-layer')).toBe(false);
    });
  });

  /* ================================================================ */
  /*  offLayerError                                                    */
  /* ================================================================ */
  describe('offLayerError', () => {
    it('invokes cleanup and removes callback and cleanup maps', () => {
      const cleanup = vi.fn();
      (provider as any).layerErrorCallbacks.set('layer-1', vi.fn());
      (provider as any).layerErrorCleanups.set('layer-1', cleanup);

      provider.offLayerError('layer-1');

      expect(cleanup).toHaveBeenCalledTimes(1);
      expect((provider as any).layerErrorCallbacks.has('layer-1')).toBe(false);
      expect((provider as any).layerErrorCleanups.has('layer-1')).toBe(false);
    });

    it('cleanup calls unsubscribe for errorEvent listeners', () => {
      const unsubscribe = vi.fn();
      const errorEvent = { addEventListener: vi.fn().mockReturnValue(unsubscribe) };

      (provider as any).layerManager.getLayer.mockReturnValue({
        _imageryLayer: {
          imageryProvider: { errorEvent },
        },
      });

      const callback = vi.fn();
      provider.onLayerError('layer-1', callback);

      // Now off should call unsubscribe
      provider.offLayerError('layer-1');

      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('cleanup calls unsubscribe for tileFailed listeners', () => {
      const unsubscribe = vi.fn();
      const tileFailed = { addEventListener: vi.fn().mockReturnValue(unsubscribe) };

      (provider as any).layerManager.getLayer.mockReturnValue({
        _tileset: { tileFailed },
      });

      const callback = vi.fn();
      provider.onLayerError('layer-1', callback);

      provider.offLayerError('layer-1');

      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('calling offLayerError twice does not throw', () => {
      (provider as any).layerErrorCallbacks.set('layer-1', vi.fn());
      (provider as any).layerErrorCleanups.set('layer-1', vi.fn());

      provider.offLayerError('layer-1');
      expect(() => provider.offLayerError('layer-1')).not.toThrow();
    });

    it('does not throw for non-existent layer', () => {
      expect(() => provider.offLayerError('nonexistent')).not.toThrow();
    });
  });

  /* ================================================================ */
  /*  removeLayer calls offLayerError                                  */
  /* ================================================================ */
  describe('removeLayer calls offLayerError', () => {
    it('cleans up error listeners when a layer is removed', async () => {
      const cleanup = vi.fn();
      (provider as any).layerErrorCallbacks.set('test-layer-id', vi.fn());
      (provider as any).layerErrorCleanups.set('test-layer-id', cleanup);

      await provider.removeLayer('test-layer-id');

      expect(cleanup).toHaveBeenCalledTimes(1);
      expect((provider as any).layerErrorCallbacks.has('test-layer-id')).toBe(false);
    });
  });

  /* ================================================================ */
  /*  attachCesiumErrorListeners                                       */
  /* ================================================================ */
  describe('attachCesiumErrorListeners', () => {
    it('cleans up previous listeners before re-attaching', () => {
      const previousCleanup = vi.fn();
      (provider as any).layerErrorCallbacks.set('layer-1', vi.fn());
      (provider as any).layerErrorCleanups.set('layer-1', previousCleanup);

      const unsubscribe = vi.fn();
      const errorEvent = { addEventListener: vi.fn().mockReturnValue(unsubscribe) };
      (provider as any).layerManager.getLayer.mockReturnValue({
        _imageryLayer: {
          imageryProvider: { errorEvent },
        },
      });

      (provider as any).attachCesiumErrorListeners('layer-1');

      expect(previousCleanup).toHaveBeenCalledTimes(1);
    });

    it('does nothing when no callback is registered', () => {
      // No callback set for 'layer-1'
      const getLayerSpy = (provider as any).layerManager.getLayer;

      (provider as any).attachCesiumErrorListeners('layer-1');

      expect(getLayerSpy).not.toHaveBeenCalled();
    });

    it('handles both errorEvent and tileFailed on the same layer', () => {
      const unsubError = vi.fn();
      const unsubTile = vi.fn();
      const errorEvent = { addEventListener: vi.fn().mockReturnValue(unsubError) };
      const tileFailed = { addEventListener: vi.fn().mockReturnValue(unsubTile) };

      (provider as any).layerManager.getLayer.mockReturnValue({
        _imageryLayer: {
          imageryProvider: { errorEvent },
        },
        _tileset: { tileFailed },
      });

      const callback = vi.fn();
      provider.onLayerError('layer-1', callback);

      expect(errorEvent.addEventListener).toHaveBeenCalled();
      expect(tileFailed.addEventListener).toHaveBeenCalled();

      // Cleanup should call both
      provider.offLayerError('layer-1');

      expect(unsubError).toHaveBeenCalledTimes(1);
      expect(unsubTile).toHaveBeenCalledTimes(1);
    });
  });

  /* ================================================================ */
  /*  updateLayer rebinds error listeners                              */
  /* ================================================================ */
  describe('updateLayer rebinds error listeners', () => {
    it('detaches old listeners and reattaches new ones after replacement', () => {
      // Simulate: onLayerError registered, then a layer replacement happens
      const oldUnsubscribe = vi.fn();
      const oldErrorEvent = { addEventListener: vi.fn().mockReturnValue(oldUnsubscribe) };

      (provider as any).layerManager.getLayer.mockReturnValue({
        _imageryLayer: { imageryProvider: { errorEvent: oldErrorEvent } },
      });

      const callback = vi.fn();
      provider.onLayerError('test-layer-id', callback);
      expect(oldErrorEvent.addEventListener).toHaveBeenCalledTimes(1);

      // Simulate the off/on cycle that updateLayer performs
      provider.offLayerError('test-layer-id');
      expect(oldUnsubscribe).toHaveBeenCalled();
      expect((provider as any).layerErrorCallbacks.has('test-layer-id')).toBe(false);

      // After replacement: new layer with fresh errorEvent
      const newUnsubscribe = vi.fn();
      const newErrorEvent = { addEventListener: vi.fn().mockReturnValue(newUnsubscribe) };
      (provider as any).layerManager.getLayer.mockReturnValue({
        _imageryLayer: { imageryProvider: { errorEvent: newErrorEvent } },
      });

      // Re-register (updateLayer does this via hadErrorListener check)
      provider.onLayerError('test-layer-id', callback);
      expect(newErrorEvent.addEventListener).toHaveBeenCalledTimes(1);
      expect((provider as any).layerErrorCallbacks.get('test-layer-id')).toBe(callback);
    });

    it('hadErrorListener flag in updateLayer drives the off/on cycle', async () => {
      const offSpy = vi.spyOn(provider, 'offLayerError');
      const attachSpy = vi.spyOn(provider as any, 'attachCesiumErrorListeners');

      // Register an error listener
      const callback = vi.fn();
      (provider as any).layerErrorCallbacks.set('test-layer-id', callback);

      // Call updateLayer with a no-op type (tile3d-style doesn't replace layers)
      await provider.updateLayer('test-layer-id', {
        type: 'tile3d-style',
        data: { style: {} },
      });

      // offLayerError was called because hadErrorListener was true
      expect(offSpy).toHaveBeenCalledWith('test-layer-id');
      // attachCesiumErrorListeners was called for rebind
      expect(attachSpy).toHaveBeenCalledWith('test-layer-id');
    });
  });
});
