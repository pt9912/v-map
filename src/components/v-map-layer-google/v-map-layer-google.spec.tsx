import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, h } from '@stencil/vitest';

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
    const { root } = await render(
      h('v-map', { flavour: 'ol', style: 'display:block;width:300px;height:200px' },
        h('v-map-layergroup', null,
          h('v-map-layer-google', null),
        ),
      ),
    );
    expect(root).toBeTruthy();
  });

  it('renders with api-key', async () => {
    const { root } = await render(
      h('v-map', { flavour: 'ol', style: 'display:block;width:300px;height:200px' },
        h('v-map-layergroup', null,
          h('v-map-layer-google', { 'api-key': mockApiKey }),
        ),
      ),
    );
    expect(root).toBeTruthy();
    const googleLayer = root?.querySelector('v-map-layer-google');
    expect(googleLayer?.getAttribute('api-key')).toBe(mockApiKey);
  });

  it('renders with all map types', async () => {
    const mapTypes = ['roadmap', 'satellite', 'terrain', 'hybrid'];

    for (const mapType of mapTypes) {
      const { root } = await render(
        h('v-map', { flavour: 'ol', style: 'display:block;width:300px;height:200px' },
          h('v-map-layergroup', null,
            h('v-map-layer-google', { 'api-key': mockApiKey, 'map-type': mapType }),
          ),
        ),
      );
      expect(root).toBeTruthy();
      const googleLayer = root?.querySelector('v-map-layer-google');
      expect(googleLayer?.getAttribute('map-type')).toBe(mapType);
    }
  });

  it('renders with complex attributes', async () => {
    const { root } = await render(
      h('v-map', { flavour: 'ol', style: 'display:block;width:300px;height:200px' },
        h('v-map-layergroup', null,
          h('v-map-layer-google', {
            'api-key': mockApiKey,
            'map-type': 'roadmap',
            opacity: '0.8',
            'max-zoom': '18',
            language: 'de',
            region: 'DE',
          }),
        ),
      ),
    );
    expect(root).toBeTruthy();
    const googleLayer = root?.querySelector('v-map-layer-google');
    expect(googleLayer?.getAttribute('api-key')).toBe(mockApiKey);
    expect(googleLayer?.getAttribute('map-type')).toBe('roadmap');
    expect(googleLayer?.getAttribute('opacity')).toBe('0.8');
    expect(googleLayer?.getAttribute('max-zoom')).toBe('18');
    expect(googleLayer?.getAttribute('language')).toBe('de');
    expect(googleLayer?.getAttribute('region')).toBe('DE');
  });

  it('handles optional properties', async () => {
    const { root } = await render(
      h('v-map', { flavour: 'ol', style: 'display:block;width:300px;height:200px' },
        h('v-map-layergroup', null,
          h('v-map-layer-google', {
            'api-key': mockApiKey,
            'map-type': 'satellite',
            'max-zoom': '18',
            scale: 'scaleFactor2x',
            language: 'de',
            region: 'DE',
            opacity: '0.5',
            visible: 'false',
          }),
        ),
      ),
    );

    expect(root).toBeTruthy();
    const googleLayer = root?.querySelector('v-map-layer-google');
    expect(googleLayer?.getAttribute('max-zoom')).toBe('18');
    expect(googleLayer?.getAttribute('scale')).toBe('scaleFactor2x');
    expect(googleLayer?.getAttribute('language')).toBe('de');
    expect(googleLayer?.getAttribute('region')).toBe('DE');
    expect(googleLayer?.getAttribute('opacity')).toBe('0.5');
    // visible="false" may not be reflected as attribute since Stencil treats it as boolean prop
    expect((googleLayer as any)?.visible).toBe(false);
  });

  it('validates required api-key property', async () => {
    // This test checks that the component handles missing API key gracefully
    const { root } = await render(
      h('v-map', { flavour: 'ol', style: 'display:block;width:300px;height:200px' },
        h('v-map-layergroup', null,
          h('v-map-layer-google', { 'map-type': 'roadmap' }),
        ),
      ),
    );

    expect(root).toBeTruthy();
    const googleLayer = root?.querySelector('v-map-layer-google');
    // The component should render but may not function without API key
    expect(googleLayer?.getAttribute('api-key')).toBeNull();
  });

  it('supports all Google Maps scale factors', async () => {
    const scaleFactors = ['scaleFactor1x', 'scaleFactor2x', 'scaleFactor4x'];

    for (const scale of scaleFactors) {
      const { root } = await render(
        h('v-map', { flavour: 'ol', style: 'display:block;width:300px;height:200px' },
          h('v-map-layergroup', null,
            h('v-map-layer-google', { 'api-key': mockApiKey, scale }),
          ),
        ),
      );
      const googleLayer = root?.querySelector('v-map-layer-google');
      expect(googleLayer?.getAttribute('scale')).toBe(scale);
    }
  });

  it('handles styles attribute', async () => {
    const { root } = await render(
      h('v-map', { flavour: 'ol', style: 'display:block;width:300px;height:200px' },
        h('v-map-layergroup', null,
          h('v-map-layer-google', {
            'api-key': mockApiKey,
            styles: '[{"featureType":"water","stylers":[{"color":"#blue"}]}]',
          }),
        ),
      ),
    );

    expect(root).toBeTruthy();
    const googleLayer = root?.querySelector('v-map-layer-google');
    // styles may be stored as a property rather than reflected as attribute
    const stylesVal = googleLayer?.getAttribute('styles') ?? JSON.stringify((googleLayer as any)?.styles);
    expect(stylesVal).toContain('water');
  });

  it('handles libraries attribute', async () => {
    const { root } = await render(
      h('v-map-layer-google', { 'api-key': mockApiKey, libraries: 'geometry,places' }),
    );

    expect(root).toBeTruthy();
    expect(root?.getAttribute('libraries')).toBe('geometry,places');
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
