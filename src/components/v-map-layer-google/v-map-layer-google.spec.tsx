import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import '../../testing/fail-on-console-spec';

// Mock Google Maps API
const { mockGoogleMapsApi } = vi.hoisted(() => {
  const mockGoogleMapsApi = {
    google: {
      maps: {
        Map: vi.fn(),
        event: {
          addListenerOnce: vi.fn(),
        },
      },
    },
  };
  return { mockGoogleMapsApi };
});

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
    // Setup window.google mock
    (global as any).window = Object.create(window);
    Object.defineProperty(window, 'google', {
      value: mockGoogleMapsApi.google,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without props', async () => {
    const component = new (VMapLayerGoogle as any)();

    expect(component.mapType).toBe('roadmap');
    expect(component.visible).toBe(true);
    expect(component.opacity).toBe(1);
    expect(VMapLayerGoogle.prototype.render.call(component)).toBeUndefined();
  });

  it('renders with api-key', async () => {
    const component = new (VMapLayerGoogle as any)();
    component.apiKey = mockApiKey;

    expect(component.apiKey).toBe(mockApiKey);
  });

  it('renders with all map types', async () => {
    const mapTypes = ['roadmap', 'satellite', 'terrain', 'hybrid'];

    for (const mapType of mapTypes) {
      const component = new (VMapLayerGoogle as any)();
      component.apiKey = mockApiKey;
      component.mapType = mapType;

      expect(component.mapType).toBe(mapType);
    }
  });

  it('renders with complex attributes', async () => {
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

  it('handles optional properties', async () => {
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

  it('validates required api-key property', async () => {
    const component = new (VMapLayerGoogle as any)();
    component.mapType = 'roadmap';

    expect(component.apiKey).toBeUndefined();
  });

  it('supports all Google Maps scale factors', async () => {
    const scaleFactors = ['scaleFactor1x', 'scaleFactor2x', 'scaleFactor4x'];

    for (const scale of scaleFactors) {
      const component = new (VMapLayerGoogle as any)();
      component.apiKey = mockApiKey;
      component.scale = scale;

      expect(component.scale).toBe(scale);
    }
  });

  it('handles styles attribute', async () => {
    const component = new (VMapLayerGoogle as any)();
    component.apiKey = mockApiKey;
    component.styles = '[{"featureType":"water","stylers":[{"color":"#blue"}]}]';

    await VMapLayerGoogle.prototype.connectedCallback.call(component);

    expect(component.styles).toEqual([
      { featureType: 'water', stylers: [{ color: '#blue' }] },
    ]);
  });

  it('handles libraries attribute', async () => {
    const component = new (VMapLayerGoogle as any)();
    component.apiKey = mockApiKey;
    component.libraries = 'geometry,places';

    expect(component.libraries).toBe('geometry,places');
  });

  describe('prototype-based source coverage', () => {
    it('componentDidLoad emits ready event', async () => {
      const component = {
        el: document.createElement('v-map-layer-google'),
        mapType: 'roadmap',
        visible: true,
        opacity: 1,
        ready: { emit: vi.fn() },
      } as any;

      await VMapLayerGoogle.prototype.componentDidLoad.call(component);

      expect(component.ready.emit).toHaveBeenCalledTimes(1);
    });

    it('connectedCallback runs without error when styles is undefined', async () => {
      const component = {
        el: document.createElement('v-map-layer-google'),
        styles: undefined,
        autoApply: true,
        parseStyles: VMapLayerGoogle.prototype.parseStyles,
      } as any;

      await expect(
        VMapLayerGoogle.prototype.connectedCallback.call(component),
      ).resolves.toBeUndefined();
    });

    it('connectedCallback parses string styles on initial load', async () => {
      const stylesJson = '[{"featureType":"water","stylers":[{"color":"#0000ff"}]}]';
      const component = {
        el: document.createElement('v-map-layer-google'),
        styles: stylesJson,
        parseStyles: VMapLayerGoogle.prototype.parseStyles,
      } as any;

      await VMapLayerGoogle.prototype.connectedCallback.call(component);

      // After parsing, styles should be the parsed array
      expect(component.styles).toEqual([{ featureType: 'water', stylers: [{ color: '#0000ff' }] }]);
    });

    it('parseStyles converts a JSON string to an array', () => {
      const component = {
        styles: undefined as any,
      } as any;

      const stylesJson = '[{"featureType":"road"}]';
      VMapLayerGoogle.prototype.parseStyles.call(component, stylesJson);

      expect(component.styles).toEqual([{ featureType: 'road' }]);
    });

    it('parseStyles warns on invalid JSON string', () => {
      const component = {
        styles: undefined as any,
      } as any;

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      VMapLayerGoogle.prototype.parseStyles.call(component, 'not valid json');

      expect(warnSpy).toHaveBeenCalledWith(
        'Invalid JSON in styles attribute:',
        expect.any(Error),
      );

      warnSpy.mockRestore();
    });

    it('parseStyles does nothing when value is already an array', () => {
      const component = {
        styles: undefined as any,
      } as any;

      const arrayStyles = [{ featureType: 'water' }];
      VMapLayerGoogle.prototype.parseStyles.call(component, arrayStyles as any);

      // styles should remain undefined since non-string values skip the parsing branch
      expect(component.styles).toBeUndefined();
    });

    it('render returns undefined', () => {
      const component = {} as any;
      const result = VMapLayerGoogle.prototype.render.call(component);
      expect(result).toBeUndefined();
    });

    it('has correct default property values', () => {
      const component = new (VMapLayerGoogle as any)();
      expect(component.visible).toBe(true);
      expect(component.opacity).toBe(1.0);
      expect(component.mapType).toBe('roadmap');
    });
  });
});
