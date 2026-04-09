import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const { helperMock } = vi.hoisted(() => {
  const helperMock = {
    initLayer: vi.fn((factory?: () => unknown) => { if (typeof factory === "function") factory(); }),
    removeLayer: vi.fn(),
    updateLayer: vi.fn(),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
    getLayerId: vi.fn().mockReturnValue('google-layer-id'),
    startLoading: vi.fn(),
    dispose: vi.fn(),
    setError: vi.fn(),
    clearError: vi.fn(),
    getError: vi.fn().mockReturnValue(undefined),
    markReady: vi.fn(),
    markUpdated: vi.fn(),
    recreateLayer: vi.fn(),
  };
  return { helperMock };
});

vi.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: vi.fn().mockImplementation(function () { return helperMock; }),
}));

// Mock the loadGoogleMapsApi function
vi.mock('../../map-provider/leaflet/leaflet-helpers', () => ({
  loadGoogleMapsApi: vi.fn().mockResolvedValue(undefined),
  ensureGoogleMutantLoaded: vi.fn().mockResolvedValue(undefined),
  ensureGoogleLogo: vi.fn(),
}));

import { VMapLayerGoogle } from './v-map-layer-google';

describe('<v-map-layer-google>', () => {
  const mockApiKey = 'test-mock-api-key-123';

  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without props', () => {
    const component = new (VMapLayerGoogle as any)();
    expect(component.mapType).toBe('roadmap');
    expect(component.visible).toBe(true);
    expect(component.opacity).toBe(1);
    expect(VMapLayerGoogle.prototype.render.call(component)).toBeUndefined();
  });

  it('renders with api-key', () => {
    const component = new (VMapLayerGoogle as any)();
    component.apiKey = mockApiKey;
    expect(component.apiKey).toBe(mockApiKey);
  });

  it('renders with all map types', () => {
    const mapTypes = ['roadmap', 'satellite', 'terrain', 'hybrid'];
    for (const mapType of mapTypes) {
      const component = new (VMapLayerGoogle as any)();
      component.apiKey = mockApiKey;
      component.mapType = mapType;
      expect(component.mapType).toBe(mapType);
    }
  });

  it('renders with complex attributes', () => {
    const component = new (VMapLayerGoogle as any)();
    component.apiKey = mockApiKey;
    component.mapType = 'roadmap';
    component.opacity = 0.8;
    component.maxZoom = 18;
    component.language = 'de';
    component.region = 'DE';

    expect(component.apiKey).toBe(mockApiKey);
    expect(component.mapType).toBe('roadmap');
    expect(component.opacity).toBe(0.8);
    expect(component.maxZoom).toBe(18);
    expect(component.language).toBe('de');
    expect(component.region).toBe('DE');
  });

  it('handles optional properties', () => {
    const component = new (VMapLayerGoogle as any)();
    component.apiKey = mockApiKey;
    component.mapType = 'satellite';
    component.maxZoom = 18;
    component.scale = 'scaleFactor2x';
    component.language = 'de';
    component.region = 'DE';
    component.opacity = 0.5;
    component.visible = false;

    expect(component.maxZoom).toBe(18);
    expect(component.scale).toBe('scaleFactor2x');
    expect(component.language).toBe('de');
    expect(component.region).toBe('DE');
    expect(component.opacity).toBe(0.5);
    expect(component.visible).toBe(false);
  });

  it('validates required api-key property', () => {
    const component = new (VMapLayerGoogle as any)();
    component.mapType = 'roadmap';
    expect(component.apiKey).toBeUndefined();
  });

  it('supports all Google Maps scale factors', () => {
    const scaleFactors = ['scaleFactor1x', 'scaleFactor2x', 'scaleFactor4x'];
    for (const scale of scaleFactors) {
      const component = new (VMapLayerGoogle as any)();
      component.apiKey = mockApiKey;
      component.scale = scale;
      expect(component.scale).toBe(scale);
    }
  });

  it('handles styles attribute', async () => {
    const component = {
      helper: helperMock,
      styles: '[{"featureType":"water","stylers":[{"color":"#blue"}]}]',
      hasLoadedOnce: false,
      parseStyles: VMapLayerGoogle.prototype.parseStyles,
    } as any;

    await VMapLayerGoogle.prototype.connectedCallback.call(component);

    expect(component.styles).toEqual([
      { featureType: 'water', stylers: [{ color: '#blue' }] },
    ]);
  });

  it('handles libraries attribute', () => {
    const component = new (VMapLayerGoogle as any)();
    component.apiKey = mockApiKey;
    component.libraries = 'geometry,places';
    expect(component.libraries).toBe('geometry,places');
  });

  it('creates the expected layer config and emits ready on load', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-google'),
      mapType: 'roadmap',
      apiKey: mockApiKey,
      language: 'de',
      region: 'DE',
      visible: true,
      opacity: 0.8,
      scale: 'scaleFactor2x',
      maxZoom: 18,
      styles: undefined,
      libraries: 'geometry',
      hasLoadedOnce: false,
      ready: { emit: vi.fn() },
      createLayerConfig: VMapLayerGoogle.prototype['createLayerConfig'],
    } as any;
    component.el.id = 'google1';

    await VMapLayerGoogle.prototype.componentDidLoad.call(component);

    expect(helperMock.startLoading).toHaveBeenCalled();
    expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'google1');
    expect(component.createLayerConfig.call(component)).toEqual({
      type: 'google',
      apiKey: mockApiKey,
      mapType: 'roadmap',
      language: 'de',
      region: 'DE',
      visible: true,
      opacity: 0.8,
      scale: 'scaleFactor2x',
      maxZoom: 18,
      styles: undefined,
      libraries: ['geometry'],
    });
    expect(component.hasLoadedOnce).toBe(true);
    expect(component.ready.emit).toHaveBeenCalledTimes(1);
  });

  it('disposes layer on disconnect', async () => {
    await VMapLayerGoogle.prototype.disconnectedCallback.call({ helper: helperMock });
    expect(helperMock.dispose).toHaveBeenCalledTimes(1);
  });

  describe('prototype-based source coverage', () => {
    it('componentWillLoad creates a VMapLayerHelper', async () => {
      const el = document.createElement('v-map-layer-google');
      const component = { el } as any;
      await VMapLayerGoogle.prototype.componentWillLoad.call(component);
      expect(component.helper).toBeDefined();
    });

    it('connectedCallback runs without error when styles is undefined', async () => {
      const component = {
        helper: helperMock,
        styles: undefined,
        hasLoadedOnce: false,
        parseStyles: VMapLayerGoogle.prototype.parseStyles,
      } as any;

      await expect(
        VMapLayerGoogle.prototype.connectedCallback.call(component),
      ).resolves.toBeUndefined();
    });

    it('connectedCallback parses string styles on initial load', async () => {
      const stylesJson = '[{"featureType":"water","stylers":[{"color":"#0000ff"}]}]';
      const component = {
        helper: helperMock,
        styles: stylesJson,
        hasLoadedOnce: false,
        parseStyles: VMapLayerGoogle.prototype.parseStyles,
      } as any;

      await VMapLayerGoogle.prototype.connectedCallback.call(component);

      expect(component.styles).toEqual([{ featureType: 'water', stylers: [{ color: '#0000ff' }] }]);
    });

    it('connectedCallback re-initializes when hasLoadedOnce is true', async () => {
      const component = {
        hasLoadedOnce: true,
        helper: helperMock,
        el: document.createElement('v-map-layer-google'),
        styles: undefined,
        mapType: 'roadmap',
        visible: true,
        opacity: 1,
        parseStyles: VMapLayerGoogle.prototype.parseStyles,
        createLayerConfig: VMapLayerGoogle.prototype['createLayerConfig'],
      } as any;
      component.el.id = 'google2';

      await VMapLayerGoogle.prototype.connectedCallback.call(component);

      expect(helperMock.startLoading).toHaveBeenCalled();
      expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'google2');
    });

    it('parseStyles converts a JSON string to an array', () => {
      const component = { helper: helperMock, styles: undefined as any } as any;
      VMapLayerGoogle.prototype.parseStyles.call(component, '[{"featureType":"road"}]');
      expect(component.styles).toEqual([{ featureType: 'road' }]);
    });

    it('parseStyles calls helper.setError on invalid JSON string', () => {
      const component = { helper: helperMock, styles: undefined as any } as any;
      VMapLayerGoogle.prototype.parseStyles.call(component, 'not valid json');
      expect(helperMock.setError).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'parse', attribute: 'styles' }),
      );
    });

    it('parseStyles does nothing when value is already an array', () => {
      const component = { helper: helperMock, styles: undefined as any } as any;
      VMapLayerGoogle.prototype.parseStyles.call(component, [{ featureType: 'water' }] as any);
      expect(component.styles).toBeUndefined();
    });

    it('render returns undefined', () => {
      const result = VMapLayerGoogle.prototype.render.call({});
      expect(result).toBeUndefined();
    });

    it('disconnectedCallback handles undefined helper', async () => {
      const component = { helper: undefined } as any;
      await VMapLayerGoogle.prototype.disconnectedCallback.call(component);
    });
  });

  describe('Error-API', () => {
    it('initializes loadState as idle', () => {
      const component = new (VMapLayerGoogle as any)();
      expect(component.loadState).toBe('idle');
    });

    it('setLoadState updates loadState', () => {
      const component = new (VMapLayerGoogle as any)();
      VMapLayerGoogle.prototype.setLoadState.call(component, 'loading');
      expect(component.loadState).toBe('loading');
      VMapLayerGoogle.prototype.setLoadState.call(component, 'error');
      expect(component.loadState).toBe('error');
      VMapLayerGoogle.prototype.setLoadState.call(component, 'ready');
      expect(component.loadState).toBe('ready');
    });

    it('getError delegates to helper.getError', async () => {
      const errorDetail = { type: 'provider' as const, message: 'test error' };
      helperMock.getError.mockReturnValue(errorDetail);
      const component = { helper: helperMock } as any;
      const result = await VMapLayerGoogle.prototype.getError.call(component);
      expect(result).toEqual(errorDetail);
    });

    it('componentDidLoad calls startLoading before initLayer', async () => {
      const callOrder: string[] = [];
      helperMock.startLoading.mockImplementation(() => { callOrder.push('startLoading'); });
      helperMock.initLayer.mockImplementation(() => { callOrder.push('initLayer'); });

      const component = {
        helper: helperMock,
        el: document.createElement('v-map-layer-google'),
        mapType: 'roadmap',
        visible: true,
        opacity: 1,
        didLoad: false,
        hasLoadedOnce: false,
        ready: { emit: vi.fn() },
        createLayerConfig: VMapLayerGoogle.prototype['createLayerConfig'],
      } as any;

      await VMapLayerGoogle.prototype.componentDidLoad.call(component);

      expect(callOrder[0]).toBe('startLoading');
      expect(callOrder[1]).toBe('initLayer');
    });

    it('parseStyles sets parse error on invalid JSON via helper', () => {
      const component = { helper: helperMock, styles: undefined as any } as any;
      VMapLayerGoogle.prototype.parseStyles.call(component, '{invalid json}');
      expect(helperMock.setError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'parse',
          message: 'Invalid JSON in styles attribute',
          attribute: 'styles',
        }),
      );
    });
  });
});
