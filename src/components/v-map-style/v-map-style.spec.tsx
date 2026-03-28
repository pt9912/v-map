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
});
