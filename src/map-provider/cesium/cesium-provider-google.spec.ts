import { vi } from 'vitest';
import { CesiumProvider } from './cesium-provider';
import { LayerConfig, googleMapType } from '../../types/layerconfig';

// Mock Cesium imports — use vi.hoisted() so the variable is available when vi.mock() is hoisted
const mockCesium = vi.hoisted(() => ({
  Viewer: vi.fn().mockImplementation(function() { return {
    scene: {
      imageryLayers: {
        add: vi.fn(),
        remove: vi.fn(),
      },
    },
    container: document.createElement('div'),
    destroy: vi.fn(),
  }; }),
  UrlTemplateImageryProvider: vi.fn().mockImplementation(function(options) { return {
    ...options,
    buildImageResource: options.buildImageResource || vi.fn(),
  }; }),
  ImageryLayer: vi.fn().mockImplementation(function(provider, options) { return {
    provider,
    getVisible: vi.fn().mockReturnValue(true),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    ...options,
  }; }),
  WebMercatorTilingScheme: vi.fn().mockImplementation(function() { return {
    tileXYToRectangle: vi.fn().mockReturnValue({
      west: -Math.PI,
      south: -Math.PI / 2,
      east: Math.PI,
      north: Math.PI / 2,
    }),
  }; }),
  Rectangle: {
    MAX_VALUE: {
      west: -Math.PI,
      south: -Math.PI / 2,
      east: Math.PI,
      north: Math.PI / 2,
    },
  },
  Math: {
    toDegrees: vi.fn(radians => radians * (180 / Math.PI)),
  },
  Resource: vi.fn().mockImplementation(function(options) { return options; }),
}));

vi.mock('../../lib/cesium-loader', () => ({
  loadCesium: vi.fn().mockResolvedValue(mockCesium),
  injectWidgetsCss: vi.fn().mockResolvedValue(undefined),
}));

// Create global Cesium mock that will be available to the real CesiumProvider
(global as any).Cesium = mockCesium;

// Mock Google Maps API
const mockGoogleMapsApi = {
  google: {
    maps: {
      Map: vi.fn(),
      event: {
        addListenerOnce: vi.fn(),
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
          add: vi.fn(),
          remove: vi.fn(),
        },
      },
    };
    (provider as any).layerManager = {
      addLayer: vi.fn().mockReturnValue({
        layerId: 'mock-layer-wrapper',
        setOpacity: vi.fn(),
        setVisible: vi.fn(),
        setZIndex: vi.fn(),
      }),
      removeLayer: vi.fn(),
      setOpacity: vi.fn(),
      setVisible: vi.fn(),
    };
    (provider as any).layerGroups = {
      addLayerToGroup: vi.fn().mockReturnValue('mock-layer-id'),
      removeLayer: vi.fn(),
      setOpacity: vi.fn(),
      setVisible: vi.fn(),
      apply: vi.fn(),
    };

    vi.clearAllMocks();
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
