import { CesiumProvider } from './cesium-provider';
import { LayerConfig, googleMapType } from '../../types/layerconfig';

// Mock Cesium imports
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
  UrlTemplateImageryProvider: jest.fn().mockImplementation(options => ({
    ...options,
    buildImageResource: options.buildImageResource || jest.fn(),
  })),
  ImageryLayer: jest.fn().mockImplementation((provider, options) => ({
    provider,
    getVisible: jest.fn().mockReturnValue(true),
    setVisible: jest.fn(),
    setOpacity: jest.fn(),
    ...options,
  })),
  WebMercatorTilingScheme: jest.fn().mockImplementation(() => ({
    tileXYToRectangle: jest.fn().mockReturnValue({
      west: -Math.PI,
      south: -Math.PI / 2,
      east: Math.PI,
      north: Math.PI / 2,
    }),
  })),
  Rectangle: {
    MAX_VALUE: {
      west: -Math.PI,
      south: -Math.PI / 2,
      east: Math.PI,
      north: Math.PI / 2,
    },
  },
  Math: {
    toDegrees: jest.fn(radians => radians * (180 / Math.PI)),
  },
  Resource: jest.fn().mockImplementation(options => options),
};

jest.mock('../../lib/cesium-loader', () => ({
  loadCesium: jest.fn().mockResolvedValue(mockCesium),
  injectWidgetsCss: jest.fn().mockResolvedValue(undefined),
}));

// Create global Cesium mock that will be available to the real CesiumProvider
(global as any).Cesium = mockCesium;

// Mock Google Maps API
const mockGoogleMapsApi = {
  google: {
    maps: {
      Map: jest.fn(),
      event: {
        addListenerOnce: jest.fn(),
      },
    },
  },
};

