import { OpenLayersProvider } from './openlayers-provider';

const mockTileLayer = jest
  .fn()
  .mockImplementation(options => ({
    ...options,
    set: jest.fn(),
    setSource: jest.fn(),
    getSource: jest.fn(() => options.source),
    setOpacity: jest.fn(),
    setVisible: jest.fn(),
    setZIndex: jest.fn(),
  }));

const mockTileArcGISRest = jest
  .fn()
  .mockImplementation(options => ({
    ...options,
    getParams: () => options.params ?? {},
    getUrls: () => [options.url],
    getUrl: () => options.url,
  }));

jest.mock('ol/layer/Tile', () => ({
  __esModule: true,
  default: mockTileLayer,
}));

jest.mock('ol/source/TileArcGISRest', () => ({
  __esModule: true,
  default: mockTileArcGISRest,
}));

describe('OpenLayersProvider ArcGIS support', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('erstellt eine ArcGIS Tile-Schicht über TileArcGISRest', async () => {
    const provider = new OpenLayersProvider();
    const layer = await (provider as any).createArcGISLayer({
      type: 'arcgis',
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
      params: { foo: 'bar' },
    });

    expect(mockTileArcGISRest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        params: expect.objectContaining({ foo: 'bar' }),
      }),
    );
    expect(layer).toBeTruthy();
  });

  it('aktualisiert eine bestehende ArcGIS-Schicht mit neuen Parametern', async () => {
    const provider = new OpenLayersProvider();
    const arcSource = {
      getParams: () => ({ existing: 'value' }),
      getUrls: () => ['https://example.com'],
      getUrl: () => 'https://example.com',
    } as any;
    const tileLayerInstance = {
      getSource: jest.fn(() => arcSource),
      setSource: jest.fn(),
    } as any;

    await (provider as any).updateArcGISLayer(tileLayerInstance, {
      params: { foo: 'bar' },
      token: 'abc',
    });

    expect(tileLayerInstance.setSource).toHaveBeenCalled();
    expect(mockTileArcGISRest).toHaveBeenLastCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({ foo: 'bar', token: 'abc', existing: 'value' }),
      }),
    );
  });
});
