import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---- hoisted mocks (must be declared before vi.mock) ----

const { mockTileLayer, mockDeck } = vi.hoisted(() => ({
  mockTileLayer: vi.fn().mockImplementation(function (this: any, props: any) {
    return {
      id: props.id,
      props,
      clone: vi.fn().mockReturnValue({ id: props.id, props }),
    };
  }),
  mockDeck: vi.fn().mockImplementation(function() { return {
    setProps: vi.fn(),
    finalize: vi.fn(),
  }; }),
}));

vi.mock('@deck.gl/core', () => ({
  Deck: mockDeck,
}));

vi.mock('@deck.gl/geo-layers', () => ({
  TileLayer: mockTileLayer,
  TerrainLayer: vi.fn().mockImplementation(function(props: any) { return {
    id: props.id,
    props,
    clone: vi.fn().mockReturnValue({ id: props.id, props }),
  }; }),
}));

vi.mock('@deck.gl/layers', () => ({
  BitmapLayer: vi.fn().mockImplementation(function(props: any) { return {
    id: props?.id,
    props,
  }; }),
  GeoJsonLayer: vi.fn().mockImplementation(function(props: any) { return {
    id: props.id,
    props,
    clone: vi.fn().mockReturnValue({ id: props.id, props }),
  }; }),
  ScatterplotLayer: vi.fn().mockImplementation(function(props: any) { return {
    id: props.id,
    props,
    clone: vi.fn().mockReturnValue({ id: props.id, props }),
  }; }),
}));

vi.mock('wellknown', () => ({
  wellknownModule: {
    default: vi.fn().mockImplementation((wkt: string) => {
      if (wkt.startsWith('POINT')) {
        return { type: 'Point', coordinates: [10, 50] };
      }
      if (wkt.startsWith('POLYGON')) {
        return {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
        };
      }
      return null;
    }),
  },
}));

vi.mock('@npm9912/s-gml', () => ({
  GmlParser: vi.fn().mockImplementation(function() {
    return {
      parse: vi.fn().mockResolvedValue({ type: 'FeatureCollection', features: [] }),
    };
  }),
}));

vi.mock('./DeckGLGeoTIFFLayer', () => ({
  createDeckGLGeoTIFFLayer: vi.fn().mockRejectedValue(new Error('GeoTIFF not available')),
}));

vi.mock('./DeckGLGeoTIFFTerrainLayer', () => ({
  createDeckGLGeoTIFFTerrainLayer: vi.fn().mockRejectedValue(new Error('Terrain not available')),
}));

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  warn: vi.fn(),
}));

import { DeckProvider } from './deck-provider';

// ---------- helpers ----------

function createTarget() {
  const target = document.createElement('div');
  const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
  return { target, shadowRoot };
}

async function initProvider(): Promise<DeckProvider> {
  const provider = new DeckProvider();
  const { target, shadowRoot } = createTarget();
  await provider.init({ target, shadowRoot });
  return provider;
}

// ---------- tests ----------