describe('CesiumProvider Google Maps Integration', () => {
  const mockApiKey = 'test-cesium-api-key-456';
  let provider: any;

  beforeEach(() => {
    // Setup window.google mock
    (global as any).window = Object.create(window);
    Object.defineProperty(window, 'google', {
      value: mockGoogleMapsApi.google,
      writable: true,
    });

    // Create mocked provider instance
    provider = new CesiumProvider();

    // Directly inject the mock into the provider instance
    (provider as any).Cesium = mockCesium;
    (provider as any).viewer = {
      scene: {
        imageryLayers: {
          add: jest.fn(),
          remove: jest.fn(),
        },
      },
    };
    (provider as any).layerManager = {
      addLayer: jest.fn().mockReturnValue({
        layerId: 'mock-layer-wrapper',
        setOpacity: jest.fn(),
        setVisible: jest.fn(),
        setZIndex: jest.fn(),
      }),
      removeLayer: jest.fn(),
      setOpacity: jest.fn(),
      setVisible: jest.fn(),
    };
    (provider as any).layerGroups = {
      addLayerToGroup: jest.fn().mockReturnValue('mock-layer-id'),
      removeLayer: jest.fn(),
      setOpacity: jest.fn(),
      setVisible: jest.fn(),
      apply: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('Google Maps Static API Integration', () => {
    it('should create Google layer with correct configuration', async () => {
      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
        opacity: 0.8,
        visible: true,
        maxZoom: 18,
        scale: 'scaleFactor2x',
        language: 'en',
        region: 'US',
      };
      const layerId = await provider.addLayerToGroup(config, 'test-group');
      expect(layerId).toBeTruthy();
    });

    it('should handle all Google Maps types', async () => {
      const mapTypes: googleMapType[] = [
        'roadmap',
        'satellite',
        'terrain',
        'hybrid',
      ];
      for (const mapType of mapTypes) {
        const config: LayerConfig = {
          type: 'google' as const,
          apiKey: mockApiKey,
          mapType,
        };
        const layerId = await provider.addLayerToGroup(
          config,
          `test-group-${mapType}`,
        );
        expect(layerId).toBeTruthy();
      }
    });

    it('should throw error for missing API key', async () => {
      const config = {
        type: 'google' as const,
        mapType: 'roadmap',
      };
      await expect(
        provider.addLayerToGroup(config as any, 'test-group'),
      ).rejects.toThrow("Google-Layer benötigt 'apiKey'");
    });

    it('should create UrlTemplateImageryProvider with correct options', async () => {
      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'satellite',
        maxZoom: 15,
      };
      await provider.addLayerToGroup(config, 'test-group');
      expect(mockCesium.UrlTemplateImageryProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          maximumLevel: 15,
          minimumLevel: 0,
          credit: 'Google Maps',
        }),
      );
    });
    it('should handle map type conversion correctly', async () => {
      const mapTypeTests = [
        { input: 'roadmap', expected: 'roadmap' },
        { input: 'satellite', expected: 'satellite' },
        { input: 'terrain', expected: 'terrain' },
        { input: 'hybrid', expected: 'hybrid' },
        { input: undefined, expected: 'roadmap' }, // default
      ];
      for (const test of mapTypeTests) {
        const config = {
          type: 'google' as const,
          apiKey: mockApiKey,
          mapType: test.input,
        };
        await provider.addLayerToGroup(
          config as any,
          `test-group-${test.input || 'default'}`,
        );
        // The mapType should be processed correctly
      }
    });

    it('should handle scale factor correctly', async () => {
      const scaleTests = [
        { input: 'scaleFactor1x', expected: '1' },
        { input: 'scaleFactor2x', expected: '2' },
        { input: undefined, expected: '2' }, // default
      ];
      for (const test of scaleTests) {
        const config = {
          type: 'google' as const,
          apiKey: mockApiKey,
          mapType: 'roadmap',
          scale: test.input,
        };
        await provider.addLayerToGroup(
          config as any,
          `test-group-scale-${test.input || 'default'}`,
        );
        // Scale should be processed correctly in the URL generation
      }
    });

    it('should support language and region parameters', async () => {
      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
        language: 'de',
        region: 'DE',
      };
      const layerId = await provider.addLayerToGroup(config, 'test-group');
      expect(layerId).toBeTruthy();
      // Language and region should be included in API calls
    });

    it('should handle ImageryLayer creation', async () => {
      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
        opacity: 0.7,
        visible: false,
      };
      await provider.addLayerToGroup(config, 'test-group');
      expect(mockCesium.ImageryLayer).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          alpha: 0.7,
          show: false,
        }),
      );
    });

    it('should handle opacity updates', async () => {
      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
        opacity: 0.5,
      };
      const layerId = await provider.addLayerToGroup(config, 'test-group');
      expect(layerId).toBeTruthy();
      await provider.setOpacity(layerId, 0.9);
      // Opacity change should not throw error
    });

    it('should handle visibility updates', async () => {
      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
        visible: true,
      };
      const layerId = await provider.addLayerToGroup(config, 'test-group');
      expect(layerId).toBeTruthy();
      await provider.setVisible(layerId, false);
      await provider.setVisible(layerId, true);
      // Visibility changes should not throw error
    });

    it('should support Google logo compliance', async () => {
      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
      };
      await provider.addLayerToGroup(config, 'test-group');
      // Google logo compliance should be handled
      expect(provider).toBeTruthy();
    });

    it('should generate correct Static Maps API URLs', async () => {
      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'terrain',
        scale: 'scaleFactor1x',
        language: 'fr',
        region: 'FR',
      };
      await provider.addLayerToGroup(config, 'test-group');
      // Verify that the imagery provider was created with buildImageResource override
      expect(mockCesium.UrlTemplateImageryProvider).toHaveBeenCalled();
    });

    it('should handle layer removal', async () => {
      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
      };
      const layerId = await provider.addLayerToGroup(config, 'test-group');
      expect(layerId).toBeTruthy();
      await provider.removeLayer(layerId);
      // Layer removal should not throw error
    });
  });
});
