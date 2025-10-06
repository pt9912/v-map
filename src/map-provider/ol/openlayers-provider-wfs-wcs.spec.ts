import type { LayerConfig } from '../../types/layerconfig';

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
