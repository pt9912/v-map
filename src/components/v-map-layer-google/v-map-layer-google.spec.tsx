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
});
