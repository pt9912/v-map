import type { Style } from 'geostyler-style';
import { vi } from 'vitest';

const { mockCesium } = vi.hoisted(() => ({
  mockCesium: {
    Ion: {
      defaultAccessToken: null,
    },
    Viewer: vi.fn().mockImplementation(function() { return {
      scene: {
        primitives: {
          removeAll: vi.fn(),
          add: vi.fn(),
        },
        globe: {
          baseColor: {},
        },
        backgroundColor: {},
      },
      dataSources: {
        add: vi.fn(),
      },
      imageryLayers: {
        add: vi.fn(),
      },
      destroy: vi.fn(),
      container: document.createElement('div'),
    }; }),
    EllipsoidTerrainProvider: vi.fn(),
    Color: {
      WHITE: { withAlpha: vi.fn(() => ({})) },
      BLUE: { withAlpha: vi.fn(() => ({})) },
      fromCssColorString: vi.fn(() => ({ withAlpha: vi.fn(() => ({})) })),
    },
    GeoJsonDataSource: Object.assign(
      vi.fn().mockImplementation(function() { return {
        entities: {
          values: [],
        },
        show: true,
      }; }),
      {
        load: vi.fn().mockResolvedValue({
          entities: {
            values: [],
          },
          show: true,
        }),
      },
    ),
    DataSource: vi.fn().mockImplementation(function() { return {
      show: true,
    }; }),
    Cesium3DTileset: vi.fn().mockImplementation(function() { return {
      show: true,
      style: null,
    }; }),
    ImageryLayer: vi.fn().mockImplementation(function() { return {
      show: true,
      alpha: 1,
    }; }),
    Cesium3DTileStyle: vi.fn(),
    ColorBlendMode: {
      MIX: 0,
    },
    Property: class MockProperty {},
    JulianDate: vi.fn(),
    ColorMaterialProperty: vi.fn(),
    ImageMaterialProperty: vi.fn(),
    PolylineOutlineMaterialProperty: vi.fn(),
    HeightReference: {
      CLAMP_TO_GROUND: 0,
      RELATIVE_TO_GROUND: 1,
    },
    VerticalOrigin: {
      BOTTOM: 0,
    },
    BillboardGraphics: vi.fn(),
    LabelGraphics: vi.fn(),
  },
}));

// Mock cesium-loader BEFORE importing the provider
vi.mock('../../lib/cesium-loader', () => ({
  loadCesium: jest.fn().mockResolvedValue(mockCesium),
  injectWidgetsCss: jest.fn().mockResolvedValue(undefined),
}));

// Import provider AFTER mocks are defined
import { CesiumProvider } from './cesium-provider';

// Make Cesium available globally for the provider code
(global as any).Cesium = mockCesium;

describe('CesiumProvider GeoStyler Integration', () => {
  let provider: CesiumProvider;

  beforeEach(() => {
    provider = new CesiumProvider();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GeoStyler Style Support', () => {
    it('should accept GeoStyler style for GeoJSON layer', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const geostylerStyle: Style = {
        name: 'Test Style',
        rules: [
          {
            name: 'Polygon Style',
            symbolizers: [
              {
                kind: 'Fill',
                color: '#FF0000',
                opacity: 0.5,
                outlineColor: '#000000',
                outlineWidth: 2,
              },
            ],
          },
        ],
      };

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({
          type: 'FeatureCollection',
          features: [],
        }),
        geostylerStyle,
        groupId: 'test-group',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('should handle Fill symbolizer correctly', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const geostylerStyle: Style = {
        name: 'Fill Test',
        rules: [
          {
            name: 'Polygon Fill',
            symbolizers: [
              {
                kind: 'Fill',
                color: 'rgba(255, 0, 0, 0.5)',
                opacity: 0.5,
                outlineColor: '#000000',
                outlineWidth: 3,
              },
            ],
          },
        ],
      };

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({
          type: 'FeatureCollection',
          features: [],
        }),
        geostylerStyle,
        groupId: 'test-group',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('should handle Line symbolizer correctly', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const geostylerStyle: Style = {
        name: 'Line Test',
        rules: [
          {
            name: 'LineString Style',
            symbolizers: [
              {
                kind: 'Line',
                color: '#0000FF',
                width: 4,
              },
            ],
          },
        ],
      };

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({
          type: 'FeatureCollection',
          features: [],
        }),
        geostylerStyle,
        groupId: 'test-group',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('should handle Mark symbolizer for points', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const geostylerStyle: Style = {
        name: 'Point Test',
        rules: [
          {
            name: 'Point Mark',
            symbolizers: [
              {
                kind: 'Mark',
                wellKnownName: 'circle',
                color: '#00FF00',
                radius: 8,
                strokeColor: '#000000',
                strokeWidth: 2,
              },
            ],
          },
        ],
      };

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({
          type: 'FeatureCollection',
          features: [],
        }),
        geostylerStyle,
        groupId: 'test-group',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('should handle Icon symbolizer for points', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const geostylerStyle: Style = {
        name: 'Icon Test',
        rules: [
          {
            name: 'Point Icon',
            symbolizers: [
              {
                kind: 'Icon',
                image: 'https://example.com/icon.png',
                size: 32,
                opacity: 1,
              },
            ],
          },
        ],
      };

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({
          type: 'FeatureCollection',
          features: [],
        }),
        geostylerStyle,
        groupId: 'test-group',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('should handle Text symbolizer', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const geostylerStyle: Style = {
        name: 'Text Test',
        rules: [
          {
            name: 'Text Label',
            symbolizers: [
              {
                kind: 'Text',
                label: '{{name}}',
                color: '#000000',
                size: 14,
                font: ['Arial'],
              } as any,
            ],
          },
        ],
      };

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({
          type: 'FeatureCollection',
          features: [],
        }),
        geostylerStyle,
        groupId: 'test-group',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('should work with WKT layers', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const geostylerStyle: Style = {
        name: 'WKT Style',
        rules: [
          {
            name: 'WKT Polygon',
            symbolizers: [
              {
                kind: 'Fill',
                color: '#00FF00',
                opacity: 0.5,
              },
            ],
          },
        ],
      };

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POINT(0 0)',
        geostylerStyle,
        groupId: 'test-group',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('should fall back to default style when geostylerStyle is not provided', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({
          type: 'FeatureCollection',
          features: [],
        }),
        groupId: 'test-group',
      } as any);

      expect(layerId).toBeTruthy();
    });
  });
});
