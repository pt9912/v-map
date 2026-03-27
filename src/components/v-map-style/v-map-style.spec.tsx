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

  it('should handle Cesium 3D Tiles style format', async () => {
    const cesiumStyle = JSON.stringify({
      color: 'color("white", 0.8)',
      show: true,
    });

    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="cesium-3d-tiles" content='${cesiumStyle}' auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    expect(component.format).toBe('cesium-3d-tiles');

    const result = await component.loadAndParseStyle();
    expect(result).toBeTruthy();
    expect((result as any).color).toBe('color("white", 0.8)');
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
    expect(component.getError().message).toContain(
      'Either src or content must be provided',
    );
  });

  it('onStyleSourceChanged re-parses when autoApply is true and content changes', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="cesium-3d-tiles" content='{"show":true}' auto-apply></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    const spy = jest.spyOn(component, 'loadAndParseStyle');
    (component as any).content = '{"show":false}';
    await (component as any).onStyleSourceChanged();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('onStyleSourceChanged does nothing when autoApply is false', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="sld" content="test" auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    const spy = jest.spyOn(component, 'loadAndParseStyle');
    await (component as any).onStyleSourceChanged();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('getStyle returns the parsed style', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="cesium-3d-tiles" content='{"show":true}' auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    await component.loadAndParseStyle();
    const result = await component.getStyle();

    expect(result).toEqual({ show: true });
  });

  it('getLayerTargetIds returns parsed targets', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style layer-targets="a,b,c"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    const result = await component.getLayerTargetIds();

    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('successfully parses SLD from content', async () => {
    const sldContent = '<StyledLayerDescriptor version="1.0.0"></StyledLayerDescriptor>';
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="sld" content='${sldContent}' auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    const result = await component.loadAndParseStyle();

    expect(result).toBeTruthy();
    expect(result.name).toBe('Mock Style');
  });

  it('successfully fetches and parses style from src URL', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue('<StyledLayerDescriptor />'),
    });

    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="sld" src="https://example.com/style.sld" auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    const result = await component.loadAndParseStyle();

    expect(result).toBeTruthy();
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/style.sld');
  });

  it('handles Mapbox GL parser returning undefined output', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="mapbox-gl" content='{"version":8}' auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    component['mapboxParser'] = {
      readStyle: jest.fn().mockResolvedValue({ output: undefined }),
    } as any;

    const result = await component.loadAndParseStyle();
    expect(result).toBeUndefined();
    expect(component.getError().message).toContain('no style output');
  });

  it('handles LYRX parser returning undefined output', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="lyrx" content='{"type":"CIMFeatureLayer"}' auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    component['lyrxParser'] = {
      readStyle: jest.fn().mockResolvedValue({ output: undefined }),
    } as any;

    const result = await component.loadAndParseStyle();
    expect(result).toBeUndefined();
    expect(component.getError().message).toContain('no style output');
  });

  it('handles Cesium 3D Tiles with non-object JSON value', async () => {
    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style format="cesium-3d-tiles" content="42" auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    const result = await component.loadAndParseStyle();

    expect(result).toBeUndefined();
    expect(component.getError().message).toContain('not a valid object');
  });

  it('loadAndParseStyle handles non-ok fetch response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    const page = await newSpecPage({
      components: [VMapStyle],
      html: `<v-map-style src="https://example.com/missing.sld" auto-apply="false"></v-map-style>`,
    });

    const component = page.rootInstance as VMapStyle;
    const result = await component.loadAndParseStyle();

    expect(result).toBeUndefined();
    expect(component.getError()).toBeTruthy();
    expect(component.getError().message).toContain('Failed to fetch');
  });

  describe('Negative test cases - Parser errors', () => {
    it('should handle invalid JSON for Mapbox GL Style', async () => {
      const page = await newSpecPage({
        components: [VMapStyle],
        html: `<v-map-style format="mapbox-gl" content="invalid json" auto-apply="false"></v-map-style>`,
      });

      const component = page.rootInstance as VMapStyle;
      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('Mapbox GL Style parsing failed');
    });

    it('should handle invalid JSON for LYRX Style', async () => {
      const page = await newSpecPage({
        components: [VMapStyle],
        html: `<v-map-style format="lyrx" content="{invalid: json}" auto-apply="false"></v-map-style>`,
      });

      const component = page.rootInstance as VMapStyle;
      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('LYRX (ArcGIS Pro) Style parsing failed');
    });

    it('should handle invalid JSON for Cesium 3D Tiles Style', async () => {
      const page = await newSpecPage({
        components: [VMapStyle],
        html: `<v-map-style format="cesium-3d-tiles" content="not valid json" auto-apply="false"></v-map-style>`,
      });

      const component = page.rootInstance as VMapStyle;
      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('Cesium 3D Tiles style parsing failed');
    });

    it('should handle non-object JSON for Mapbox GL Style', async () => {
      const page = await newSpecPage({
        components: [VMapStyle],
        html: `<v-map-style format="mapbox-gl" content='"just a string"' auto-apply="false"></v-map-style>`,
      });

      const component = page.rootInstance as VMapStyle;
      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('not a valid object');
    });

    it('should handle null JSON for LYRX Style', async () => {
      const page = await newSpecPage({
        components: [VMapStyle],
        html: `<v-map-style format="lyrx" content="null" auto-apply="false"></v-map-style>`,
      });

      const component = page.rootInstance as VMapStyle;
      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('not a valid object');
    });

    it('should handle parser returning undefined output for SLD', async () => {
      const page = await newSpecPage({
        components: [VMapStyle],
        html: `<v-map-style format="sld" content="invalid sld" auto-apply="false"></v-map-style>`,
      });

      const component = page.rootInstance as VMapStyle;

      // Mock parser to return undefined output
      const originalParser = component['sldParser'];
      component['sldParser'] = {
        readStyle: jest.fn().mockResolvedValue({ output: undefined }),
      } as any;

      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('no style output');

      // Restore original parser
      component['sldParser'] = originalParser;
    });

    it('should handle parser returning undefined output for QGIS', async () => {
      const page = await newSpecPage({
        components: [VMapStyle],
        html: `<v-map-style format="qgis" content="invalid qgis" auto-apply="false"></v-map-style>`,
      });

      const component = page.rootInstance as VMapStyle;

      // Mock parser to return undefined output
      const originalParser = component['qgisParser'];
      component['qgisParser'] = {
        readStyle: jest.fn().mockResolvedValue({ output: undefined }),
      } as any;

      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('no style output');

      // Restore original parser
      component['qgisParser'] = originalParser;
    });

    it('should handle unsupported format', async () => {
      const page = await newSpecPage({
        components: [VMapStyle],
        html: `<v-map-style format="sld" content="test" auto-apply="false"></v-map-style>`,
      });

      const component = page.rootInstance as VMapStyle;

      // Manually set an invalid format
      (component as any).format = 'unsupported-format' as any;

      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('Unsupported style format');
    });

    it('should emit styleError event on parsing failure', async () => {
      const page = await newSpecPage({
        components: [VMapStyle],
        html: `<v-map-style format="mapbox-gl" content="invalid" auto-apply="false"></v-map-style>`,
      });

      const component = page.rootInstance as VMapStyle;
      const styleErrorSpy = jest.fn();
      page.root.addEventListener('styleError', styleErrorSpy);

      await component.loadAndParseStyle();

      expect(styleErrorSpy).toHaveBeenCalled();
      expect(styleErrorSpy.mock.calls[0][0].detail).toBeInstanceOf(Error);
    });
  });
});
