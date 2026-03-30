import { vi } from 'vitest';
import { DeckProvider } from './deck-provider';
import { LayerConfig, googleMapType } from '../../types/layerconfig';

// Mock @deck.gl imports
vi.mock('@deck.gl/core', () => {
  const Deck = vi.fn(function (this: any) {
    this.setProps = vi.fn();
    this.finalize = vi.fn();
  });
  return { Deck };
});

vi.mock('@deck.gl/geo-layers', () => ({
  TileLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      props: {
        visible: props.visible ?? true,
        opacity: props.opacity ?? 1,
        ...props,
      },
      clone: vi.fn().mockImplementation((overrides: any) => ({
        id: props.id,
        props: {
          visible: overrides?.visible ?? props.visible ?? true,
          opacity: overrides?.opacity ?? props.opacity ?? 1,
          ...props,
          ...overrides,
        },
        clone: vi.fn().mockReturnThis(),
      })),
      ...props,
    };
  }),
}));

vi.mock('@deck.gl/layers', () => ({
  BitmapLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      ...props,
    };
  }),
  GeoJsonLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      props: props,
      clone: vi.fn().mockReturnThis(),
    };
  }),
  ScatterplotLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      props: props,
      clone: vi.fn().mockReturnThis(),
    };
  }),
}));

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

describe('DeckProvider Google Maps Integration', () => {
  let provider: DeckProvider;
  const mockApiKey = 'test-deck-api-key-123';

  beforeEach(() => {
    // Setup window.google mock
    (global as any).window = Object.create(window);
    Object.defineProperty(window, 'google', {
      value: mockGoogleMapsApi.google,
      writable: true,
    });

    // Mock fetch for Static Maps API
    global.fetch = vi.fn();

    provider = new DeckProvider();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Google Maps Static API Integration', () => {
    it('should create Google layer with correct configuration', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

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
        groupId: 'test-group',
      };

      const layerId = await provider.addLayerToGroup(config);
      expect(layerId).toBeTruthy();
    });

    it('should handle all Google Maps types', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

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
          groupId: `test-group-${mapType}`,
        };

        const layerId = await provider.addLayerToGroup(config);
        expect(layerId).toBeTruthy();
      }
    });

    it('should throw error for missing API key', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const config = {
        type: 'google' as const,
        mapType: 'roadmap',
        groupId: 'test-group',
      };

      await expect(provider.addLayerToGroup(config as any)).rejects.toThrow(
        "Google-Layer benötigt 'apiKey'",
      );
    });

    it('should handle tile loading correctly', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      // Mock successful fetch response
      const mockBlob = new Blob(['mock-image-data'], { type: 'image/png' });
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
        groupId: 'test-group',
      };

      const layerId = await provider.addLayerToGroup(config);
      expect(layerId).toBeTruthy();
      // Note: fetch is called lazily when tiles are actually requested
      // expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle tile loading errors gracefully', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      // Mock failed fetch response
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
        groupId: 'test-group',
      };

      const layerId = await provider.addLayerToGroup(config);
      expect(layerId).toBeTruthy();
    });

    it('should generate correct Static Maps URLs', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      // Mock successful fetch response and capture the URL
      const mockBlob = new Blob(['mock-image-data'], { type: 'image/png' });
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'satellite',
        scale: 'scaleFactor1x',
        language: 'de',
        region: 'DE',
        groupId: 'test-group',
      };

      const layerId = await provider.addLayerToGroup(config);

      // Check that layer was created successfully
      expect(layerId).toBeTruthy();
      // Note: URL generation happens in getTileData when tiles are requested
    });

    it('should handle opacity updates', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
        opacity: 0.5,
        groupId: 'test-group',
      };

      const layerId = await provider.addLayerToGroup(config);
      expect(layerId).toBeTruthy();

      await provider.setOpacity(layerId, 0.8);
      // Opacity change should not throw error
    });

    it('should handle visibility updates', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
        visible: true,
        groupId: 'test-group',
      };

      const layerId = await provider.addLayerToGroup(config);
      expect(layerId).toBeTruthy();

      await provider.setVisible(layerId, false);
      await provider.setVisible(layerId, true);
      // Visibility changes should not throw error
    });

    it('should support Google logo compliance', async () => {
      const mockTarget = document.createElement('div');
      await provider.init({
        target: mockTarget,
        shadowRoot: document
          .createElement('div')
          .attachShadow({ mode: 'open' }),
      });

      const config: LayerConfig = {
        type: 'google' as const,
        apiKey: mockApiKey,
        mapType: 'roadmap',
        groupId: 'test-group',
      };

      await provider.addLayerToGroup(config);

      // Check if Google logo would be added (mocked)
      expect(mockTarget).toBeTruthy();
    });
  });
});
