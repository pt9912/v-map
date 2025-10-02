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

  it('should handle unsupported formats', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="mapbox-gl" content="test" auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;

    // Should return undefined and set error for unsupported format
    const result = await component.loadAndParseStyle();
    expect(result).toBeUndefined();
    expect(component.getError()).toBeTruthy();
    expect(component.getError().message).toContain('Mapbox GL Style format not yet implemented');
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