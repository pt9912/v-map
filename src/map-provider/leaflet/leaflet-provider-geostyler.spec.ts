import type { Style } from 'geostyler-style';

// Create mock functions
const mockMap = jest.fn(() => ({
  setView: jest.fn().mockReturnThis(),
  addLayer: jest.fn(),
  removeLayer: jest.fn(),
  eachLayer: jest.fn(),
  invalidateSize: jest.fn(),
  remove: jest.fn(),
}));

const mockGeoJSON = jest.fn(() => ({
  addTo: jest.fn().mockReturnThis(),
  clearLayers: jest.fn(),
  addData: jest.fn(),
  eachLayer: jest.fn(),
  setStyle: jest.fn(),
}));

const mockLayerGroup = jest.fn(() => ({
  addTo: jest.fn().mockReturnThis(),
  addLayer: jest.fn(),
  clearLayers: jest.fn(),
  getLayers: jest.fn(() => []),
}));

const mockTileLayer = jest.fn(() => ({
  addTo: jest.fn().mockReturnThis(),
  setUrl: jest.fn(),
  setOpacity: jest.fn(),
  setZIndex: jest.fn(),
}));

const mockCircleMarker = jest.fn(() => ({}));
const mockMarker = jest.fn(() => ({}));
const mockIcon = jest.fn(() => ({}));

// Mock Leaflet module
jest.mock('leaflet', () => ({
  map: mockMap,
  geoJSON: mockGeoJSON,
  layerGroup: mockLayerGroup,
  tileLayer: mockTileLayer,
  circleMarker: mockCircleMarker,
  marker: mockMarker,
  icon: mockIcon,
  GridLayer: class {
    options: any = {};
    constructor() {}
  },
  Util: {
    stamp: jest.fn(() => 'layer-id-123'),
    setOptions: jest.fn((instance: any, opts: any) => {
      instance.options = { ...(instance.options ?? {}), ...opts };
    }),
  },
}));

// Import after mocks
import { LeafletProvider } from './leaflet-provider';

describe('LeafletProvider GeoStyler Integration', () => {
  let provider: LeafletProvider;

  beforeEach(() => {
    provider = new LeafletProvider();
    // Clear all mock calls before each test
    mockMap.mockClear();
    mockGeoJSON.mockClear();
    mockLayerGroup.mockClear();
    mockTileLayer.mockClear();
    mockCircleMarker.mockClear();
    mockMarker.mockClear();
    mockIcon.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GeoStyler Style Support', () => {
    it('should accept GeoStyler style for GeoJSON layer', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document.createElement('div').attachShadow({ mode: 'open' }),
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

      const layerId = await provider.addLayerToGroup(
        {
          type: 'geojson',
          geojson: JSON.stringify({
            type: 'FeatureCollection',
            features: [],
          }),
          geostylerStyle,
        } as any,
        'test-group',
      );

      expect(layerId).toBeTruthy();
      expect(mockGeoJSON).toHaveBeenCalled();
    });

    it('should handle Fill symbolizer correctly', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document.createElement('div').attachShadow({ mode: 'open' }),
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

      const layerId = await provider.addLayerToGroup(
        {
          type: 'geojson',
          geojson: JSON.stringify({
            type: 'FeatureCollection',
            features: [],
          }),
          geostylerStyle,
        } as any,
        'test-group',
      );

      expect(layerId).toBeTruthy();
    });

    it('should handle Line symbolizer correctly', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document.createElement('div').attachShadow({ mode: 'open' }),
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
                dasharray: [5, 10],
              },
            ],
          },
        ],
      };

      const layerId = await provider.addLayerToGroup(
        {
          type: 'geojson',
          geojson: JSON.stringify({
            type: 'FeatureCollection',
            features: [],
          }),
          geostylerStyle,
        } as any,
        'test-group',
      );

      expect(layerId).toBeTruthy();
    });

    it('should handle Mark symbolizer for points', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document.createElement('div').attachShadow({ mode: 'open' }),
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

      const layerId = await provider.addLayerToGroup(
        {
          type: 'geojson',
          geojson: JSON.stringify({
            type: 'FeatureCollection',
            features: [],
          }),
          geostylerStyle,
        } as any,
        'test-group',
      );

      expect(layerId).toBeTruthy();
    });

    it('should work with WKT layers', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document.createElement('div').attachShadow({ mode: 'open' }),
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

      const layerId = await provider.addLayerToGroup(
        {
          type: 'wkt',
          wkt: 'POINT(0 0)',
          geostylerStyle,
        } as any,
        'test-group',
      );

      expect(layerId).toBeTruthy();
    });

    it('should fall back to default style when geostylerStyle is not provided', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document.createElement('div').attachShadow({ mode: 'open' }),
      });

      const layerId = await provider.addLayerToGroup(
        {
          type: 'geojson',
          geojson: JSON.stringify({
            type: 'FeatureCollection',
            features: [],
          }),
        } as any,
        'test-group',
      );

      expect(layerId).toBeTruthy();
    });
  });
});
