import { DeckProvider } from './deck-provider';

const mockTerrainLayer = jest.fn().mockImplementation(props => ({
  id: props.id,
  props,
  clone: jest.fn().mockReturnValue({ id: props.id, props }),
}));

jest.mock('@deck.gl/geo-layers', () => ({
  TerrainLayer: mockTerrainLayer,
  TileLayer: jest.fn().mockImplementation(props => ({
    id: props.id,
    props,
    clone: jest.fn().mockReturnValue({ id: props.id, props }),
  })),
}));

jest.mock('@deck.gl/core', () => ({
  Deck: jest.fn().mockImplementation(() => ({
    setProps: jest.fn(),
    finalize: jest.fn(),
  })),
}));

describe('DeckProvider terrain support', () => {
  afterEach(() => {
    jest.clearAllMocks();
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
});
