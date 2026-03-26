import { vi } from 'vitest';
import type { LayerConfig } from '../../types/layerconfig';

const { mockUrlTemplateImageryProvider, mockImageryLayer, mockCesium } =
  vi.hoisted(() => {
    const hoistedMockUrlTemplateImageryProvider = vi
      .fn()
      .mockImplementation(options => ({ ...options }));

    const hoistedMockImageryLayer = vi
      .fn()
      .mockImplementation((_provider, options) => ({
        options,
        setOptions: vi.fn(),
        setOpacity: vi.fn(),
        setVisible: vi.fn(),
        setZIndex: vi.fn(),
        getOptions: vi.fn().mockReturnValue(options ?? {}),
      }));

    return {
      mockUrlTemplateImageryProvider: hoistedMockUrlTemplateImageryProvider,
      mockImageryLayer: hoistedMockImageryLayer,
      mockCesium: {
        Viewer: vi.fn().mockImplementation(() => ({
          scene: {
            imageryLayers: {
              add: vi.fn(),
              remove: vi.fn(),
            },
          },
          container: document.createElement('div'),
          destroy: vi.fn(),
        })),
        UrlTemplateImageryProvider: hoistedMockUrlTemplateImageryProvider,
        ImageryLayer: hoistedMockImageryLayer,
      },
    };
  });

vi.mock('../../lib/cesium-loader', () => ({
  loadCesium: jest.fn().mockResolvedValue(mockCesium),
  injectWidgetsCss: jest.fn().mockResolvedValue(undefined),
}));

import { CesiumProvider } from './cesium-provider';

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
    vi.stubGlobal('crypto', {
      randomUUID: jest.fn().mockReturnValue('layer-id'),
    });
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
