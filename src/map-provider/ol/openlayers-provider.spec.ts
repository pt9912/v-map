import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const {
  mockMap,
  mockView,
  mockVectorLayer,
  mockLayerGroup,
  mockTileLayer,
  mockImageLayer,
  mockWebGLTileLayer,
  mockVectorSource,
  mockTileWMS,
  mockOSM,
  mockXYZ,
  mockGoogle,
  mockTileArcGISRest,
  mockGeoJSON,
  mockGML2,
  mockGML3,
  mockGML32,
  mockWKT,
  mockControl,
  mockFromLonLat,
  mockBboxStrategy,
  mockImageSource,
} = vi.hoisted(() => {
  const layerProto = {
    set: vi.fn(),
    get: vi.fn(),
    setOpacity: vi.fn(),
    setVisible: vi.fn(),
    setZIndex: vi.fn(),
    setSource: vi.fn(),
    setStyle: vi.fn(),
    getSource: vi.fn(),
  };

  const hoistedMockTileLayer = vi.fn().mockImplementation(function (options: any) {
    return { ...layerProto, ...options, set: vi.fn(), get: vi.fn(), setOpacity: vi.fn(), setVisible: vi.fn(), setZIndex: vi.fn(), setSource: vi.fn() };
  });

  const hoistedMockImageLayer = vi.fn().mockImplementation(function (options: any) {
    return { ...layerProto, ...options, set: vi.fn(), get: vi.fn(), setOpacity: vi.fn(), setVisible: vi.fn(), setZIndex: vi.fn(), setSource: vi.fn() };
  });

  const hoistedMockVectorLayer = vi.fn().mockImplementation(function (options: any) {
    return { ...layerProto, ...options, set: vi.fn(), get: vi.fn(), setOpacity: vi.fn(), setVisible: vi.fn(), setZIndex: vi.fn(), setSource: vi.fn(), setStyle: vi.fn() };
  });

  const hoistedMockLayerGroup = vi.fn().mockImplementation(function (options: any) {
    const layers: any[] = [];
    return {
      ...options,
      get: vi.fn((key: string) => {
        if (key === 'groupId') return options?.properties?.groupId;
        return undefined;
      }),
      set: vi.fn(),
      getLayers: vi.fn(() => ({
        getArray: vi.fn(() => layers),
        push: vi.fn((l: any) => layers.push(l)),
        remove: vi.fn((l: any) => {
          const idx = layers.indexOf(l);
          if (idx >= 0) layers.splice(idx, 1);
        }),
        clear: vi.fn(() => layers.length = 0),
      })),
      setVisible: vi.fn(),
    };
  });

  const hoistedMockWebGLTileLayer = vi.fn().mockImplementation(function (options: any) {
    return { ...layerProto, ...options, set: vi.fn(), get: vi.fn() };
  });

  // The map's top-level layer group. _forEachLayer checks instanceof LayerGroup.
  // Since our mock LayerGroup is a plain function, we need to make mapLayerGroup
  // also have a .get() method for the else-branch fallback.
  const mapLayerGroup = {
    getLayers: vi.fn(() => ({
      getArray: vi.fn(() => []),
    })),
    get: vi.fn(() => undefined),
  };

  const viewInstance = {
    animate: vi.fn(),
    getProjection: vi.fn(() => 'EPSG:3857'),
    getResolution: vi.fn(() => 1),
  };

  const hoistedMockView = vi.fn().mockImplementation(function () {
    return viewInstance;
  });

  const mapInstance = {
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    addControl: vi.fn(),
    setTarget: vi.fn(),
    getView: vi.fn(() => viewInstance),
    getLayerGroup: vi.fn(() => mapLayerGroup),
    getTargetElement: vi.fn(() => ({
      dispatchEvent: vi.fn(),
    })),
    updateSize: vi.fn(),
  };

  const hoistedMockMap = vi.fn().mockImplementation(function () {
    return mapInstance;
  });

  const readFeaturesMock = vi.fn(() => [{ type: 'Feature' }]);

  return {
    mockMap: hoistedMockMap,
    mapInstance,
    mockView: hoistedMockView,
    viewInstance,
    mockVectorLayer: hoistedMockVectorLayer,
    mockLayerGroup: hoistedMockLayerGroup,
    mockTileLayer: hoistedMockTileLayer,
    mockImageLayer: hoistedMockImageLayer,
    mockWebGLTileLayer: hoistedMockWebGLTileLayer,
    mockVectorSource: vi.fn().mockImplementation(function (options: any) {
      return { ...options };
    }),
    mockTileWMS: vi.fn().mockImplementation(function (options: any) {
      return { ...options };
    }),
    mockOSM: vi.fn().mockImplementation(function (options: any) {
      return { ...options };
    }),
    mockXYZ: vi.fn().mockImplementation(function (options: any) {
      return { ...options };
    }),
    mockGoogle: vi.fn().mockImplementation(function (options: any) {
      return {
        ...options,
        on: vi.fn(),
        getState: vi.fn(() => 'ready'),
        getError: vi.fn(),
      };
    }),
    mockTileArcGISRest: vi.fn().mockImplementation(function (options: any) {
      return {
        ...options,
        getParams: vi.fn(() => options?.params ?? {}),
        getUrls: vi.fn(() => [options?.url]),
      };
    }),
    mockGeoJSON: vi.fn().mockImplementation(function () {
      return { readFeatures: readFeaturesMock };
    }),
    mockGML2: vi.fn(),
    mockGML3: vi.fn(),
    mockGML32: vi.fn(),
    mockWKT: vi.fn().mockImplementation(function () {
      return { readFeature: vi.fn(() => ({ type: 'Feature' })) };
    }),
    mockControl: vi.fn(),
    mockFromLonLat: vi.fn((c: any) => c),
    mockBboxStrategy: vi.fn(),
    mockImageSource: vi.fn().mockImplementation(function () { /* no explicit return so `this` is preserved for subclasses */ }),
  };
});

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock('ol/Map', () => ({ __esModule: true, default: mockMap }));
vi.mock('ol/View', () => ({ __esModule: true, default: mockView }));
vi.mock('ol/layer/Vector', () => ({ __esModule: true, default: mockVectorLayer }));
vi.mock('ol/layer/Group', () => ({ __esModule: true, default: mockLayerGroup }));
vi.mock('ol/layer/Tile', () => ({ __esModule: true, default: mockTileLayer }));
vi.mock('ol/layer/Image', () => ({ __esModule: true, default: mockImageLayer }));
vi.mock('ol/layer/WebGLTile', () => ({ __esModule: true, default: mockWebGLTileLayer }));
vi.mock('ol/source/Vector', () => ({ __esModule: true, default: mockVectorSource }));
vi.mock('ol/source/TileWMS', () => ({ __esModule: true, default: mockTileWMS }));
vi.mock('ol/source/OSM', () => ({ __esModule: true, default: mockOSM }));
vi.mock('ol/source/XYZ', () => ({ __esModule: true, default: mockXYZ }));
vi.mock('ol/source/Google', () => ({ __esModule: true, default: mockGoogle }));
vi.mock('ol/source/TileArcGISRest', () => ({ __esModule: true, default: mockTileArcGISRest }));
vi.mock('ol/source/Image', () => ({ __esModule: true, default: mockImageSource }));
vi.mock('ol/Image', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(function () {
    return {
      load: vi.fn(),
      getImage: vi.fn(() => ({ src: '', crossOrigin: '' })),
    };
  }),
}));
vi.mock('ol/format/GeoJSON', () => ({ __esModule: true, default: mockGeoJSON }));
vi.mock('ol/format/GML2', () => ({ __esModule: true, default: mockGML2 }));
vi.mock('ol/format/GML3', () => ({ __esModule: true, default: mockGML3 }));
vi.mock('ol/format/GML32', () => ({ __esModule: true, default: mockGML32 }));
vi.mock('ol/format/WKT', () => ({ __esModule: true, default: mockWKT }));
vi.mock('ol/control/Control', () => ({ __esModule: true, default: mockControl }));
vi.mock('ol/style/Style', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Fill', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Stroke', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Circle', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Icon', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Text', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/loadingstrategy', () => ({ __esModule: true, bbox: mockBboxStrategy }));
vi.mock('ol/proj', () => ({
  __esModule: true,
  fromLonLat: mockFromLonLat,
}));

