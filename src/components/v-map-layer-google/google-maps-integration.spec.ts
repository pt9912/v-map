import { vi } from 'vitest';
import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerGoogle } from './v-map-layer-google';

// Mock Google Maps API for all providers
const mockGoogleMapsApi = {
  google: {
    maps: {
      Map: vi.fn().mockImplementation(() => ({
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        setMapTypeId: vi.fn(),
      })),
      event: {
        addListenerOnce: vi.fn((_map, _event, callback) => {
          setTimeout(callback, 100);
        }),
      },
      MapTypeId: {
        ROADMAP: 'roadmap',
        SATELLITE: 'satellite',
        TERRAIN: 'terrain',
        HYBRID: 'hybrid',
      },
    },
  },
};

// Mock provider-specific Google Maps helpers
vi.mock('../../map-provider/leaflet/leaflet-helpers', () => ({
  loadGoogleMapsApi: vi.fn().mockResolvedValue(undefined),
  ensureGoogleMutantLoaded: vi.fn().mockResolvedValue(undefined),
  ensureGoogleLogo: vi.fn(),
  ensureLeafletCss: vi.fn().mockReturnValue(document.createElement('style')),
  removeInjectedCss: vi.fn(),
}));

describe('Google Maps Integration Tests', () => {
  const mockApiKey = 'integration-test-api-key-789';

  beforeEach(() => {
    // Setup window.google mock
    (global as any).window = Object.create(window);
    Object.defineProperty(window, 'google', {
      value: mockGoogleMapsApi.google,
      writable: true,
    });

    // Mock fetch for Static Maps API calls
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () =>
        Promise.resolve(new Blob(['mock-image'], { type: 'image/png' })),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Google Maps Layer Component', () => {
    const mapTypes = ['roadmap', 'satellite', 'terrain', 'hybrid'];

    mapTypes.forEach(mapType => {
      it(`should render Google ${mapType} layer`, async () => {
        const page = await newSpecPage({
          components: [VMapLayerGoogle],
          html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="${mapType}"
              opacity="1">
            </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
          `,
        });

        expect(page.root).toBeTruthy();
        expect(page.root?.getAttribute('api-key')).toBe(mockApiKey);
        expect(page.root?.getAttribute('map-type')).toBe(mapType);
        expect(page.root?.getAttribute('opacity')).toBe('1');
      });
    });

    it('should handle custom styles', async () => {
      const styles = [
        {
          featureType: 'water',
          stylers: [{ color: '#0099cc' }],
        },
        {
          featureType: 'landscape',
          stylers: [{ color: '#f2f2f2' }],
        },
      ];

      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-google
            api-key="${mockApiKey}"
            map-type="roadmap"
            styles='${JSON.stringify(styles)}'>
          </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
        `,
      });

      const googleLayer = page.root;
      expect(googleLayer?.getAttribute('styles')).toContain('water');
    });

    it('should handle language and region settings', async () => {
      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-google
            api-key="${mockApiKey}"
            map-type="roadmap"
            language="de"
            region="DE">
          </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
        `,
      });

      const googleLayer = page.root;
      expect(googleLayer?.getAttribute('language')).toBe('de');
      expect(googleLayer?.getAttribute('region')).toBe('DE');
    });

    it('should handle scale factors', async () => {
      const scaleFactors = ['scaleFactor1x', 'scaleFactor2x', 'scaleFactor4x'];

      for (const scale of scaleFactors) {
        const page = await newSpecPage({
          components: [VMapLayerGoogle],
          html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              scale="${scale}">
            </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
          `,
        });

        const googleLayer = page.root;
        expect(googleLayer?.getAttribute('scale')).toBe(scale);
      }
    });

    it('should handle libraries parameter', async () => {
      const libraries = 'geometry,places,drawing';

      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-google
            api-key="${mockApiKey}"
            map-type="roadmap"
            libraries="${libraries}">
          </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
        `,
      });

      const googleLayer = page.root;
      expect(googleLayer?.getAttribute('libraries')).toBe(libraries);
    });

    it('should handle max-zoom setting', async () => {
      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-google
            api-key="${mockApiKey}"
            map-type="roadmap"
            max-zoom="15">
          </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
        `,
      });

      const googleLayer = page.root;
      expect(googleLayer?.getAttribute('max-zoom')).toBe('15');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing API key gracefully', async () => {
      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-google map-type="roadmap">
          </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
        `,
      });

      const googleLayer = page.root;
      expect(googleLayer).toBeTruthy();
      expect(googleLayer?.getAttribute('api-key')).toBeNull();
    });

    it('should handle invalid map types gracefully', async () => {
      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-google
            api-key="${mockApiKey}"
            map-type="invalid-type">
          </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
        `,
      });

      const googleLayer = page.root;
      expect(googleLayer).toBeTruthy();
      expect(googleLayer?.getAttribute('map-type')).toBe('invalid-type');
      // Provider should handle invalid types gracefully (likely falling back to roadmap)
    });

    it('should handle network errors gracefully', async () => {
      // Mock network failure for Static Maps API
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-google
            api-key="${mockApiKey}"
            map-type="roadmap">
          </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
        `,
      });

      const googleLayer = page.root;
      expect(googleLayer).toBeTruthy();
      // Component should render even if network requests fail
    });
  });

  describe('Dynamic Property Updates', () => {
    it('should handle property changes', async () => {
      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-google
            id="dynamic-layer"
            api-key="${mockApiKey}"
            map-type="roadmap"
            opacity="0.5"
          </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
        `,
      });

      const googleLayer = page.root;
      expect(googleLayer).toBeTruthy();

      // Simulate property changes
      googleLayer?.setAttribute('map-type', 'satellite');
      googleLayer?.setAttribute('opacity', '0.8');
      googleLayer?.setAttribute('visible', 'false');

      await page.waitForChanges();

      expect(googleLayer?.getAttribute('map-type')).toBe('satellite');
      expect(googleLayer?.getAttribute('opacity')).toBe('0.8');
      expect(googleLayer?.getAttribute('visible')).toBe('false');
    });

    it('should handle API key updates', async () => {
      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-google
            id="test-layer"
            api-key="${mockApiKey}"
            map-type="roadmap">
          </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
        `,
      });

      const googleLayer = page.root;
      expect(googleLayer?.getAttribute('api-key')).toBe(mockApiKey);

      // Update API key
      const newApiKey = 'new-test-api-key-456';
      googleLayer?.setAttribute('api-key', newApiKey);
      await page.waitForChanges();

      expect(googleLayer?.getAttribute('api-key')).toBe(newApiKey);
    });
  });

  describe('Attribute Validation', () => {
    it('should preserve all valid attributes', async () => {
      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-google
            api-key="${mockApiKey}"
            map-type="hybrid"
            max-zoom="18"
            scale="scaleFactor2x"
            language="fr"
            region="FR"
            opacity="0.7"
            visible="false"
            libraries="geometry,places"
            styles='[{"featureType":"road"}]'>
          </v-map-layer-google></v-map-layer-google>
                </v-map-layergroup>
        `,
      });

      const googleLayer = page.root;
      expect(googleLayer?.getAttribute('api-key')).toBe(mockApiKey);
      expect(googleLayer?.getAttribute('map-type')).toBe('hybrid');
      expect(googleLayer?.getAttribute('max-zoom')).toBe('18');
      expect(googleLayer?.getAttribute('scale')).toBe('scaleFactor2x');
      expect(googleLayer?.getAttribute('language')).toBe('fr');
      expect(googleLayer?.getAttribute('region')).toBe('FR');
      expect(googleLayer?.getAttribute('opacity')).toBe('0.7');
      expect(googleLayer?.getAttribute('visible')).toBe('false');
      expect(googleLayer?.getAttribute('libraries')).toBe('geometry,places');
      expect(googleLayer?.getAttribute('styles')).toContain('road');
    });
  });
});
