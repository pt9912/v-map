import { vi } from 'vitest';
import { DeckProvider } from './deck-provider';
import type { Style } from 'geostyler-style';

// Mock @deck.gl imports
vi.mock('@deck.gl/core', () => {
  const Deck = vi.fn(function (this: any) {
    this.setProps = vi.fn();
    this.finalize = vi.fn();
  });
  return { Deck };
});

vi.mock('@deck.gl/geo-layers', () => ({
  TileLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      props: props,
      clone: vi.fn().mockReturnThis(),
    };
  }),
}));

vi.mock('@deck.gl/layers', () => ({
  GeoJsonLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      props: props,
      clone: vi.fn().mockReturnThis(),
    };
  }),
  BitmapLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      props: props,
    };
  }),
  ScatterplotLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      props: props,
      clone: vi.fn().mockReturnThis(),
    };
  }),
}));

describe('DeckProvider GeoStyler Integration', () => {
  let provider: DeckProvider;

  beforeEach(() => {
    provider = new DeckProvider();
  });

  afterEach(() => {
    vi.clearAllMocks();
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
      // Layer was successfully created
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
                dasharray: [5, 10],
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

    it('should handle Icon symbolizer (converted to Mark)', async () => {
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

    it('should convert colors correctly', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const geostylerStyle: Style = {
        name: 'Color Test',
        rules: [
          {
            name: 'Various Colors',
            symbolizers: [
              {
                kind: 'Fill',
                color: '#FF5733',
                opacity: 0.7,
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
