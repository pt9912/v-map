import { vi } from 'vitest';

const setUrlMock = vi.fn();

let LeafletProvider: any;
let mockTileLayer: ReturnType<typeof vi.fn>;

class MockLayerGroup {
  _groupId?: string;
  addLayer = vi.fn();
  clearLayers = vi.fn();
  addTo = vi.fn().mockReturnThis();
  basemap = false;
  getLayers = vi.fn(() => []);
}

const setupModule = async () => {
  vi.resetModules();
  setUrlMock.mockClear();

  mockTileLayer = vi.fn().mockImplementation((url: string) => ({
    url,
    setUrl: setUrlMock,
    setZIndex: vi.fn(),
  }));

  vi.doMock('leaflet', () => ({
    tileLayer: mockTileLayer,
    map: vi.fn(() => ({
      setView: vi.fn().mockReturnThis(),
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
      remove: vi.fn(),
      eachLayer: vi.fn(),
      invalidateSize: vi.fn(),
    })),
    layerGroup: vi.fn(() => new MockLayerGroup()),
    LayerGroup: MockLayerGroup,
    GridLayer: class {
      options: any = {};
      constructor() {}
    },
    Util: {
      stamp: vi.fn(() => 'leaflet-layer-id'),
      setOptions: vi.fn((instance: any, opts: any) => {
        instance.options = { ...(instance.options ?? {}), ...opts };
      }),
    },
  }));

  ({ LeafletProvider } = await import('./leaflet-provider'));
};

describe('LeafletProvider ArcGIS support', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('erstellt einen ArcGIS Tile-Layer mit Parametern', async () => {
    await setupModule();
    const provider = new LeafletProvider();
    await provider.init({
      target: document.createElement('div'),
      shadowRoot: document.createElement('div').attachShadow({ mode: 'open' }),
    });

    const layerId = await provider.addLayerToGroup(
      {
        type: 'arcgis',
        url: 'https://server.example.com/arcgis/rest/services/basemap/MapServer/tile/{z}/{y}/{x}',
        params: { foo: 'bar' },
        token: 'abc',
        minZoom: 2,
        maxZoom: 18,
      } as any,
      'test-group',
    );

    expect(layerId).toBeTruthy();
    expect(mockTileLayer).toHaveBeenCalledWith(
      expect.stringContaining('foo=bar'),
      expect.objectContaining({ minZoom: 2, maxZoom: 18 }),
    );
    expect(mockTileLayer.mock.calls[0][0]).toContain('token=abc');
  });

  it('aktualisiert einen ArcGIS Tile-Layer mit neuen Parametern', async () => {
    await setupModule();
    const provider = new LeafletProvider();
    const tileLayerInstance = {
      options: { url: 'https://example.com/tiles/{z}/{x}/{y}' },
      setUrl: setUrlMock,
    } as any;

    await (provider as any).updateArcGISLayer(tileLayerInstance, {
      params: { foo: 'bar' },
    });

    expect(setUrlMock).toHaveBeenCalledWith(
      expect.stringContaining('foo=bar'),
    );
  });
});
