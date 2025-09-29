import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerGoogle } from './v-map-layer-google';
//import { VMap } from '../v-map/v-map';
//import { VMapLayergroup } from '../v-map-layergroup/v-map-layergroup';

import '../../testing/fail-on-console-spec';

// Mock Google Maps API
const mockGoogleMapsApi = {
  google: {
    maps: {
      Map: jest.fn(),
      event: {
        addListenerOnce: jest.fn(),
      },
    },
  },
};

// Mock the loadGoogleMapsApi function
jest.mock('../../map-provider/leaflet/leaflet-helpers', () => ({
  loadGoogleMapsApi: jest.fn().mockResolvedValue(undefined),
  ensureGoogleMutantLoaded: jest.fn().mockResolvedValue(undefined),
  ensureGoogleLogo: jest.fn(),
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
    jest.clearAllMocks();
  });

  it('renders without props', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGoogle],
      html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
              <v-map-layergroup>
                <v-map-layer-google></v-map-layer-google>
              </v-map-layergroup>
              </v-map>
             `,
    });
    expect(page.root).toBeTruthy();
  });

  it('renders with api-key', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGoogle],
      html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
              <v-map-layergroup><v-map-layer-google api-key="${mockApiKey}"></v-map-layer-google>
              </v-map-layergroup>
      </v-map>`,
    });
    expect(page.root).toBeTruthy();
    expect(page.root?.getAttribute('api-key')).toBe(mockApiKey);
  });

  it('renders with all map types', async () => {
    const mapTypes = ['roadmap', 'satellite', 'terrain', 'hybrid'];

    for (const mapType of mapTypes) {
      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
              <v-map-layergroup><v-map-layer-google api-key="${mockApiKey}" map-type="${mapType}"></v-map-layer-google>
                </v-map-layergroup>
      </v-map>`,
      });
      expect(page.root).toBeTruthy();
      expect(page.root?.getAttribute('map-type')).toBe(mapType);
    }
  });

  it('renders with complex attributes', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGoogle],
      html: `
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>      
        <v-map-layer-google
          api-key="${mockApiKey}"
          map-type="roadmap"
          opacity="0.8"
          max-zoom="18"
          language="de"
          region="DE">
        </v-map-layer-google>
        </v-map-layergroup>
      </v-map>        
      `,
    });
    expect(page.root).toBeTruthy();
    expect(page.root?.getAttribute('api-key')).toBe(mockApiKey);
    expect(page.root?.getAttribute('map-type')).toBe('roadmap');
    expect(page.root?.getAttribute('opacity')).toBe('0.8');
    expect(page.root?.getAttribute('max-zoom')).toBe('18');
    expect(page.root?.getAttribute('language')).toBe('de');
    expect(page.root?.getAttribute('region')).toBe('DE');
  });

  it('handles optional properties', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGoogle],
      html: `
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>      
        <v-map-layer-google
          api-key="${mockApiKey}"
          map-type="satellite"
          max-zoom="18"
          scale="scaleFactor2x"
          language="de"
          region="DE"
          opacity="0.5"
          visible="false">
        </v-map-layer-google>
        </v-map-layergroup>
      </v-map>        
      `,
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.getAttribute('max-zoom')).toBe('18');
    expect(page.root?.getAttribute('scale')).toBe('scaleFactor2x');
    expect(page.root?.getAttribute('language')).toBe('de');
    expect(page.root?.getAttribute('region')).toBe('DE');
    expect(page.root?.getAttribute('opacity')).toBe('0.5');
    expect(page.root?.getAttribute('visible')).toBe('false');
  });

  it('validates required api-key property', async () => {
    // This test checks that the component handles missing API key gracefully
    const page = await newSpecPage({
      components: [VMapLayerGoogle],
      html: `      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup><v-map-layer-google map-type="roadmap"></v-map-layer-google>
                </v-map-layergroup>
      </v-map>`,
    });

    expect(page.root).toBeTruthy();
    // The component should render but may not function without API key
    expect(page.root?.getAttribute('api-key')).toBeNull();
  });

  it('supports all Google Maps scale factors', async () => {
    const scaleFactors = ['scaleFactor1x', 'scaleFactor2x', 'scaleFactor4x'];

    for (const scale of scaleFactors) {
      const page = await newSpecPage({
        components: [VMapLayerGoogle],
        html: `      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup><v-map-layer-google api-key="${mockApiKey}" scale="${scale}"></v-map-layer-google>
                </v-map-layergroup>
      </v-map>`,
      });
      expect(page.root?.getAttribute('scale')).toBe(scale);
    }
  });

  it('handles styles attribute', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGoogle],
      html: `      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup><v-map-layer-google api-key="${mockApiKey}" styles='[{"featureType":"water","stylers":[{"color":"#blue"}]}]'></v-map-layer-google>
                </v-map-layergroup>
      </v-map>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.getAttribute('styles')).toContain('water');
  });

  it('handles libraries attribute', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGoogle],
      html: `<v-map-layer-google api-key="${mockApiKey}" libraries="geometry,places"></v-map-layer-google>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.getAttribute('libraries')).toBe('geometry,places');
  });
});
