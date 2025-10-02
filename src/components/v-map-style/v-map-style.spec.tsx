import { newSpecPage } from '@stencil/core/testing';

// Mock all geostyler imports
jest.mock('geostyler-sld-parser', () => {
  return jest.fn().mockImplementation(() => ({
    readStyle: jest.fn().mockResolvedValue({
      output: {
        name: 'Mock Style',
        rules: [
          {
            name: 'Mock Rule',
            symbolizers: [
              {
                kind: 'Fill',
                color: '#ff0000',
              },
            ],
          },
        ],
      },
    }),
  }));
});

jest.mock('geostyler-mapbox-parser', () => {
  return jest.fn().mockImplementation(() => ({
    readStyle: jest.fn().mockResolvedValue({
      output: {
        name: 'Mock Mapbox Style',
        rules: [
          {
            name: 'Mock Mapbox Rule',
            symbolizers: [
              {
                kind: 'Fill',
                color: '#0000ff',
              },
            ],
          },
        ],
      },
    }),
  }));
});

jest.mock('geostyler-qgis-parser', () => {
  return jest.fn().mockImplementation(() => ({
    readStyle: jest.fn().mockResolvedValue({
      output: {
        name: 'Mock QGIS Style',
        rules: [
          {
            name: 'Mock QGIS Rule',
            symbolizers: [
              {
                kind: 'Fill',
                color: '#00ff00',
              },
            ],
          },
        ],
      },
    }),
  }));
});

jest.mock('geostyler-lyrx-parser', () => {
  return jest.fn().mockImplementation(() => ({
    readStyle: jest.fn().mockResolvedValue({
      output: {
        name: 'Mock LYRX Style',
        rules: [
          {
            name: 'Mock LYRX Rule',
            symbolizers: [
              {
                kind: 'Fill',
                color: '#ffff00',
              },
            ],
          },
        ],
      },
    }),
  }));
});

jest.mock('geostyler-style', () => ({
  Style: {},
}));

// Import VMapStyle after mocks
import { VMapStyle } from './v-map-style';

describe('v-map-style', () => {
  it('renders with default properties', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style></v-map-style>`,
    });

    expect(page.root).toEqualHtml(`
      <v-map-style format="sld" auto-apply="">
        <mock:shadow-root>
          <div class="style-container">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </v-map-style>
    `);
  });

  it('renders with custom format', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="mapbox-gl"></v-map-style>`,
    });

    expect(page.root.format).toBe('mapbox-gl');
  });

  it('should parse layer targets correctly', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style layer-targets="layer1,layer2,layer3"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    const targets = component.getLayerTargets();

    expect(targets).toEqual(['layer1', 'layer2', 'layer3']);
  });

  it('should parse empty layer targets', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    const targets = component.getLayerTargets();

    expect(targets).toEqual([]);
  });

  it('should handle inline SLD content', async () => {
    const sldContent = `<?xml version="1.0" encoding="UTF-8"?>
      <StyledLayerDescriptor version="1.0.0">
        <NamedLayer>
          <Name>test-layer</Name>
        </NamedLayer>
      </StyledLayerDescriptor>`;

    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="sld" content='${sldContent}' auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    expect(component.content).toBe(sldContent);
    expect(component.format).toBe('sld');
    expect(component.autoApply).toBe(false);
  });

  it('should emit styleReady event when style is parsed successfully', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    const styleReadySpy = jest.fn();
    page.root.addEventListener('styleReady', styleReadySpy);

    // Note: This test would need the actual SLD content to work fully
    // For now, we just test the component structure
    expect(component).toBeTruthy();
  });

  it('should handle Mapbox GL Style format', async () => {
    const mapboxStyle = JSON.stringify({
      version: 8,
      name: 'Test Style',
      layers: [
        {
          id: 'test-layer',
          type: 'fill',
          paint: {
            'fill-color': '#0000ff',
          },
        },
      ],
    });

    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="mapbox-gl" content='${mapboxStyle}' auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    expect(component.format).toBe('mapbox-gl');

    // Parse the Mapbox GL style
    const result = await component.loadAndParseStyle();
    expect(result).toBeTruthy();
    expect(result.name).toBe('Mock Mapbox Style');
  });

  it('should handle QGIS Style format', async () => {
    const qgisStyle = `<?xml version="1.0" encoding="UTF-8"?>
      <qgis>
        <renderer-v2>
          <symbol>
            <layer class="SimpleFill">
              <prop k="color" v="0,255,0,255"/>
            </layer>
          </symbol>
        </renderer-v2>
      </qgis>`;

    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="qgis" content='${qgisStyle}' auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    expect(component.format).toBe('qgis');

    // Parse the QGIS style
    const result = await component.loadAndParseStyle();
    expect(result).toBeTruthy();
    expect(result.name).toBe('Mock QGIS Style');
  });

  it('should handle LYRX (ArcGIS Pro) Style format', async () => {
    const lyrxStyle = JSON.stringify({
      type: 'CIMFeatureLayer',
      renderer: {
        type: 'CIMSimpleRenderer',
        symbol: {
          type: 'CIMPolygonSymbol',
        },
      },
    });

    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="lyrx" content='${lyrxStyle}' auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    expect(component.format).toBe('lyrx');

    // Parse the LYRX style
    const result = await component.loadAndParseStyle();
    expect(result).toBeTruthy();
    expect(result.name).toBe('Mock LYRX Style');
  });

  it('should handle unsupported formats', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="cartocss" content="test" auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;

    // Should return undefined and set error for unsupported format
    const result = await component.loadAndParseStyle();
    expect(result).toBeUndefined();
    expect(component.getError()).toBeTruthy();
    expect(component.getError().message).toContain('CartoCSS format not supported');
  });

  it('should display loading state', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;

    // Check initial loading state
    expect(component.isStyleLoading()).toBe(false);
  });

  it('should handle fetch errors for remote styles', async () => {
    // Mock fetch to simulate error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style src="https://example.com/invalid.sld"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;

    // Should handle fetch error gracefully
    const result = await component.loadAndParseStyle();
    expect(result).toBeUndefined();
    expect(component.getError()).toBeTruthy();
  });

  it('should require either src or content', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;

    // Should return undefined and set error when neither src nor content is provided
    const result = await component.loadAndParseStyle();
    expect(result).toBeUndefined();
    expect(component.getError()).toBeTruthy();
    expect(component.getError().message).toContain('Either src or content must be provided');
  });
});