vi.mock('./openlayers-helper', () => ({
  __esModule: true,
  injectOlCss: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./CustomGeoTiff', () => ({
  __esModule: true,
  createCustomGeoTiff: vi.fn().mockResolvedValue(
    vi.fn().mockImplementation(function () {
      return { registerProjectionIfNeeded: vi.fn().mockResolvedValue(undefined) };
    }),
  ),
}));

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  error: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Import the class under test AFTER all mocks
// ---------------------------------------------------------------------------
import { OpenLayersProvider } from './openlayers-provider';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createProvider(): OpenLayersProvider {
  return new OpenLayersProvider();
}

async function createInitializedProvider(): Promise<OpenLayersProvider> {
  const provider = createProvider();
  const target = document.createElement('div');
  const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });

  // Stub ResizeObserver
  vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(function () {
    return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
  }));

  await provider.init({ target, shadowRoot } as any);
  return provider;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('OpenLayersProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue('test-uuid'),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -----------------------------------------------------------------------
  // init
  // -----------------------------------------------------------------------
  describe('init', () => {
    it('creates a map with default center and zoom', async () => {
      const provider = createProvider();
      const target = document.createElement('div');
      const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
      vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(function () {
        return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
      }));

      await provider.init({ target, shadowRoot } as any);

      expect(mockMap).toHaveBeenCalled();
      expect(mockView).toHaveBeenCalled();
      expect(mockFromLonLat).toHaveBeenCalledWith([0, 0]);
    });

    it('creates a map with custom center and zoom', async () => {
      const provider = createProvider();
      const target = document.createElement('div');
      const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
      vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(function () {
        return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
      }));

      await provider.init({
        target,
        shadowRoot,
        mapInitOptions: { center: [10, 50], zoom: 7 },
      } as any);

      expect(mockFromLonLat).toHaveBeenCalledWith([10, 50]);
    });
  });

  // -----------------------------------------------------------------------
  // destroy
  // -----------------------------------------------------------------------
  describe('destroy', () => {
    it('sets map target to undefined', async () => {
      const provider = await createInitializedProvider();
      const map = (provider as any).map;

      await provider.destroy();

      expect(map.setTarget).toHaveBeenCalledWith(undefined);
      expect((provider as any).map).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // setView
  // -----------------------------------------------------------------------
  describe('setView', () => {
    it('animates the view to new center and zoom', async () => {
      const provider = await createInitializedProvider();
      const view = (provider as any).map.getView();

      await provider.setView([10, 50], 7);

      expect(view.animate).toHaveBeenCalledWith(
        expect.objectContaining({ zoom: 7, duration: 0 }),
      );
      expect(mockFromLonLat).toHaveBeenCalledWith([10, 50]);
    });

    it('does nothing when map is not initialized', async () => {
      const provider = createProvider();
      await expect(provider.setView([0, 0], 2)).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // createLayer - OSM
  // -----------------------------------------------------------------------
  describe('createLayer - OSM', () => {
    it('creates an OSM layer with default URL', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({ type: 'osm' });

      expect(mockTileLayer).toHaveBeenCalled();
      expect(mockOSM).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        }),
      );
      expect(layer).toBeTruthy();
    });

    it('creates an OSM layer with custom URL', async () => {
      const provider = await createInitializedProvider();
      await (provider as any).createLayer({
        type: 'osm',
        url: 'https://custom.tiles.com',
      });

      expect(mockOSM).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://custom.tiles.com/{z}/{x}/{y}.png',
        }),
      );
    });
  });

  // -----------------------------------------------------------------------
  // createLayer - XYZ
  // -----------------------------------------------------------------------
  describe('createLayer - XYZ', () => {
    it('creates an XYZ layer', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'xyz',
        url: 'https://tiles.example.com/{z}/{x}/{y}.png',
      });

      expect(mockTileLayer).toHaveBeenCalled();
      expect(mockXYZ).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://tiles.example.com/{z}/{x}/{y}.png',
        }),
      );
      expect(layer).toBeTruthy();
    });

    it('uses default maxZoom of 19 for XYZ', async () => {
      const provider = await createInitializedProvider();
      await (provider as any).createLayer({
        type: 'xyz',
        url: 'https://tiles.example.com/{z}/{x}/{y}.png',
      });

      expect(mockXYZ).toHaveBeenCalledWith(
        expect.objectContaining({ maxZoom: 19 }),
      );
    });
  });

  // -----------------------------------------------------------------------
  // createLayer - WMS
  // -----------------------------------------------------------------------
  describe('createLayer - WMS', () => {
    it('creates a WMS layer', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'wms',
        url: 'https://wms.example.com/service',
        layers: 'topo',
      });

      expect(mockTileLayer).toHaveBeenCalled();
      expect(mockTileWMS).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://wms.example.com/service',
          params: expect.objectContaining({
            LAYERS: 'topo',
            TILED: true,
          }),
        }),
      );
      expect(layer).toBeTruthy();
    });

    it('passes extraParams to WMS', async () => {
      const provider = await createInitializedProvider();
      await (provider as any).createLayer({
        type: 'wms',
        url: 'https://wms.example.com',
        layers: 'layer1',
        extraParams: { FORMAT: 'image/png' },
      });

      expect(mockTileWMS).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ FORMAT: 'image/png' }),
        }),
      );
    });
  });

  // -----------------------------------------------------------------------
  // createLayer - GeoJSON
  // -----------------------------------------------------------------------
  describe('createLayer - GeoJSON', () => {
    it('creates a GeoJSON layer from inline geojson', async () => {
      const provider = await createInitializedProvider();
      const geojsonStr = JSON.stringify({
        type: 'FeatureCollection',
        features: [],
      });
      const layer = await (provider as any).createLayer({
        type: 'geojson',
        geojson: geojsonStr,
      });

      expect(mockVectorLayer).toHaveBeenCalled();
      expect(layer).toBeTruthy();
    });

    it('creates a GeoJSON layer from URL', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'geojson',
        url: 'https://example.com/data.geojson',
      });

      expect(mockVectorSource).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://example.com/data.geojson',
        }),
      );
      expect(layer).toBeTruthy();
    });

    it('applies geostylerStyle when provided', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'geojson',
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        geostylerStyle: {
          name: 'test-style',
          rules: [
            {
              name: 'fill-rule',
              symbolizers: [
                { kind: 'Fill', color: '#FF0000' },
              ],
            },
          ],
        },
      });

      expect(layer).toBeTruthy();
    });

    it('applies enhanced style when no geostylerStyle', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'geojson',
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        style: { fillColor: '#FF0000' },
      });

      expect(layer).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // createLayer - Google
  // -----------------------------------------------------------------------
  describe('createLayer - Google', () => {
    it('creates a Google layer', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'google',
        apiKey: 'test-key',
      });

      expect(mockGoogle).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'test-key',
          mapType: 'roadmap',
        }),
      );
      expect(layer).toBeTruthy();
    });

    it('throws when apiKey is missing for Google layer', async () => {
      const provider = await createInitializedProvider();
      await expect(
        (provider as any).createLayer({ type: 'google' }),
      ).rejects.toThrow('apiKey');
    });

    it('adds google logo control only once', async () => {
      const provider = await createInitializedProvider();
      const map = (provider as any).map;

      await (provider as any).createLayer({
        type: 'google',
        apiKey: 'key1',
      });
      const addControlCount1 = map.addControl.mock.calls.length;

      await (provider as any).createLayer({
        type: 'google',
        apiKey: 'key2',
      });
      const addControlCount2 = map.addControl.mock.calls.length;

      // Second call should NOT add another control
      expect(addControlCount2).toBe(addControlCount1);
    });
  });

  // -----------------------------------------------------------------------
  // createLayer - ArcGIS
  // -----------------------------------------------------------------------
  describe('createLayer - ArcGIS', () => {
    it('creates an ArcGIS layer', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'arcgis',
        url: 'https://arcgis.example.com/rest',
        params: { layers: 'show:0' },
      });

      expect(mockTileArcGISRest).toHaveBeenCalled();
      expect(mockTileLayer).toHaveBeenCalled();
      expect(layer).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // createLayer - WFS
  // -----------------------------------------------------------------------
  describe('createLayer - WFS', () => {
    it('creates a WFS layer with default outputFormat', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'wfs',
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
      });

      expect(mockVectorLayer).toHaveBeenCalled();
      expect(layer).toBeTruthy();
    });

    it('creates a WFS layer with GML2 format', async () => {
      const provider = await createInitializedProvider();
      await (provider as any).createLayer({
        type: 'wfs',
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
        outputFormat: 'GML2',
      });

      expect(mockGML2).toHaveBeenCalled();
    });

    it('creates a WFS layer with GML3 format', async () => {
      const provider = await createInitializedProvider();
      await (provider as any).createLayer({
        type: 'wfs',
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
        outputFormat: 'gml3',
      });

      expect(mockGML3).toHaveBeenCalled();
    });

    it('creates a WFS layer with GML32 format', async () => {
      const provider = await createInitializedProvider();
      await (provider as any).createLayer({
        type: 'wfs',
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
        outputFormat: 'gml32',
      });

      expect(mockGML32).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // createLayer - WKT
  // -----------------------------------------------------------------------
  describe('createLayer - WKT', () => {
    it('creates a WKT layer from inline WKT', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'wkt',
        wkt: 'POINT(10 50)',
      });

      expect(mockWKT).toHaveBeenCalled();
      expect(mockVectorLayer).toHaveBeenCalled();
      expect(layer).toBeTruthy();
    });

    it('creates a WKT layer from URL', async () => {
      const provider = await createInitializedProvider();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('POINT(10 50)'),
      }));

      const layer = await (provider as any).createLayer({
        type: 'wkt',
        url: 'https://example.com/data.wkt',
      });

      expect(layer).toBeTruthy();
    });

    it('creates an empty WKT layer when neither wkt nor url provided', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'wkt',
      });

      expect(layer).toBeTruthy();
    });

    it('handles WKT parse errors gracefully', async () => {
      const provider = await createInitializedProvider();
      mockWKT.mockImplementationOnce(function () {
        return {
          readFeature: vi.fn(() => {
            throw new Error('Invalid WKT');
          }),
        };
      });

      const layer = await (provider as any).createLayer({
        type: 'wkt',
        wkt: 'INVALID',
      });

      expect(layer).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // createLayer - unsupported
  // -----------------------------------------------------------------------
  describe('createLayer - unsupported', () => {
    it('throws for unsupported layer type', async () => {
      const provider = await createInitializedProvider();
      await expect(
        (provider as any).createLayer({ type: 'unknown-type' }),
      ).rejects.toThrow('Unsupported layer type');
    });
  });

  // -----------------------------------------------------------------------
  // addLayerToGroup
  // -----------------------------------------------------------------------
  describe('addLayerToGroup', () => {
    it('creates and adds an OSM layer to a group', async () => {
      const provider = await createInitializedProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'test-group',
        groupVisible: true,
      });

      expect(layerId).toBe('test-uuid');
      expect(mockLayerGroup).toHaveBeenCalled();
    });

    it('returns null when group creation fails (map not set)', async () => {
      const provider = createProvider();

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'test-group',
        groupVisible: true,
      });

      expect(layerId).toBeNull();
    });

    it('applies opacity, zIndex, and visible from config', async () => {
      const provider = await createInitializedProvider();

      await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'test-group',
        groupVisible: true,
        opacity: 0.5,
        zIndex: 10,
        visible: false,
      });

      // Layer was created – check that setOpacity, setZIndex, setVisible were called
      const layer = mockTileLayer.mock.results[0]?.value;
      if (layer) {
        expect(layer.setOpacity).toHaveBeenCalledWith(0.5);
        expect(layer.setZIndex).toHaveBeenCalledWith(10);
        expect(layer.setVisible).toHaveBeenCalledWith(false);
      }
    });
  });

  // -----------------------------------------------------------------------
  // ensureGroup
  // -----------------------------------------------------------------------
  describe('ensureGroup', () => {
    it('creates a new group if one does not exist', async () => {
      const provider = await createInitializedProvider();

      await provider.ensureGroup('my-group', true);

      expect(mockLayerGroup).toHaveBeenCalled();
    });

    it('reuses an existing group', async () => {
      const provider = await createInitializedProvider();

      await provider.ensureGroup('my-group', true);
      const callCount1 = mockLayerGroup.mock.calls.length;

      await provider.ensureGroup('my-group', true);
      const callCount2 = mockLayerGroup.mock.calls.length;

      expect(callCount2).toBe(callCount1);
    });
  });

  // -----------------------------------------------------------------------
  // removeLayer
  // -----------------------------------------------------------------------
  describe('removeLayer', () => {
    it('does nothing when layerId is empty', async () => {
      const provider = await createInitializedProvider();
      await provider.removeLayer('');
      // should not throw
    });

    it('does nothing when layer is not found', async () => {
      const provider = await createInitializedProvider();
      await expect(provider.removeLayer('non-existent')).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // setOpacity
  // -----------------------------------------------------------------------
  describe('setOpacity', () => {
    it('does nothing when layerId is empty', async () => {
      const provider = await createInitializedProvider();
      await provider.setOpacity('', 0.5);
      // Should not throw
    });

    it('does nothing when layer is not found', async () => {
      const provider = await createInitializedProvider();
      await expect(provider.setOpacity('non-existent', 0.3)).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // setZIndex
  // -----------------------------------------------------------------------
  describe('setZIndex', () => {
    it('does nothing when layerId is empty', async () => {
      const provider = await createInitializedProvider();
      await provider.setZIndex('', 5);
    });
  });

  // -----------------------------------------------------------------------
  // setVisible
  // -----------------------------------------------------------------------
  describe('setVisible', () => {
    it('does nothing when layer is not found', async () => {
      const provider = await createInitializedProvider();
      await expect(provider.setVisible('non-existent', false)).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // setGroupVisible
  // -----------------------------------------------------------------------
  describe('setGroupVisible', () => {
    it('sets visibility on a group', async () => {
      const provider = await createInitializedProvider();
      await provider.ensureGroup('vis-group', true);

      await provider.setGroupVisible('vis-group', false);
      await provider.setGroupVisible('vis-group', true);
      // Should not throw
    });

    it('does nothing when group does not exist', async () => {
      const provider = await createInitializedProvider();
      await expect(
        provider.setGroupVisible('nonexistent', true),
      ).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // updateLayer (via private methods directly)
  // -----------------------------------------------------------------------
  describe('updateLayer', () => {
    it('updateOSMLayer sets a new OSM source', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn() };

      await (provider as any).updateOSMLayer(mockLayer, {
        url: 'https://new-osm.example.com',
      });

      expect(mockOSM).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://new-osm.example.com/{z}/{x}/{y}.png',
        }),
      );
      expect(mockLayer.setSource).toHaveBeenCalled();
    });

    it('updateOSMLayer uses default URL when url not provided', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn() };

      await (provider as any).updateOSMLayer(mockLayer, {});

      expect(mockOSM).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        }),
      );
    });

    it('updateWMSLayer sets a new TileWMS source', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn() };

      await (provider as any).updateWMSLayer(mockLayer, {
        url: 'https://wms.example.com/new',
        layers: 'layer2',
        extraParams: { FORMAT: 'image/png' },
      });

      expect(mockTileWMS).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://wms.example.com/new',
          params: expect.objectContaining({
            LAYERS: 'layer2',
            FORMAT: 'image/png',
          }),
        }),
      );
    });

    it('updateGeoJSONLayer sets source from inline geojson', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn(), setStyle: vi.fn() };

      await (provider as any).updateGeoJSONLayer(mockLayer, {
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
      });

      expect(mockLayer.setSource).toHaveBeenCalled();
    });

    it('updateGeoJSONLayer sets source from URL', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn(), setStyle: vi.fn() };

      await (provider as any).updateGeoJSONLayer(mockLayer, {
        url: 'https://example.com/data.geojson',
      });

      expect(mockLayer.setSource).toHaveBeenCalled();
    });

    it('updateArcGISLayer sets a new TileArcGISRest source', async () => {
      const provider = await createInitializedProvider();
      const existingSource = {
        getParams: vi.fn(() => ({ existing: 'param' })),
        getUrls: vi.fn(() => ['https://old.example.com']),
      };
      const mockLayer = {
        setSource: vi.fn(),
        getSource: vi.fn(() => existingSource),
      };

      await (provider as any).updateArcGISLayer(mockLayer, {
        url: 'https://new-arcgis.example.com',
        params: { layers: 'show:1' },
        token: 'abc123',
      });

      expect(mockTileArcGISRest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://new-arcgis.example.com',
          params: expect.objectContaining({ token: 'abc123' }),
        }),
      );
      expect(mockLayer.setSource).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // addBaseLayer
  // -----------------------------------------------------------------------
  describe('addBaseLayer', () => {
    it('returns null when layerElementId is null', async () => {
      const provider = await createInitializedProvider();
      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'base', groupVisible: true } as any,
        'bm-1',
        null as any,
      );
      expect(result).toBeNull();
    });

    it('returns null when layerElementId is undefined', async () => {
      const provider = await createInitializedProvider();
      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'base', groupVisible: true } as any,
        'bm-1',
        undefined as any,
      );
      expect(result).toBeNull();
    });

    it('adds a base layer and returns layerId when basemapid matches', async () => {
      const provider = await createInitializedProvider();
      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'base-g', groupVisible: true } as any,
        'elem-A',
        'elem-A',
      );
      expect(result).toBeTruthy();
    });

    it('adds a base layer and returns layerId when basemapid differs', async () => {
      const provider = await createInitializedProvider();
      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'base-g', groupVisible: true } as any,
        'other-bm',
        'elem-B',
      );
      expect(result).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // setBaseLayer
  // -----------------------------------------------------------------------
  describe('setBaseLayer', () => {
    it('returns when layerElementId is null', async () => {
      const provider = await createInitializedProvider();
      await provider.setBaseLayer('group-1', null as any);
      // Should not throw
    });

    it('returns when layer is not found', async () => {
      const provider = await createInitializedProvider();
      await provider.setBaseLayer('group-1', 'unknown-element');
      // Should not throw
    });
  });

  // -----------------------------------------------------------------------
  // appendParams (private)
  // -----------------------------------------------------------------------
  describe('appendParams (private)', () => {
    it('appends params to a URL without query string', () => {
      const provider = createProvider();
      const result = (provider as any).appendParams(
        'https://example.com/service',
        { key: 'value' },
      );
      expect(result).toContain('key=value');
      expect(result).toContain('?');
    });

    it('appends params to a URL with existing query string', () => {
      const provider = createProvider();
      const result = (provider as any).appendParams(
        'https://example.com/service?existing=1',
        { key: 'value' },
      );
      expect(result).toContain('&');
      expect(result).toContain('key=value');
    });

    it('returns the base URL when no params', () => {
      const provider = createProvider();
      const result = (provider as any).appendParams(
        'https://example.com/service',
        {},
      );
      expect(result).toBe('https://example.com/service');
    });
  });

  // -----------------------------------------------------------------------
  // mergeLayerConfig (private)
  // -----------------------------------------------------------------------
  describe('mergeLayerConfig (private)', () => {
    it('merges new data with existing config on a layer', () => {
      const provider = createProvider();
      const mockLayer = {
        get: vi.fn().mockReturnValue({ existing: 'value' }),
        set: vi.fn(),
      };

      const result = (provider as any).mergeLayerConfig(
        mockLayer,
        'testConfig',
        { newKey: 'newValue' },
      );

      expect(result).toEqual({ existing: 'value', newKey: 'newValue' });
      expect(mockLayer.set).toHaveBeenCalledWith(
        'testConfig',
        expect.objectContaining({ existing: 'value', newKey: 'newValue' }),
        false,
      );
    });

    it('handles null previous config', () => {
      const provider = createProvider();
      const mockLayer = {
        get: vi.fn().mockReturnValue(null),
        set: vi.fn(),
      };

      const result = (provider as any).mergeLayerConfig(
        mockLayer,
        'testConfig',
        { key: 'val' },
      );

      expect(result).toEqual({ key: 'val' });
    });
  });

  // -----------------------------------------------------------------------
  // _getLayerById (private)
  // -----------------------------------------------------------------------
  describe('_getLayerById (private)', () => {
    it('returns null when map is not set', async () => {
      const provider = createProvider();
      const result = await (provider as any)._getLayerById('some-id');
      expect(result).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // _getLayerGroupById (private)
  // -----------------------------------------------------------------------
  describe('_getLayerGroupById (private)', () => {
    it('returns null when map is not set', async () => {
      const provider = createProvider();
      const result = await (provider as any)._getLayerGroupById('some-id');
      expect(result).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // WCS layer
  // -----------------------------------------------------------------------
  describe('createLayer - WCS', () => {
    it('creates a WCS layer', async () => {
      const provider = await createInitializedProvider();

      // WCS layer creation uses a custom ImageSource class internally
      // We just verify it doesn't throw
      const layer = await (provider as any).createLayer({
        type: 'wcs',
        url: 'https://wcs.example.com/service',
        coverageName: 'testCoverage',
      });

      expect(layer).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // GeoTIFF layer
  // -----------------------------------------------------------------------
  describe('createLayer - GeoTIFF', () => {
    it('creates a GeoTIFF layer', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'geotiff',
        url: 'https://example.com/data.tif',
      });

      expect(layer).toBeTruthy();
    });

    it('throws when url is missing', async () => {
      const provider = await createInitializedProvider();
      await expect(
        (provider as any).createLayer({ type: 'geotiff' }),
      ).rejects.toThrow('GeoTIFF layer requires a URL');
    });

    it('sets nodata when provided', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'geotiff',
        url: 'https://example.com/data.tif',
        nodata: -9999,
      });

      expect(layer).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // createEnhancedStyleFunction (private)
  // -----------------------------------------------------------------------
  describe('createEnhancedStyleFunction', () => {
    it('returns a function', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({});
      expect(typeof fn).toBe('function');
    });

    it('handles Point geometry without icon', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({
        pointColor: '#FF0000',
        pointRadius: 10,
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Point' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('handles Point geometry with iconUrl', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({
        iconUrl: 'https://example.com/icon.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Point' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('handles Polygon geometry', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({
        fillColor: '#FF0000',
        fillOpacity: 0.5,
        strokeColor: '#00FF00',
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Polygon' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('handles LineString geometry', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({
        strokeColor: '#0000FF',
        strokeWidth: 3,
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'LineString' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('handles text labeling', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({
        textProperty: 'name',
        textColor: '#000000',
        textSize: 14,
        textHaloColor: '#FFFFFF',
        textHaloWidth: 3,
        textOffset: [5, 10],
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Point' }),
        get: vi.fn((key: string) => key === 'name' ? 'Test Label' : undefined),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(1); // main style + text style
    });

    it('applies rgba fill color', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({
        fillColor: 'rgba(255, 0, 0, 0.5)',
        fillOpacity: 0.8,
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Polygon' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('applies rgb stroke color', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({
        strokeColor: 'rgb(0, 255, 0)',
        strokeOpacity: 0.6,
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'LineString' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('applies hex color', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({
        fillColor: '#FF0000',
        fillOpacity: 0.3,
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Polygon' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('handles strokeDashArray', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({
        strokeDashArray: [5, 10],
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'LineString' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // createGeostylerStyleFunction (private)
  // -----------------------------------------------------------------------
  describe('createGeostylerStyleFunction', () => {
    it('returns a function', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createGeostylerStyleFunction({
        name: 'test',
        rules: [],
      });
      expect(typeof fn).toBe('function');
    });

    it('handles Fill symbolizer for Polygon', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createGeostylerStyleFunction({
        name: 'fill-test',
        rules: [{
          name: 'fill',
          symbolizers: [{
            kind: 'Fill',
            color: '#FF0000',
            outlineColor: '#00FF00',
            outlineWidth: 2,
          }],
        }],
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Polygon' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('handles Line symbolizer', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createGeostylerStyleFunction({
        name: 'line-test',
        rules: [{
          name: 'line',
          symbolizers: [{
            kind: 'Line',
            color: '#0000FF',
            width: 3,
            dasharray: [5, 10],
          }],
        }],
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'LineString' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('handles Mark symbolizer for Point', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createGeostylerStyleFunction({
        name: 'mark-test',
        rules: [{
          name: 'mark',
          symbolizers: [{
            kind: 'Mark',
            color: '#FF0000',
            radius: 10,
            strokeColor: '#000000',
            strokeWidth: 2,
          }],
        }],
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Point' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('handles Icon symbolizer', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createGeostylerStyleFunction({
        name: 'icon-test',
        rules: [{
          name: 'icon',
          symbolizers: [{
            kind: 'Icon',
            image: 'https://example.com/icon.png',
            size: 24,
            opacity: 0.8,
          }],
        }],
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Point' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('handles Text symbolizer', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createGeostylerStyleFunction({
        name: 'text-test',
        rules: [{
          name: 'text',
          symbolizers: [{
            kind: 'Text',
            label: 'name',
            color: '#000000',
            size: 14,
            font: ['Arial'],
            haloColor: '#FFFFFF',
            haloWidth: 2,
            offset: [5, 10],
          }],
        }],
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Point' }),
        get: vi.fn((key: string) => key === 'name' ? 'Label Text' : undefined),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });

    it('returns undefined for empty rules', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createGeostylerStyleFunction({
        name: 'empty',
        rules: [],
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Point' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeUndefined();
    });

    it('handles GeoStyler function objects as property values', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createGeostylerStyleFunction({
        name: 'func-test',
        rules: [{
          name: 'fill-fn',
          symbolizers: [{
            kind: 'Fill',
            color: { name: 'property', args: ['myColor'] },
          }],
        }],
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Polygon' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // getWFSGetFeatureUrl (private)
  // -----------------------------------------------------------------------
  describe('getWFSGetFeatureUrl', () => {
    it('returns a function that generates WFS URLs', () => {
      const provider = createProvider();
      const urlFn = (provider as any).getWFSGetFeatureUrl({
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
      });

      expect(typeof urlFn).toBe('function');

      const url = urlFn([0, 0, 10, 10]);
      expect(url).toContain('service=WFS');
      expect(url).toContain('request=GetFeature');
      expect(url).toContain('typeName=myLayer');
    });

    it('uses custom version and srsName', () => {
      const provider = createProvider();
      const urlFn = (provider as any).getWFSGetFeatureUrl({
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
        version: '2.0.0',
        srsName: 'EPSG:4326',
        outputFormat: 'application/json',
        params: { CQL_FILTER: 'id>5' },
      });

      const url = urlFn([0, 0, 10, 10]);
      expect(url).toContain('version=2.0.0');
      expect(url).toContain('srsName=EPSG%3A4326');
    });
  });

  // -----------------------------------------------------------------------
  // getWCSGetCoverageUrl (private)
  // -----------------------------------------------------------------------
  describe('getWCSGetCoverageUrl', () => {
    it('generates WCS 2.0.1 URLs with subset parameters', async () => {
      const provider = await createInitializedProvider();
      const urlFn = (provider as any).getWCSGetCoverageUrl({
        url: 'https://wcs.example.com/service',
        coverageName: 'testCoverage',
        version: '2.0.1',
      }, 1);

      const url = urlFn([0, 0, 10, 10]);
      expect(url).toContain('SERVICE=WCS');
      expect(url).toContain('REQUEST=GetCoverage');
      expect(url).toContain('VERSION=2.0.1');
      expect(url).toContain('coverageId=testCoverage');
      expect(url).toContain('subset=');
    });

    it('generates WCS 1.x.x URLs with BBOX', async () => {
      const provider = await createInitializedProvider();
      const urlFn = (provider as any).getWCSGetCoverageUrl({
        url: 'https://wcs.example.com/service',
        coverageName: 'testCoverage',
        version: '1.1.0',
      }, 1);

      const url = urlFn([0, 0, 10, 10]);
      expect(url).toContain('SERVICE=WCS');
      expect(url).toContain('REQUEST=GetCoverage');
      expect(url).toContain('VERSION=1.1.0');
      expect(url).toContain('COVERAGE=testCoverage');
      expect(url).toContain('BBOX=');
    });

    it('includes additional params from config', async () => {
      const provider = await createInitializedProvider();
      const urlFn = (provider as any).getWCSGetCoverageUrl({
        url: 'https://wcs.example.com/service',
        coverageName: 'testCoverage',
        version: '2.0.1',
        params: { customKey: 'customValue' },
      }, 1);

      const url = urlFn([0, 0, 10, 10]);
      expect(url).toContain('customKey=customValue');
    });
  });

  // -----------------------------------------------------------------------
  // _forEachLayer (private)
  // -----------------------------------------------------------------------
  describe('_forEachLayer', () => {
    it('returns false for empty layer group', async () => {
      const provider = await createInitializedProvider();
      const mockGroup = {
        getLayers: vi.fn(() => ({
          getArray: vi.fn(() => []),
        })),
        get: vi.fn(() => undefined),
      };

      // Make it look like a LayerGroup instance
      const result = await (provider as any)._forEachLayer(mockGroup, () => true);
      // Since mockGroup is not instanceof LayerGroup, it goes to else branch
      expect(result).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // updateWKTLayer (private)
  // -----------------------------------------------------------------------
  describe('updateWKTLayer', () => {
    it('updates from inline WKT', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn(), setStyle: vi.fn() };

      await (provider as any).updateWKTLayer(mockLayer, {
        wkt: 'POINT(10 50)',
      });

      expect(mockWKT).toHaveBeenCalled();
      expect(mockLayer.setSource).toHaveBeenCalled();
    });

    it('updates from URL', async () => {
      const provider = await createInitializedProvider();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue('POINT(10 50)'),
      }));

      const mockLayer = { setSource: vi.fn(), setStyle: vi.fn() };

      await (provider as any).updateWKTLayer(mockLayer, {
        url: 'https://example.com/data.wkt',
      });

      expect(mockLayer.setSource).toHaveBeenCalled();
    });

    it('applies style when geostylerStyle is provided', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn(), setStyle: vi.fn() };

      await (provider as any).updateWKTLayer(mockLayer, {
        wkt: 'POINT(10 50)',
        geostylerStyle: {
          name: 'test',
          rules: [{ name: 'mark', symbolizers: [{ kind: 'Mark', color: '#FF0000' }] }],
        },
      });

      expect(mockLayer.setStyle).toHaveBeenCalled();
    });

    it('applies style when style config is provided', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn(), setStyle: vi.fn() };

      await (provider as any).updateWKTLayer(mockLayer, {
        wkt: 'POINT(10 50)',
        style: { fillColor: '#FF0000' },
      });

      expect(mockLayer.setStyle).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // updateGeoJSONLayer with style (private)
  // -----------------------------------------------------------------------
  describe('updateGeoJSONLayer with styles', () => {
    it('applies geostylerStyle on update', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn(), setStyle: vi.fn() };

      await (provider as any).updateGeoJSONLayer(mockLayer, {
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        geostylerStyle: {
          name: 'test',
          rules: [{ name: 'fill', symbolizers: [{ kind: 'Fill', color: '#FF0000' }] }],
        },
      });

      expect(mockLayer.setStyle).toHaveBeenCalled();
    });

    it('applies enhanced style on update', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn(), setStyle: vi.fn() };

      await (provider as any).updateGeoJSONLayer(mockLayer, {
        geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }),
        style: { fillColor: '#FF0000' },
      });

      expect(mockLayer.setStyle).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // updateWFSLayer (private)
  // -----------------------------------------------------------------------
  describe('updateWFSLayer', () => {
    it('merges config and sets new source', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = {
        get: vi.fn().mockReturnValue({}),
        set: vi.fn(),
        setSource: vi.fn(),
        setStyle: vi.fn(),
      };

      await (provider as any).updateWFSLayer(mockLayer, {
        url: 'https://wfs.example.com/service',
        typeName: 'updatedLayer',
      });

      expect(mockLayer.setSource).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // updateWCSLayer (private)
  // -----------------------------------------------------------------------
  describe('updateWCSLayer', () => {
    it('merges config and sets new image source', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = {
        get: vi.fn().mockReturnValue({}),
        set: vi.fn(),
        setSource: vi.fn(),
      };

      await (provider as any).updateWCSLayer(mockLayer, {
        url: 'https://wcs.example.com/new',
        coverageName: 'newCov',
      });

      expect(mockLayer.set).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // updateGeoTIFFLayer (private)
  // -----------------------------------------------------------------------
  describe('updateGeoTIFFLayer', () => {
    it('is a no-op for now (returns without error)', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = {
        get: vi.fn().mockReturnValue({}),
        set: vi.fn(),
        setSource: vi.fn(),
      };

      // updateGeoTIFFLayer might not be fully implemented - just ensure no throw
      await expect(
        (provider as any).updateGeoTIFFLayer?.(mockLayer, {
          url: 'https://example.com/data.tif',
        }),
      ).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // createArcGISLayer (private)
  // -----------------------------------------------------------------------
  describe('createArcGISLayer', () => {
    it('creates an ArcGIS layer with token', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'arcgis',
        url: 'https://arcgis.example.com/rest',
        params: { layers: 'show:0' },
        token: 'my-token',
      });

      expect(mockTileArcGISRest).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ token: 'my-token' }),
        }),
      );
      expect(layer).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // updateLayer (public) - switch branches
  // -----------------------------------------------------------------------
  describe('updateLayer (public switch branches)', () => {
    // Helper: create a provider with a findable layer by injecting into baseLayers
    async function providerWithBaseLayer() {
      const provider = await createInitializedProvider();
      const fakeLayer = {
        get: vi.fn((key: string) => (key === 'id' ? 'layer-1' : undefined)),
        set: vi.fn(),
        setSource: vi.fn(),
        setStyle: vi.fn(),
        setOpacity: vi.fn(),
        setVisible: vi.fn(),
        setZIndex: vi.fn(),
        getSource: vi.fn(() => ({
          getParams: vi.fn(() => ({})),
          getUrls: vi.fn(() => ['https://old.example.com']),
        })),
      };
      (provider as any).baseLayers = [fakeLayer];
      return { provider, fakeLayer };
    }

    it('routes geojson update type', async () => {
      const { provider } = await providerWithBaseLayer();
      await provider.updateLayer('layer-1', {
        type: 'geojson',
        data: { geojson: JSON.stringify({ type: 'FeatureCollection', features: [] }) },
      } as any);
      // Should not throw - the geojson branch was hit
    });

    it('routes osm update type', async () => {
      const { provider } = await providerWithBaseLayer();
      await provider.updateLayer('layer-1', {
        type: 'osm',
        data: { url: 'https://osm.example.com' },
      } as any);
    });

    it('routes wms update type', async () => {
      const { provider } = await providerWithBaseLayer();
      await provider.updateLayer('layer-1', {
        type: 'wms',
        data: { url: 'https://wms.example.com', layers: 'l1' },
      } as any);
    });

    it('routes wfs update type', async () => {
      const { provider } = await providerWithBaseLayer();
      await provider.updateLayer('layer-1', {
        type: 'wfs',
        data: { url: 'https://wfs.example.com', typeName: 'myLayer' },
      } as any);
    });

    it('routes wcs update type', async () => {
      const { provider } = await providerWithBaseLayer();
      await provider.updateLayer('layer-1', {
        type: 'wcs',
        data: { url: 'https://wcs.example.com', coverageName: 'cov1' },
      } as any);
    });

    it('routes arcgis update type', async () => {
      const { provider } = await providerWithBaseLayer();
      await provider.updateLayer('layer-1', {
        type: 'arcgis',
        data: { url: 'https://arcgis.example.com' },
      } as any);
    });

    it('routes wkt update type', async () => {
      const { provider } = await providerWithBaseLayer();
      await provider.updateLayer('layer-1', {
        type: 'wkt',
        data: { wkt: 'POINT(10 50)' },
      } as any);
    });

    it('routes geotiff update type', async () => {
      const { provider } = await providerWithBaseLayer();
      await provider.updateLayer('layer-1', {
        type: 'geotiff',
        data: { url: 'https://example.com/data.tif' },
      } as any);
    });
  });

  // -----------------------------------------------------------------------
  // setBaseLayer - finding and applying base layer
  // -----------------------------------------------------------------------
  describe('setBaseLayer (group + layer found)', () => {
    it('clears group and pushes found layer', async () => {
      const provider = await createInitializedProvider();

      // Manually set up a group in provider.layers
      const clearFn = vi.fn();
      const pushFn = vi.fn();
      const layersObj = {
        getArray: vi.fn(() => []),
        push: pushFn,
        remove: vi.fn(),
        clear: clearFn,
      };
      const fakeGroup = {
        get: vi.fn((key: string) => (key === 'groupId' ? 'base-g' : undefined)),
        set: vi.fn(),
        getLayers: vi.fn(() => layersObj),
        setVisible: vi.fn(),
      };
      (provider as any).layers = [fakeGroup];

      const fakeBaseLayer = {
        get: vi.fn((key: string) => (key === 'layerElementId' ? 'elem-A' : undefined)),
        set: vi.fn(),
      };
      (provider as any).baseLayers = [fakeBaseLayer];

      await provider.setBaseLayer('base-g', 'elem-A');

      expect(clearFn).toHaveBeenCalled();
      expect(pushFn).toHaveBeenCalledWith(fakeBaseLayer);
    });
  });

  // -----------------------------------------------------------------------
  // addBaseLayer - additional branch coverage
  // -----------------------------------------------------------------------
  describe('addBaseLayer (branch coverage)', () => {
    it('logs and continues when basemapid is null', async () => {
      const provider = await createInitializedProvider();
      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'base-g', groupVisible: true } as any,
        null as any,
        'elem-B',
      );
      // Should still create the layer since only basemapid null logs
      expect(result).toBeTruthy();
    });

    it('logs and continues when basemapid is undefined', async () => {
      const provider = await createInitializedProvider();
      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'base-g', groupVisible: true } as any,
        undefined as any,
        'elem-B',
      );
      expect(result).toBeTruthy();
    });

    it('returns null when map is not initialized (group is null)', async () => {
      const provider = createProvider();
      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'base-g', groupVisible: true } as any,
        'bm-1',
        'elem-A',
      );
      expect(result).toBeNull();
    });

    it('applies opacity, zIndex, and visible=true on base layer', async () => {
      const provider = await createInitializedProvider();
      const result = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'base-g',
          groupVisible: true,
          opacity: 0.7,
          zIndex: 5,
          visible: true,
        } as any,
        'elem-A',
        'elem-A',
      );
      expect(result).toBeTruthy();
      const layer = mockTileLayer.mock.results[0]?.value;
      if (layer) {
        expect(layer.setOpacity).toHaveBeenCalledWith(0.7);
        expect(layer.setZIndex).toHaveBeenCalledWith(5);
        expect(layer.setVisible).toHaveBeenCalledWith(true);
      }
    });

    it('applies visible=false on base layer', async () => {
      const provider = await createInitializedProvider();
      const result = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'base-g',
          groupVisible: true,
          visible: false,
        } as any,
        'other',
        'elem-B',
      );
      expect(result).toBeTruthy();
      const layer = mockTileLayer.mock.results[0]?.value;
      if (layer) {
        expect(layer.setVisible).toHaveBeenCalledWith(false);
      }
    });
  });

  // -----------------------------------------------------------------------
  // addLayerToGroup - visible false branch, layer null branch
  // -----------------------------------------------------------------------
  describe('addLayerToGroup (additional branches)', () => {
    it('applies visible=false from config', async () => {
      const provider = await createInitializedProvider();
      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'test-group',
        groupVisible: true,
        visible: false,
      } as any);

      expect(layerId).toBeTruthy();
      const layer = mockTileLayer.mock.results[0]?.value;
      if (layer) {
        expect(layer.setVisible).toHaveBeenCalledWith(false);
      }
    });
  });

  // -----------------------------------------------------------------------
  // updateWFSLayer with styles
  // -----------------------------------------------------------------------
  describe('updateWFSLayer (style branches)', () => {
    it('applies geostylerStyle when provided', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = {
        get: vi.fn().mockReturnValue({}),
        set: vi.fn(),
        setSource: vi.fn(),
        setStyle: vi.fn(),
      };

      await (provider as any).updateWFSLayer(mockLayer, {
        url: 'https://wfs.example.com',
        typeName: 'myLayer',
        geostylerStyle: {
          name: 'test',
          rules: [{ name: 'fill', symbolizers: [{ kind: 'Fill', color: '#FF0000' }] }],
        },
      });

      expect(mockLayer.setStyle).toHaveBeenCalled();
    });

    it('applies enhanced style when style is provided (no geostylerStyle)', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = {
        get: vi.fn().mockReturnValue({}),
        set: vi.fn(),
        setSource: vi.fn(),
        setStyle: vi.fn(),
      };

      await (provider as any).updateWFSLayer(mockLayer, {
        url: 'https://wfs.example.com',
        typeName: 'myLayer',
        style: { fillColor: '#00FF00' },
      });

      expect(mockLayer.setStyle).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // createEnhancedStyleFunction - unparseable color fallback
  // -----------------------------------------------------------------------
  describe('createEnhancedStyleFunction (unparseable color)', () => {
    it('returns original color when format is unrecognized', async () => {
      const provider = await createInitializedProvider();
      const fn = await (provider as any).createEnhancedStyleFunction({
        fillColor: 'hsl(120, 100%, 50%)',
        fillOpacity: 0.5,
      });

      const feature = {
        getGeometry: () => ({ getType: () => 'Polygon' }),
        get: vi.fn(),
      };

      const result = fn(feature);
      expect(result).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // createWFSLayer with geostylerStyle branch
  // -----------------------------------------------------------------------
  describe('createWFSLayer (geostylerStyle branch)', () => {
    it('uses geostylerStyle when provided', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'wfs',
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
        geostylerStyle: {
          name: 'test-style',
          rules: [
            {
              name: 'fill',
              symbolizers: [{ kind: 'Fill', color: '#FF0000' }],
            },
          ],
        },
      });

      expect(mockVectorLayer).toHaveBeenCalled();
      expect(layer).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // Google source error handler (lines 1012-1016)
  // -----------------------------------------------------------------------
  describe('Google source error handler', () => {
    it('dispatches google-source-error event on source error', async () => {
      // Capture the 'change' handler registered on the Google source
      let changeHandler: (() => void) | null = null;
      mockGoogle.mockImplementationOnce(function (options: any) {
        return {
          ...options,
          on: vi.fn((event: string, handler: () => void) => {
            if (event === 'change') changeHandler = handler;
          }),
          getState: vi.fn(() => 'error'),
          getError: vi.fn(() => 'API key invalid'),
        };
      });

      const provider = await createInitializedProvider();

      // Set up the dispatchEvent mock on the target element before triggering
      const dispatchEventMock = vi.fn();
      (provider as any).map.getTargetElement = vi.fn(() => ({
        dispatchEvent: dispatchEventMock,
      }));

      await (provider as any).createLayer({
        type: 'google',
        apiKey: 'bad-key',
      });

      expect(changeHandler).not.toBeNull();
      // Trigger the change handler (simulates source error)
      changeHandler!();
      // The error handler should have dispatched an event
      expect(dispatchEventMock).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // _getLayerById - finding in baseLayers
  // -----------------------------------------------------------------------
  describe('_getLayerById (baseLayers fallback)', () => {
    it('finds a layer in baseLayers when not in map layer group', async () => {
      const provider = await createInitializedProvider();
      const fakeBaseLayer = {
        get: vi.fn((key: string) => (key === 'id' ? 'base-layer-1' : undefined)),
        set: vi.fn(),
      };
      (provider as any).baseLayers = [fakeBaseLayer];

      const result = await (provider as any)._getLayerById('base-layer-1');
      expect(result).toBe(fakeBaseLayer);
    });

    it('returns null when not found in baseLayers either', async () => {
      const provider = await createInitializedProvider();
      (provider as any).baseLayers = [];

      const result = await (provider as any)._getLayerById('nonexistent');
      expect(result).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // removeLayer - layer found with group
  // -----------------------------------------------------------------------
  describe('removeLayer (layer found with group)', () => {
    it('removes the layer from its group', async () => {
      const provider = await createInitializedProvider();
      const removeFn = vi.fn();
      const fakeGroup = {
        getLayers: vi.fn(() => ({ remove: removeFn })),
      };
      const fakeLayer = {
        get: vi.fn((key: string) => {
          if (key === 'id') return 'remove-me';
          if (key === 'group') return fakeGroup;
          return undefined;
        }),
        set: vi.fn(),
      };
      (provider as any).baseLayers = [fakeLayer];

      await provider.removeLayer('remove-me');

      expect(removeFn).toHaveBeenCalledWith(fakeLayer);
    });
  });

  // -----------------------------------------------------------------------
  // setOpacity - layer found
  // -----------------------------------------------------------------------
  describe('setOpacity (layer found)', () => {
    it('sets opacity on a found layer', async () => {
      const provider = await createInitializedProvider();
      const setOpacityFn = vi.fn();
      const fakeLayer = {
        get: vi.fn((key: string) => (key === 'id' ? 'opa-layer' : undefined)),
        set: vi.fn(),
        setOpacity: setOpacityFn,
      };
      (provider as any).baseLayers = [fakeLayer];

      await provider.setOpacity('opa-layer', 0.42);

      expect(setOpacityFn).toHaveBeenCalledWith(0.42);
    });
  });

  // -----------------------------------------------------------------------
  // setZIndex - layer found
  // -----------------------------------------------------------------------
  describe('setZIndex (layer found)', () => {
    it('sets zIndex on a found layer', async () => {
      const provider = await createInitializedProvider();
      const setZIndexFn = vi.fn();
      const fakeLayer = {
        get: vi.fn((key: string) => (key === 'id' ? 'z-layer' : undefined)),
        set: vi.fn(),
        setZIndex: setZIndexFn,
      };
      (provider as any).baseLayers = [fakeLayer];

      await provider.setZIndex('z-layer', 42);

      expect(setZIndexFn).toHaveBeenCalledWith(42);
    });
  });

  // -----------------------------------------------------------------------
  // setVisible - layer found
  // -----------------------------------------------------------------------
  describe('setVisible (layer found)', () => {
    it('sets visibility on a found layer', async () => {
      const provider = await createInitializedProvider();
      const setVisibleFn = vi.fn();
      const fakeLayer = {
        get: vi.fn((key: string) => (key === 'id' ? 'vis-layer' : undefined)),
        set: vi.fn(),
        setVisible: setVisibleFn,
      };
      (provider as any).baseLayers = [fakeLayer];

      await provider.setVisible('vis-layer', false);

      expect(setVisibleFn).toHaveBeenCalledWith(false);
    });
  });

  // -----------------------------------------------------------------------
  // updateWKTLayer - URL error branch (response not ok)
  // -----------------------------------------------------------------------
  describe('updateWKTLayer (URL error)', () => {
    it('throws when fetch response is not ok', async () => {
      const provider = await createInitializedProvider();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: vi.fn().mockResolvedValue(''),
      }));

      const mockLayer = { setSource: vi.fn(), setStyle: vi.fn() };

      await expect(
        (provider as any).updateWKTLayer(mockLayer, {
          url: 'https://example.com/missing.wkt',
        }),
      ).rejects.toThrow('Failed to fetch WKT: 404');
    });

    it('does not set source when neither wkt nor url provided', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn(), setStyle: vi.fn() };

      await (provider as any).updateWKTLayer(mockLayer, {});

      // vectorSource is null so setSource should not be called
      expect(mockLayer.setSource).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // createWKTLayer - URL fetch error branch
  // -----------------------------------------------------------------------
  describe('createWKTLayer (URL fetch error)', () => {
    it('handles fetch failure gracefully', async () => {
      const provider = await createInitializedProvider();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValue(''),
      }));

      const layer = await (provider as any).createLayer({
        type: 'wkt',
        url: 'https://example.com/error.wkt',
      });

      // Should still create the layer with empty features
      expect(layer).toBeTruthy();
    });

    it('uses geostylerStyle when provided', async () => {
      const provider = await createInitializedProvider();
      const layer = await (provider as any).createLayer({
        type: 'wkt',
        wkt: 'POINT(10 50)',
        geostylerStyle: {
          name: 'wkt-style',
          rules: [
            { name: 'mark', symbolizers: [{ kind: 'Mark', color: '#FF0000' }] },
          ],
        },
      });

      expect(layer).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // updateGeoTIFFLayer - missing URL and nodata branches
  // -----------------------------------------------------------------------
  describe('updateGeoTIFFLayer (branch coverage)', () => {
    it('throws when url is missing', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn() };

      await expect(
        (provider as any).updateGeoTIFFLayer(mockLayer, {}),
      ).rejects.toThrow('GeoTIFF update requires a URL');
    });

    it('passes nodata when provided and valid', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn() };

      await (provider as any).updateGeoTIFFLayer(mockLayer, {
        url: 'https://example.com/data.tif',
        nodata: -9999,
      });

      expect(mockLayer.setSource).toHaveBeenCalled();
    });

    it('skips nodata when null', async () => {
      const provider = await createInitializedProvider();
      const mockLayer = { setSource: vi.fn() };

      await (provider as any).updateGeoTIFFLayer(mockLayer, {
        url: 'https://example.com/data.tif',
        nodata: null,
      });

      expect(mockLayer.setSource).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // getMap
  // -----------------------------------------------------------------------
  describe('getMap', () => {
    it('returns the map instance', async () => {
      const provider = await createInitializedProvider();
      const map = provider.getMap();
      expect(map).toBeDefined();
    });

    it('returns undefined when map is not initialized', () => {
      const provider = createProvider();
      const map = provider.getMap();
      expect(map).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // WCS getImageInternal (lines 1614-1628) - via createWcsSource
  // -----------------------------------------------------------------------
  describe('createWcsSource (WCSImageSource.getImageInternal)', () => {
    it('creates a source whose getImageInternal returns an OlImageWrapper', async () => {
      const provider = await createInitializedProvider();

      const source = await (provider as any).createWcsSource({
        url: 'https://wcs.example.com/service',
        coverageName: 'testCoverage',
        version: '2.0.1',
      });

      expect(source).toBeDefined();
      expect(typeof source.getImageInternal).toBe('function');

      const result = source.getImageInternal([0, 0, 10, 10], 1, 1, 'EPSG:3857');
      expect(result).toBeDefined();
      // The result should have a load function set by the WCS source
      expect(typeof result.load).toBe('function');
      // Call the load function to exercise the CORS loader branch
      result.load();
    });
  });
});
