// Mock all OpenLayers modules before they are imported
jest.mock('ol/Map', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/View', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Layer', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Base', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Vector', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Group', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Image', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/WebGLTile', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/Vector', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/TileWMS', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/OSM', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/XYZ', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/Google', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/ImageWMS', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/Image', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/GeoTIFF', () => ({ __esModule: true, default: jest.fn(), SourceInfo: jest.fn() }));
jest.mock('ol/Image', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/format/GeoJSON', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/format/GML2', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/format/GML3', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/format/GML32', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/format/WKT', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/control/Control', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/style/Style', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/style/Fill', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/style/Stroke', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/style/Circle', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/style/Icon', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/style/Text', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/loadingstrategy', () => ({ __esModule: true, bbox: jest.fn() }));
jest.mock('ol/proj', () => ({ __esModule: true, fromLonLat: jest.fn(), ProjectionLike: jest.fn() }));

// Mock local helper modules
jest.mock('./openlayers-helper', () => ({
  __esModule: true,
  injectOlCss: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./CustomGeoTiff', () => ({
  __esModule: true,
  createCustomGeoTiff: jest.fn().mockResolvedValue(jest.fn()),
}));

// Create mock functions before jest.mock calls
const mockTileLayer = jest.fn().mockImplementation(options => ({
  ...options,
  set: jest.fn(),
  setSource: jest.fn(),
  getSource: jest.fn(() => options.source),
  setOpacity: jest.fn(),
  setVisible: jest.fn(),
  setZIndex: jest.fn(),
}));

const mockTileArcGISRest = jest.fn().mockImplementation(options => ({
  ...options,
  getParams: () => options.params ?? {},
  getUrls: () => [options.url],
  getUrl: () => options.url,
}));

// Override the generic mocks with specific implementations
jest.mock('ol/layer/Tile', () => ({
  __esModule: true,
  default: mockTileLayer,
}));

jest.mock('ol/source/TileArcGISRest', () => ({
  __esModule: true,
  default: mockTileArcGISRest,
}));

import { OpenLayersProvider } from './openlayers-provider';

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
