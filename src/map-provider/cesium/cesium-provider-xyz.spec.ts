import { CesiumProvider } from './cesium-provider';
import type { LayerConfig } from '../../types/layerconfig';

const mockUrlTemplateImageryProvider = jest
  .fn()
  .mockImplementation(options => ({ ...options }));

const mockImageryLayer = jest.fn().mockImplementation((_provider, options) => ({
  options,
  setOptions: jest.fn(),
  setOpacity: jest.fn(),
  setVisible: jest.fn(),
  setZIndex: jest.fn(),
  getOptions: jest.fn().mockReturnValue(options ?? {}),
}));

const mockCesium = {
  Viewer: jest.fn().mockImplementation(() => ({
    scene: {
      imageryLayers: {
        add: jest.fn(),
        remove: jest.fn(),
      },
    },
    container: document.createElement('div'),
    destroy: jest.fn(),
  })),
  UrlTemplateImageryProvider: mockUrlTemplateImageryProvider,
  ImageryLayer: mockImageryLayer,
};

jest.mock('../../lib/cesium-loader', () => ({
  loadCesium: jest.fn().mockResolvedValue(mockCesium),
  injectWidgetsCss: jest.fn().mockResolvedValue(undefined),
}));

describe('CesiumProvider XYZ layer support', () => {
  let provider: CesiumProvider;
  const mockWrapper = {
    setOptions: jest.fn(),
    setVisible: jest.fn(),
    setOpacity: jest.fn(),
    setZIndex: jest.fn(),
    getOptions: jest.fn().mockReturnValue({}),
  };

  beforeAll(() => {
    (global as any).crypto = {
      randomUUID: jest.fn().mockReturnValue('layer-id'),
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new CesiumProvider();
    (provider as any).Cesium = mockCesium;
    (global as any).Cesium = mockCesium;
    (provider as any).viewer = mockCesium.Viewer();
    (provider as any).layerManager = {
      addLayer: jest.fn().mockReturnValue(mockWrapper),
      replaceLayer: jest.fn().mockReturnValue(mockWrapper),
      getLayer: jest.fn().mockReturnValue({
        getOptions: jest.fn().mockReturnValue({}),
      }),
    };
    (provider as any).layerGroups = {
      addLayerToGroup: jest.fn().mockReturnValue('layer-id'),
      removeLayer: jest.fn(),
      setBasemap: jest.fn(),
      setVisible: jest.fn(),
      setOpacity: jest.fn(),
      apply: jest.fn(),
    };
  });

  it('erstellt ein XYZ-Layer mit UrlTemplateImageryProvider', async () => {
    const config: LayerConfig = {
      type: 'xyz',
      url: 'https://tiles.example.com/{z}/{x}/{y}.png',
      opacity: 0.7,
      visible: false,
      maxZoom: 18,
      options: { subdomains: ['a', 'b'] },
      groupId: 'test-group',
    };

    const layerId = await provider.addLayerToGroup(config);

    expect(layerId).toBe('layer-id');
    expect(mockUrlTemplateImageryProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        url: config.url,
        maximumLevel: 18,
        subdomains: ['a', 'b'],
      }),
    );
    expect(mockImageryLayer).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        alpha: 0.7,
        show: false,
      }),
    );
  });

  it('aktualisiert ein bestehendes XYZ-Layer über updateLayer', async () => {
    await provider.updateLayer('layer-id', {
      type: 'xyz',
      data: {
        type: 'xyz',
        url: 'https://tiles.example.com/{z}/{x}/{y}.png',
      } as Extract<LayerConfig, { type: 'xyz' }>,
    });

    expect((provider as any).layerManager.replaceLayer).toHaveBeenCalled();
  });
});
