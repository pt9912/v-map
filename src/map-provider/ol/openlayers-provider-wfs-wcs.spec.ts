import type { LayerConfig } from '../../types/layerconfig';

// Mock all OpenLayers modules before they are imported
jest.mock('ol/Map', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/View', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Layer', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Base', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Vector', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Group', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Tile', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/Image', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/layer/WebGLTile', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/Vector', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/TileWMS', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/OSM', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/XYZ', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/Google', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('ol/source/TileArcGISRest', () => ({ __esModule: true, default: jest.fn() }));
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

describe('OpenLayersProvider WFS/WCS support', () => {
  afterEach(() => {
    jest.resetModules();
  });

  // it('delegiert das Erstellen eines WFS-Layers an Hilfsfunktionen', async () => {
  //   jest.resetModules();

  //   const mockVectorLayer = jest.fn().mockImplementation(() => ({
  //     set: jest.fn(),
  //     setOpacity: jest.fn(),
  //     setVisible: jest.fn(),
  //   }));

  //   jest.doMock('ol/layer/Vector', () => ({
  //     __esModule: true,
  //     default: mockVectorLayer,
  //   }));

  //   const { OpenLayersProvider } = await import('./openlayers-provider');
  //   const provider = new OpenLayersProvider();

  //   const fetchWfsSpy = jest
  //     .spyOn(provider as any, 'fetchWFSGeoJSON')
  //     .mockResolvedValue({ type: 'FeatureCollection', features: [] });
  //   const createSourceSpy = jest
  //     .spyOn(provider as any, 'createVectorSourceFromGeoJSON')
  //     .mockResolvedValue({});

  //   const layer = await (provider as any).createWFSLayer({
  //     type: 'wfs',
  //     url: 'https://example.com/wfs',
  //     typeName: 'namespace:layer',
  //   } as Extract<LayerConfig, { type: 'wfs' }>);

  //   expect(layer).toBeTruthy();
  //   expect(fetchWfsSpy).toHaveBeenCalledWith(
  //     expect.objectContaining({ typeName: 'namespace:layer' }),
  //   );
  //   expect(createSourceSpy).toHaveBeenCalled();
  //   expect(mockVectorLayer).toHaveBeenCalled();
  // });

  it('verwendet createWcsSource zum Erstellen eines WCS-Layers', async () => {
    jest.resetModules();

    const mockImageLayer = jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      setOpacity: jest.fn(),
      setVisible: jest.fn(),
    }));

    jest.doMock('ol/layer/Image', () => ({
      __esModule: true,
      default: mockImageLayer,
    }));

    const { OpenLayersProvider } = await import('./openlayers-provider');
    const provider = new OpenLayersProvider();

    const createWcsSourceSpy = jest
      .spyOn(provider as any, 'createWcsSource')
      .mockResolvedValue({});

    const layer = await (provider as any).createWCSLayer({
      type: 'wcs',
      url: 'https://example.com/wcs',
      coverageName: 'DEM',
    } as Extract<LayerConfig, { type: 'wcs' }>);

    expect(layer).toBeTruthy();
    expect(createWcsSourceSpy).toHaveBeenCalledWith(
      expect.objectContaining({ coverageName: 'DEM' }),
    );
    expect(mockImageLayer).toHaveBeenCalled();
  });
});