describe('DeckProvider', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ===== 1. parseColor =====

  describe('parseColor', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    const defaultColor: [number, number, number, number] = [0, 0, 0, 255];

    it('parses a hex color (#FF0000)', () => {
      const result = (provider as any).parseColor('#FF0000', defaultColor);
      expect(result).toEqual([255, 0, 0, 255]);
    });

    it('parses a 6-digit hex with mixed case (#00ff88)', () => {
      const result = (provider as any).parseColor('#00ff88', defaultColor);
      expect(result).toEqual([0, 255, 136, 255]);
    });

    it('parses rgba(255,0,0,0.5)', () => {
      const result = (provider as any).parseColor('rgba(255,0,0,0.5)', defaultColor);
      expect(result).toEqual([255, 0, 0, 128]);
    });

    it('parses rgb(255,0,0) with alpha defaulting to 255', () => {
      const result = (provider as any).parseColor('rgb(255,0,0)', defaultColor);
      expect(result).toEqual([255, 0, 0, 255]);
    });

    it('returns default color for undefined input', () => {
      const result = (provider as any).parseColor(undefined, defaultColor);
      expect(result).toEqual(defaultColor);
    });

    it('returns default color for empty string', () => {
      const result = (provider as any).parseColor('', defaultColor);
      expect(result).toEqual(defaultColor);
    });

    it('returns default color for an unknown/unparseable string', () => {
      const result = (provider as any).parseColor('not-a-color', defaultColor);
      expect(result).toEqual(defaultColor);
    });

    it('parses rgba with alpha 1', () => {
      const result = (provider as any).parseColor('rgba(10, 20, 30, 1)', defaultColor);
      expect(result).toEqual([10, 20, 30, 255]);
    });

    it('parses rgba with alpha 0', () => {
      const result = (provider as any).parseColor('rgba(10, 20, 30, 0)', defaultColor);
      expect(result).toEqual([10, 20, 30, 0]);
    });
  });

  // ===== 2. applyOpacity =====

  describe('applyOpacity', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    it('applies 0.5 opacity to a color array', () => {
      const result = (provider as any).applyOpacity([100, 150, 200, 255], 0.5);
      expect(result).toEqual([100, 150, 200, 128]);
    });

    it('applies 1.0 opacity (fully opaque)', () => {
      const result = (provider as any).applyOpacity([10, 20, 30, 0], 1.0);
      expect(result).toEqual([10, 20, 30, 255]);
    });

    it('applies 0 opacity (fully transparent)', () => {
      const result = (provider as any).applyOpacity([10, 20, 30, 255], 0);
      expect(result).toEqual([10, 20, 30, 0]);
    });
  });

  // ===== 3. normalizeElevationDecoder =====

  describe('normalizeElevationDecoder', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    it('returns defaults when decoder is undefined', () => {
      const result = (provider as any).normalizeElevationDecoder(undefined);
      expect(result).toEqual({ rScaler: 1, gScaler: 1, bScaler: 1, offset: 0 });
    });

    it('accepts {r, g, b, offset} shorthand keys', () => {
      const result = (provider as any).normalizeElevationDecoder({
        r: 256,
        g: 1,
        b: 0.00390625,
        offset: -10000,
      });
      expect(result).toEqual({
        rScaler: 256,
        gScaler: 1,
        bScaler: 0.00390625,
        offset: -10000,
      });
    });

    it('accepts {rScaler, gScaler, bScaler, offset} long keys', () => {
      const result = (provider as any).normalizeElevationDecoder({
        rScaler: 6553.6,
        gScaler: 25.6,
        bScaler: 0.1,
        offset: -10000,
      });
      expect(result).toEqual({
        rScaler: 6553.6,
        gScaler: 25.6,
        bScaler: 0.1,
        offset: -10000,
      });
    });

    it('prefers rScaler over r when both are present', () => {
      const result = (provider as any).normalizeElevationDecoder({
        rScaler: 100,
        r: 50,
        gScaler: 200,
        g: 75,
        bScaler: 300,
        b: 25,
        offset: 5,
      });
      expect(result).toEqual({
        rScaler: 100,
        gScaler: 200,
        bScaler: 300,
        offset: 5,
      });
    });

    it('fills missing keys with defaults', () => {
      const result = (provider as any).normalizeElevationDecoder({
        rScaler: 10,
      });
      expect(result).toEqual({
        rScaler: 10,
        gScaler: 1,
        bScaler: 1,
        offset: 0,
      });
    });
  });

  // ===== 4. getGoogleMapTypeId =====

  describe('getGoogleMapTypeId', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    it('returns "roadmap" for roadmap', () => {
      expect((provider as any).getGoogleMapTypeId('roadmap')).toBe('roadmap');
    });

    it('returns "satellite" for satellite', () => {
      expect((provider as any).getGoogleMapTypeId('satellite')).toBe('satellite');
    });

    it('returns "terrain" for terrain', () => {
      expect((provider as any).getGoogleMapTypeId('terrain')).toBe('terrain');
    });

    it('returns "hybrid" for hybrid', () => {
      expect((provider as any).getGoogleMapTypeId('hybrid')).toBe('hybrid');
    });

    it('returns "roadmap" as default for unknown value', () => {
      expect((provider as any).getGoogleMapTypeId('unknown')).toBe('roadmap');
    });

    it('returns "roadmap" for empty string', () => {
      expect((provider as any).getGoogleMapTypeId('')).toBe('roadmap');
    });
  });

  // ===== 5. buildArcgisUrl =====

  describe('buildArcgisUrl', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    it('returns plain url when no params or token', () => {
      const result = (provider as any).buildArcgisUrl('https://example.com/arcgis');
      expect(result).toBe('https://example.com/arcgis');
    });

    it('appends params with ? separator', () => {
      const result = (provider as any).buildArcgisUrl(
        'https://example.com/arcgis',
        { foo: 'bar', num: 42 },
      );
      expect(result).toContain('?');
      expect(result).toContain('foo=bar');
      expect(result).toContain('num=42');
    });

    it('appends token as query parameter', () => {
      const result = (provider as any).buildArcgisUrl(
        'https://example.com/arcgis',
        undefined,
        'my-secret-token',
      );
      expect(result).toContain('token=my-secret-token');
    });

    it('appends both params and token', () => {
      const result = (provider as any).buildArcgisUrl(
        'https://example.com/arcgis',
        { layer: 'streets' },
        'tok123',
      );
      expect(result).toContain('layer=streets');
      expect(result).toContain('token=tok123');
    });

    it('uses & separator when url already contains ?', () => {
      const result = (provider as any).buildArcgisUrl(
        'https://example.com/arcgis?existing=1',
        { extra: 'yes' },
      );
      expect(result).toMatch(/\?existing=1&/);
      expect(result).toContain('extra=yes');
    });

    it('skips undefined/null param values', () => {
      const result = (provider as any).buildArcgisUrl(
        'https://example.com/arcgis',
        { good: 'yes', bad: undefined, also_bad: null },
      );
      expect(result).toContain('good=yes');
      expect(result).not.toContain('bad');
    });
  });

  // ===== 6. destroy =====

  describe('destroy', () => {
    it('calls deck.finalize and removes injected style', async () => {
      const provider = await initProvider();
      const deck = (provider as any).deck;

      await provider.destroy();

      expect(deck.finalize).toHaveBeenCalled();
    });

    it('does not throw when called on un-initialized provider', async () => {
      const provider = new DeckProvider();
      await expect(provider.destroy()).resolves.not.toThrow();
    });
  });

  // ===== 7. removeLayer =====

  describe('removeLayer', () => {
    it('removes a layer that was added via addLayerToGroup', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        groupId: 'test-group',
      } as any);

      expect(layerId).toBeTruthy();

      // Should not throw
      await provider.removeLayer(layerId);
    });

    it('does not throw when removing a non-existent layer id', async () => {
      const provider = await initProvider();
      await expect(
        provider.removeLayer('non-existent-layer-id'),
      ).resolves.not.toThrow();
    });

    it('does not throw when removing an empty string layer id', async () => {
      const provider = await initProvider();
      await expect(provider.removeLayer('')).resolves.not.toThrow();
    });
  });

  // ===== 8. setOpacity / setVisible / setZIndex =====

  describe('setOpacity', () => {
    it('applies opacity override to an existing layer', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        groupId: 'opacity-group',
      } as any);

      await expect(provider.setOpacity(layerId, 0.3)).resolves.not.toThrow();
    });

    it('silently ignores unknown layer id', async () => {
      const provider = await initProvider();
      await expect(provider.setOpacity('ghost', 0.5)).resolves.not.toThrow();
    });
  });

  describe('setVisible', () => {
    it('sets visibility on an existing layer', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        groupId: 'vis-group',
      } as any);

      await expect(provider.setVisible(layerId, false)).resolves.not.toThrow();
      await expect(provider.setVisible(layerId, true)).resolves.not.toThrow();
    });

    it('silently ignores unknown layer id', async () => {
      const provider = await initProvider();
      await expect(provider.setVisible('ghost', true)).resolves.not.toThrow();
    });
  });

  describe('setZIndex', () => {
    it('sets zIndex on an existing layer', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        groupId: 'z-group',
      } as any);

      await expect(provider.setZIndex(layerId, 999)).resolves.not.toThrow();
    });

    it('silently ignores unknown layer id', async () => {
      const provider = await initProvider();
      await expect(provider.setZIndex('ghost', 10)).resolves.not.toThrow();
    });
  });

  // ===== 9. ensureGroup / setGroupVisible / setBaseLayer =====

  describe('ensureGroup', () => {
    it('creates a new group if it does not exist', async () => {
      const provider = await initProvider();
      await expect(
        provider.ensureGroup('my-group', true),
      ).resolves.not.toThrow();
    });

    it('reuses an existing group on second call', async () => {
      const provider = await initProvider();
      await provider.ensureGroup('g1', true);
      await expect(provider.ensureGroup('g1', false)).resolves.not.toThrow();
    });

    it('accepts basemapid option', async () => {
      const provider = await initProvider();
      await expect(
        provider.ensureGroup('basemap-group', true, { basemapid: 'osm-1' }),
      ).resolves.not.toThrow();
    });
  });

  describe('setGroupVisible', () => {
    it('toggles group visibility', async () => {
      const provider = await initProvider();
      await provider.ensureGroup('grp', true);

      await expect(provider.setGroupVisible('grp', false)).resolves.not.toThrow();
      await expect(provider.setGroupVisible('grp', true)).resolves.not.toThrow();
    });
  });

  describe('setBaseLayer', () => {
    it('sets the active base layer element id', async () => {
      const provider = await initProvider();
      await provider.ensureGroup('base', true, { basemapid: 'a' });

      await expect(provider.setBaseLayer('base', 'b')).resolves.not.toThrow();
    });
  });

  // ===== 10. addLayerToGroup for OSM type =====

  describe('addLayerToGroup (OSM)', () => {
    it('creates an OSM layer with default URL', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'osm-group',
      } as any);

      expect(layerId).toBeTruthy();
      expect(mockTileLayer).toHaveBeenCalled();
      const callArgs = mockTileLayer.mock.calls[0][0];
      expect(callArgs.data).toEqual(
        expect.arrayContaining([
          expect.stringContaining('openstreetmap.org'),
        ]),
      );
    });

    it('creates an OSM layer with custom base URL', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        url: 'https://my-tile-server.example.com',
        groupId: 'osm-custom',
      } as any);

      expect(layerId).toBeTruthy();
      const callArgs = mockTileLayer.mock.calls[0][0];
      expect(callArgs.data).toEqual(
        expect.arrayContaining([
          expect.stringContaining('my-tile-server.example.com'),
        ]),
      );
    });
  });

  // ===== 11. createDeckGLStyle =====

  describe('createDeckGLStyle (private)', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    it('returns default style when called with no args', () => {
      const result = (provider as any).createDeckGLStyle();
      expect(result).toBeDefined();
      expect(typeof result.getFillColor).toBe('function');
      expect(typeof result.getLineColor).toBe('function');
      expect(typeof result.getPointRadius).toBe('function');
      expect(typeof result.getPointFillColor).toBe('function');
      expect(result.lineWidthMinPixels).toBe(2);
      expect(result.pointRadiusMinPixels).toBe(2);
      expect(result.pointRadiusMaxPixels).toBe(100);

      // Default fill: [0, 100, 255, 76]
      const fill = result.getFillColor();
      expect(fill).toEqual([0, 100, 255, 76]);

      // Default stroke: [0, 100, 255, 255]
      const stroke = result.getLineColor();
      expect(stroke).toEqual([0, 100, 255, 255]);

      // Default point radius: 8
      const radius = result.getPointRadius();
      expect(radius).toBe(8);

      // Default point color: [0, 100, 255, 255]
      const pointColor = result.getPointFillColor();
      expect(pointColor).toEqual([0, 100, 255, 255]);
    });

    it('uses provided fillColor and strokeColor', () => {
      const result = (provider as any).createDeckGLStyle({
        fillColor: '#FF0000',
        strokeColor: 'rgb(0,255,0)',
      });
      const fill = result.getFillColor();
      expect(fill).toEqual([255, 0, 0, 255]);

      const stroke = result.getLineColor();
      expect(stroke).toEqual([0, 255, 0, 255]);
    });

    it('applies fillOpacity override', () => {
      const result = (provider as any).createDeckGLStyle({
        fillColor: '#FF0000',
        fillOpacity: 0.5,
      });
      const fill = result.getFillColor();
      expect(fill).toEqual([255, 0, 0, 128]);
    });

    it('applies strokeOpacity override', () => {
      const result = (provider as any).createDeckGLStyle({
        strokeColor: '#00FF00',
        strokeOpacity: 0.5,
      });
      const stroke = result.getLineColor();
      expect(stroke).toEqual([0, 255, 0, 128]);
    });

    it('applies pointOpacity override', () => {
      const result = (provider as any).createDeckGLStyle({
        pointColor: '#0000FF',
        pointOpacity: 0.5,
      });
      const pointColor = result.getPointFillColor();
      expect(pointColor).toEqual([0, 0, 255, 128]);
    });

    it('uses custom pointRadius', () => {
      const result = (provider as any).createDeckGLStyle({
        pointRadius: 20,
      });
      expect(result.getPointRadius()).toBe(20);
    });

    it('uses custom strokeWidth', () => {
      const result = (provider as any).createDeckGLStyle({
        strokeWidth: 5,
      });
      expect(result.lineWidthMinPixels).toBe(5);
    });

    it('applies styleFunction for conditional fillColor', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: (feature: any) => {
          if (feature?.properties?.type === 'special') {
            return { fillColor: '#00FF00' };
          }
          return {};
        },
      });

      // With a matching feature
      const specialFill = result.getFillColor({
        properties: { type: 'special' },
      });
      expect(specialFill).toEqual([0, 255, 0, 255]);

      // With a non-matching feature (falls through to default)
      const defaultFill = result.getFillColor({
        properties: { type: 'normal' },
      });
      expect(defaultFill).toEqual([0, 100, 255, 76]);
    });

    it('applies styleFunction for conditional strokeColor', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: (feature: any) => {
          if (feature?.properties?.highlight) {
            return { strokeColor: '#FF0000', strokeOpacity: 0.5 };
          }
          return {};
        },
      });

      const highlighted = result.getLineColor({
        properties: { highlight: true },
      });
      expect(highlighted).toEqual([255, 0, 0, 128]);

      const normal = result.getLineColor({
        properties: { highlight: false },
      });
      expect(normal).toEqual([0, 100, 255, 255]);
    });

    it('applies styleFunction for conditional pointColor', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: (feature: any) => {
          if (feature?.properties?.active) {
            return { pointColor: '#FFFF00', pointOpacity: 0.8 };
          }
          return {};
        },
      });

      const active = result.getPointFillColor({
        properties: { active: true },
      });
      expect(active).toEqual([255, 255, 0, 204]);

      const inactive = result.getPointFillColor({
        properties: { active: false },
      });
      expect(inactive).toEqual([0, 100, 255, 255]);
    });

    it('applies styleFunction for conditional pointRadius', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: (feature: any) => {
          if (feature?.properties?.big) {
            return { pointRadius: 50 };
          }
          return {};
        },
      });

      expect(
        result.getPointRadius({ properties: { big: true } }),
      ).toBe(50);
      expect(
        result.getPointRadius({ properties: { big: false } }),
      ).toBe(8);
    });
  });

  // ===== 12. addLayerToGroup for GeoJSON type =====

  describe('addLayerToGroup (GeoJSON)', () => {
    it('creates a GeoJSON layer from a geojson string', async () => {
      const provider = await initProvider();
      const geojson = JSON.stringify({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [10, 50] },
            properties: { name: 'test' },
          },
        ],
      });

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson,
        groupId: 'geojson-group',
      });

      expect(layerId).toBeTruthy();
    });

    it('creates a GeoJSON layer from a url', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        url: 'https://example.com/data.geojson',
        groupId: 'geojson-url-group',
      });

      expect(layerId).toBeTruthy();
    });

    it('creates a GeoJSON layer with custom StyleConfig', async () => {
      const provider = await initProvider();
      const geojson = JSON.stringify({
        type: 'FeatureCollection',
        features: [],
      });

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson,
        groupId: 'geojson-styled',
        style: {
          fillColor: '#FF0000',
          strokeColor: '#00FF00',
          strokeWidth: 4,
          pointRadius: 12,
        },
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('creates a GeoJSON layer with opacity and visibility', async () => {
      const provider = await initProvider();
      const geojson = JSON.stringify({
        type: 'FeatureCollection',
        features: [],
      });

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson,
        groupId: 'geojson-ov',
        opacity: 0.7,
        visible: false,
      });

      expect(layerId).toBeTruthy();
    });

    it('returns null when geojson and url are both missing', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        groupId: 'geojson-empty',
      });

      expect(layerId).toBeNull();
    });
  });

  // ===== 13. addLayerToGroup for WMS type =====

  describe('addLayerToGroup (WMS)', () => {
    it('creates a WMS layer with required params', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wms',
        url: 'https://example.com/wms',
        layers: 'my-layer',
        groupId: 'wms-group',
      });

      expect(layerId).toBeTruthy();
      expect(mockTileLayer).toHaveBeenCalled();
    });

    it('creates a WMS layer with optional params', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wms',
        url: 'https://example.com/wms',
        layers: 'layer1,layer2',
        styles: 'style1',
        format: 'image/jpeg',
        version: '1.1.1',
        tileSize: 512,
        minZoom: 2,
        maxZoom: 15,
        time: '2024-01-01',
        groupId: 'wms-full',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('creates a WMS layer with opacity and visibility', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wms',
        url: 'https://example.com/wms',
        layers: 'test',
        groupId: 'wms-ov',
        opacity: 0.5,
        visible: false,
      });

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 14. addLayerToGroup for WKT type =====

  describe('addLayerToGroup (WKT)', () => {
    it('creates a WKT layer from inline WKT string', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POINT(10 50)',
        groupId: 'wkt-group',
      });

      expect(layerId).toBeTruthy();
    });

    it('creates a WKT layer from POLYGON wkt', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))',
        groupId: 'wkt-polygon',
      });

      expect(layerId).toBeTruthy();
    });

    it('creates a WKT layer with custom style', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POINT(10 50)',
        style: {
          fillColor: '#FF0000',
          strokeColor: '#00FF00',
        },
        groupId: 'wkt-styled',
      } as any);

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 15. addLayerToGroup for terrain type =====

  describe('addLayerToGroup (terrain)', () => {
    it('creates a terrain layer with elevation data', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'terrain',
        elevationData: 'https://example.com/terrain/{z}/{x}/{y}.png',
        groupId: 'terrain-group',
      });

      expect(layerId).toBeTruthy();
    });

    it('creates a terrain layer with texture and elevation decoder', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'terrain',
        elevationData: 'https://example.com/terrain/{z}/{x}/{y}.png',
        texture: 'https://example.com/texture/{z}/{x}/{y}.png',
        elevationDecoder: { r: 256, g: 1, b: 0.00390625, offset: -10000 },
        wireframe: true,
        groupId: 'terrain-full',
      });

      expect(layerId).toBeTruthy();
    });

    it('creates a terrain layer with opacity and visibility', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'terrain',
        elevationData: 'https://example.com/terrain/{z}/{x}/{y}.png',
        groupId: 'terrain-ov',
        opacity: 0.8,
        visible: false,
      });

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 16. updateLayer =====

  describe('updateLayer', () => {
    it('updates a geojson layer with new geojson data', async () => {
      const provider = await initProvider();
      const geojson = JSON.stringify({
        type: 'FeatureCollection',
        features: [],
      });

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson,
        groupId: 'update-geojson-group',
      });

      const newGeojson = JSON.stringify({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [11, 51] },
            properties: {},
          },
        ],
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'geojson',
          data: { geojson: newGeojson } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a geojson layer with a URL', async () => {
      const provider = await initProvider();
      const geojson = JSON.stringify({
        type: 'FeatureCollection',
        features: [],
      });

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson,
        groupId: 'update-geojson-url',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'geojson',
          data: { url: 'https://example.com/new-data.geojson' } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates an OSM layer with new URL', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'update-osm-group',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'osm',
          data: { url: 'https://new-tile-server.example.com' } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a WMS layer with new params', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wms',
        url: 'https://example.com/wms',
        layers: 'original-layer',
        groupId: 'update-wms-group',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'wms',
          data: {
            layers: 'new-layer',
            styles: 'new-style',
            format: 'image/jpeg',
          } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a terrain layer', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'terrain',
        elevationData: 'https://example.com/terrain/{z}/{x}/{y}.png',
        groupId: 'update-terrain-group',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'terrain',
          data: {
            elevationData: 'https://example.com/terrain2/{z}/{x}/{y}.png',
            wireframe: true,
          } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('silently ignores update for non-existent layer', async () => {
      const provider = await initProvider();

      await expect(
        provider.updateLayer('non-existent', {
          type: 'geojson',
          data: { geojson: '{}' } as any,
        }),
      ).resolves.not.toThrow();
    });
  });

  // ===== 17. addBaseLayer =====

  describe('addBaseLayer', () => {
    it('adds a base layer with valid params', async () => {
      const provider = await initProvider();

      const layerId = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'basemap',
        },
        'osm-base',
        'layer-element-1',
      );

      expect(layerId).toBeTruthy();
    });

    it('returns null when basemapid is empty', async () => {
      const provider = await initProvider();

      const layerId = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'basemap',
        },
        '',
        'layer-element-1',
      );

      expect(layerId).toBeNull();
    });

    it('returns null when layerElementId is empty', async () => {
      const provider = await initProvider();

      const layerId = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'basemap',
        },
        'osm-base',
        '',
      );

      expect(layerId).toBeNull();
    });

    it('adds a base layer with opacity and visibility overrides', async () => {
      const provider = await initProvider();

      const layerId = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'basemap',
          opacity: 0.8,
          visible: true,
        },
        'osm-base-ov',
        'layer-element-ov',
      );

      expect(layerId).toBeTruthy();
    });

    it('adds a WMS base layer', async () => {
      const provider = await initProvider();

      const layerId = await provider.addBaseLayer(
        {
          type: 'wms',
          url: 'https://example.com/wms',
          layers: 'basemap-layer',
          groupId: 'basemap',
        },
        'wms-base',
        'wms-layer-element',
      );

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 18. setView =====

  describe('setView', () => {
    it('sets the view on the deck instance', async () => {
      const provider = await initProvider();
      const deck = (provider as any).deck;

      await provider.setView([13.4, 52.5], 10);

      expect(deck.setProps).toHaveBeenCalledWith({
        viewState: {
          longitude: 13.4,
          latitude: 52.5,
          zoom: 10,
          bearing: 0,
          pitch: 0,
        },
      });
    });
  });

  // ===== 19. ensureGoogleLogo =====

  describe('ensureGoogleLogo (private)', () => {
    it('adds a Google logo img element to the container', async () => {
      const provider = await initProvider();
      const container = document.createElement('div');

      (provider as any).ensureGoogleLogo(container);

      const img = container.querySelector('img');
      expect(img).not.toBeNull();
      expect(img!.alt).toBe('Google');
      expect(img!.src).toContain('google');
    });

    it('does not add logo twice', async () => {
      const provider = await initProvider();
      const container = document.createElement('div');

      (provider as any).ensureGoogleLogo(container);
      (provider as any).ensureGoogleLogo(container);

      const imgs = container.querySelectorAll('img');
      expect(imgs.length).toBe(1);
    });
  });

  // ===== 20. loadGoogleMapsApi (with mock) =====

  describe('loadGoogleMapsApi (private)', () => {
    it('calls __mockGoogleMapsApi when available', async () => {
      const provider = await initProvider();
      const mockLoader = vi.fn().mockResolvedValue(undefined);
      (window as any).__mockGoogleMapsApi = mockLoader;

      await (provider as any).loadGoogleMapsApi('test-key', {
        language: 'de',
      });

      expect(mockLoader).toHaveBeenCalledWith('test-key', { language: 'de' });

      delete (window as any).__mockGoogleMapsApi;
    });

    it('returns early if google.maps is already loaded', async () => {
      const provider = await initProvider();
      (window as any).google = { maps: {} };

      await expect(
        (provider as any).loadGoogleMapsApi('test-key'),
      ).resolves.not.toThrow();

      delete (window as any).google;
    });
  });

  // ===== 21. createDeckGLStyle with styleFunction – fill/stroke opacity branches =====

  describe('createDeckGLStyle styleFunction – opacity-less conditional branches', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    it('returns conditional fillColor WITHOUT fillOpacity', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: () => ({ fillColor: '#00FF00' }),
      });
      // styleFunction returns fillColor but no fillOpacity → should not apply opacity
      const fill = result.getFillColor({ properties: {} });
      expect(fill).toEqual([0, 255, 0, 255]);
    });

    it('returns conditional strokeColor WITHOUT strokeOpacity', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: () => ({ strokeColor: '#FF0000' }),
      });
      const stroke = result.getLineColor({ properties: {} });
      expect(stroke).toEqual([255, 0, 0, 255]);
    });

    it('returns conditional pointColor WITHOUT pointOpacity', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: () => ({ pointColor: '#0000FF' }),
      });
      const point = result.getPointFillColor({ properties: {} });
      expect(point).toEqual([0, 0, 255, 255]);
    });

    it('returns conditional fillColor WITH fillOpacity', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: () => ({ fillColor: '#00FF00', fillOpacity: 0.5 }),
      });
      const fill = result.getFillColor({ properties: {} });
      expect(fill).toEqual([0, 255, 0, 128]);
    });

    it('returns conditional strokeColor WITH strokeOpacity', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: () => ({ strokeColor: '#FF0000', strokeOpacity: 0.25 }),
      });
      const stroke = result.getLineColor({ properties: {} });
      expect(stroke).toEqual([255, 0, 0, 64]);
    });

    it('returns conditional pointColor WITH pointOpacity', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: () => ({ pointColor: '#0000FF', pointOpacity: 1.0 }),
      });
      const point = result.getPointFillColor({ properties: {} });
      expect(point).toEqual([0, 0, 255, 255]);
    });

    it('returns default when styleFunction returns empty for all accessors', () => {
      const result = (provider as any).createDeckGLStyle({
        styleFunction: () => ({}),
      });
      expect(result.getFillColor({ properties: {} })).toEqual([0, 100, 255, 76]);
      expect(result.getLineColor({ properties: {} })).toEqual([0, 100, 255, 255]);
      expect(result.getPointFillColor({ properties: {} })).toEqual([0, 100, 255, 255]);
      expect(result.getPointRadius({ properties: {} })).toBe(8);
    });
  });

  // ===== 22. addLayerToGroup for WCS type =====

  describe('addLayerToGroup (WCS)', () => {
    it('creates a WCS layer with required params', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wcs',
        url: 'https://example.com/wcs',
        coverageName: 'dem',
        groupId: 'wcs-group',
      });

      expect(layerId).toBeTruthy();
      expect(mockTileLayer).toHaveBeenCalled();
    });

    it('creates a WCS layer with optional params', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wcs',
        url: 'https://example.com/wcs',
        coverageName: 'dem',
        format: 'image/tiff',
        version: '1.1.1',
        projection: 'EPSG:4326',
        tileSize: 512,
        minZoom: 1,
        maxZoom: 18,
        opacity: 0.7,
        visible: false,
        groupId: 'wcs-full',
      } as any);

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 23. addLayerToGroup for scatterplot type =====

  describe('addLayerToGroup (scatterplot)', () => {
    it('creates a scatterplot layer with data points', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'scatterplot',
        data: [
          { position: [13.4, 52.5], radius: 10, color: [255, 0, 0, 200] },
          { position: [13.5, 52.6], radius: 20, color: [0, 255, 0, 200] },
        ],
        groupId: 'scatter-group',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('creates a scatterplot layer with empty data', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'scatterplot',
        data: [],
        groupId: 'scatter-empty',
      } as any);

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 24. addLayerToGroup for geojson with URL (no inline geojson) =====

  describe('addLayerToGroup (GeoJSON with URL)', () => {
    it('creates a GeoJSON layer from a URL without inline geojson', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        url: 'https://example.com/data.geojson',
        groupId: 'geojson-url',
      });

      expect(layerId).toBeTruthy();
    });

    it('creates a GeoJSON layer with geostylerStyle', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        geostylerStyle: {
          name: 'test-style',
          rules: [
            {
              name: 'fill-rule',
              symbolizers: [
                { kind: 'Fill', color: '#FF0000', opacity: 0.5 },
              ],
            },
          ],
        },
        groupId: 'geojson-geostyler',
      } as any);

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 25. addBaseLayer – additional edge cases =====

  describe('addBaseLayer (additional)', () => {
    it('returns null when both basemapid and layerElementId are empty', async () => {
      const provider = await initProvider();

      const layerId = await provider.addBaseLayer(
        { type: 'osm', groupId: 'basemap' },
        '',
        '',
      );

      expect(layerId).toBeNull();
    });

    it('adds a base layer with zIndex override', async () => {
      const provider = await initProvider();

      const layerId = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'basemap',
          zIndex: 5,
          visible: false,
        },
        'osm-z',
        'layer-z',
      );

      expect(layerId).toBeTruthy();
    });

    it('defaults groupId to "basemap" when not provided', async () => {
      const provider = await initProvider();

      const layerId = await provider.addBaseLayer(
        { type: 'osm' } as any,
        'osm-default',
        'layer-default',
      );

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 26. updateLayer – additional switch cases =====

  describe('updateLayer (additional switch cases)', () => {
    it('updates a WMS layer with url, transparent, version, crs, time, extraParams', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wms',
        url: 'https://example.com/wms',
        layers: 'layer1',
        groupId: 'update-wms-full',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'wms',
          data: {
            url: 'https://new.example.com/wms',
            layers: 'new-layer',
            transparent: 'FALSE',
            version: '1.1.1',
            crs: 'EPSG:4326',
            time: '2025-01-01',
            extraParams: { CQL_FILTER: 'id>100' },
          } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates an arcgis layer with new url', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'arcgis',
        url: 'https://example.com/arcgis/tile/{z}/{y}/{x}',
        groupId: 'update-arcgis-group',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'arcgis',
          data: {
            url: 'https://new.example.com/arcgis/tile/{z}/{y}/{x}',
            minZoom: 2,
            maxZoom: 16,
          } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates an arcgis layer with params and token', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'arcgis',
        url: 'https://example.com/arcgis/tile/{z}/{y}/{x}',
        groupId: 'update-arcgis-params',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'arcgis',
          data: {
            params: { layer: 'streets' },
            token: 'secret123',
          } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a WCS layer with coverage and format params', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wcs',
        url: 'https://example.com/wcs',
        coverageName: 'dem',
        groupId: 'update-wcs-group',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'wcs',
          data: {
            url: 'https://new.example.com/wcs',
            coverageName: 'dem2',
            format: 'image/png',
            version: '2.0.1',
            projection: 'EPSG:3857',
            params: { subset: 'time(2025-01-01)' },
            tileSize: 512,
            minZoom: 1,
            maxZoom: 15,
          } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a google layer (logs warning)', async () => {
      const provider = await initProvider();

      // Google layers are not easily updatable via addLayerToGroup
      // but we can still test the updateLayer path if a layer exists
      // We'll use a geojson layer and call updateLayer with 'google' type
      // to exercise the branch
      const geojson = JSON.stringify({ type: 'FeatureCollection', features: [] });
      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson,
        groupId: 'update-google-test',
      });

      // Even though the underlying layer is geojson, updateLayer switch
      // will hit the 'google' branch and log a warning without throwing
      await expect(
        provider.updateLayer(layerId, {
          type: 'google',
          data: { mapType: 'satellite', apiKey: 'test' } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a geojson layer with no data (no-op)', async () => {
      const provider = await initProvider();
      const geojson = JSON.stringify({ type: 'FeatureCollection', features: [] });

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson,
        groupId: 'update-geojson-noop',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'geojson',
          data: {} as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates an OSM layer with no URL (no-op)', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'update-osm-noop',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'osm',
          data: {} as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a terrain layer with all params', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'terrain',
        elevationData: 'https://example.com/terrain/{z}/{x}/{y}.png',
        groupId: 'update-terrain-full',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'terrain',
          data: {
            elevationData: 'https://example.com/terrain2/{z}/{x}/{y}.png',
            texture: 'https://example.com/texture/{z}/{x}/{y}.png',
            elevationDecoder: { r: 256, g: 1, b: 0.00390625, offset: -10000 },
            wireframe: true,
            color: [128, 128, 128],
            meshMaxError: 5,
          } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a wkt layer with new wkt data', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POINT(10 50)',
        groupId: 'update-wkt-group',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'wkt',
          data: { wkt: 'POINT(11 51)' } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a wkt layer with a URL', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POINT(10 50)',
        groupId: 'update-wkt-url',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'wkt',
          data: { url: 'https://example.com/data.wkt' } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a geotiff layer with various params', async () => {
      const provider = await initProvider();
      // Create a geojson layer to exercise the geotiff update branch
      const geojson = JSON.stringify({ type: 'FeatureCollection', features: [] });
      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson,
        groupId: 'update-geotiff-test',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'geotiff',
          data: {
            url: 'https://example.com/data.tif',
            nodata: -9999,
            colorMap: 'viridis',
            valueRange: [0, 100],
            resolution: 256,
            resampleMethod: 'bilinear',
          } as any,
        }),
      ).resolves.not.toThrow();
    });

    it('updates a terrain-geotiff layer with various params', async () => {
      const provider = await initProvider();
      const geojson = JSON.stringify({ type: 'FeatureCollection', features: [] });
      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson,
        groupId: 'update-terrain-geotiff',
      });

      await expect(
        provider.updateLayer(layerId, {
          type: 'terrain-geotiff',
          data: {
            url: 'https://example.com/terrain.tif',
            projection: 'EPSG:4326',
            forceProjection: true,
            nodata: -9999,
            meshMaxError: 4,
            wireframe: false,
            texture: 'https://example.com/tex.png',
            color: [200, 200, 200],
            colorMap: 'terrain',
            valueRange: [0, 3000],
            elevationScale: 1.5,
            renderMode: 'terrain',
          } as any,
        }),
      ).resolves.not.toThrow();
    });
  });

  // ===== 27. getModelUrl (private) =====

  describe('getModelUrl (private)', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    it('returns undefined for undefined model', () => {
      const result = (provider as any).getModelUrl(undefined);
      expect(result).toBeUndefined();
    });

    it('returns undefined for model without make function', () => {
      const result = (provider as any).getModelUrl({ make: 'not-a-function' });
      expect(result).toBeUndefined();
    });

    it('returns url from props.data array', () => {
      const model = {
        make: () => ({
          props: {
            data: ['https://example.com/tile/{z}/{x}/{y}.png'],
          },
        }),
      };
      const result = (provider as any).getModelUrl(model);
      expect(result).toBe('https://example.com/tile/{z}/{x}/{y}.png');
    });

    it('returns url from props.url when data is not an array', () => {
      const model = {
        make: () => ({
          props: {
            data: { type: 'FeatureCollection', features: [] },
            url: 'https://example.com/data.geojson',
          },
        }),
      };
      const result = (provider as any).getModelUrl(model);
      expect(result).toBe('https://example.com/data.geojson');
    });

    it('returns undefined when data is empty array and no url', () => {
      const model = {
        make: () => ({
          props: {
            data: [],
          },
        }),
      };
      const result = (provider as any).getModelUrl(model);
      expect(result).toBeUndefined();
    });

    it('returns undefined when make() throws', () => {
      const model = {
        make: () => {
          throw new Error('broken');
        },
      };
      const result = (provider as any).getModelUrl(model);
      expect(result).toBeUndefined();
    });

    it('returns undefined when make() returns null', () => {
      const model = {
        make: () => null,
      };
      const result = (provider as any).getModelUrl(model);
      expect(result).toBeUndefined();
    });
  });

  // ===== 28. createGeostylerDeckGLStyle edge cases =====

  describe('createGeostylerDeckGLStyle (private) – edge cases', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    it('returns defaults for style with no rules', () => {
      const result = (provider as any).createGeostylerDeckGLStyle({
        name: 'empty',
        rules: [],
      });
      expect(result.getFillColor()).toEqual([0, 100, 255, 76]);
      expect(result.getLineColor()).toEqual([0, 100, 255, 255]);
      expect(result.getPointRadius()).toBe(8);
      expect(result.getPointFillColor()).toEqual([0, 100, 255, 255]);
      expect(result.lineWidthMinPixels).toBe(2);
    });

    it('returns defaults for style with no rules property', () => {
      const result = (provider as any).createGeostylerDeckGLStyle({
        name: 'no-rules',
      });
      expect(result.getFillColor()).toEqual([0, 100, 255, 76]);
      expect(result.getLineColor()).toEqual([0, 100, 255, 255]);
    });

    it('returns defaults for rule with no symbolizers', () => {
      const result = (provider as any).createGeostylerDeckGLStyle({
        name: 'no-symbolizers',
        rules: [{ name: 'empty-rule' }],
      });
      expect(result.getFillColor()).toEqual([0, 100, 255, 76]);
    });

    it('handles Fill symbolizer with color and opacity', () => {
      const result = (provider as any).createGeostylerDeckGLStyle({
        name: 'fill-test',
        rules: [
          {
            name: 'fill',
            symbolizers: [
              {
                kind: 'Fill',
                color: '#FF0000',
                opacity: 0.5,
                outlineColor: '#00FF00',
                outlineWidth: 3,
              },
            ],
          },
        ],
      });
      expect(result.getFillColor()).toEqual([255, 0, 0, 128]);
      expect(result.getLineColor()).toEqual([0, 255, 0, 255]);
      expect(result.lineWidthMinPixels).toBe(3);
    });

    it('handles Line symbolizer with color and width', () => {
      const result = (provider as any).createGeostylerDeckGLStyle({
        name: 'line-test',
        rules: [
          {
            name: 'line',
            symbolizers: [
              {
                kind: 'Line',
                color: '#0000FF',
                width: 5,
              },
            ],
          },
        ],
      });
      expect(result.getLineColor()).toEqual([0, 0, 255, 255]);
      expect(result.lineWidthMinPixels).toBe(5);
    });

    it('handles Mark symbolizer with color and radius', () => {
      const result = (provider as any).createGeostylerDeckGLStyle({
        name: 'mark-test',
        rules: [
          {
            name: 'mark',
            symbolizers: [
              {
                kind: 'Mark',
                color: '#FFFF00',
                radius: 12,
              },
            ],
          },
        ],
      });
      expect(result.getPointFillColor()).toEqual([255, 255, 0, 255]);
      expect(result.getPointRadius()).toBe(12);
    });

    it('handles Icon symbolizer with size', () => {
      const result = (provider as any).createGeostylerDeckGLStyle({
        name: 'icon-test',
        rules: [
          {
            name: 'icon',
            symbolizers: [
              {
                kind: 'Icon',
                size: 48,
              },
            ],
          },
        ],
      });
      // Icon size 48 / 2 = 24
      expect(result.getPointRadius()).toBe(24);
    });

    it('handles GeoStyler function objects as property values (returns default)', () => {
      const result = (provider as any).createGeostylerDeckGLStyle({
        name: 'function-prop',
        rules: [
          {
            name: 'fill-fn',
            symbolizers: [
              {
                kind: 'Fill',
                color: { name: 'property', args: ['myColor'] },
                opacity: { name: 'property', args: ['myOpacity'] },
              },
            ],
          },
        ],
      });
      // GeoStyler function objects should fall through to defaults
      const fill = result.getFillColor();
      expect(fill).toBeDefined();
      expect(fill.length).toBe(4);
    });

    it('handles multiple rules with different symbolizer kinds', () => {
      const result = (provider as any).createGeostylerDeckGLStyle({
        name: 'multi-rule',
        rules: [
          {
            name: 'fill-rule',
            symbolizers: [{ kind: 'Fill', color: '#FF0000', opacity: 1.0 }],
          },
          {
            name: 'line-rule',
            symbolizers: [{ kind: 'Line', color: '#00FF00', width: 4 }],
          },
          {
            name: 'mark-rule',
            symbolizers: [{ kind: 'Mark', color: '#0000FF', radius: 15 }],
          },
        ],
      });
      expect(result.getFillColor()).toEqual([255, 0, 0, 255]);
      expect(result.getLineColor()).toEqual([0, 255, 0, 255]);
      expect(result.lineWidthMinPixels).toBe(4);
      expect(result.getPointFillColor()).toEqual([0, 0, 255, 255]);
      expect(result.getPointRadius()).toBe(15);
    });

    it('handles Fill symbolizer without outlineColor', () => {
      const result = (provider as any).createGeostylerDeckGLStyle({
        name: 'fill-no-outline',
        rules: [
          {
            name: 'fill',
            symbolizers: [{ kind: 'Fill', color: '#AABBCC', opacity: 0.8 }],
          },
        ],
      });
      expect(result.getFillColor()).toEqual([170, 187, 204, 204]);
      // strokeColor should remain default since no outlineColor was set
      expect(result.getLineColor()).toEqual([0, 100, 255, 255]);
    });
  });

  // ===== 29. addLayerToGroup for ArcGIS type =====

  describe('addLayerToGroup (ArcGIS)', () => {
    it('creates an ArcGIS tile layer', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'arcgis',
        url: 'https://example.com/arcgis/tile/{z}/{y}/{x}',
        groupId: 'arcgis-group',
      });

      expect(layerId).toBeTruthy();
      expect(mockTileLayer).toHaveBeenCalled();
    });

    it('creates an ArcGIS tile layer with token and params', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'arcgis',
        url: 'https://example.com/arcgis/tile/{z}/{y}/{x}',
        token: 'my-token',
        params: { layer: 'imagery' },
        minZoom: 3,
        maxZoom: 17,
        opacity: 0.9,
        groupId: 'arcgis-full',
      } as any);

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 30. addLayerToGroup for XYZ type =====

  describe('addLayerToGroup (XYZ)', () => {
    it('creates an XYZ tile layer', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'xyz',
        url: 'https://example.com/tiles/{z}/{x}/{y}.png',
        groupId: 'xyz-group',
      });

      expect(layerId).toBeTruthy();
      expect(mockTileLayer).toHaveBeenCalled();
    });
  });

  // ===== 31. addLayerToGroup with unsupported type =====

  describe('addLayerToGroup (unsupported type)', () => {
    it('returns null for an unsupported layer type', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'nonexistent-type',
        groupId: 'unsupported-group',
      } as any);

      expect(layerId).toBeNull();
    });
  });

  // ===== 32. WKT layer with geostylerStyle =====

  describe('addLayerToGroup (WKT with geostylerStyle)', () => {
    it('creates a WKT layer with geostylerStyle', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POINT(10 50)',
        geostylerStyle: {
          name: 'wkt-geostyler',
          rules: [
            {
              name: 'mark',
              symbolizers: [{ kind: 'Mark', color: '#FF0000', radius: 10 }],
            },
          ],
        },
        groupId: 'wkt-geostyler-group',
      } as any);

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 33. addLayerToGroup with groupVisible =====

  describe('addLayerToGroup (groupVisible)', () => {
    it('sets groupVisible on the group when provided', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        groupId: 'gv-test',
        groupVisible: false,
      });

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 34. getMap =====

  describe('getMap', () => {
    it('returns the deck instance', async () => {
      const provider = await initProvider();
      const map = provider.getMap();
      expect(map).toBeDefined();
    });

    it('returns undefined before init', () => {
      const provider = new DeckProvider();
      const map = provider.getMap();
      expect(map).toBeUndefined();
    });
  });

  // ===== 35. appendParams (exercised through WFS) =====

  describe('appendParams (private)', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    it('appends params with ? separator', () => {
      const result = (provider as any).appendParams(
        'https://example.com/wfs',
        { service: 'WFS', request: 'GetFeature' },
      );
      expect(result).toContain('?');
      expect(result).toContain('service=WFS');
      expect(result).toContain('request=GetFeature');
    });

    it('appends params with & separator when url already has ?', () => {
      const result = (provider as any).appendParams(
        'https://example.com/wfs?existing=1',
        { service: 'WFS' },
      );
      expect(result).toContain('&service=WFS');
    });

    it('returns base url when params are all undefined/null', () => {
      const result = (provider as any).appendParams(
        'https://example.com/wfs',
        { a: undefined, b: null },
      );
      expect(result).toBe('https://example.com/wfs');
    });

    it('returns base url when params is empty object', () => {
      const result = (provider as any).appendParams(
        'https://example.com/wfs',
        {},
      );
      expect(result).toBe('https://example.com/wfs');
    });
  });

  // ===== 36. addLayerToGroup for WFS type =====

  describe('addLayerToGroup (WFS)', () => {
    it('creates a WFS layer fetching GeoJSON', async () => {
      const provider = await initProvider();

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            type: 'FeatureCollection',
            features: [],
          }),
        }),
      );

      const layerId = await provider.addLayerToGroup({
        type: 'wfs',
        url: 'https://example.com/wfs',
        typeName: 'testLayer',
        groupId: 'wfs-group',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('throws when WFS fetch fails', async () => {
      const provider = await initProvider();

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        }),
      );

      await expect(
        provider.addLayerToGroup({
          type: 'wfs',
          url: 'https://example.com/wfs',
          typeName: 'testLayer',
          groupId: 'wfs-fail-group',
        } as any),
      ).rejects.toThrow('WFS request failed');
    });
  });

  // ===== 37. addLayerToGroup for Google type =====

  describe('addLayerToGroup (Google)', () => {
    it('creates a Google tile layer with apiKey', async () => {
      const provider = await initProvider();
      // Mock loadGoogleMapsApi to do nothing
      (provider as any).loadGoogleMapsApi = vi.fn().mockResolvedValue(undefined);

      const layerId = await provider.addLayerToGroup({
        type: 'google',
        apiKey: 'test-key',
        mapType: 'satellite',
        groupId: 'google-group',
      } as any);

      expect(layerId).toBeTruthy();
    });

    it('throws when apiKey is missing for Google layer', async () => {
      const provider = await initProvider();

      await expect(
        provider.addLayerToGroup({
          type: 'google',
          groupId: 'google-no-key',
        } as any),
      ).rejects.toThrow('apiKey');
    });
  });

  // ===== 38. buildOsmLayer with custom url =====

  describe('buildOsmLayer (private)', () => {
    it('builds OSM layer with custom URL', async () => {
      const provider = await initProvider();

      const layer = await (provider as any).buildOsmLayer(
        { url: 'https://custom-tiles.example.com', type: 'osm' },
        'osm-custom-id',
      );

      expect(layer).toBeDefined();
      const callArgs = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'osm-custom-id',
      );
      expect(callArgs).toBeTruthy();
    });
  });

  // ===== 39. fetchWFSFromUrl (private) – branches =====

  describe('fetchWFSFromUrl (private)', () => {
    let provider: DeckProvider;

    beforeEach(async () => {
      provider = await initProvider();
    });

    it('returns JSON for application/json output format', async () => {
      const data = { type: 'FeatureCollection', features: [] };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      }));

      const result = await (provider as any).fetchWFSFromUrl({
        url: 'https://wfs.example.com',
        typeName: 'layer',
      });

      expect(result).toEqual(data);
    });

    it('throws when fetch is not ok', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      }));

      await expect(
        (provider as any).fetchWFSFromUrl({
          url: 'https://wfs.example.com',
          typeName: 'layer',
        }),
      ).rejects.toThrow('WFS request failed');
    });

    it('defaults to JSON parse for unknown format', async () => {
      const data = { type: 'FeatureCollection', features: [] };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(data),
      }));

      const result = await (provider as any).fetchWFSFromUrl({
        url: 'https://wfs.example.com',
        typeName: 'layer',
        outputFormat: 'text/csv',
      });

      expect(result).toEqual(data);
    });

    it('parses GML when outputFormat includes gml', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('<wfs:FeatureCollection/>'),
      }));

      const result = await (provider as any).fetchWFSFromUrl({
        url: 'https://wfs.example.com',
        typeName: 'layer',
        outputFormat: 'gml3',
      });

      expect(result).toEqual({ type: 'FeatureCollection', features: [] });
    });

    it('parses GML when outputFormat includes xml', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('<xml/>'),
      }));

      const result = await (provider as any).fetchWFSFromUrl({
        url: 'https://wfs.example.com',
        typeName: 'layer',
        outputFormat: 'application/xml',
      });

      expect(result).toEqual({ type: 'FeatureCollection', features: [] });
    });
  });

  // ===== 40. createWFSLayer with geostylerStyle =====

  describe('addLayerToGroup (WFS with geostylerStyle)', () => {
    it('creates a WFS layer with geostylerStyle', async () => {
      const provider = await initProvider();

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          type: 'FeatureCollection',
          features: [],
        }),
      }));

      const layerId = await provider.addLayerToGroup({
        type: 'wfs',
        url: 'https://example.com/wfs',
        typeName: 'testLayer',
        geostylerStyle: {
          name: 'wfs-style',
          rules: [
            { name: 'fill', symbolizers: [{ kind: 'Fill', color: '#FF0000' }] },
          ],
        },
        groupId: 'wfs-geostyler',
      } as any);

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 41. onPointerMove =====

  describe('onPointerMove', () => {
    it('registers callback and returns unsubscribe function', async () => {
      const provider = await initProvider();
      const callback = vi.fn();

      const unsubscribe = provider.onPointerMove(callback);
      expect(typeof unsubscribe).toBe('function');

      // Call unsubscribe - should not throw
      unsubscribe();
    });

    it('invokes callback with coordinates when viewport is available', async () => {
      const provider = await initProvider();
      const callback = vi.fn();
      const target = (provider as any).target as HTMLDivElement;

      (provider as any).deck.getViewports = vi.fn(() => [{
        unproject: vi.fn(() => [10, 50]),
      }]);

      // Capture the event listener
      let capturedHandler: ((e: Event) => void) | undefined;
      const origAddEvent = target.addEventListener.bind(target);
      target.addEventListener = vi.fn((type: string, handler: any) => {
        if (type === 'pointermove') capturedHandler = handler;
        origAddEvent(type, handler);
      }) as any;

      provider.onPointerMove(callback);

      // Call the handler directly with a fake PointerEvent-like object
      if (capturedHandler) {
        capturedHandler({ clientX: 100, clientY: 200 } as any);
      }

      expect(callback).toHaveBeenCalledWith(
        [10, 50],
        expect.any(Array),
      );
    });

    it('invokes callback with null when no viewport', async () => {
      const provider = await initProvider();
      const callback = vi.fn();
      const target = (provider as any).target as HTMLDivElement;

      (provider as any).deck.getViewports = vi.fn(() => []);

      let capturedHandler: ((e: Event) => void) | undefined;
      const origAddEvent = target.addEventListener.bind(target);
      target.addEventListener = vi.fn((type: string, handler: any) => {
        if (type === 'pointermove') capturedHandler = handler;
        origAddEvent(type, handler);
      }) as any;

      provider.onPointerMove(callback);

      if (capturedHandler) {
        capturedHandler({ clientX: 100, clientY: 200 } as any);
      }

      expect(callback).toHaveBeenCalledWith(null, expect.any(Array));
    });

    it('invokes callback with null on error', async () => {
      const provider = await initProvider();
      const callback = vi.fn();
      const target = (provider as any).target as HTMLDivElement;

      (provider as any).deck.getViewports = vi.fn(() => {
        throw new Error('broken');
      });

      let capturedHandler: ((e: Event) => void) | undefined;
      const origAddEvent = target.addEventListener.bind(target);
      target.addEventListener = vi.fn((type: string, handler: any) => {
        if (type === 'pointermove') capturedHandler = handler;
        origAddEvent(type, handler);
      }) as any;

      provider.onPointerMove(callback);

      if (capturedHandler) {
        capturedHandler({ clientX: 100, clientY: 200 } as any);
      }

      expect(callback).toHaveBeenCalledWith(null, expect.any(Array));
    });
  });

  // ===== 42. geotiff layer error handling =====

  describe('addLayerToGroup (GeoTIFF error handling)', () => {
    it('returns a fallback GeoJsonLayer when createDeckGLGeoTIFFLayer throws', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geotiff',
        url: 'https://example.com/data.tif',
        groupId: 'geotiff-group',
      } as any);

      // Should return a fallback layer, not null
      expect(layerId).toBeTruthy();
    });
  });

  describe('addLayerToGroup (terrain-geotiff error handling)', () => {
    it('returns null when createDeckGLGeoTIFFTerrainLayer throws', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'terrain-geotiff',
        url: 'https://example.com/terrain.tif',
        groupId: 'terrain-geotiff-group',
      } as any);

      // terrain-geotiff returns null on error, which means addLayerToGroup returns null
      expect(layerId).toBeNull();
    });
  });

  // ===== 43. GeoTIFF without URL =====

  describe('addLayerToGroup (GeoTIFF without URL)', () => {
    it('returns fallback when geotiff URL is missing', async () => {
      const provider = await initProvider();

      // GeoTIFF without url should throw "GeoTIFF layer requires a URL"
      // but the error is caught in createGeoTIFFLayer's catch block
      await expect(
        provider.addLayerToGroup({
          type: 'geotiff',
          groupId: 'geotiff-no-url',
        } as any),
      ).rejects.toThrow('GeoTIFF layer requires a URL');
    });
  });

  // ===== 44a. onViewStateChange callback (lines 134-135) =====

  describe('init – onViewStateChange callback', () => {
    it('calls deck.setProps with updated viewState', async () => {
      const provider = await initProvider();
      const deck = (provider as any).deck;

      // The Deck constructor was called with onViewStateChange
      const deckCall = mockDeck.mock.calls[0][0];
      expect(deckCall.onViewStateChange).toBeDefined();

      // Simulate the callback
      const newVs = { longitude: 10, latitude: 52, zoom: 8, bearing: 0, pitch: 0 };
      deckCall.onViewStateChange({ viewState: newVs });

      expect(deck.setProps).toHaveBeenCalledWith({ viewState: newVs });
    });
  });

  // ===== 44b. XYZ layer onTileError and renderSubLayers (lines 234-256) =====

  describe('buildXyzTileLayer – callbacks', () => {
    it('onTileError logs an error without throwing', async () => {
      const provider = await initProvider();
      const layer = await (provider as any).buildXyzTileLayer(
        { url: 'https://tiles.example.com/{z}/{x}/{y}.png', type: 'osm' },
        'xyz-test-id',
      );
      expect(layer).toBeDefined();

      // Extract onTileError from TileLayer constructor call
      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'xyz-test-id',
      );
      expect(call).toBeTruthy();
      const { onTileError } = call[0];
      expect(() => onTileError(new Error('404'))).not.toThrow();
    });

    it('renderSubLayers returns transparent bitmap when data is null', async () => {
      const provider = await initProvider();
      await (provider as any).buildXyzTileLayer(
        { url: 'https://tiles.example.com/{z}/{x}/{y}.png', type: 'osm' },
        'xyz-null-data',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'xyz-null-data',
      );
      const { renderSubLayers } = call[0];
      const result = renderSubLayers({
        data: null,
        tile: { bbox: { west: 0, south: 0, east: 1, north: 1 }, width: 256, height: 256, index: { x: 0, y: 0, z: 0 } },
      });
      expect(result).toBeDefined();
      expect(result.id).toContain('dynamic-transparent-bitmap');
    });

    it('renderSubLayers returns BitmapLayer when data is present', async () => {
      const provider = await initProvider();
      await (provider as any).buildXyzTileLayer(
        { url: 'https://tiles.example.com/{z}/{x}/{y}.png', type: 'osm' },
        'xyz-with-data',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'xyz-with-data',
      );
      const { renderSubLayers } = call[0];
      const result = renderSubLayers({
        data: 'blob:image',
        tile: { bbox: { west: 0, south: 0, east: 1, north: 1 }, index: { x: 0, y: 0, z: 0 } },
        opacity: 0.8,
      });
      expect(result).toBeDefined();
    });
  });

  // ===== 44c. Google layer getTileData, renderSubLayers, onTileLoad (lines 699-767) =====

  describe('buildGoogleTileLayer – callbacks', () => {
    it('getTileData fetches a tile and returns blob', async () => {
      const provider = await initProvider();
      (provider as any).loadGoogleMapsApi = vi.fn().mockResolvedValue(undefined);

      const fakeBlob = new Blob(['pixels']);
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(fakeBlob),
      }));

      await (provider as any).buildGoogleTileLayer(
        { type: 'google', apiKey: 'test-key', mapType: 'roadmap', scale: 'scaleFactor2x' },
        'google-tile-test',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'google-tile-test',
      );
      const { getTileData } = call[0];
      const blob = await getTileData({ index: { x: 0, y: 0, z: 1 } });
      expect(blob).toBe(fakeBlob);
    });

    it('getTileData returns null when fetch fails', async () => {
      const provider = await initProvider();
      (provider as any).loadGoogleMapsApi = vi.fn().mockResolvedValue(undefined);

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

      await (provider as any).buildGoogleTileLayer(
        { type: 'google', apiKey: 'test-key', mapType: 'satellite' },
        'google-tile-fail',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'google-tile-fail',
      );
      const { getTileData } = call[0];
      const result = await getTileData({ index: { x: 0, y: 0, z: 1 } });
      expect(result).toBeNull();
    });

    it('getTileData sets language and region when configured', async () => {
      const provider = await initProvider();
      (provider as any).loadGoogleMapsApi = vi.fn().mockResolvedValue(undefined);

      const fakeBlob = new Blob(['pixels']);
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(fakeBlob),
      });
      vi.stubGlobal('fetch', fetchMock);

      await (provider as any).buildGoogleTileLayer(
        { type: 'google', apiKey: 'k', mapType: 'roadmap', language: 'de', region: 'DE', scale: 'scaleFactor1x' },
        'google-lang',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'google-lang',
      );
      const { getTileData } = call[0];
      await getTileData({ index: { x: 0, y: 0, z: 1 } });

      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('language=de');
      expect(url).toContain('region=DE');
      expect(url).toContain('scale=1');
    });

    it('renderSubLayers returns null when data is falsy', async () => {
      const provider = await initProvider();
      (provider as any).loadGoogleMapsApi = vi.fn().mockResolvedValue(undefined);

      await (provider as any).buildGoogleTileLayer(
        { type: 'google', apiKey: 'k', mapType: 'roadmap' },
        'google-rs-null',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'google-rs-null',
      );
      const { renderSubLayers } = call[0];
      const result = renderSubLayers({
        data: null,
        tile: { bbox: { west: 0, south: 0, east: 1, north: 1 }, index: { x: 0, y: 0, z: 0 } },
      });
      expect(result).toBeNull();
    });

    it('renderSubLayers returns BitmapLayer when data is present', async () => {
      const provider = await initProvider();
      (provider as any).loadGoogleMapsApi = vi.fn().mockResolvedValue(undefined);

      await (provider as any).buildGoogleTileLayer(
        { type: 'google', apiKey: 'k', mapType: 'roadmap' },
        'google-rs-data',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'google-rs-data',
      );
      const { renderSubLayers } = call[0];
      const result = renderSubLayers({
        data: 'blob:image',
        opacity: 0.7,
        tile: { bbox: { west: 0, south: 0, east: 1, north: 1 }, index: { x: 0, y: 0, z: 0 } },
      });
      expect(result).toBeDefined();
    });

    it('onTileLoad calls ensureGoogleLogo', async () => {
      const provider = await initProvider();
      (provider as any).loadGoogleMapsApi = vi.fn().mockResolvedValue(undefined);
      const spy = vi.spyOn(provider as any, 'ensureGoogleLogo');

      await (provider as any).buildGoogleTileLayer(
        { type: 'google', apiKey: 'k', mapType: 'roadmap' },
        'google-onload',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'google-onload',
      );
      const { onTileLoad } = call[0];
      onTileLoad();
      expect(spy).toHaveBeenCalled();
    });
  });

  // ===== 44d. loadGoogleMapsApi – script loading branch (lines 802-822) =====

  describe('loadGoogleMapsApi – script injection branch', () => {
    it('injects script element and resolves on callback', async () => {
      const provider = await initProvider();
      // Remove mock loader and google.maps so script branch is hit
      delete (window as any).__mockGoogleMapsApi;
      delete (window as any).google;

      const origAppend = document.head.appendChild.bind(document.head);
      document.head.appendChild = vi.fn((el: any) => {
        // Simulate the Google Maps callback being invoked
        if (el.tagName === 'SCRIPT' && el.src) {
          const url = new URL(el.src);
          const cbName = url.searchParams.get('callback');
          if (cbName) (window as any)[cbName]();
        }
        return origAppend(el);
      }) as any;

      await expect(
        (provider as any).loadGoogleMapsApi('test-key', { language: 'de', region: 'DE', libraries: ['places', 'geometry'] }),
      ).resolves.not.toThrow();

      document.head.appendChild = origAppend;
    });

    it('rejects when script fails to load', async () => {
      const provider = await initProvider();
      delete (window as any).__mockGoogleMapsApi;
      delete (window as any).google;

      const origAppend = document.head.appendChild.bind(document.head);
      document.head.appendChild = vi.fn((el: any) => {
        if (el.tagName === 'SCRIPT') {
          // Simulate error after a microtask
          setTimeout(() => el.onerror(), 0);
        }
        return origAppend(el);
      }) as any;

      await expect(
        (provider as any).loadGoogleMapsApi('bad-key'),
      ).rejects.toThrow('Google Maps JS API failed to load');

      document.head.appendChild = origAppend;
    });
  });

  // ===== 44e. buildScatterPlot – onHover callback (lines 856-867) =====

  describe('buildScatterPlot – onHover', () => {
    it('executes onHover callback without throwing', async () => {
      const provider = await initProvider();
      const { ScatterplotLayer } = await import('@deck.gl/layers');

      const layer = await (provider as any).buildScatterPlot(
        {
          type: 'scatterplot',
          data: [{ position: [10, 50], radius: 5, color: [255, 0, 0, 255] }],
        },
        'scatter-hover-test',
      );

      expect(layer).toBeDefined();
      // Extract the onHover from the ScatterplotLayer constructor call
      const scatterCall = (ScatterplotLayer as any).mock.calls.find(
        (c: any[]) => c[0]?.id === 'scatter-hover-test',
      );
      expect(scatterCall).toBeTruthy();
      const { onHover } = scatterCall[0];
      expect(() => onHover({ object: { name: 'test' } })).not.toThrow();
      expect(() => onHover({ object: null })).not.toThrow();
    });
  });

  // ===== 44f. WMS getTileData, onTileError, renderSubLayers (lines 994-1042) =====

  describe('buildWmsTileLayer – callbacks', () => {
    it('getTileData fetches tile and creates ImageBitmap', async () => {
      const provider = await initProvider();
      const fakeImageBitmap = { width: 256, height: 256 };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(new Blob(['pixels'])),
      }));
      vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(fakeImageBitmap));

      await (provider as any).buildWmsTileLayer(
        { type: 'wms', url: 'https://example.com/wms', layers: 'test', version: '1.3.0' },
        'wms-td-test',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wms-td-test',
      );
      const { getTileData } = call[0];
      const result = await getTileData({
        bbox: { west: 8, south: 50, east: 9, north: 51 },
      });
      expect(result).toBe(fakeImageBitmap);
    });

    it('getTileData returns canvas fallback on fetch error', async () => {
      const provider = await initProvider();
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

      await (provider as any).buildWmsTileLayer(
        { type: 'wms', url: 'https://example.com/wms', layers: 'test' },
        'wms-td-fail',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wms-td-fail',
      );
      const { getTileData } = call[0];
      const result = await getTileData({
        bbox: { west: 8, south: 50, east: 9, north: 51 },
      });
      expect(result).toBeInstanceOf(HTMLCanvasElement);
    });

    it('onTileError logs without throwing', async () => {
      const provider = await initProvider();
      await (provider as any).buildWmsTileLayer(
        { type: 'wms', url: 'https://example.com/wms', layers: 'test' },
        'wms-err',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wms-err',
      );
      expect(() => call[0].onTileError(new Error('tile err'))).not.toThrow();
    });

    it('renderSubLayers returns canvas-based BitmapLayer for HTMLCanvasElement data', async () => {
      const provider = await initProvider();
      await (provider as any).buildWmsTileLayer(
        { type: 'wms', url: 'https://example.com/wms', layers: 'test' },
        'wms-rs-canvas',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wms-rs-canvas',
      );
      const { renderSubLayers } = call[0];
      const canvas = document.createElement('canvas');
      const result = renderSubLayers({
        data: canvas,
        tile: { bbox: { west: 0, south: 0, east: 1, north: 1 }, width: 256, height: 256, index: { x: 0, y: 0, z: 0 } },
      });
      expect(result).toBeDefined();
    });

    it('renderSubLayers returns image BitmapLayer for non-canvas data', async () => {
      const provider = await initProvider();
      await (provider as any).buildWmsTileLayer(
        { type: 'wms', url: 'https://example.com/wms', layers: 'test' },
        'wms-rs-img',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wms-rs-img',
      );
      const { renderSubLayers } = call[0];
      const result = renderSubLayers({
        data: { width: 256, height: 256 },
        tile: { bbox: { west: 0, south: 0, east: 1, north: 1 }, index: { x: 0, y: 0, z: 0 } },
        opacity: 0.9,
      });
      expect(result).toBeDefined();
    });
  });

  // ===== 44g. WCS getTileData, renderSubLayers, onTileError (lines 1099-1182) =====

  describe('buildWcsTileLayer – callbacks', () => {
    it('getTileData (WCS 2.0.x) fetches tile and creates ImageBitmap', async () => {
      const provider = await initProvider();
      const fakeImageBitmap = { width: 256, height: 256 };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(new Blob(['pixels'])),
      }));
      vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(fakeImageBitmap));

      await (provider as any).buildWcsTileLayer(
        { type: 'wcs', url: 'https://example.com/wcs', coverageName: 'dem', version: '2.0.1', format: 'image/tiff' },
        'wcs-20-test',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wcs-20-test',
      );
      const { getTileData } = call[0];
      const result = await getTileData({
        bbox: { west: 8, south: 50, east: 9, north: 51 },
      });
      expect(result).toBe(fakeImageBitmap);
    });

    it('getTileData (WCS 2.0.x) returns canvas fallback on fetch error', async () => {
      const provider = await initProvider();
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

      await (provider as any).buildWcsTileLayer(
        { type: 'wcs', url: 'https://example.com/wcs', coverageName: 'dem', version: '2.0.1' },
        'wcs-20-fail',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wcs-20-fail',
      );
      const { getTileData } = call[0];
      const result = await getTileData({
        bbox: { west: 8, south: 50, east: 9, north: 51 },
      });
      expect(result).toBeInstanceOf(HTMLCanvasElement);
    });

    it('getTileData (WCS 2.0.x) adds geotiff:compression for tiff format', async () => {
      const provider = await initProvider();
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(new Blob([])),
      });
      vi.stubGlobal('fetch', fetchMock);
      vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ width: 256 }));

      await (provider as any).buildWcsTileLayer(
        { type: 'wcs', url: 'https://example.com/wcs', coverageName: 'dem', version: '2.0.1', format: 'image/geotiff' },
        'wcs-20-tiff',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wcs-20-tiff',
      );
      const { getTileData } = call[0];
      await getTileData({ bbox: { west: 8, south: 50, east: 9, north: 51 } });
      const url = fetchMock.mock.calls[0][0] as string;
      expect(url).toContain('subset=X');
      expect(url).toContain('subset=Y');
    });

    it('getTileData (WCS 1.x.x) fetches tile and creates ImageBitmap', async () => {
      const provider = await initProvider();
      const fakeImageBitmap = { width: 256, height: 256 };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(new Blob(['pixels'])),
      }));
      vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(fakeImageBitmap));

      await (provider as any).buildWcsTileLayer(
        { type: 'wcs', url: 'https://example.com/wcs', coverageName: 'dem', version: '1.1.1' },
        'wcs-1x-test',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wcs-1x-test',
      );
      const { getTileData } = call[0];
      const result = await getTileData({
        bbox: { west: 8, south: 50, east: 9, north: 51 },
      });
      expect(result).toBe(fakeImageBitmap);
    });

    it('getTileData (WCS 1.x.x) returns canvas fallback on fetch error', async () => {
      const provider = await initProvider();
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')));

      await (provider as any).buildWcsTileLayer(
        { type: 'wcs', url: 'https://example.com/wcs', coverageName: 'dem', version: '1.1.1' },
        'wcs-1x-fail',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wcs-1x-fail',
      );
      const { getTileData } = call[0];
      const result = await getTileData({
        bbox: { west: 8, south: 50, east: 9, north: 51 },
      });
      expect(result).toBeInstanceOf(HTMLCanvasElement);
    });

    it('onTileError logs without throwing', async () => {
      const provider = await initProvider();
      await (provider as any).buildWcsTileLayer(
        { type: 'wcs', url: 'https://example.com/wcs', coverageName: 'dem' },
        'wcs-err',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wcs-err',
      );
      expect(() => call[0].onTileError(new Error('wcs tile err'))).not.toThrow();
    });

    it('renderSubLayers returns canvas-based BitmapLayer for HTMLCanvasElement data', async () => {
      const provider = await initProvider();
      await (provider as any).buildWcsTileLayer(
        { type: 'wcs', url: 'https://example.com/wcs', coverageName: 'dem' },
        'wcs-rs-canvas',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wcs-rs-canvas',
      );
      const { renderSubLayers } = call[0];
      const canvas = document.createElement('canvas');
      const result = renderSubLayers({
        data: canvas,
        tile: { bbox: { west: 0, south: 0, east: 1, north: 1 }, width: 256, height: 256, index: { x: 0, y: 0, z: 0 } },
      });
      expect(result).toBeDefined();
    });

    it('renderSubLayers returns image BitmapLayer for non-canvas data', async () => {
      const provider = await initProvider();
      await (provider as any).buildWcsTileLayer(
        { type: 'wcs', url: 'https://example.com/wcs', coverageName: 'dem' },
        'wcs-rs-img',
      );

      const call = mockTileLayer.mock.calls.find(
        (c: any[]) => c[0]?.id === 'wcs-rs-img',
      );
      const { renderSubLayers } = call[0];
      const result = renderSubLayers({
        data: { width: 256, height: 256 },
        tile: { bbox: { west: 0, south: 0, east: 1, north: 1 }, index: { x: 0, y: 0, z: 0 } },
        opacity: 0.5,
      });
      expect(result).toBeDefined();
    });
  });

  // ===== 44h. addLayerToGroup with zIndex (line 1302) =====

  describe('addLayerToGroup – zIndex override', () => {
    it('applies zIndex override when provided', async () => {
      const provider = await initProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        groupId: 'zindex-test',
        zIndex: 42,
      } as any);

      expect(layerId).toBeTruthy();
    });
  });

  // ===== 44i. updateLayer 'wfs' case (lines 1536-1538) =====

  describe('updateLayer (wfs case)', () => {
    it('updates a WFS layer with new config', async () => {
      const provider = await initProvider();

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ type: 'FeatureCollection', features: [] }),
      }));

      const layerId = await provider.addLayerToGroup({
        type: 'wfs',
        url: 'https://example.com/wfs',
        typeName: 'layer1',
        groupId: 'update-wfs-group',
      } as any);

      expect(layerId).toBeTruthy();

      await expect(
        provider.updateLayer(layerId, {
          type: 'wfs',
          data: {
            url: 'https://example.com/wfs2',
            typeName: 'layer2',
          } as any,
        }),
      ).resolves.not.toThrow();
    });
  });

  // ===== 44j. wktToGeoJSON – wellknown parser not available (line 1673) =====

  describe('wktToGeoJSON – parser not available', () => {
    it('throws when wellknown has no parse function', async () => {
      const provider = await initProvider();
      const wk = await import('wellknown');

      // Save original and replace with non-function
      const origDefault = (wk.wellknownModule as any).default;
      const origParse = (wk.wellknownModule as any).parse;
      (wk.wellknownModule as any).default = 'not-a-function';
      (wk.wellknownModule as any).parse = undefined;

      await expect(
        (provider as any).wktToGeoJSON('POINT(10 50)'),
      ).rejects.toThrow('wellknown parser not available');

      // Restore
      (wk.wellknownModule as any).default = origDefault;
      if (origParse) (wk.wellknownModule as any).parse = origParse;
    });
  });

  // ===== 44k. createGeoTIFFLayer success path (line 1711) =====

  describe('createGeoTIFFLayer – success path', () => {
    it('returns the layer when createDeckGLGeoTIFFLayer succeeds', async () => {
      const provider = await initProvider();
      const { createDeckGLGeoTIFFLayer } = await import('./DeckGLGeoTIFFLayer');
      const fakeLayer = { id: 'geotiff-success', props: {} };
      (createDeckGLGeoTIFFLayer as any).mockResolvedValueOnce(fakeLayer);

      const result = await (provider as any).createGeoTIFFLayer(
        { type: 'geotiff', url: 'https://example.com/data.tif', opacity: 0.8, visible: true },
        'geotiff-success',
      );

      expect(result).toBe(fakeLayer);
    });
  });

  // ===== 44. WKT layer with null geometry =====

  describe('wktToGeoJSON (null geometry)', () => {
    it('throws when wellknown returns null', async () => {
      const provider = await initProvider();

      // Override the wellknown mock to return null
      const { wellknownModule } = await import('wellknown');
      const defaultFn = (wellknownModule as any).default;
      (wellknownModule as any).default = vi.fn().mockReturnValue(null);

      await expect(
        (provider as any).wktToGeoJSON('INVALID'),
      ).rejects.toThrow('Failed to parse WKT');

      // Restore
      (wellknownModule as any).default = defaultFn;
    });
  });

  // ===== 45. resolveWktText edge cases =====

  describe('resolveWktText (private)', () => {
    it('throws when neither wkt nor url provided', async () => {
      const provider = await initProvider();

      await expect(
        (provider as any).resolveWktText({}),
      ).rejects.toThrow('Either wkt or url must be provided');
    });

    it('returns wkt string directly', async () => {
      const provider = await initProvider();
      const result = await (provider as any).resolveWktText({ wkt: 'POINT(10 50)' });
      expect(result).toBe('POINT(10 50)');
    });

    it('fetches WKT text from URL', async () => {
      const provider = await initProvider();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('POINT(10 50)'),
      }));

      const result = await (provider as any).resolveWktText({ url: 'https://example.com/data.wkt' });
      expect(result).toBe('POINT(10 50)');
    });

    it('throws when WKT fetch fails', async () => {
      const provider = await initProvider();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }));

      await expect(
        (provider as any).resolveWktText({ url: 'https://example.com/bad.wkt' }),
      ).rejects.toThrow('Failed to fetch WKT');
    });
  });

  describe('getView / setView', () => {
    it('returns null before init', () => {
      const provider = new DeckProvider();
      expect(provider.getView()).toBeNull();
    });

    it('returns the seed view after init', async () => {
      const provider = await initProvider();
      const view = provider.getView();
      expect(view).not.toBeNull();
      expect(typeof view!.center[0]).toBe('number');
      expect(typeof view!.center[1]).toBe('number');
      expect(typeof view!.zoom).toBe('number');
    });

    it('setView updates the live viewState that getView returns', async () => {
      const provider = await initProvider();
      await provider.setView([12.34, 56.78], 9);
      expect(provider.getView()).toEqual({ center: [12.34, 56.78], zoom: 9 });
    });
  });
});
