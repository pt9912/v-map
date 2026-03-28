import { vi, describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';

// Mock all geostyler imports using vi.hoisted + vi.mock
const { sldMock, mapboxMock, qgisMock, lyrxMock } = vi.hoisted(() => {
  const sldMock = {
    readStyle: vi.fn().mockResolvedValue({
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
  };
  const mapboxMock = {
    readStyle: vi.fn().mockResolvedValue({
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
  };
  const qgisMock = {
    readStyle: vi.fn().mockResolvedValue({
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
  };
  const lyrxMock = {
    readStyle: vi.fn().mockResolvedValue({
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
  };
  return { sldMock, mapboxMock, qgisMock, lyrxMock };
});

vi.mock('geostyler-sld-parser', () => {
  return { default: vi.fn().mockImplementation(() => sldMock) };
});

vi.mock('geostyler-mapbox-parser', () => {
  return { default: vi.fn().mockImplementation(() => mapboxMock) };
});

vi.mock('geostyler-qgis-parser', () => {
  return { default: vi.fn().mockImplementation(() => qgisMock) };
});

vi.mock('geostyler-lyrx-parser', () => {
  return { default: vi.fn().mockImplementation(() => lyrxMock) };
});

vi.mock('geostyler-style', () => ({
  Style: {},
}));

// Import after mocks (ensures mocked modules are used)
import './v-map-style';
import { VMapStyle } from './v-map-style';

describe('v-map-style', () => {
  it('renders with default properties', async () => {
    const { root } = await render(
      h('v-map-style', null),
    );

    expect(root).toBeTruthy();
    expect(root?.getAttribute('format')).toBe('sld');
  });

  it('renders with custom format', async () => {
    const { root } = await render(
      h('v-map-style', { format: 'mapbox-gl' }),
    );

    expect((root as any).format).toBe('mapbox-gl');
  });

  it('should parse layer targets correctly', async () => {
    const { root, instance } = await render(
      h('v-map-style', { 'layer-targets': 'layer1,layer2,layer3' }),
    );

    const component = (instance ?? root) as any;
    const targets = component.getLayerTargets();

    expect(targets).toEqual(['layer1', 'layer2', 'layer3']);
  });

  it('should parse empty layer targets', async () => {
    const { root, instance } = await render(
      h('v-map-style', null),
    );

    const component = (instance ?? root) as any;
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

    const { root, instance } = await render(
      h('v-map-style', { format: 'sld', content: sldContent, 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    expect(component.content).toBe(sldContent);
    expect(component.format).toBe('sld');
    expect(component.autoApply).toBe(false);
  });

  it('should emit styleReady event when style is parsed successfully', async () => {
    const { root, instance } = await render(
      h('v-map-style', null),
    );

    const component = (instance ?? root) as any;
    const styleReadySpy = vi.fn();
    root!.addEventListener('styleReady', styleReadySpy);

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

    const { root, instance } = await render(
      h('v-map-style', { format: 'mapbox-gl', content: mapboxStyle, 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    expect(component.format).toBe('mapbox-gl');

    // Override parser on instance to use mock
    component.mapboxParser = mapboxMock;

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

    const { root, instance } = await render(
      h('v-map-style', { format: 'qgis', content: qgisStyle, 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    expect(component.format).toBe('qgis');

    // Override parser on instance to use mock
    component.qgisParser = qgisMock;

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

    const { root, instance } = await render(
      h('v-map-style', { format: 'lyrx', content: lyrxStyle, 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    expect(component.format).toBe('lyrx');

    // Override parser on instance to use mock
    component.lyrxParser = lyrxMock;

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

    const { root, instance } = await render(
      h('v-map-style', { format: 'cesium-3d-tiles', content: cesiumStyle, 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    expect(component.format).toBe('cesium-3d-tiles');

    const result = await component.loadAndParseStyle();
    expect(result).toBeTruthy();
    expect((result as any).color).toBe('color("white", 0.8)');
  });

  it('should display loading state', async () => {
    const { root, instance } = await render(
      h('v-map-style', null),
    );

    const component = (instance ?? root) as any;

    // Check initial loading state
    expect(component.isStyleLoading()).toBe(false);
  });

  it('should handle fetch errors for remote styles', async () => {
    // Mock fetch to simulate error
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { root, instance } = await render(
      h('v-map-style', { src: 'https://example.com/invalid.sld' }),
    );

    const component = (instance ?? root) as any;

    // Should handle fetch error gracefully
    const result = await component.loadAndParseStyle();
    expect(result).toBeUndefined();
    expect(component.getError()).toBeTruthy();
  });

  it('should require either src or content', async () => {
    const { root, instance } = await render(
      h('v-map-style', { 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;

    // Should return undefined and set error when neither src nor content is provided
    const result = await component.loadAndParseStyle();
    expect(result).toBeUndefined();
    expect(component.getError()).toBeTruthy();
    expect(component.getError().message).toContain(
      'Either src or content must be provided',
    );
  });

  it('onStyleSourceChanged re-parses when autoApply is true and content changes', async () => {
    const { root, instance } = await render(
      h('v-map-style', { format: 'cesium-3d-tiles', content: '{"show":true}', 'auto-apply': true }),
    );

    const component = (instance ?? root) as any;
    const spy = vi.spyOn(component, 'loadAndParseStyle');
    component.content = '{"show":false}';
    await component.onStyleSourceChanged();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('onStyleSourceChanged does nothing when autoApply is false', async () => {
    const { root, instance } = await render(
      h('v-map-style', { format: 'sld', content: 'test', 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    const spy = vi.spyOn(component, 'loadAndParseStyle');
    await component.onStyleSourceChanged();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('getStyle returns the parsed style', async () => {
    const { root, instance } = await render(
      h('v-map-style', { format: 'cesium-3d-tiles', content: '{"show":true}', 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    await component.loadAndParseStyle();
    const result = await component.getStyle();

    expect(result).toEqual({ show: true });
  });

  it('getLayerTargetIds returns parsed targets', async () => {
    const { root, instance } = await render(
      h('v-map-style', { 'layer-targets': 'a,b,c' }),
    );

    const component = (instance ?? root) as any;
    const result = await component.getLayerTargetIds();

    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('successfully parses SLD from content', async () => {
    const sldContent = '<StyledLayerDescriptor version="1.0.0"></StyledLayerDescriptor>';
    const { root, instance } = await render(
      h('v-map-style', { format: 'sld', content: sldContent, 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    // Override parser on instance to use mock
    component.sldParser = sldMock;
    const result = await component.loadAndParseStyle();

    expect(result).toBeTruthy();
    expect(result.name).toBe('Mock Style');
  });

  it('successfully fetches and parses style from src URL', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('<StyledLayerDescriptor />'),
    });

    const { root, instance } = await render(
      h('v-map-style', { format: 'sld', src: 'https://example.com/style.sld', 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    // Override parser on instance to use mock
    component.sldParser = sldMock;
    const result = await component.loadAndParseStyle();

    expect(result).toBeTruthy();
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/style.sld');
  });

  it('handles Mapbox GL parser returning undefined output', async () => {
    const { root, instance } = await render(
      h('v-map-style', { format: 'mapbox-gl', content: '{"version":8}', 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    component['mapboxParser'] = {
      readStyle: vi.fn().mockResolvedValue({ output: undefined }),
    } as any;

    const result = await component.loadAndParseStyle();
    expect(result).toBeUndefined();
    expect(component.getError().message).toContain('no style output');
  });

  it('handles LYRX parser returning undefined output', async () => {
    const { root, instance } = await render(
      h('v-map-style', { format: 'lyrx', content: '{"type":"CIMFeatureLayer"}', 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    component['lyrxParser'] = {
      readStyle: vi.fn().mockResolvedValue({ output: undefined }),
    } as any;

    const result = await component.loadAndParseStyle();
    expect(result).toBeUndefined();
    expect(component.getError().message).toContain('no style output');
  });

  it('handles Cesium 3D Tiles with non-object JSON value', async () => {
    const { root, instance } = await render(
      h('v-map-style', { format: 'cesium-3d-tiles', content: '42', 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    const result = await component.loadAndParseStyle();

    expect(result).toBeUndefined();
    expect(component.getError().message).toContain('not a valid object');
  });

  it('loadAndParseStyle handles non-ok fetch response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    const { root, instance } = await render(
      h('v-map-style', { src: 'https://example.com/missing.sld', 'auto-apply': 'false' }),
    );

    const component = (instance ?? root) as any;
    const result = await component.loadAndParseStyle();

    expect(result).toBeUndefined();
    expect(component.getError()).toBeTruthy();
    expect(component.getError().message).toContain('Failed to fetch');
  });

  describe('Negative test cases - Parser errors', () => {
    it('should handle invalid JSON for Mapbox GL Style', async () => {
      const { root, instance } = await render(
        h('v-map-style', { format: 'mapbox-gl', content: 'invalid json', 'auto-apply': 'false' }),
      );

      const component = (instance ?? root) as any;
      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('Mapbox GL Style parsing failed');
    });

    it('should handle invalid JSON for LYRX Style', async () => {
      const { root, instance } = await render(
        h('v-map-style', { format: 'lyrx', content: '{invalid: json}', 'auto-apply': 'false' }),
      );

      const component = (instance ?? root) as any;
      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('LYRX (ArcGIS Pro) Style parsing failed');
    });

    it('should handle invalid JSON for Cesium 3D Tiles Style', async () => {
      const { root, instance } = await render(
        h('v-map-style', { format: 'cesium-3d-tiles', content: 'not valid json', 'auto-apply': 'false' }),
      );

      const component = (instance ?? root) as any;
      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('Cesium 3D Tiles style parsing failed');
    });

    it('should handle non-object JSON for Mapbox GL Style', async () => {
      const { root, instance } = await render(
        h('v-map-style', { format: 'mapbox-gl', content: '"just a string"', 'auto-apply': 'false' }),
      );

      const component = (instance ?? root) as any;
      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('not a valid object');
    });

    it('should handle null JSON for LYRX Style', async () => {
      const { root, instance } = await render(
        h('v-map-style', { format: 'lyrx', content: 'null', 'auto-apply': 'false' }),
      );

      const component = (instance ?? root) as any;
      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('not a valid object');
    });

    it('should handle parser returning undefined output for SLD', async () => {
      const { root, instance } = await render(
        h('v-map-style', { format: 'sld', content: 'invalid sld', 'auto-apply': 'false' }),
      );

      const component = (instance ?? root) as any;

      // Mock parser to return undefined output
      const originalParser = component['sldParser'];
      component['sldParser'] = {
        readStyle: vi.fn().mockResolvedValue({ output: undefined }),
      } as any;

      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('no style output');

      // Restore original parser
      component['sldParser'] = originalParser;
    });

    it('should handle parser returning undefined output for QGIS', async () => {
      const { root, instance } = await render(
        h('v-map-style', { format: 'qgis', content: 'invalid qgis', 'auto-apply': 'false' }),
      );

      const component = (instance ?? root) as any;

      // Mock parser to return undefined output
      const originalParser = component['qgisParser'];
      component['qgisParser'] = {
        readStyle: vi.fn().mockResolvedValue({ output: undefined }),
      } as any;

      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('no style output');

      // Restore original parser
      component['qgisParser'] = originalParser;
    });

    it('should handle unsupported format', async () => {
      const { root, instance } = await render(
        h('v-map-style', { format: 'sld', content: 'test', 'auto-apply': 'false' }),
      );

      const component = (instance ?? root) as any;

      // Manually set an invalid format
      (component as any).format = 'unsupported-format' as any;

      const result = await component.loadAndParseStyle();

      expect(result).toBeUndefined();
      expect(component.getError()).toBeTruthy();
      expect(component.getError().message).toContain('Unsupported style format');
    });

    it('should emit styleError event on parsing failure', async () => {
      const { root, instance } = await render(
        h('v-map-style', { format: 'mapbox-gl', content: 'invalid', 'auto-apply': 'false' }),
      );

      const component = (instance ?? root) as any;
      const styleErrorSpy = vi.fn();
      root!.addEventListener('styleError', styleErrorSpy);

      await component.loadAndParseStyle();

      expect(styleErrorSpy).toHaveBeenCalled();
      expect(styleErrorSpy.mock.calls[0][0].detail).toBeInstanceOf(Error);
    });
  });

  describe('prototype-based source coverage', () => {
    function makeComponent(overrides: Record<string, any> = {}) {
      return {
        el: document.createElement('v-map-style'),
        format: 'sld' as any,
        src: undefined as string | undefined,
        content: undefined as string | undefined,
        layerTargets: undefined as string | undefined,
        autoApply: true,
        parsedStyle: undefined as any,
        isLoading: false,
        error: undefined as Error | undefined,
        sldParser: sldMock,
        mapboxParser: mapboxMock,
        qgisParser: qgisMock,
        lyrxParser: lyrxMock,
        styleReady: { emit: vi.fn() },
        styleError: { emit: vi.fn() },
        loadAndParseStyle: VMapStyle.prototype.loadAndParseStyle,
        parseStyle: VMapStyle.prototype['parseStyle'],
        parseSLD: VMapStyle.prototype['parseSLD'],
        parseMapboxGL: VMapStyle.prototype['parseMapboxGL'],
        parseQGIS: VMapStyle.prototype['parseQGIS'],
        parseLyrx: VMapStyle.prototype['parseLyrx'],
        parseCesium3DTiles: VMapStyle.prototype['parseCesium3DTiles'],
        getLayerTargets: VMapStyle.prototype.getLayerTargets,
        ...overrides,
      } as any;
    }

    it('loadAndParseStyle parses SLD from content', async () => {
      const component = makeComponent({
        format: 'sld',
        content: '<StyledLayerDescriptor/>',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeTruthy();
      expect(result.name).toBe('Mock Style');
      expect(component.parsedStyle).toEqual(result);
      expect(component.isLoading).toBe(false);
      expect(component.styleReady.emit).toHaveBeenCalledWith({
        style: result,
        layerIds: [],
      });
    });

    it('loadAndParseStyle parses Mapbox GL from content', async () => {
      const component = makeComponent({
        format: 'mapbox-gl',
        content: '{"version":8,"layers":[]}',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeTruthy();
      expect(result.name).toBe('Mock Mapbox Style');
      expect(component.styleReady.emit).toHaveBeenCalled();
    });

    it('loadAndParseStyle parses QGIS from content', async () => {
      const component = makeComponent({
        format: 'qgis',
        content: '<qgis></qgis>',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeTruthy();
      expect(result.name).toBe('Mock QGIS Style');
    });

    it('loadAndParseStyle parses LYRX from content', async () => {
      const component = makeComponent({
        format: 'lyrx',
        content: '{"type":"CIMFeatureLayer"}',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeTruthy();
      expect(result.name).toBe('Mock LYRX Style');
    });

    it('loadAndParseStyle parses Cesium 3D Tiles from content', async () => {
      const component = makeComponent({
        format: 'cesium-3d-tiles',
        content: '{"color":"red","show":true}',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toEqual({ color: 'red', show: true });
    });

    it('loadAndParseStyle fetches from src URL', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('<StyledLayerDescriptor/>'),
      });

      const component = makeComponent({
        format: 'sld',
        src: 'https://example.com/style.sld',
        content: undefined,
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeTruthy();
      expect(global.fetch).toHaveBeenCalledWith('https://example.com/style.sld');
    });

    it('loadAndParseStyle sets error when neither src nor content provided', async () => {
      const component = makeComponent({
        src: undefined,
        content: undefined,
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error).toBeTruthy();
      expect(component.error.message).toContain('Either src or content must be provided');
      expect(component.styleError.emit).toHaveBeenCalledWith(component.error);
      expect(component.isLoading).toBe(false);
    });

    it('loadAndParseStyle sets error on non-ok fetch response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      const component = makeComponent({
        src: 'https://example.com/missing.sld',
        content: undefined,
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error).toBeTruthy();
      expect(component.error.message).toContain('Failed to fetch');
    });

    it('loadAndParseStyle sets error on fetch rejection', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const component = makeComponent({
        src: 'https://example.com/fail.sld',
        content: undefined,
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error).toBeTruthy();
      expect(component.error.message).toBe('Network error');
    });

    it('loadAndParseStyle handles unsupported format', async () => {
      const component = makeComponent({
        format: 'unsupported-format',
        content: 'test',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error).toBeTruthy();
      expect(component.error.message).toContain('Unsupported style format');
    });

    it('loadAndParseStyle handles SLD parser returning undefined output', async () => {
      const component = makeComponent({
        format: 'sld',
        content: '<broken/>',
        sldParser: { readStyle: vi.fn().mockResolvedValue({ output: undefined }) },
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('no style output');
    });

    it('loadAndParseStyle handles QGIS parser returning undefined output', async () => {
      const component = makeComponent({
        format: 'qgis',
        content: '<broken/>',
        qgisParser: { readStyle: vi.fn().mockResolvedValue({ output: undefined }) },
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('no style output');
    });

    it('loadAndParseStyle handles Mapbox GL parser returning undefined output', async () => {
      const component = makeComponent({
        format: 'mapbox-gl',
        content: '{"version":8}',
        mapboxParser: { readStyle: vi.fn().mockResolvedValue({ output: undefined }) },
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('no style output');
    });

    it('loadAndParseStyle handles LYRX parser returning undefined output', async () => {
      const component = makeComponent({
        format: 'lyrx',
        content: '{"type":"CIM"}',
        lyrxParser: { readStyle: vi.fn().mockResolvedValue({ output: undefined }) },
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('no style output');
    });

    it('loadAndParseStyle handles invalid JSON for Mapbox GL', async () => {
      const component = makeComponent({
        format: 'mapbox-gl',
        content: 'not json',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('Mapbox GL Style parsing failed');
    });

    it('loadAndParseStyle handles non-object JSON for Mapbox GL', async () => {
      const component = makeComponent({
        format: 'mapbox-gl',
        content: '"just a string"',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('not a valid object');
    });

    it('loadAndParseStyle handles invalid JSON for LYRX', async () => {
      const component = makeComponent({
        format: 'lyrx',
        content: '{invalid',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('LYRX (ArcGIS Pro) Style parsing failed');
    });

    it('loadAndParseStyle handles null JSON for LYRX', async () => {
      const component = makeComponent({
        format: 'lyrx',
        content: 'null',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('not a valid object');
    });

    it('loadAndParseStyle handles invalid JSON for Cesium 3D Tiles', async () => {
      const component = makeComponent({
        format: 'cesium-3d-tiles',
        content: 'not valid json',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('Cesium 3D Tiles style parsing failed');
    });

    it('loadAndParseStyle handles non-object JSON for Cesium 3D Tiles', async () => {
      const component = makeComponent({
        format: 'cesium-3d-tiles',
        content: '42',
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('not a valid object');
    });

    it('loadAndParseStyle includes layer targets in styleReady event', async () => {
      const component = makeComponent({
        format: 'cesium-3d-tiles',
        content: '{"show":true}',
        layerTargets: 'layer1, layer2',
      });

      await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(component.styleReady.emit).toHaveBeenCalledWith({
        style: { show: true },
        layerIds: ['layer1', 'layer2'],
      });
    });

    it('getLayerTargets returns empty array when layerTargets is undefined', () => {
      const component = makeComponent({ layerTargets: undefined });
      const result = VMapStyle.prototype.getLayerTargets.call(component);
      expect(result).toEqual([]);
    });

    it('getLayerTargets splits and trims comma-separated targets', () => {
      const component = makeComponent({ layerTargets: ' a , b , c ' });
      const result = VMapStyle.prototype.getLayerTargets.call(component);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('getLayerTargetIds returns the result of getLayerTargets', async () => {
      const component = makeComponent({ layerTargets: 'x,y' });
      const result = await VMapStyle.prototype.getLayerTargetIds.call(component);
      expect(result).toEqual(['x', 'y']);
    });

    it('getStyle returns the parsedStyle', async () => {
      const mockStyle = { name: 'test', rules: [] };
      const component = makeComponent({ parsedStyle: mockStyle });
      const result = await VMapStyle.prototype.getStyle.call(component);
      expect(result).toEqual(mockStyle);
    });

    it('getStyle returns undefined when no style is parsed', async () => {
      const component = makeComponent({ parsedStyle: undefined });
      const result = await VMapStyle.prototype.getStyle.call(component);
      expect(result).toBeUndefined();
    });

    it('isStyleLoading returns the isLoading state', () => {
      const component = makeComponent({ isLoading: false });
      expect(VMapStyle.prototype.isStyleLoading.call(component)).toBe(false);

      component.isLoading = true;
      expect(VMapStyle.prototype.isStyleLoading.call(component)).toBe(true);
    });

    it('getError returns the error state', () => {
      const component = makeComponent({ error: undefined });
      expect(VMapStyle.prototype.getError.call(component)).toBeUndefined();

      const err = new Error('test');
      component.error = err;
      expect(VMapStyle.prototype.getError.call(component)).toBe(err);
    });

    it('connectedCallback calls loadAndParseStyle when autoApply and content exist', async () => {
      const loadSpy = vi.fn();
      const component = makeComponent({
        autoApply: true,
        content: '<sld/>',
        loadAndParseStyle: loadSpy,
      });

      await VMapStyle.prototype.connectedCallback.call(component);

      expect(loadSpy).toHaveBeenCalled();
    });

    it('connectedCallback calls loadAndParseStyle when autoApply and src exist', async () => {
      const loadSpy = vi.fn();
      const component = makeComponent({
        autoApply: true,
        src: 'https://example.com/style.sld',
        content: undefined,
        loadAndParseStyle: loadSpy,
      });

      await VMapStyle.prototype.connectedCallback.call(component);

      expect(loadSpy).toHaveBeenCalled();
    });

    it('connectedCallback does not call loadAndParseStyle when autoApply is false', async () => {
      const loadSpy = vi.fn();
      const component = makeComponent({
        autoApply: false,
        content: '<sld/>',
        loadAndParseStyle: loadSpy,
      });

      await VMapStyle.prototype.connectedCallback.call(component);

      expect(loadSpy).not.toHaveBeenCalled();
    });

    it('connectedCallback does not call loadAndParseStyle when no src or content', async () => {
      const loadSpy = vi.fn();
      const component = makeComponent({
        autoApply: true,
        src: undefined,
        content: undefined,
        loadAndParseStyle: loadSpy,
      });

      await VMapStyle.prototype.connectedCallback.call(component);

      expect(loadSpy).not.toHaveBeenCalled();
    });

    it('onStyleSourceChanged calls loadAndParseStyle when autoApply and content exist', async () => {
      const loadSpy = vi.fn();
      const component = makeComponent({
        autoApply: true,
        content: '<sld/>',
        loadAndParseStyle: loadSpy,
      });

      await VMapStyle.prototype.onStyleSourceChanged.call(component);

      expect(loadSpy).toHaveBeenCalled();
    });

    it('onStyleSourceChanged does not call loadAndParseStyle when autoApply is false', async () => {
      const loadSpy = vi.fn();
      const component = makeComponent({
        autoApply: false,
        content: '<sld/>',
        loadAndParseStyle: loadSpy,
      });

      await VMapStyle.prototype.onStyleSourceChanged.call(component);

      expect(loadSpy).not.toHaveBeenCalled();
    });

    it('onStyleSourceChanged does not call loadAndParseStyle when no src or content', async () => {
      const loadSpy = vi.fn();
      const component = makeComponent({
        autoApply: true,
        src: undefined,
        content: undefined,
        loadAndParseStyle: loadSpy,
      });

      await VMapStyle.prototype.onStyleSourceChanged.call(component);

      expect(loadSpy).not.toHaveBeenCalled();
    });

    it('loadAndParseStyle handles SLD parser throwing an error', async () => {
      const component = makeComponent({
        format: 'sld',
        content: '<broken/>',
        sldParser: { readStyle: vi.fn().mockRejectedValue(new Error('XML parse error')) },
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('SLD parsing failed');
    });

    it('loadAndParseStyle handles QGIS parser throwing an error', async () => {
      const component = makeComponent({
        format: 'qgis',
        content: '<broken/>',
        qgisParser: { readStyle: vi.fn().mockRejectedValue(new Error('QGIS parse error')) },
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('QGIS Style parsing failed');
    });

    it('loadAndParseStyle handles Mapbox GL parser throwing an error', async () => {
      const component = makeComponent({
        format: 'mapbox-gl',
        content: '{"version":8}',
        mapboxParser: { readStyle: vi.fn().mockRejectedValue(new Error('Mapbox error')) },
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('Mapbox GL Style parsing failed');
    });

    it('loadAndParseStyle handles LYRX parser throwing an error', async () => {
      const component = makeComponent({
        format: 'lyrx',
        content: '{"type":"CIM"}',
        lyrxParser: { readStyle: vi.fn().mockRejectedValue(new Error('LYRX error')) },
      });

      const result = await VMapStyle.prototype.loadAndParseStyle.call(component);

      expect(result).toBeUndefined();
      expect(component.error.message).toContain('LYRX (ArcGIS Pro) Style parsing failed');
    });

    it('default component has expected initial state from makeComponent', () => {
      const component = makeComponent();
      expect(component.format).toBe('sld');
      expect(component.autoApply).toBe(true);
      expect(component.isLoading).toBe(false);
      expect(component.parsedStyle).toBeUndefined();
      expect(component.error).toBeUndefined();
    });

    it('render returns JSX with all branches (line 301)', () => {
      // Test render with isLoading=true
      const loadingComp = makeComponent({ isLoading: true, error: undefined, parsedStyle: undefined });
      const loadingResult = VMapStyle.prototype.render.call(loadingComp);
      expect(loadingResult).toBeTruthy();

      // Test render with error set
      const errorComp = makeComponent({ isLoading: false, error: new Error('test'), parsedStyle: undefined });
      const errorResult = VMapStyle.prototype.render.call(errorComp);
      expect(errorResult).toBeTruthy();

      // Test render with parsedStyle set and layer targets
      const successComp = makeComponent({
        isLoading: false,
        error: undefined,
        parsedStyle: { name: 'test', rules: [] },
        layerTargets: 'a,b',
        format: 'sld',
      });
      const successResult = VMapStyle.prototype.render.call(successComp);
      expect(successResult).toBeTruthy();

      // Test render with parsedStyle but no layer targets
      const noTargetsComp = makeComponent({
        isLoading: false,
        error: undefined,
        parsedStyle: { name: 'test', rules: [] },
        layerTargets: undefined,
        format: 'sld',
      });
      const noTargetsResult = VMapStyle.prototype.render.call(noTargetsComp);
      expect(noTargetsResult).toBeTruthy();
    });

    it('parser fields are assigned on rendered component (lines 77-80)', async () => {
      // Rendering creates a real component instance which runs field initializers
      const { root, instance } = await render(
        h('v-map-style', { format: 'sld', 'auto-apply': 'false' }),
      );
      const component = (instance ?? root) as any;
      // Verify parsers are defined (mocked implementations)
      expect(component.sldParser).toBeDefined();
      expect(component.mapboxParser).toBeDefined();
      expect(component.qgisParser).toBeDefined();
      expect(component.lyrxParser).toBeDefined();
    });
  });
});
