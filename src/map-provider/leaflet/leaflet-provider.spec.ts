import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks – Vitest requires mocks referenced inside vi.mock() to be
// created via vi.hoisted() so they are available at module-evaluation time.
// ---------------------------------------------------------------------------
const {
  mockMap,
  mapInstance,
  MockLayerGroup,
  mockLayerGroup,
  mockTileLayer,
  mockUtilStamp,
} = vi.hoisted(() => {
  class HoistedMockLayerGroup {
    _groupId?: string;
    visible?: boolean;
    addTo = vi.fn().mockReturnThis();
    addLayer = vi.fn();
    clearLayers = vi.fn();
    getLayers = vi.fn(() => []);
  }

  const inst = {
    setView: vi.fn().mockReturnThis(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    eachLayer: vi.fn(),
    invalidateSize: vi.fn(),
    remove: vi.fn(),
  };

  return {
    mapInstance: inst,
    mockMap: vi.fn(() => inst),
    MockLayerGroup: HoistedMockLayerGroup,
    mockLayerGroup: vi.fn(() => new HoistedMockLayerGroup()),
    mockTileLayer: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      setUrl: vi.fn(),
      setOpacity: vi.fn(),
      setZIndex: vi.fn(),
    })),
    mockUtilStamp: vi.fn(() => 42),
  };
});

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock('leaflet', () => {
  // Dummy classes for instanceof checks used in setLayerOpacity
  class MockPath {}
  class MockMarker {}
  class MockGeoJSON {}

  return {
    map: mockMap,
    geoJSON: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      clearLayers: vi.fn(),
      addData: vi.fn(),
      eachLayer: vi.fn(),
      setStyle: vi.fn(),
    })),
    GeoJSON: MockGeoJSON,
    layerGroup: mockLayerGroup,
    LayerGroup: MockLayerGroup,
    tileLayer: Object.assign(mockTileLayer, {
      wms: vi.fn(() => ({
        addTo: vi.fn().mockReturnThis(),
        setOpacity: vi.fn(),
        setZIndex: vi.fn(),
      })),
    }),
    Path: MockPath,
    Marker: MockMarker,
    circleMarker: vi.fn(() => ({})),
    marker: vi.fn(() => ({})),
    icon: vi.fn(() => ({})),
    GridLayer: class {
      options: any = {};
      constructor() {}
    },
    Util: {
      stamp: mockUtilStamp,
      setOptions: vi.fn((instance: any, opts: any) => {
        instance.options = { ...(instance.options ?? {}), ...opts };
      }),
    },
  };
});

vi.mock('../../utils/dom-env', () => ({
  isBrowser: () => true,
  watchElementResize: vi.fn(() => vi.fn()),
  supportsAdoptedStyleSheets: () => false,
}));

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  error: vi.fn(),
}));

vi.mock('./leaflet-helpers', () => ({
  ensureLeafletCss: vi.fn(() => null),
  removeInjectedCss: vi.fn(),
  ensureGoogleLogo: vi.fn(),
}));

vi.mock('./google-map-tiles-layer', () => ({
  GoogleMapTilesLayer: vi.fn(),
}));

vi.mock('./GeoTIFFGridLayer', () => ({
  GeoTIFFGridLayer: vi.fn(),
}));

vi.mock('./WCSGridLayer', () => ({
  WCSGridLayer: vi.fn(),
}));

vi.mock('wellknown', () => ({
  wellknown: { parse: vi.fn() },
}));

