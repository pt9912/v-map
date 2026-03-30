import { vi } from 'vitest';

const { mockTerrainLayer, mockCreateDeckGLGeoTIFFTerrainLayer } = vi.hoisted(
  () => ({
    mockTerrainLayer: vi.fn().mockImplementation(function (
      this: any,
      props: any,
    ) {
      return {
        id: props.id,
        props,
        clone: vi.fn().mockReturnValue({ id: props.id, props }),
      };
    }),
    mockCreateDeckGLGeoTIFFTerrainLayer: vi.fn().mockResolvedValue({
      id: 'terrain-geotiff-layer',
      props: {},
      clone: vi.fn().mockReturnThis(),
    }),
  }),
);

vi.mock('@deck.gl/geo-layers', () => ({
  TerrainLayer: mockTerrainLayer,
  TileLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      props,
      clone: vi.fn().mockReturnValue({ id: props.id, props }),
    };
  }),
}));

vi.mock('@deck.gl/layers', () => ({
  GeoJsonLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      props: props,
      clone: vi.fn().mockReturnThis(),
    };
  }),
  BitmapLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return { id: props.id, props };
  }),
  ScatterplotLayer: vi.fn().mockImplementation(function(this: any, props: any) {
    return {
      id: props.id,
      props: props,
      clone: vi.fn().mockReturnThis(),
    };
  }),
}));

vi.mock('@deck.gl/core', () => ({
  Deck: vi.fn().mockImplementation(() => ({
    setProps: vi.fn(),
    finalize: vi.fn(),
  })),
}));

vi.mock('./DeckGLGeoTIFFTerrainLayer', () => ({
  createDeckGLGeoTIFFTerrainLayer: mockCreateDeckGLGeoTIFFTerrainLayer,
}));

import { DeckProvider } from './deck-provider';

describe('DeckProvider terrain support', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('erstellt einen TerrainLayer mit den übergebenen Parametern', async () => {
    const provider = new DeckProvider();
    const layer = await (provider as any).buildTerrainLayer(
      {
        type: 'terrain',
        elevationData: 'https://example.com/elevation.tiff',
        texture: 'https://example.com/texture.png',
        elevationDecoder: { r: 1, g: 1, b: 1, offset: 0 },
        wireframe: true,
        color: [255, 200, 150],
        minZoom: 4,
        maxZoom: 12,
        meshMaxError: 4,
        opacity: 0.8,
        visible: false,
      } as any,
      'terrain-layer',
    );

    expect(layer).toBeTruthy();
    expect(mockTerrainLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'terrain-layer',
        elevationData: 'https://example.com/elevation.tiff',
        texture: 'https://example.com/texture.png',
        wireframe: true,
        color: [255, 200, 150],
        minZoom: 4,
        maxZoom: 12,
        meshMaxError: 4,
        opacity: 0.8,
        visible: false,
      }),
    );
  });

  it('leitet renderMode an den GeoTIFF-Terrain-Layer weiter', async () => {
    const provider = new DeckProvider();

    await (provider as any).createGeoTIFFTerrainLayer(
      {
        type: 'terrain-geotiff',
        url: 'https://example.com/elevation.tif',
        renderMode: 'colormap',
        colorMap: 'terrain',
        opacity: 0.7,
        visible: false,
      } as any,
      'terrain-geotiff-layer',
    );

    expect(mockCreateDeckGLGeoTIFFTerrainLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'terrain-geotiff-layer',
        url: 'https://example.com/elevation.tif',
        renderMode: 'colormap',
        colorMap: 'terrain',
        opacity: 0.7,
        visible: false,
      }),
    );
  });

  it('leitet renderMode auch bei terrain-geotiff Updates an die Model-Overrides weiter', async () => {
    const provider = new DeckProvider();
    const setModelOverrides = vi.fn();
    const applyToDeck = vi.fn();

    (provider as any).layerGroups = {
      groups: [
        {
          getModel: vi.fn().mockImplementation((layerId: string) =>
            layerId === 'terrain-geotiff-layer' ? { id: layerId } : undefined,
          ),
          setModelOverrides,
        },
      ],
      applyToDeck,
    };

    await provider.updateLayer('terrain-geotiff-layer', {
      type: 'terrain-geotiff',
      data: {
        renderMode: 'colormap',
        colorMap: 'terrain',
      },
    } as any);

    expect(setModelOverrides).toHaveBeenCalledWith(
      'terrain-geotiff-layer',
      expect.objectContaining({
        renderMode: 'colormap',
        colorMap: 'terrain',
      }),
    );
    expect(applyToDeck).toHaveBeenCalled();
  });
});
