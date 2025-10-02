const setUrlMock = jest.fn();

let LeafletProvider: any;
let mockTileLayer: jest.Mock;

const setupModule = async () => {
  jest.resetModules();
  setUrlMock.mockClear();

  mockTileLayer = jest.fn().mockImplementation((url: string) => ({
    url,
    setUrl: setUrlMock,
    setZIndex: jest.fn(),
  }));

  jest.doMock('leaflet', () => ({
    tileLayer: mockTileLayer,
    map: jest.fn(() => ({
      setView: jest.fn().mockReturnThis(),
      addLayer: jest.fn(),
      removeLayer: jest.fn(),
      remove: jest.fn(),
      eachLayer: jest.fn(),
      invalidateSize: jest.fn(),
    })),
    layerGroup: jest.fn(() => ({
      addLayer: jest.fn(),
      clearLayers: jest.fn(),
      addTo: jest.fn().mockReturnThis(),
      basemap: false,
      getLayers: jest.fn(() => []),
    })),
    Util: {
      stamp: jest.fn(() => 'leaflet-layer-id'),
    },
  }));

  ({ LeafletProvider } = await import('./leaflet-provider'));
};

describe('LeafletProvider ArcGIS support', () => {
  afterEach(() => {
    jest.clearAllMocks();
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