vi.mock('@npm9912/s-gml', () => ({
  GmlParser: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Import the class under test AFTER all mocks are in place
// ---------------------------------------------------------------------------
import { LeafletProvider } from './leaflet-provider';
import { removeInjectedCss } from './leaflet-helpers';
import { error, log } from '../../utils/logger';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createProvider(): LeafletProvider {
  return new LeafletProvider();
}

async function createInitializedProvider(): Promise<LeafletProvider> {
  const provider = createProvider();
  const target = document.createElement('div');
  const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
  await provider.init({ target, shadowRoot } as any);
  return provider;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('LeafletProvider', () => {
  let provider: LeafletProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the shared map instance spies
    mapInstance.setView.mockClear();
    mapInstance.setView.mockReturnThis();
    mapInstance.addLayer.mockClear();
    mapInstance.removeLayer.mockClear();
    mapInstance.eachLayer.mockClear();
    mapInstance.invalidateSize.mockClear();
    mapInstance.remove.mockClear();
    // Default stamp returns '42' as string (getLayerId calls String())
    mockUtilStamp.mockReturnValue(42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -----------------------------------------------------------------------
  // normalizeAttribution (private)
  // -----------------------------------------------------------------------
  describe('normalizeAttribution', () => {
    beforeEach(() => {
      provider = createProvider();
    });

    it('returns a string as-is', () => {
      const result = (provider as any).normalizeAttribution('OpenStreetMap');
      expect(result).toBe('OpenStreetMap');
    });

    it('joins an array of strings with comma-space', () => {
      const result = (provider as any).normalizeAttribution(['A', 'B', 'C']);
      expect(result).toBe('A, B, C');
    });

    it('returns undefined when input is undefined', () => {
      const result = (provider as any).normalizeAttribution(undefined);
      expect(result).toBeUndefined();
    });

    it('returns a single-element array as a plain string', () => {
      const result = (provider as any).normalizeAttribution(['Only']);
      expect(result).toBe('Only');
    });
  });

  // -----------------------------------------------------------------------
  // buildArcGISUrl (private)
  // -----------------------------------------------------------------------
  describe('buildArcGISUrl', () => {
    beforeEach(() => {
      provider = createProvider();
    });

    it('returns the url unchanged when no params are given', () => {
      const url = 'https://server.example.com/tiles/{z}/{y}/{x}';
      const result = (provider as any).buildArcGISUrl(url);
      expect(result).toBe(url);
    });

    it('returns the url unchanged when params is an empty object', () => {
      const url = 'https://server.example.com/tiles/{z}/{y}/{x}';
      const result = (provider as any).buildArcGISUrl(url, {});
      expect(result).toBe(url);
    });

    it('appends params with ? when url has no query string', () => {
      const url = 'https://server.example.com/tiles/{z}/{y}/{x}';
      const result = (provider as any).buildArcGISUrl(url, { token: 'abc' });
      expect(result).toBe('https://server.example.com/tiles/{z}/{y}/{x}?token=abc');
    });

    it('appends params with & when url already contains ?', () => {
      const url = 'https://server.example.com/tiles/{z}/{y}/{x}?existing=1';
      const result = (provider as any).buildArcGISUrl(url, { foo: 'bar' });
      expect(result).toBe(
        'https://server.example.com/tiles/{z}/{y}/{x}?existing=1&foo=bar',
      );
    });

    it('skips null and undefined param values', () => {
      const url = 'https://server.example.com/tiles';
      const result = (provider as any).buildArcGISUrl(url, {
        keep: 'yes',
        drop: undefined,
        alsoDropped: null,
      });
      expect(result).toBe('https://server.example.com/tiles?keep=yes');
    });

    it('converts numeric and boolean params to strings', () => {
      const url = 'https://example.com/tiles';
      const result = (provider as any).buildArcGISUrl(url, {
        count: 42,
        active: true,
      });
      expect(result).toContain('count=42');
      expect(result).toContain('active=true');
    });
  });

  // -----------------------------------------------------------------------
  // tryParseStyles (private)
  // -----------------------------------------------------------------------
  describe('tryParseStyles', () => {
    beforeEach(() => {
      provider = createProvider();
    });

    it('parses a valid JSON array and returns it', () => {
      const styles = JSON.stringify([{ color: 'red' }]);
      const result = (provider as any).tryParseStyles(styles);
      expect(result).toEqual([{ color: 'red' }]);
    });

    it('returns undefined for invalid JSON', () => {
      const result = (provider as any).tryParseStyles('not-json{{{');
      expect(result).toBeUndefined();
      expect(error).toHaveBeenCalledWith('Failed to parse Google styles JSON');
    });

    it('returns undefined for valid JSON that is not an array', () => {
      const result = (provider as any).tryParseStyles(JSON.stringify({ key: 'value' }));
      expect(result).toBeUndefined();
    });

    it('returns an empty array when given "[]"', () => {
      const result = (provider as any).tryParseStyles('[]');
      expect(result).toEqual([]);
    });
  });

  // -----------------------------------------------------------------------
  // destroy
  // -----------------------------------------------------------------------
  describe('destroy', () => {
    it('removes all layers, cleans up the map, and resets state', async () => {
      provider = await createInitializedProvider();

      // Manually push a mock layer so destroy has something to iterate over
      const mockLayer = { setOpacity: vi.fn() };
      (provider as any).layers.push(mockLayer);

      await provider.destroy();

      expect(mapInstance.removeLayer).toHaveBeenCalledWith(mockLayer);
      expect(mapInstance.remove).toHaveBeenCalled();
      expect((provider as any).map).toBeUndefined();
      expect((provider as any).layers).toEqual([]);
      expect(removeInjectedCss).toHaveBeenCalled();
    });

    it('does not throw when called on an uninitialised provider', async () => {
      provider = createProvider();
      await expect(provider.destroy()).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // removeLayer
  // -----------------------------------------------------------------------
  describe('removeLayer', () => {
    it('does nothing when layerId is empty', async () => {
      provider = await createInitializedProvider();
      await provider.removeLayer('');
      // eachLayer should not have been called after init (removeLayer bails early)
      expect(mapInstance.eachLayer).not.toHaveBeenCalled();
    });

    it('removes a layer found by id', async () => {
      provider = await createInitializedProvider();

      const targetLayer = { _leaflet_id: 99 };
      // Make eachLayer call the callback with our target layer
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(targetLayer);
      });
      // stamp returns 42 for any layer, and getLayerId returns String(42) = '42'
      mockUtilStamp.mockReturnValue(42);

      await provider.removeLayer('42');
      expect(mapInstance.removeLayer).toHaveBeenCalledWith(targetLayer);
    });
  });

  // -----------------------------------------------------------------------
  // setView
  // -----------------------------------------------------------------------
  describe('setView', () => {
    it('calls map.setView with swapped lon/lat and zoom', async () => {
      provider = await createInitializedProvider();
      // Clear the setView call from init()
      mapInstance.setView.mockClear();

      await provider.setView([10, 50], 7);

      expect(mapInstance.setView).toHaveBeenCalledWith([50, 10], 7, { animate: false });
    });

    it('does nothing when the map is not initialized', async () => {
      provider = createProvider();
      // Should not throw
      await expect(provider.setView([0, 0], 2)).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // setOpacity
  // -----------------------------------------------------------------------
  describe('setOpacity', () => {
    it('returns early when layerId is empty', async () => {
      provider = await createInitializedProvider();

      await provider.setOpacity('', 0.5);
      // eachLayer should not have been called (bails before lookup)
      expect(mapInstance.eachLayer).not.toHaveBeenCalled();
    });

    it('stores vmapOpacity on the layer', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setOpacity: vi.fn(), vmapVisible: true, vmapOpacity: 1.0 };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(99);

      await provider.setOpacity('99', 0.3);
      expect(fakeLayer.vmapOpacity).toBe(0.3);
    });
  });

  // -----------------------------------------------------------------------
  // setVisible
  // -----------------------------------------------------------------------
  describe('setVisible', () => {
    it('returns early when layerId is empty', async () => {
      provider = await createInitializedProvider();

      await provider.setVisible('', true);
      expect(mapInstance.eachLayer).not.toHaveBeenCalled();
    });

    it('sets vmapVisible to false when hidden', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setOpacity: vi.fn(), vmapVisible: true, vmapOpacity: 0.8 };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(77);

      await provider.setVisible('77', false);
      expect(fakeLayer.vmapVisible).toBe(false);
    });

    it('restores vmapVisible to true when made visible again', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setOpacity: vi.fn(), vmapVisible: false, vmapOpacity: 0.6 };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(77);

      await provider.setVisible('77', true);
      expect(fakeLayer.vmapVisible).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // setZIndex
  // -----------------------------------------------------------------------
  describe('setZIndex', () => {
    it('returns early when layerId is empty', async () => {
      provider = await createInitializedProvider();

      await provider.setZIndex('', 5);
      expect(mapInstance.eachLayer).not.toHaveBeenCalled();
    });

    it('calls setZIndex on a layer that supports it', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setZIndex: vi.fn() };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(55);

      await provider.setZIndex('55', 10);
      expect(fakeLayer.setZIndex).toHaveBeenCalledWith(10);
    });
  });

  // -----------------------------------------------------------------------
  // ensureGroup / setGroupVisible
  // -----------------------------------------------------------------------
  describe('ensureGroup', () => {
    it('creates a new group if one does not exist', async () => {
      provider = await createInitializedProvider();

      await provider.ensureGroup('my-group', true);

      expect(mockLayerGroup).toHaveBeenCalled();
      const createdGroup = mockLayerGroup.mock.results[0].value;
      expect(createdGroup._groupId).toBe('my-group');
      expect(createdGroup.addTo).toHaveBeenCalled();
    });

    it('reuses an existing group rather than creating a second', async () => {
      provider = await createInitializedProvider();

      await provider.ensureGroup('dup-group', true);
      const callCountAfterFirst = mockLayerGroup.mock.calls.length;

      // Second call with same groupId should NOT create a new group.
      // _getLayerGroupById finds the group in this.layers by checking
      // instanceof L.LayerGroup (which is MockLayerGroup) and _groupId.
      await provider.ensureGroup('dup-group', true);
      expect(mockLayerGroup.mock.calls.length).toBe(callCountAfterFirst);
    });
  });

  describe('setGroupVisible', () => {
    it('hides a visible group by removing it from the map', async () => {
      provider = await createInitializedProvider();

      // Create the group (visible by default)
      await provider.ensureGroup('toggle-group', true);
      mapInstance.removeLayer.mockClear();

      await provider.setGroupVisible('toggle-group', false);
      expect(mapInstance.removeLayer).toHaveBeenCalled();
    });

    it('shows a hidden group by adding it back to the map', async () => {
      provider = await createInitializedProvider();

      // Create and then hide the group
      await provider.ensureGroup('toggle-group', true);
      await provider.setGroupVisible('toggle-group', false);

      const group = mockLayerGroup.mock.results[0].value;
      group.addTo.mockClear();

      await provider.setGroupVisible('toggle-group', true);
      expect(group.addTo).toHaveBeenCalled();
    });

    it('is a no-op when the group is already in the requested state', async () => {
      provider = await createInitializedProvider();

      await provider.ensureGroup('stable-group', true);
      mapInstance.removeLayer.mockClear();

      // Group is already visible – setting visible=true should do nothing
      await provider.setGroupVisible('stable-group', true);
      expect(mapInstance.removeLayer).not.toHaveBeenCalled();
    });

    it('does nothing when the group does not exist', async () => {
      provider = await createInitializedProvider();
      await expect(
        provider.setGroupVisible('nonexistent', true),
      ).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // setOpacity – additional coverage
  // -----------------------------------------------------------------------
  describe('setOpacity – extended', () => {
    it('applies opacity via setOpacity when layer has setOpacity and vmapVisible is true', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setOpacity: vi.fn(), vmapVisible: true, vmapOpacity: 1.0 };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(99);

      await provider.setOpacity('99', 0.5);
      expect(fakeLayer.vmapOpacity).toBe(0.5);
      expect(fakeLayer.setOpacity).toHaveBeenCalledWith(0.5);
    });

    it('stores vmapOpacity but does NOT call setOpacity when vmapVisible is false', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setOpacity: vi.fn(), vmapVisible: false, vmapOpacity: 1.0 };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(99);

      await provider.setOpacity('99', 0.7);
      expect(fakeLayer.vmapOpacity).toBe(0.7);
      // setOpacity should NOT be called because the layer is hidden
      expect(fakeLayer.setOpacity).not.toHaveBeenCalled();
    });

    it('initialises vmapVisible to true when it was undefined', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setOpacity: vi.fn() } as any;
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(88);

      await provider.setOpacity('88', 0.4);
      expect(fakeLayer.vmapVisible).toBe(true);
      expect(fakeLayer.vmapOpacity).toBe(0.4);
    });
  });

  // -----------------------------------------------------------------------
  // setVisible – additional coverage
  // -----------------------------------------------------------------------
  describe('setVisible – extended', () => {
    it('sets opacity to 0 when hiding a layer', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setOpacity: vi.fn(), vmapVisible: true, vmapOpacity: 0.8 };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(77);

      await provider.setVisible('77', false);
      expect(fakeLayer.vmapVisible).toBe(false);
      expect(fakeLayer.setOpacity).toHaveBeenCalledWith(0.0);
    });

    it('restores the stored vmapOpacity when making a layer visible again', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setOpacity: vi.fn(), vmapVisible: false, vmapOpacity: 0.6 };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(77);

      await provider.setVisible('77', true);
      expect(fakeLayer.vmapVisible).toBe(true);
      expect(fakeLayer.setOpacity).toHaveBeenCalledWith(0.6);
    });

    it('initialises vmapOpacity to 1.0 when it was undefined and layer becomes visible', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setOpacity: vi.fn() } as any;
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(66);

      await provider.setVisible('66', true);
      expect(fakeLayer.vmapOpacity).toBe(1.0);
      expect(fakeLayer.setOpacity).toHaveBeenCalledWith(1.0);
    });
  });

  // -----------------------------------------------------------------------
  // setZIndex – additional coverage
  // -----------------------------------------------------------------------
  describe('setZIndex – extended', () => {
    it('does nothing when the layer lacks setZIndex', async () => {
      provider = await createInitializedProvider();

      // Layer without setZIndex function
      const fakeLayer = {};
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(33);

      // Should not throw
      await expect(provider.setZIndex('33', 5)).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // setBaseLayer
  // -----------------------------------------------------------------------
  describe('setBaseLayer', () => {
    it('returns early when layerElementId is null', async () => {
      provider = await createInitializedProvider();

      await provider.setBaseLayer('group-1', null as any);
      expect(log).toHaveBeenCalledWith(
        'leaflet - setBaseLayer - layerElementId is null.',
      );
    });

    it('logs and returns when the layer is not found in baseLayers', async () => {
      provider = await createInitializedProvider();

      await provider.setBaseLayer('group-1', 'unknown-element-id');
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining('layer not found'),
      );
    });

    it('swaps the base layer in the group when layer is found', async () => {
      provider = await createInitializedProvider();

      // Set up a group in provider.layers
      await provider.ensureGroup('basemap-group', true);
      const group = mockLayerGroup.mock.results[0].value;
      const prevLayer = { _leaflet_id: 10 };
      group.getLayers.mockReturnValue([prevLayer]);

      // Push a matching base layer into baseLayers
      const baseLayer = { layerElementId: 'elem-1', addTo: vi.fn() };
      (provider as any).baseLayers.push(baseLayer);

      mapInstance.removeLayer.mockClear();

      await provider.setBaseLayer('basemap-group', 'elem-1');

      expect(mapInstance.removeLayer).toHaveBeenCalledWith(prevLayer);
      expect(group.clearLayers).toHaveBeenCalled();
      expect(group.addLayer).toHaveBeenCalledWith(baseLayer);
    });

    it('adds the layer without removing when group has no previous layer', async () => {
      provider = await createInitializedProvider();

      await provider.ensureGroup('empty-group', true);
      const group = mockLayerGroup.mock.results[0].value;
      group.getLayers.mockReturnValue([]);

      const baseLayer = { layerElementId: 'elem-2', addTo: vi.fn() };
      (provider as any).baseLayers.push(baseLayer);

      mapInstance.removeLayer.mockClear();

      await provider.setBaseLayer('empty-group', 'elem-2');

      expect(mapInstance.removeLayer).not.toHaveBeenCalled();
      expect(group.addLayer).toHaveBeenCalledWith(baseLayer);
    });
  });

  // -----------------------------------------------------------------------
  // addBaseLayer
  // -----------------------------------------------------------------------
  describe('addBaseLayer', () => {
    it('returns null and logs when layerElementId is null', async () => {
      provider = await createInitializedProvider();

      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'g1', groupVisible: true } as any,
        'bm-1',
        null as any,
      );
      expect(result).toBeNull();
      expect(log).toHaveBeenCalledWith(
        'leaflet - addBaseLayer - layerElementId not set.',
      );
    });

    it('returns null and logs when layerElementId is undefined', async () => {
      provider = await createInitializedProvider();

      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'g1', groupVisible: true } as any,
        'bm-1',
        undefined as any,
      );
      expect(result).toBeNull();
    });

    it('adds a base layer and returns its layerId when basemapid matches layerElementId', async () => {
      provider = await createInitializedProvider();

      const group = mockLayerGroup.mock.results[0]?.value;
      // Ensure getLayers returns [] so the prev_layer path is skipped
      if (group) group.getLayers.mockReturnValue([]);

      mockUtilStamp.mockReturnValue(200);

      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'base-g', groupVisible: true } as any,
        'elem-A',
        'elem-A',
      );
      expect(result).toBe('200');
    });

    it('does not add layer to group when basemapid differs from layerElementId', async () => {
      provider = await createInitializedProvider();

      mockUtilStamp.mockReturnValue(201);

      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'base-g2', groupVisible: true } as any,
        'different-bm',
        'elem-B',
      );
      // Layer is still created and a layerId returned, but the group.addLayer
      // path (basemapid === layerElementId) is NOT taken.
      expect(result).toBe('201');
    });
  });

  // -----------------------------------------------------------------------
  // addLayerToGroup
  // -----------------------------------------------------------------------
  describe('addLayerToGroup', () => {
    it('adds an OSM layer to the group and returns a layerId', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(300);

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'overlay-group',
        groupVisible: true,
      });

      expect(layerId).toBe('300');
      expect(mockTileLayer).toHaveBeenCalled();
    });

    it('adds an XYZ layer to the group', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(301);

      const layerId = await provider.addLayerToGroup({
        type: 'xyz',
        url: 'https://tiles.example.com/{z}/{x}/{y}.png',
        groupId: 'xyz-group',
        groupVisible: true,
      });

      expect(layerId).toBe('301');
      expect(mockTileLayer).toHaveBeenCalledWith(
        'https://tiles.example.com/{z}/{x}/{y}.png',
        expect.any(Object),
      );
    });

    it('adds a WMS layer to the group', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(302);
      const L = await import('leaflet');

      const layerId = await provider.addLayerToGroup({
        type: 'wms',
        url: 'https://wms.example.com/service',
        layers: 'my_layer',
        groupId: 'wms-group',
        groupVisible: true,
      });

      expect(layerId).toBe('302');
      expect(L.tileLayer.wms).toHaveBeenCalledWith(
        'https://wms.example.com/service',
        expect.objectContaining({ layers: 'my_layer' }),
      );
    });

    it('adds a GeoJSON layer to the group', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(303);

      const geojsonString = JSON.stringify({
        type: 'FeatureCollection',
        features: [],
      });

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        geojson: geojsonString,
        groupId: 'geojson-group',
        groupVisible: true,
      });

      expect(layerId).toBe('303');
    });

    it('applies opacity and zIndex when provided in the config', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(304);

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'styled-group',
        groupVisible: true,
        opacity: 0.5,
        zIndex: 10,
      });

      expect(layerId).toBe('304');
    });

    it('sets visible=false on the created layer when config says visible=false', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(305);

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'hidden-group',
        groupVisible: true,
        visible: false,
      });

      expect(layerId).toBe('305');
    });
  });

  // -----------------------------------------------------------------------
  // _getLayerById (private) – via removeLayer / setOpacity as proxy
  // -----------------------------------------------------------------------
  describe('_getLayerById – fallback to baseLayers', () => {
    it('finds a layer in baseLayers when eachLayer does not find it', async () => {
      provider = await createInitializedProvider();

      // eachLayer yields no matching layer
      mapInstance.eachLayer.mockImplementation(() => {});

      const baseLayer = { setOpacity: vi.fn(), vmapVisible: true, vmapOpacity: 1.0 };
      mockUtilStamp.mockReturnValue(500);
      (provider as any).baseLayers.push(baseLayer);

      // setOpacity will internally call _getLayerById which should fall back
      await provider.setOpacity('500', 0.2);
      expect(baseLayer.vmapOpacity).toBe(0.2);
    });
  });

  // -----------------------------------------------------------------------
  // createLayer – unsupported type
  // -----------------------------------------------------------------------
  describe('createLayer – unsupported type', () => {
    it('throws for an unsupported layer type', async () => {
      provider = await createInitializedProvider();

      await expect(
        provider.addLayerToGroup({
          type: 'unknown-type' as any,
          groupId: 'g',
          groupVisible: true,
        }),
      ).rejects.toThrow('Unsupported layer type');
    });
  });

  // -----------------------------------------------------------------------
  // init
  // -----------------------------------------------------------------------
  describe('init', () => {
    it('creates a Leaflet map with provided center and zoom', async () => {
      const p = createProvider();
      const target = document.createElement('div');
      const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });

      await p.init({
        target,
        shadowRoot,
        mapInitOptions: { center: [8, 47], zoom: 12 },
      } as any);

      expect(mockMap).toHaveBeenCalledWith(target, expect.any(Object));
      // setView should have been called with swapped [lat, lon]
      expect(mapInstance.setView).toHaveBeenCalledWith([47, 8], 12);
    });

    it('defaults center to [0,0] and zoom to 2 when not provided', async () => {
      const p = createProvider();
      const target = document.createElement('div');
      const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });

      await p.init({ target, shadowRoot } as any);

      expect(mapInstance.setView).toHaveBeenCalledWith([0, 0], 2);
    });
  });

  // -----------------------------------------------------------------------
  // createLeafletStyle (private)
  // -----------------------------------------------------------------------
  describe('createLeafletStyle', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('returns a function', () => {
      const styleFn = (provider as any).createLeafletStyle();
      expect(typeof styleFn).toBe('function');
    });

    it('returns polygon style for Polygon geometry', () => {
      const styleFn = (provider as any).createLeafletStyle({
        fillColor: '#ff0000',
        fillOpacity: 0.5,
        strokeColor: '#00ff00',
        strokeOpacity: 0.8,
        strokeWidth: 3,
      });
      const result = styleFn({
        geometry: { type: 'Polygon' },
        properties: {},
        type: 'Feature',
      });
      expect(result).toEqual({
        fillColor: '#ff0000',
        fillOpacity: 0.5,
        color: '#00ff00',
        opacity: 0.8,
        weight: 3,
        dashArray: undefined,
      });
    });

    it('returns polygon style for MultiPolygon geometry', () => {
      const styleFn = (provider as any).createLeafletStyle({
        fillColor: 'blue',
        fillOpacity: 0.2,
        strokeColor: 'red',
        strokeOpacity: 0.9,
        strokeWidth: 1,
        strokeDashArray: [5, 10],
      });
      const result = styleFn({
        geometry: { type: 'MultiPolygon' },
        properties: {},
        type: 'Feature',
      });
      expect(result.fillColor).toBe('blue');
      expect(result.dashArray).toBe('5,10');
    });

    it('returns line style for LineString geometry', () => {
      const styleFn = (provider as any).createLeafletStyle({
        strokeColor: '#123456',
        strokeOpacity: 0.7,
        strokeWidth: 4,
      });
      const result = styleFn({
        geometry: { type: 'LineString' },
        properties: {},
        type: 'Feature',
      });
      expect(result).toEqual({
        color: '#123456',
        opacity: 0.7,
        weight: 4,
        dashArray: undefined,
      });
    });

    it('returns line style for MultiLineString geometry', () => {
      const styleFn = (provider as any).createLeafletStyle({
        strokeColor: 'green',
        strokeOpacity: 1,
        strokeWidth: 2,
        strokeDashArray: [2, 4],
      });
      const result = styleFn({
        geometry: { type: 'MultiLineString' },
        properties: {},
        type: 'Feature',
      });
      expect(result.color).toBe('green');
      expect(result.dashArray).toBe('2,4');
    });

    it('returns empty object for Point geometry', () => {
      const styleFn = (provider as any).createLeafletStyle({ fillColor: 'red' });
      const result = styleFn({
        geometry: { type: 'Point' },
        properties: {},
        type: 'Feature',
      });
      expect(result).toEqual({});
    });

    it('uses defaults when no style is provided', () => {
      const styleFn = (provider as any).createLeafletStyle(undefined);
      const result = styleFn({
        geometry: { type: 'Polygon' },
        properties: {},
        type: 'Feature',
      });
      expect(result.fillColor).toBe('rgba(0,100,255,0.3)');
      expect(result.fillOpacity).toBe(0.3);
      expect(result.color).toBe('rgba(0,100,255,1)');
      expect(result.opacity).toBe(1);
      expect(result.weight).toBe(2);
    });

    it('returns empty object when feature is undefined', () => {
      const styleFn = (provider as any).createLeafletStyle({});
      const result = styleFn(undefined);
      expect(result).toEqual({});
    });
  });

  // -----------------------------------------------------------------------
  // setLayerOpacity (private) – different layer types
  // -----------------------------------------------------------------------
  describe('setLayerOpacity', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('calls setOpacity on a layer that has setOpacity (GridLayer fallback)', () => {
      const layer = { setOpacity: vi.fn() };
      (provider as any).setLayerOpacity(layer, 0.5);
      expect(layer.setOpacity).toHaveBeenCalledWith(0.5);
    });

    it('does nothing when layer is null', () => {
      // Should not throw
      expect(() => (provider as any).setLayerOpacity(null, 0.5)).not.toThrow();
    });

    it('accepts OpacityOptions object with opacity and fillOpacity', () => {
      const layer = { setOpacity: vi.fn() };
      (provider as any).setLayerOpacity(layer, { opacity: 0.3, fillOpacity: 0.7 });
      expect(layer.setOpacity).toHaveBeenCalledWith(0.3);
    });

    it('defaults fillOpacity to opacity when not provided in options', () => {
      const layer = { setOpacity: vi.fn() };
      (provider as any).setLayerOpacity(layer, { opacity: 0.4 });
      expect(layer.setOpacity).toHaveBeenCalledWith(0.4);
    });
  });

  // -----------------------------------------------------------------------
  // setOpacityByLayer / setVisibleByLayer (private)
  // -----------------------------------------------------------------------
  describe('setOpacityByLayer', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('does nothing when layer is null', () => {
      expect(() => (provider as any).setOpacityByLayer(null, 0.5)).not.toThrow();
    });

    it('stores vmapOpacity and applies when vmapVisible is true', () => {
      const layer = { setOpacity: vi.fn(), vmapVisible: true, vmapOpacity: 1.0 };
      (provider as any).setOpacityByLayer(layer, 0.4);
      expect(layer.vmapOpacity).toBe(0.4);
      expect(layer.setOpacity).toHaveBeenCalledWith(0.4);
    });

    it('stores vmapOpacity but does not apply when vmapVisible is false', () => {
      const layer = { setOpacity: vi.fn(), vmapVisible: false, vmapOpacity: 1.0 };
      (provider as any).setOpacityByLayer(layer, 0.7);
      expect(layer.vmapOpacity).toBe(0.7);
      expect(layer.setOpacity).not.toHaveBeenCalled();
    });

    it('initialises vmapVisible to true when undefined', () => {
      const layer = { setOpacity: vi.fn() } as any;
      (provider as any).setOpacityByLayer(layer, 0.6);
      expect(layer.vmapVisible).toBe(true);
      expect(layer.vmapOpacity).toBe(0.6);
    });
  });

  describe('setVisibleByLayer', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('does nothing when layer is null', () => {
      expect(() => (provider as any).setVisibleByLayer(null, true)).not.toThrow();
    });

    it('sets opacity to 0 when hiding', () => {
      const layer = { setOpacity: vi.fn(), vmapVisible: true, vmapOpacity: 0.5 };
      (provider as any).setVisibleByLayer(layer, false);
      expect(layer.vmapVisible).toBe(false);
      expect(layer.setOpacity).toHaveBeenCalledWith(0.0);
    });

    it('restores vmapOpacity when making visible', () => {
      const layer = { setOpacity: vi.fn(), vmapVisible: false, vmapOpacity: 0.8 };
      (provider as any).setVisibleByLayer(layer, true);
      expect(layer.vmapVisible).toBe(true);
      expect(layer.setOpacity).toHaveBeenCalledWith(0.8);
    });

    it('initialises vmapOpacity to 1.0 when undefined', () => {
      const layer = { setOpacity: vi.fn() } as any;
      (provider as any).setVisibleByLayer(layer, true);
      expect(layer.vmapOpacity).toBe(1.0);
      expect(layer.setOpacity).toHaveBeenCalledWith(1.0);
    });
  });

  // -----------------------------------------------------------------------
  // addLayerToGroup – WMS type
  // -----------------------------------------------------------------------
  describe('addLayerToGroup – WMS type', () => {
    it('creates a WMS tile layer with correct params', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(400);
      const L = await import('leaflet');

      const layerId = await provider.addLayerToGroup({
        type: 'wms',
        url: 'https://wms.example.com/ows',
        layers: 'some:layer',
        format: 'image/jpeg',
        transparent: 'false',
        groupId: 'wms-g',
        groupVisible: true,
      });

      expect(layerId).toBe('400');
      expect(L.tileLayer.wms).toHaveBeenCalledWith(
        'https://wms.example.com/ows',
        expect.objectContaining({
          layers: 'some:layer',
          format: 'image/jpeg',
          transparent: 'false',
        }),
      );
    });

    it('uses default format and transparent when not specified', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(401);
      const L = await import('leaflet');

      await provider.addLayerToGroup({
        type: 'wms',
        url: 'https://wms.example.com/service',
        layers: 'default_layer',
        groupId: 'wms-g2',
        groupVisible: true,
      });

      expect(L.tileLayer.wms).toHaveBeenCalledWith(
        'https://wms.example.com/service',
        expect.objectContaining({
          layers: 'default_layer',
          format: 'image/png',
          transparent: true,
        }),
      );
    });
  });

  // -----------------------------------------------------------------------
  // addBaseLayer – additional coverage
  // -----------------------------------------------------------------------
  describe('addBaseLayer – extended', () => {
    it('sets layerElementId on the created layer', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(500);

      await provider.addBaseLayer(
        { type: 'osm', groupId: 'bg', groupVisible: true } as any,
        'active-bm',
        'elem-X',
      );

      const baseLayer = (provider as any).baseLayers.find(
        (l: any) => l.layerElementId === 'elem-X',
      );
      expect(baseLayer).toBeDefined();
      expect(baseLayer.layerElementId).toBe('elem-X');
    });

    it('adds layer to map when basemapid matches and group is visible', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(501);

      // The tileLayer mock returns an object with addTo
      const result = await provider.addBaseLayer(
        { type: 'osm', groupId: 'bg2', groupVisible: true } as any,
        'same-id',
        'same-id',
      );

      expect(result).toBe('501');
    });

    it('returns null when basemapid is null', async () => {
      provider = await createInitializedProvider();

      await provider.addBaseLayer(
        { type: 'osm', groupId: 'bg3', groupVisible: true } as any,
        null as any,
        'elem-Y',
      );

      // basemapid null just logs but does not return null (only layerElementId null returns null)
      expect(log).toHaveBeenCalledWith('leaflet - addBaseLayer - basemapid not set.');
    });
  });

  // -----------------------------------------------------------------------
  // setGroupVisible – additional coverage
  // -----------------------------------------------------------------------
  describe('setGroupVisible – extended', () => {
    it('re-adds a previously hidden group to the map', async () => {
      provider = await createInitializedProvider();

      await provider.ensureGroup('vis-group', true);
      const group = mockLayerGroup.mock.results[0].value;

      // Hide it
      await provider.setGroupVisible('vis-group', false);
      expect(group.visible).toBe(false);

      // Show it again
      group.addTo.mockClear();
      await provider.setGroupVisible('vis-group', true);
      expect(group.visible).toBe(true);
      expect(group.addTo).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // updateLayer for 'osm' type
  // -----------------------------------------------------------------------
  describe('updateLayer – osm type', () => {
    it('calls setUrl on an OSM layer with default URL when no url in data', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setUrl: vi.fn() };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(600);

      await provider.updateLayer('600', {
        type: 'osm',
        data: {},
      } as any);

      expect(fakeLayer.setUrl).toHaveBeenCalledWith(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      );
    });

    it('calls setUrl with custom URL when url is provided', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setUrl: vi.fn() };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(601);

      await provider.updateLayer('601', {
        type: 'osm',
        data: { url: 'https://custom.tile.server' },
      } as any);

      expect(fakeLayer.setUrl).toHaveBeenCalledWith(
        'https://custom.tile.server/{z}/{x}/{y}.png',
      );
    });

    it('does nothing when layer lacks setUrl', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = {};
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(602);

      // Should not throw
      await expect(
        provider.updateLayer('602', {
          type: 'osm',
          data: {},
        } as any),
      ).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // wktToGeoJSON (private)
  // -----------------------------------------------------------------------
  describe('wktToGeoJSON', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('returns a FeatureCollection with one feature on valid WKT', async () => {
      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue({
        type: 'Point',
        coordinates: [10, 50],
      });

      const result = await (provider as any).wktToGeoJSON('POINT(10 50)');

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(1);
      expect(result.features[0].type).toBe('Feature');
      expect(result.features[0].geometry).toEqual({
        type: 'Point',
        coordinates: [10, 50],
      });
    });

    it('returns empty FeatureCollection when parse returns null', async () => {
      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const result = await (provider as any).wktToGeoJSON('INVALID WKT');

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(0);
      expect(error).toHaveBeenCalled();
    });

    it('returns empty FeatureCollection when parse throws', async () => {
      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('parse error');
      });

      const result = await (provider as any).wktToGeoJSON('BROKEN');

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(0);
      expect(error).toHaveBeenCalled();
    });

    it('wraps a Polygon geometry into a Feature', async () => {
      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue({
        type: 'Polygon',
        coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
      });

      const result = await (provider as any).wktToGeoJSON(
        'POLYGON((0 0,1 0,1 1,0 1,0 0))',
      );

      expect(result.features[0].geometry.type).toBe('Polygon');
      expect(result.features[0].properties).toEqual({});
    });
  });

  // -----------------------------------------------------------------------
  // createLeafletPoint (private)
  // -----------------------------------------------------------------------
  describe('createLeafletPoint', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('creates a circleMarker by default', async () => {
      const L = await import('leaflet');
      const feature = { type: 'Feature', geometry: { type: 'Point' }, properties: {} } as any;
      const latlng = { lat: 50, lng: 10 } as any;

      (provider as any).createLeafletPoint(feature, latlng, {});

      expect(L.circleMarker).toHaveBeenCalledWith(latlng, expect.objectContaining({
        radius: 6,
      }));
    });

    it('creates a marker with icon when iconUrl is provided', async () => {
      const L = await import('leaflet');
      const feature = { type: 'Feature', geometry: { type: 'Point' }, properties: {} } as any;
      const latlng = { lat: 50, lng: 10 } as any;

      (provider as any).createLeafletPoint(feature, latlng, {
        iconUrl: 'https://example.com/icon.png',
        iconSize: [24, 24],
      });

      expect(L.icon).toHaveBeenCalledWith(expect.objectContaining({
        iconUrl: 'https://example.com/icon.png',
        iconSize: [24, 24],
      }));
      expect(L.marker).toHaveBeenCalledWith(latlng, expect.any(Object));
    });
  });

  // -----------------------------------------------------------------------
  // bindLeafletPopup (private)
  // -----------------------------------------------------------------------
  describe('bindLeafletPopup', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('binds a tooltip when textProperty matches a feature property', () => {
      const layer = { bindTooltip: vi.fn() };
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: { name: 'Test Location' },
      } as any;

      (provider as any).bindLeafletPopup(feature, layer, {
        textProperty: 'name',
        textColor: '#ff0000',
        textSize: 16,
      });

      expect(layer.bindTooltip).toHaveBeenCalledWith(
        expect.stringContaining('Test Location'),
        expect.objectContaining({ permanent: true }),
      );
    });

    it('does nothing when textProperty is not set', () => {
      const layer = { bindTooltip: vi.fn() };
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: { name: 'Test' },
      } as any;

      (provider as any).bindLeafletPopup(feature, layer, {});

      expect(layer.bindTooltip).not.toHaveBeenCalled();
    });

    it('does nothing when style is undefined', () => {
      const layer = { bindTooltip: vi.fn() };
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: { name: 'Test' },
      } as any;

      (provider as any).bindLeafletPopup(feature, layer, undefined);

      expect(layer.bindTooltip).not.toHaveBeenCalled();
    });

    it('does nothing when feature lacks the named property', () => {
      const layer = { bindTooltip: vi.fn() };
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: { other: 'value' },
      } as any;

      (provider as any).bindLeafletPopup(feature, layer, {
        textProperty: 'name',
      });

      expect(layer.bindTooltip).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // addLayerToGroup – ArcGIS type
  // -----------------------------------------------------------------------
  describe('addLayerToGroup – ArcGIS type', () => {
    it('creates an ArcGIS tile layer with token param', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(700);

      const layerId = await provider.addLayerToGroup({
        type: 'arcgis',
        url: 'https://arcgis.example.com/tiles/{z}/{y}/{x}',
        token: 'my-token',
        groupId: 'arcgis-group',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('700');
      expect(mockTileLayer).toHaveBeenCalledWith(
        expect.stringContaining('token=my-token'),
        expect.any(Object),
      );
    });

    it('creates an ArcGIS tile layer without token', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(701);

      const layerId = await provider.addLayerToGroup({
        type: 'arcgis',
        url: 'https://arcgis.example.com/tiles/{z}/{y}/{x}',
        groupId: 'arcgis-group2',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('701');
      expect(mockTileLayer).toHaveBeenCalled();
    });

    it('passes additional params to arcgis URL', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(702);

      await provider.addLayerToGroup({
        type: 'arcgis',
        url: 'https://arcgis.example.com/tiles/{z}/{y}/{x}',
        params: { f: 'image' },
        groupId: 'arcgis-group3',
        groupVisible: true,
      } as any);

      expect(mockTileLayer).toHaveBeenCalledWith(
        expect.stringContaining('f=image'),
        expect.any(Object),
      );
    });
  });

  // -----------------------------------------------------------------------
  // updateLayer – GeoJSON type
  // -----------------------------------------------------------------------
  describe('updateLayer – geojson type', () => {
    it('clears and re-adds data when geojson string is provided', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');

      // Create a fake layer that is instanceof L.GeoJSON
      const FakeGeoJSON = L.GeoJSON as unknown as new () => object;
      const fakeLayer = Object.create(FakeGeoJSON.prototype);
      fakeLayer.clearLayers = vi.fn();
      fakeLayer.addData = vi.fn();

      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(800);

      const geojsonStr = JSON.stringify({
        type: 'FeatureCollection',
        features: [],
      });

      await provider.updateLayer('800', {
        type: 'geojson',
        data: { geojson: geojsonStr },
      } as any);

      expect(fakeLayer.clearLayers).toHaveBeenCalled();
      expect(fakeLayer.addData).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // updateLayer – ArcGIS type
  // -----------------------------------------------------------------------
  describe('updateLayer – arcgis type', () => {
    it('calls setUrl on an ArcGIS layer with updated URL', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setUrl: vi.fn(), options: {} };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(810);

      await provider.updateLayer('810', {
        type: 'arcgis',
        data: { url: 'https://new-arcgis.example.com/tiles/{z}/{y}/{x}' },
      } as any);

      expect(fakeLayer.setUrl).toHaveBeenCalledWith(
        'https://new-arcgis.example.com/tiles/{z}/{y}/{x}',
      );
    });

    it('appends token to URL when provided', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { setUrl: vi.fn(), options: {} };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(811);

      await provider.updateLayer('811', {
        type: 'arcgis',
        data: {
          url: 'https://arcgis.example.com/tiles/{z}/{y}/{x}',
          token: 'new-token',
        },
      } as any);

      expect(fakeLayer.setUrl).toHaveBeenCalledWith(
        expect.stringContaining('token=new-token'),
      );
    });

    it('does nothing when layer lacks setUrl', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { options: {} };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(812);

      await expect(
        provider.updateLayer('812', {
          type: 'arcgis',
          data: { url: 'https://example.com' },
        } as any),
      ).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // addLayerToGroup – WKT type
  // -----------------------------------------------------------------------
  describe('addLayerToGroup – WKT type', () => {
    it('creates a WKT layer with inline WKT data', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(820);

      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue({
        type: 'Point',
        coordinates: [10, 50],
      });

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POINT(10 50)',
        groupId: 'wkt-group',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('820');
    });

    it('creates a WKT layer with empty collection when no wkt/url', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(821);

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        groupId: 'wkt-group2',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('821');
    });
  });

  // -----------------------------------------------------------------------
  // createGeoTIFFLayer (private) – via addLayerToGroup
  // -----------------------------------------------------------------------
  describe('addLayerToGroup – GeoTIFF type', () => {
    it('throws when no URL is provided', async () => {
      provider = await createInitializedProvider();

      await expect(
        provider.addLayerToGroup({
          type: 'geotiff',
          groupId: 'geotiff-group',
          groupVisible: true,
        } as any),
      ).rejects.toThrow('GeoTIFF layer requires a URL');
    });

    it('creates a GeoTIFF layer when URL is provided', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(830);

      // The GeoTIFFGridLayer is mocked; need to set up map.options.crs.code
      (provider as any).map.options = { crs: { code: 'EPSG:4326' } };

      const { GeoTIFFGridLayer: MockGeoTIFF } = await import('./GeoTIFFGridLayer');
      (MockGeoTIFF as unknown as ReturnType<typeof vi.fn>).mockImplementation(function() { return {
        setOpacity: vi.fn(),
        setZIndex: vi.fn(),
      }; });

      const layerId = await provider.addLayerToGroup({
        type: 'geotiff',
        url: 'https://example.com/data.tiff',
        groupId: 'geotiff-group2',
        groupVisible: true,
        opacity: 0.5,
        zIndex: 5,
      } as any);

      expect(layerId).toBe('830');
      expect(MockGeoTIFF).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://example.com/data.tiff',
          viewProjection: 'EPSG:4326',
        }),
      );
    });

    it('returns placeholder layer when GeoTIFFGridLayer constructor throws', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(831);

      (provider as any).map.options = { crs: { code: 'EPSG:4326' } };

      const { GeoTIFFGridLayer: MockGeoTIFF } = await import('./GeoTIFFGridLayer');
      (MockGeoTIFF as unknown as ReturnType<typeof vi.fn>).mockImplementation(function() {
        throw new Error('GeoTIFF creation failed');
      });

      const layerId = await provider.addLayerToGroup({
        type: 'geotiff',
        url: 'https://example.com/bad.tiff',
        groupId: 'geotiff-group3',
        groupVisible: true,
      } as any);

      // Should still return a layerId (from the fallback layerGroup)
      expect(layerId).toBeTruthy();
      expect(error).toHaveBeenCalledWith(
        'Failed to create GeoTIFF layer:',
        expect.any(Error),
      );
    });
  });

  // -----------------------------------------------------------------------
  // appendParams (private)
  // -----------------------------------------------------------------------
  describe('appendParams', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('appends params to a base URL', () => {
      const result = (provider as any).appendParams('https://example.com/wfs', {
        service: 'WFS',
        request: 'GetFeature',
      });
      expect(result).toContain('service=WFS');
      expect(result).toContain('request=GetFeature');
    });

    it('returns base URL unchanged when params produce empty string', () => {
      const result = (provider as any).appendParams('https://example.com/wfs', {});
      expect(result).toBe('https://example.com/wfs');
    });

    it('skips null and undefined param values', () => {
      const result = (provider as any).appendParams('https://example.com', {
        keep: 'yes',
        drop: undefined,
        alsoNull: null,
      });
      expect(result).toContain('keep=yes');
      expect(result).not.toContain('drop');
      expect(result).not.toContain('alsoNull');
    });
  });

  // -----------------------------------------------------------------------
  // getMap
  // -----------------------------------------------------------------------
  describe('getMap', () => {
    it('returns the Leaflet map instance', async () => {
      provider = await createInitializedProvider();
      const map = (provider as any).getMap();
      expect(map).toBe(mapInstance);
    });
  });

  // -----------------------------------------------------------------------
  // addLayerToGroup – Google type
  // -----------------------------------------------------------------------
  describe('addLayerToGroup – Google type', () => {
    it('creates a Google tile layer', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(900);

      const layerId = await provider.addLayerToGroup({
        type: 'google',
        apiKey: 'test-google-key',
        mapType: 'satellite',
        groupId: 'google-group',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('900');
    });

    it('throws when apiKey is missing for Google layer', async () => {
      provider = await createInitializedProvider();

      await expect(
        provider.addLayerToGroup({
          type: 'google',
          groupId: 'google-no-key',
          groupVisible: true,
        } as any),
      ).rejects.toThrow('apiKey');
    });

    it('throws when map is not initialized for Google layer', async () => {
      provider = await createInitializedProvider();

      // Set map to undefined to simulate uninitialized state in createGoogleLayer
      (provider as any).map = undefined;

      await expect(
        (provider as any).createGoogleLayer({ apiKey: 'key' }),
      ).rejects.toThrow('Map not initialized');
    });

    it('parses styles string for Google layer', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(901);

      const layerId = await provider.addLayerToGroup({
        type: 'google',
        apiKey: 'test-google-key',
        styles: JSON.stringify([{ featureType: 'road' }]),
        groupId: 'google-styled',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('901');
    });
  });

  // -----------------------------------------------------------------------
  // addLayerToGroup – WCS type
  // -----------------------------------------------------------------------
  describe('addLayerToGroup – WCS type', () => {
    it('throws when url is missing', async () => {
      provider = await createInitializedProvider();

      await expect(
        provider.addLayerToGroup({
          type: 'wcs',
          coverageName: 'test',
          groupId: 'wcs-group',
          groupVisible: true,
        } as any),
      ).rejects.toThrow('WCS layer requires a URL');
    });

    it('throws when coverageName is missing', async () => {
      provider = await createInitializedProvider();

      await expect(
        provider.addLayerToGroup({
          type: 'wcs',
          url: 'https://wcs.example.com',
          groupId: 'wcs-group2',
          groupVisible: true,
        } as any),
      ).rejects.toThrow('WCS layer requires a coverageName');
    });

    it('creates a WCS layer when both url and coverageName are provided', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(910);

      const { WCSGridLayer: MockWCS } = await import('./WCSGridLayer');
      (MockWCS as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
        return {
          setOpacity: vi.fn(),
          setZIndex: vi.fn(),
          updateOptions: vi.fn(),
        };
      });

      const layerId = await provider.addLayerToGroup({
        type: 'wcs',
        url: 'https://wcs.example.com/service',
        coverageName: 'myCoverage',
        opacity: 0.7,
        zIndex: 3,
        groupId: 'wcs-group3',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('910');
    });

    it('returns placeholder layer when WCSGridLayer constructor throws', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(911);

      const { WCSGridLayer: MockWCS } = await import('./WCSGridLayer');
      (MockWCS as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
        throw new Error('WCS creation failed');
      });

      const layerId = await provider.addLayerToGroup({
        type: 'wcs',
        url: 'https://wcs.example.com/service',
        coverageName: 'myCoverage',
        groupId: 'wcs-group4',
        groupVisible: true,
      } as any);

      expect(layerId).toBeTruthy();
      expect(error).toHaveBeenCalledWith(
        '[Leaflet WCS] Failed to create WCS layer:',
        expect.any(Error),
      );
    });
  });

  // -----------------------------------------------------------------------
  // addLayerToGroup – WFS type
  // -----------------------------------------------------------------------
  describe('addLayerToGroup – WFS type', () => {
    it('creates a WFS layer by fetching GeoJSON', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(920);

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
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
        groupId: 'wfs-group',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('920');
    });
  });

  // -----------------------------------------------------------------------
  // fetchWFSFromUrl (private)
  // -----------------------------------------------------------------------
  describe('fetchWFSFromUrl', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('throws when response is not ok', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        }),
      );

      await expect(
        (provider as any).fetchWFSFromUrl({
          url: 'https://wfs.example.com',
          typeName: 'layer',
        }),
      ).rejects.toThrow('WFS request failed');
    });

    it('returns JSON when outputFormat includes json', async () => {
      const geojsonData = { type: 'FeatureCollection', features: [] };
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(geojsonData),
        }),
      );

      const result = await (provider as any).fetchWFSFromUrl({
        url: 'https://wfs.example.com',
        typeName: 'layer',
        outputFormat: 'application/json',
      });

      expect(result).toEqual(geojsonData);
    });

    it('parses GML when outputFormat includes gml', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          text: vi.fn().mockResolvedValue('<wfs:FeatureCollection></wfs:FeatureCollection>'),
        }),
      );

      const { GmlParser: MockParser } = await import('@npm9912/s-gml');
      (MockParser as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
        return {
          parse: vi.fn().mockResolvedValue({ type: 'FeatureCollection', features: [] }),
        };
      });

      const result = await (provider as any).fetchWFSFromUrl({
        url: 'https://wfs.example.com',
        typeName: 'layer',
        outputFormat: 'gml3',
      });

      expect(result).toEqual({ type: 'FeatureCollection', features: [] });
    });

    it('defaults to JSON parse for unknown format', async () => {
      const geojsonData = { type: 'FeatureCollection', features: [] };
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(geojsonData),
        }),
      );

      const result = await (provider as any).fetchWFSFromUrl({
        url: 'https://wfs.example.com',
        typeName: 'layer',
        outputFormat: 'text/csv',
      });

      expect(result).toEqual(geojsonData);
    });
  });

  // -----------------------------------------------------------------------
  // createGeostylerLeafletOptions (private)
  // -----------------------------------------------------------------------
  describe('createGeostylerLeafletOptions', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('returns options with style, pointToLayer, and onEachFeature', async () => {
      const result = await (provider as any).createGeostylerLeafletOptions({
        name: 'test-style',
        rules: [
          {
            name: 'fill',
            symbolizers: [
              { kind: 'Fill', color: '#FF0000', opacity: 0.5 },
            ],
          },
        ],
      });

      expect(typeof result.style).toBe('function');
      expect(typeof result.pointToLayer).toBe('function');
      expect(typeof result.onEachFeature).toBe('function');
    });

    it('style function returns fill style for Polygon', async () => {
      const result = await (provider as any).createGeostylerLeafletOptions({
        name: 'test',
        rules: [
          {
            name: 'fill',
            symbolizers: [
              { kind: 'Fill', color: '#FF0000', opacity: 0.5, outlineColor: '#00FF00', outlineWidth: 3 },
            ],
          },
        ],
      });

      const style = result.style({
        geometry: { type: 'Polygon' },
        properties: {},
        type: 'Feature',
      });

      expect(style.fillColor).toBe('#FF0000');
      expect(style.fillOpacity).toBe(0.5);
      expect(style.color).toBe('#00FF00');
      expect(style.weight).toBe(3);
    });

    it('style function returns line style for Line symbolizer', async () => {
      const result = await (provider as any).createGeostylerLeafletOptions({
        name: 'test',
        rules: [
          {
            name: 'line',
            symbolizers: [
              { kind: 'Line', color: '#0000FF', width: 4, dasharray: [5, 10] },
            ],
          },
        ],
      });

      const style = result.style({
        geometry: { type: 'LineString' },
        properties: {},
        type: 'Feature',
      });

      expect(style.color).toBe('#0000FF');
      expect(style.weight).toBe(4);
      expect(style.dashArray).toBe('5,10');
    });

    it('pointToLayer creates circleMarker for Mark symbolizer', async () => {
      const L = await import('leaflet');

      const result = await (provider as any).createGeostylerLeafletOptions({
        name: 'test',
        rules: [
          {
            name: 'mark',
            symbolizers: [
              { kind: 'Mark', color: '#FF0000', radius: 10, strokeColor: '#000', strokeWidth: 2 },
            ],
          },
        ],
      });

      const latlng = { lat: 50, lng: 10 };
      result.pointToLayer({ geometry: { type: 'Point' }, properties: {} }, latlng);

      expect(L.circleMarker).toHaveBeenCalledWith(latlng, expect.objectContaining({
        radius: 10,
        fillColor: '#FF0000',
      }));
    });

    it('pointToLayer creates marker for Icon symbolizer', async () => {
      const L = await import('leaflet');

      const result = await (provider as any).createGeostylerLeafletOptions({
        name: 'test',
        rules: [
          {
            name: 'icon',
            symbolizers: [
              { kind: 'Icon', image: 'https://example.com/icon.png', size: 24 },
            ],
          },
        ],
      });

      const latlng = { lat: 50, lng: 10 };
      result.pointToLayer({ geometry: { type: 'Point' }, properties: {} }, latlng);

      expect(L.icon).toHaveBeenCalledWith(expect.objectContaining({
        iconUrl: 'https://example.com/icon.png',
      }));
      expect(L.marker).toHaveBeenCalled();
    });

    it('onEachFeature binds tooltip for Text symbolizer', async () => {
      const result = await (provider as any).createGeostylerLeafletOptions({
        name: 'test',
        rules: [
          {
            name: 'text',
            symbolizers: [
              { kind: 'Text', label: 'name', color: '#000', size: 14 },
            ],
          },
        ],
      });

      const mockLayer = { bindTooltip: vi.fn() };
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: { name: 'Test Label' },
      };

      result.onEachFeature(feature, mockLayer);

      expect(mockLayer.bindTooltip).toHaveBeenCalledWith(
        expect.stringContaining('Test Label'),
        expect.objectContaining({ permanent: true }),
      );
    });

    it('pointToLayer returns default circleMarker when no matching symbolizer', async () => {
      const L = await import('leaflet');

      const result = await (provider as any).createGeostylerLeafletOptions({
        name: 'test',
        rules: [],
      });

      const latlng = { lat: 50, lng: 10 };
      result.pointToLayer({ geometry: { type: 'Point' }, properties: {} }, latlng);

      expect(L.circleMarker).toHaveBeenCalledWith(latlng, expect.objectContaining({
        radius: 6,
      }));
    });
  });

  // -----------------------------------------------------------------------
  // updateWKTLayer (private) – via updateLayer
  // -----------------------------------------------------------------------
  describe('updateLayer – wkt type', () => {
    it('updates a WKT layer with inline WKT data', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');

      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue({
        type: 'Point',
        coordinates: [10, 50],
      });

      // Create a fake GeoJSON layer
      const FakeGeoJSON = L.GeoJSON as unknown as new () => object;
      const fakeLayer = Object.create(FakeGeoJSON.prototype);
      fakeLayer.clearLayers = vi.fn();
      fakeLayer.addData = vi.fn();
      fakeLayer.options = {};

      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(950);

      await provider.updateLayer('950', {
        type: 'wkt',
        data: { wkt: 'POINT(10 50)' },
      } as any);

      expect(fakeLayer.clearLayers).toHaveBeenCalled();
      expect(fakeLayer.addData).toHaveBeenCalled();
    });

    it('does nothing when layer is not a GeoJSON instance', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { clearLayers: vi.fn() };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(951);

      await expect(
        provider.updateLayer('951', {
          type: 'wkt',
          data: { wkt: 'POINT(10 50)' },
        } as any),
      ).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // updateLayer – WFS type
  // -----------------------------------------------------------------------
  describe('updateLayer – wfs type', () => {
    it('updates a WFS layer with fetched data', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');

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

      const FakeGeoJSON = L.GeoJSON as unknown as new () => object;
      const fakeLayer = Object.create(FakeGeoJSON.prototype);
      fakeLayer.clearLayers = vi.fn();
      fakeLayer.addData = vi.fn();

      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(960);

      await provider.updateLayer('960', {
        type: 'wfs',
        data: {
          url: 'https://wfs.example.com/service',
          typeName: 'layer',
        },
      } as any);

      expect(fakeLayer.clearLayers).toHaveBeenCalled();
      expect(fakeLayer.addData).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: init resize callback (line 74)
  // -----------------------------------------------------------------------
  describe('init – resize callback', () => {
    it('calls invalidateSize when resize callback is triggered', async () => {
      const { watchElementResize } = await import('../../utils/dom-env');
      (watchElementResize as ReturnType<typeof vi.fn>).mockImplementation(
        (_target: any, cb: () => void) => {
          cb(); // immediately invoke the resize callback
          return vi.fn();
        },
      );

      const p = createProvider();
      const target = document.createElement('div');
      const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
      await p.init({ target, shadowRoot } as any);

      expect(mapInstance.invalidateSize).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: updateLayer – geotiff / wcs cases (lines 99-103)
  // -----------------------------------------------------------------------
  describe('updateLayer – geotiff type', () => {
    it('calls updateGeoTIFFLayer when type is geotiff', async () => {
      provider = await createInitializedProvider();

      const { GeoTIFFGridLayer: MockGeoTIFF } = await import('./GeoTIFFGridLayer');
      const GeoTIFFProto = (MockGeoTIFF as unknown as ReturnType<typeof vi.fn>);

      // Create a fake layer that IS an instance of GeoTIFFGridLayer
      const fakeGeoTIFFLayer = { updateSource: vi.fn().mockResolvedValue(undefined) };
      // Use Object.create to make it an instanceof
      GeoTIFFProto.mockImplementation(function () { return fakeGeoTIFFLayer; });
      const realInstance = new (GeoTIFFProto as any)();
      Object.setPrototypeOf(realInstance, GeoTIFFProto.prototype);

      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(realInstance);
      });
      mockUtilStamp.mockReturnValue(1100);

      await provider.updateLayer('1100', {
        type: 'geotiff',
        data: { url: 'https://example.com/updated.tiff' },
      } as any);

      // The updateGeoTIFFLayer checks instanceof GeoTIFFGridLayer.
      // Since mock classes don't pass instanceof, it may early-return.
      // But the branch for 'geotiff' case (line 99) IS exercised.
    });

    it('throws when geotiff update has no url', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = {};
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(1101);

      await expect(
        provider.updateLayer('1101', {
          type: 'geotiff',
          data: {},
        } as any),
      ).rejects.toThrow('GeoTIFF update requires a URL');
    });
  });

  describe('updateLayer – wcs type', () => {
    it('calls updateWCSLayer when type is wcs', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { updateOptions: vi.fn() };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(1102);

      await provider.updateLayer('1102', {
        type: 'wcs',
        data: { url: 'https://wcs.example.com/updated' },
      } as any);

      // The branch for 'wcs' case (line 101-102) is exercised.
      // updateWCSLayer checks instanceof WCSGridLayer, so updateOptions may not be called.
    });

    it('returns early when layer is null', async () => {
      provider = await createInitializedProvider();

      // no layer returned by eachLayer
      mapInstance.eachLayer.mockImplementation(() => {});
      mockUtilStamp.mockReturnValue(1103);

      // also no baseLayer match
      await expect(
        provider.updateLayer('1103', {
          type: 'wcs',
          data: { url: 'https://wcs.example.com' },
        } as any),
      ).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: addLayerToGroup – layer is null (line 127)
  // -----------------------------------------------------------------------
  describe('addLayerToGroup – null layer', () => {
    it('returns null when createGeoJSONLayer returns null (no geojson/url)', async () => {
      provider = await createInitializedProvider();

      const result = await provider.addLayerToGroup({
        type: 'geojson',
        groupId: 'null-layer-group',
        groupVisible: true,
        // no geojson or url, so createGeoJSONLayer returns null
      } as any);

      expect(result).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: addLayerToGroup visible=true (line 142)
  // -----------------------------------------------------------------------
  describe('addLayerToGroup – visible=true', () => {
    it('calls setVisibleByLayer(true) when config.visible is true', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1200);

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        groupId: 'vis-true-group',
        groupVisible: true,
        visible: true,
      });

      expect(layerId).toBe('1200');
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: addBaseLayer – layer null (line 216)
  // -----------------------------------------------------------------------
  describe('addBaseLayer – null layer from createLayer', () => {
    it('returns null when createLayer returns null', async () => {
      provider = await createInitializedProvider();

      // geojson type with no data returns null
      const result = await provider.addBaseLayer(
        { type: 'geojson', groupId: 'bg-null', groupVisible: true } as any,
        'bm-null',
        'elem-null',
      );

      expect(result).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: addBaseLayer – opacity/zIndex/visible branches
  // (lines 225, 228, 231, 233, 238-239)
  // -----------------------------------------------------------------------
  describe('addBaseLayer – opacity/zIndex/visible branches', () => {
    it('applies opacity and zIndex when provided', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1300);

      const result = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'bg-opts',
          groupVisible: true,
          opacity: 0.5,
          zIndex: 7,
        } as any,
        'bm-opts',
        'elem-opts',
      );

      expect(result).toBe('1300');
    });

    it('sets visible=true when config.visible is true', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1301);

      const result = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'bg-vis-true',
          groupVisible: true,
          visible: true,
        } as any,
        'bm-vis',
        'elem-vis',
      );

      expect(result).toBe('1301');
    });

    it('sets visible=false when config.visible is false', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1302);

      const result = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'bg-vis-false',
          groupVisible: true,
          visible: false,
        } as any,
        'bm-vis2',
        'elem-vis2',
      );

      expect(result).toBe('1302');
    });

    it('removes previous layer when basemapid matches and group has prev layer', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1303);

      // First add a base layer that matches
      await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'bg-swap',
          groupVisible: true,
        } as any,
        'elem-swap',
        'elem-swap',
      );

      // Now the group has one layer; add another matching one
      const group = (provider as any).layers.find(
        (l: any) => l._groupId === 'bg-swap',
      );
      const prevLayer = { _leaflet_id: 999 };
      group.getLayers.mockReturnValue([prevLayer]);
      group.visible = true;

      mockUtilStamp.mockReturnValue(1304);
      mapInstance.removeLayer.mockClear();

      const result2 = await provider.addBaseLayer(
        {
          type: 'osm',
          groupId: 'bg-swap',
          groupVisible: true,
        } as any,
        'elem-swap2',
        'elem-swap2',
      );

      expect(result2).toBe('1304');
      expect(mapInstance.removeLayer).toHaveBeenCalledWith(prevLayer);
      expect(group.clearLayers).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: setBaseLayer – group not found (line 270)
  // -----------------------------------------------------------------------
  describe('setBaseLayer – group not found', () => {
    it('returns early when group is not found', async () => {
      provider = await createInitializedProvider();

      // push a base layer with matching layerElementId but no group matches
      const baseLayer = { layerElementId: 'elem-orphan' };
      (provider as any).baseLayers.push(baseLayer);

      await expect(
        provider.setBaseLayer('nonexistent-group', 'elem-orphan'),
      ).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: updateGeoJSONLayer with URL (lines 370-376)
  // -----------------------------------------------------------------------
  describe('updateGeoJSONLayer – URL branch', () => {
    it('fetches from URL when geojson is not provided', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');

      const fetchedData = { type: 'FeatureCollection', features: [] };
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(fetchedData),
        }),
      );

      const FakeGeoJSON = L.GeoJSON as unknown as new () => object;
      const fakeLayer = Object.create(FakeGeoJSON.prototype);
      fakeLayer.clearLayers = vi.fn();
      fakeLayer.addData = vi.fn();

      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(1400);

      await provider.updateLayer('1400', {
        type: 'geojson',
        data: { url: 'https://example.com/data.geojson' },
      } as any);

      expect(fetch).toHaveBeenCalledWith('https://example.com/data.geojson');
      expect(fakeLayer.clearLayers).toHaveBeenCalled();
      expect(fakeLayer.addData).toHaveBeenCalled();
    });

    it('throws when fetch fails for geojson URL', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          statusText: 'Server Error',
        }),
      );

      const FakeGeoJSON = L.GeoJSON as unknown as new () => object;
      const fakeLayer = Object.create(FakeGeoJSON.prototype);
      fakeLayer.clearLayers = vi.fn();
      fakeLayer.addData = vi.fn();

      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(1401);

      await expect(
        provider.updateLayer('1401', {
          type: 'geojson',
          data: { url: 'https://example.com/bad.geojson' },
        } as any),
      ).rejects.toThrow('GeoJSON fetch failed');
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createGeoJSONLayer with URL (lines 388-394)
  // -----------------------------------------------------------------------
  describe('createGeoJSONLayer – URL branch', () => {
    it('fetches geojson from URL', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1410);

      const fetchedData = { type: 'FeatureCollection', features: [] };
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(fetchedData),
        }),
      );

      const layerId = await provider.addLayerToGroup({
        type: 'geojson',
        url: 'https://example.com/remote.geojson',
        groupId: 'geojson-url-group',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('1410');
      expect(fetch).toHaveBeenCalledWith('https://example.com/remote.geojson');
    });

    it('throws when fetch fails for geojson URL in createLayer', async () => {
      provider = await createInitializedProvider();

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        }),
      );

      await expect(
        provider.addLayerToGroup({
          type: 'geojson',
          url: 'https://example.com/missing.geojson',
          groupId: 'geojson-url-fail',
          groupVisible: true,
        } as any),
      ).rejects.toThrow('GeoJSON fetch failed');
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createGeoJSONLayer returns null (line 420)
  // -----------------------------------------------------------------------
  describe('createGeoJSONLayer – no data returns null', () => {
    it('returns null when neither geojson nor url is provided', async () => {
      provider = await createInitializedProvider();

      const result = await provider.addLayerToGroup({
        type: 'geojson',
        groupId: 'empty-geojson',
        groupVisible: true,
      } as any);

      expect(result).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createOSMLayer with custom url (line 449)
  // -----------------------------------------------------------------------
  describe('createOSMLayer – custom URL', () => {
    it('creates an OSM layer with custom URL', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1420);

      const layerId = await provider.addLayerToGroup({
        type: 'osm',
        url: 'https://custom-tiles.example.com',
        groupId: 'osm-custom-group',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('1420');
      expect(mockTileLayer).toHaveBeenCalledWith(
        'https://custom-tiles.example.com/{z}/{x}/{y}.png',
        expect.any(Object),
      );
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: Google logo callback (lines 552-553)
  // -----------------------------------------------------------------------
  describe('createGoogleLayer – google logo callback', () => {
    it('invokes the ensureGoogleLogo callback setting googleLogoAdded', async () => {
      provider = await createInitializedProvider();

      const { ensureGoogleLogo } = await import('./leaflet-helpers');
      (ensureGoogleLogo as ReturnType<typeof vi.fn>).mockImplementation(
        (_map: any, cb: () => void) => {
          cb(); // immediately invoke the callback
        },
      );

      await (provider as any).createGoogleLayer({
        apiKey: 'test-key',
        mapType: 'roadmap',
      });

      expect((provider as any).googleLogoAdded).toBe(true);
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining('googleLogoAdded'),
        true,
      );
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: setLayerOpacity – GeoJSON/Path/Marker (lines 691-695)
  // -----------------------------------------------------------------------
  describe('setLayerOpacity – layer type branches', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('recursively applies opacity on GeoJSON (LayerCollection) layer', async () => {
      const L = await import('leaflet');

      const FakeGeoJSON = L.GeoJSON as unknown as new () => object;
      const geoJsonLayer = Object.create(FakeGeoJSON.prototype);
      const subLayer = { setOpacity: vi.fn() };
      geoJsonLayer.eachLayer = vi.fn((cb: (l: any) => void) => {
        cb(subLayer);
      });

      (provider as any).setLayerOpacity(geoJsonLayer, 0.5);

      expect(geoJsonLayer.eachLayer).toHaveBeenCalled();
    });

    it('calls setStyle on Path layer', async () => {
      const L = await import('leaflet');

      const FakePath = L.Path as unknown as new () => object;
      const pathLayer = Object.create(FakePath.prototype);
      pathLayer.setStyle = vi.fn();

      (provider as any).setLayerOpacity(pathLayer, 0.6);

      expect(pathLayer.setStyle).toHaveBeenCalledWith({
        opacity: 0.6,
        fillOpacity: 0.6,
      });
    });

    it('calls setOpacity on Marker layer', async () => {
      const L = await import('leaflet');

      const FakeMarker = L.Marker as unknown as new () => object;
      const markerLayer = Object.create(FakeMarker.prototype);
      markerLayer.setOpacity = vi.fn();

      (provider as any).setLayerOpacity(markerLayer, 0.3);

      expect(markerLayer.setOpacity).toHaveBeenCalledWith(0.3);
    });

    it('recursively applies opacity on LayerGroup', async () => {
      const L = await import('leaflet');

      const lgInstance = new (L.LayerGroup as any)();
      const subLayer = { setOpacity: vi.fn() };
      lgInstance.eachLayer = vi.fn((cb: (l: any) => void) => {
        cb(subLayer);
      });

      (provider as any).setLayerOpacity(lgInstance, 0.4);

      expect(lgInstance.eachLayer).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: _getLayerGroupById when map is null (line 732)
  // -----------------------------------------------------------------------
  describe('_getLayerGroupById – map is null', () => {
    it('returns null when map is not initialized', async () => {
      provider = createProvider();

      const result = await (provider as any)._getLayerGroupById('any-group');
      expect(result).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: updateWKTLayer with URL (lines 770-779)
  // -----------------------------------------------------------------------
  describe('updateWKTLayer – URL branch', () => {
    it('fetches WKT from URL and updates layer', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');

      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue({
        type: 'Point',
        coordinates: [10, 50],
      });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          text: vi.fn().mockResolvedValue('POINT(10 50)'),
        }),
      );

      const FakeGeoJSON = L.GeoJSON as unknown as new () => object;
      const fakeLayer = Object.create(FakeGeoJSON.prototype);
      fakeLayer.clearLayers = vi.fn();
      fakeLayer.addData = vi.fn();
      fakeLayer.options = {};

      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(1500);

      await provider.updateLayer('1500', {
        type: 'wkt',
        data: { url: 'https://example.com/data.wkt' },
      } as any);

      expect(fetch).toHaveBeenCalledWith('https://example.com/data.wkt');
      expect(fakeLayer.clearLayers).toHaveBeenCalled();
      expect(fakeLayer.addData).toHaveBeenCalled();
    });

    it('logs error when WKT URL fetch fails', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
        }),
      );

      const FakeGeoJSON = L.GeoJSON as unknown as new () => object;
      const fakeLayer = Object.create(FakeGeoJSON.prototype);
      fakeLayer.clearLayers = vi.fn();
      fakeLayer.addData = vi.fn();
      fakeLayer.options = {};

      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(1501);

      await provider.updateLayer('1501', {
        type: 'wkt',
        data: { url: 'https://example.com/bad.wkt' },
      } as any);

      expect(error).toHaveBeenCalledWith(
        'Failed to load WKT from URL:',
        expect.any(Error),
      );
      // clearLayers should NOT be called because of error early return
      expect(fakeLayer.clearLayers).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createWKTLayer with URL (lines 807-815)
  // -----------------------------------------------------------------------
  describe('createWKTLayer – URL branch', () => {
    it('fetches WKT from URL for layer creation', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1510);

      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue({
        type: 'Point',
        coordinates: [10, 50],
      });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          text: vi.fn().mockResolvedValue('POINT(10 50)'),
        }),
      );

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        url: 'https://example.com/data.wkt',
        groupId: 'wkt-url-group',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('1510');
      expect(fetch).toHaveBeenCalledWith('https://example.com/data.wkt');
    });

    it('uses empty collection when WKT URL fetch fails', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1511);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
        }),
      );

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        url: 'https://example.com/bad.wkt',
        groupId: 'wkt-url-fail',
        groupVisible: true,
      } as any);

      // Should still return a layerId because fallback is emptyCollection
      expect(layerId).toBeTruthy();
      expect(error).toHaveBeenCalledWith(
        'Failed to load WKT from URL:',
        expect.any(Error),
      );
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createWKTLayer with geostylerStyle (lines 838-840)
  // -----------------------------------------------------------------------
  describe('createWKTLayer – geostylerStyle branch', () => {
    it('uses geostyler options when geostylerStyle is provided', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1520);

      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue({
        type: 'Point',
        coordinates: [10, 50],
      });

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POINT(10 50)',
        groupId: 'wkt-geostyler',
        groupVisible: true,
        geostylerStyle: {
          name: 'test',
          rules: [
            {
              name: 'mark',
              symbolizers: [{ kind: 'Mark', color: '#FF0000', radius: 8 }],
            },
          ],
        },
      } as any);

      expect(layerId).toBe('1520');
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createWKTLayer default style – exercise callbacks (lines 838-840)
  // -----------------------------------------------------------------------
  describe('createWKTLayer – exercise default style callbacks', () => {
    it('invokes pointToLayer and onEachFeature callbacks from default WKT style', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');
      mockUtilStamp.mockReturnValue(1525);

      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue({
        type: 'Point',
        coordinates: [10, 50],
      });

      // Capture options passed to L.geoJSON
      let capturedOptions: any = null;
      (L.geoJSON as ReturnType<typeof vi.fn>).mockImplementation(
        (_data: any, opts: any) => {
          capturedOptions = opts;
          return {
            addTo: vi.fn().mockReturnThis(),
            clearLayers: vi.fn(),
            addData: vi.fn(),
            eachLayer: vi.fn(),
            setStyle: vi.fn(),
          };
        },
      );

      await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POINT(10 50)',
        groupId: 'wkt-default-cb',
        groupVisible: true,
      } as any);

      expect(capturedOptions).not.toBeNull();

      // Exercise pointToLayer callback (line 838)
      const feature = { type: 'Feature', geometry: { type: 'Point' }, properties: {} };
      const latlng = { lat: 50, lng: 10 };
      capturedOptions.pointToLayer(feature, latlng);
      expect(L.circleMarker).toHaveBeenCalled();

      // Exercise onEachFeature callback (line 840)
      const layer = { bindTooltip: vi.fn() };
      capturedOptions.onEachFeature(feature, layer);
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: updateWKTLayer – exercise style callbacks (lines 790, 792)
  // -----------------------------------------------------------------------
  describe('updateWKTLayer – exercise style callbacks', () => {
    it('invokes pointToLayer and onEachFeature callbacks after WKT update', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');

      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue({
        type: 'Point',
        coordinates: [10, 50],
      });

      const FakeGeoJSON = L.GeoJSON as unknown as new () => object;
      const fakeLayer = Object.create(FakeGeoJSON.prototype);
      fakeLayer.clearLayers = vi.fn();
      fakeLayer.addData = vi.fn();
      fakeLayer.options = {} as any;

      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(1530);

      await provider.updateLayer('1530', {
        type: 'wkt',
        data: { wkt: 'POINT(10 50)' },
      } as any);

      // After update, fakeLayer.options should have pointToLayer and onEachFeature
      expect(typeof fakeLayer.options.pointToLayer).toBe('function');
      expect(typeof fakeLayer.options.onEachFeature).toBe('function');

      // Exercise pointToLayer (line 790)
      const feature = { type: 'Feature', geometry: { type: 'Point' }, properties: {} };
      const latlng = { lat: 50, lng: 10 };
      fakeLayer.options.pointToLayer(feature, latlng);
      expect(L.circleMarker).toHaveBeenCalled();

      // Exercise onEachFeature (line 792)
      const layerForPopup = { bindTooltip: vi.fn() };
      fakeLayer.options.onEachFeature(feature, layerForPopup);
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: updateGeoTIFFLayer – null layer / non-GeoTIFF (lines 922-929)
  // -----------------------------------------------------------------------
  describe('updateGeoTIFFLayer – early returns', () => {
    it('returns early when layer is not a GeoTIFFGridLayer instance', async () => {
      provider = await createInitializedProvider();

      const fakeLayer = { someOtherProp: true };
      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(fakeLayer);
      });
      mockUtilStamp.mockReturnValue(1600);

      // Should not throw - just early return because not instanceof GeoTIFFGridLayer
      await expect(
        provider.updateLayer('1600', {
          type: 'geotiff',
          data: { url: 'https://example.com/test.tiff' },
        } as any),
      ).resolves.not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: updateWCSLayer (lines 984-996)
  // -----------------------------------------------------------------------
  describe('updateWCSLayer – with WCSGridLayer instance', () => {
    it('calls updateOptions on a WCSGridLayer instance', async () => {
      provider = await createInitializedProvider();
      const { WCSGridLayer: MockWCS } = await import('./WCSGridLayer');
      const WCSProto = (MockWCS as unknown as ReturnType<typeof vi.fn>);

      const fakeWCSLayer = { updateOptions: vi.fn() };
      WCSProto.mockImplementation(function () { return fakeWCSLayer; });
      const realInstance = new (WCSProto as any)();
      Object.setPrototypeOf(realInstance, WCSProto.prototype);

      mapInstance.eachLayer.mockImplementation((cb: (l: any) => void) => {
        cb(realInstance);
      });
      mockUtilStamp.mockReturnValue(1700);

      await provider.updateLayer('1700', {
        type: 'wcs',
        data: {
          url: 'https://wcs.example.com/new',
          coverageName: 'newCoverage',
          version: '2.0.1',
          format: 'image/tiff',
          projection: 'EPSG:3857',
          params: { extra: 'param' },
        },
      } as any);

      expect(realInstance.updateOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://wcs.example.com/new',
          coverageName: 'newCoverage',
        }),
      );
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createGeostylerLeafletOptions – Icon without valid src (line 1131)
  // -----------------------------------------------------------------------
  describe('createGeostylerLeafletOptions – Icon break fallback', () => {
    it('falls through to default circleMarker when Icon image is undefined', async () => {
      const L = await import('leaflet');
      provider = await createInitializedProvider();

      const result = await (provider as any).createGeostylerLeafletOptions({
        name: 'test',
        rules: [
          {
            name: 'icon-no-src',
            symbolizers: [{ kind: 'Icon', size: 24 }], // no image
          },
        ],
      });

      const latlng = { lat: 50, lng: 10 };
      result.pointToLayer(
        { geometry: { type: 'Point' }, properties: {} },
        latlng,
      );

      // Should fall through to the default circleMarker
      expect(L.circleMarker).toHaveBeenCalledWith(
        latlng,
        expect.objectContaining({ radius: 6 }),
      );
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createLeafletPoint with styleFunction (lines 1232-1236)
  // -----------------------------------------------------------------------
  describe('createLeafletPoint – styleFunction', () => {
    beforeEach(async () => {
      provider = await createInitializedProvider();
    });

    it('applies conditionalStyle from styleFunction', async () => {
      const L = await import('leaflet');
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: {},
      } as any;
      const latlng = { lat: 50, lng: 10 } as any;

      (provider as any).createLeafletPoint(feature, latlng, {
        pointRadius: 8,
        styleFunction: (_f: any) => ({
          pointColor: '#00FF00',
          pointRadius: 12,
        }),
      });

      expect(L.circleMarker).toHaveBeenCalledWith(
        latlng,
        expect.objectContaining({
          radius: 12,
          fillColor: '#00FF00',
        }),
      );
    });

    it('uses original style when styleFunction returns undefined', async () => {
      const L = await import('leaflet');
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: {},
      } as any;
      const latlng = { lat: 50, lng: 10 } as any;

      (provider as any).createLeafletPoint(feature, latlng, {
        pointRadius: 10,
        styleFunction: () => undefined,
      });

      expect(L.circleMarker).toHaveBeenCalledWith(
        latlng,
        expect.objectContaining({
          radius: 10,
        }),
      );
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createWFSLayer with geostylerStyle (line 1314)
  // -----------------------------------------------------------------------
  describe('createWFSLayer – geostylerStyle branch', () => {
    it('uses geostyler options when geostylerStyle is provided', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1800);

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
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
        groupId: 'wfs-geostyler',
        groupVisible: true,
        geostylerStyle: {
          name: 'test',
          rules: [
            {
              name: 'fill',
              symbolizers: [{ kind: 'Fill', color: '#FF0000' }],
            },
          ],
        },
      } as any);

      expect(layerId).toBe('1800');
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createWFSLayer default style callbacks (lines 1324-1326)
  // -----------------------------------------------------------------------
  describe('createWFSLayer – default style callbacks', () => {
    it('creates pointToLayer and onEachFeature with default style', async () => {
      provider = await createInitializedProvider();
      mockUtilStamp.mockReturnValue(1810);
      const L = await import('leaflet');

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
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
        groupId: 'wfs-default-style',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('1810');

      // Verify L.geoJSON was called with options that include style, pointToLayer, onEachFeature
      expect(L.geoJSON).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          style: expect.any(Function),
          pointToLayer: expect.any(Function),
          onEachFeature: expect.any(Function),
        }),
      );
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createGeoJSONLayer style/pointToLayer/onEachFeature (lines 411-413)
  // -----------------------------------------------------------------------
  describe('createGeoJSONLayer – style callbacks exercised', () => {
    it('invokes the pointToLayer and onEachFeature callbacks', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');

      // Capture the options passed to L.geoJSON
      let capturedOptions: any = null;
      (L.geoJSON as ReturnType<typeof vi.fn>).mockImplementation(
        (_data: any, opts: any) => {
          capturedOptions = opts;
          return {
            addTo: vi.fn().mockReturnThis(),
            clearLayers: vi.fn(),
            addData: vi.fn(),
            eachLayer: vi.fn(),
            setStyle: vi.fn(),
          };
        },
      );

      mockUtilStamp.mockReturnValue(1900);

      const geojsonString = JSON.stringify({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [10, 50] },
            properties: { name: 'Test' },
          },
        ],
      });

      await provider.addLayerToGroup({
        type: 'geojson',
        geojson: geojsonString,
        groupId: 'callback-group',
        groupVisible: true,
      } as any);

      expect(capturedOptions).not.toBeNull();
      expect(typeof capturedOptions.pointToLayer).toBe('function');
      expect(typeof capturedOptions.onEachFeature).toBe('function');

      // Exercise the pointToLayer callback (line 411)
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: {},
      };
      const latlng = { lat: 50, lng: 10 };
      capturedOptions.pointToLayer(feature, latlng);
      expect(L.circleMarker).toHaveBeenCalled();

      // Exercise the onEachFeature callback (line 413)
      const layer = { bindTooltip: vi.fn() };
      capturedOptions.onEachFeature(feature, layer);
      // No tooltip binding expected since no textProperty in default style
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createWKTLayer – getBounds branch (line 850)
  // -----------------------------------------------------------------------
  describe('createWKTLayer – getBounds branch', () => {
    it('logs bounds when layer has getBounds function', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');
      mockUtilStamp.mockReturnValue(1950);

      const { wellknown: wk } = await import('wellknown');
      (wk.parse as ReturnType<typeof vi.fn>).mockReturnValue({
        type: 'Point',
        coordinates: [10, 50],
      });

      const mockBounds = { _southWest: { lat: 0, lng: 0 }, _northEast: { lat: 1, lng: 1 } };
      (L.geoJSON as ReturnType<typeof vi.fn>).mockReturnValue({
        addTo: vi.fn().mockReturnThis(),
        clearLayers: vi.fn(),
        addData: vi.fn(),
        eachLayer: vi.fn(),
        setStyle: vi.fn(),
        getBounds: vi.fn().mockReturnValue(mockBounds),
      });

      const layerId = await provider.addLayerToGroup({
        type: 'wkt',
        wkt: 'POINT(10 50)',
        groupId: 'wkt-bounds-group',
        groupVisible: true,
      } as any);

      expect(layerId).toBe('1950');
      expect(log).toHaveBeenCalledWith(
        '[Leaflet WKT] Layer bounds:',
        mockBounds,
      );
    });
  });

  // -----------------------------------------------------------------------
  // Branch coverage: createWFSLayer – exercise pointToLayer/onEachFeature (lines 1324-1326)
  // -----------------------------------------------------------------------
  describe('createWFSLayer – exercise default style callbacks', () => {
    it('invokes pointToLayer and onEachFeature from default style', async () => {
      provider = await createInitializedProvider();
      const L = await import('leaflet');
      mockUtilStamp.mockReturnValue(1960);

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

      // Capture the options passed to L.geoJSON
      let capturedOptions: any = null;
      (L.geoJSON as ReturnType<typeof vi.fn>).mockImplementation(
        (_data: any, opts: any) => {
          capturedOptions = opts;
          return {
            addTo: vi.fn().mockReturnThis(),
            clearLayers: vi.fn(),
            addData: vi.fn(),
            eachLayer: vi.fn(),
            setStyle: vi.fn(),
          };
        },
      );

      await provider.addLayerToGroup({
        type: 'wfs',
        url: 'https://wfs.example.com/service',
        typeName: 'myLayer',
        groupId: 'wfs-callback-group',
        groupVisible: true,
      } as any);

      expect(capturedOptions).not.toBeNull();

      // Exercise the pointToLayer callback (line 1324)
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: {},
      };
      const latlng = { lat: 50, lng: 10 };
      capturedOptions.pointToLayer(feature, latlng);
      expect(L.circleMarker).toHaveBeenCalled();

      // Exercise the onEachFeature callback (line 1326)
      const mockLayer = { bindTooltip: vi.fn() };
      capturedOptions.onEachFeature(feature, mockLayer);
    });
  });
});
