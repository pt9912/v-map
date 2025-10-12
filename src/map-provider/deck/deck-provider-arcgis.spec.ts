const mockTileLayer = jest.fn().mockImplementation(function(this: any, props: any) {
  return {
    id: props.id,
    props,
    clone: jest.fn().mockReturnValue({ id: props.id, props }),
  };
});

jest.mock('@deck.gl/geo-layers', () => ({
  TileLayer: mockTileLayer,
}));

jest.mock('@deck.gl/layers', () => ({
  BitmapLayer: jest.fn().mockImplementation(props => ({ id: props.id, props })),
  GeoJsonLayer: jest.fn().mockImplementation(props => ({
    id: props.id,
    props: props,
    clone: jest.fn().mockReturnThis(),
  })),
  ScatterplotLayer: jest.fn().mockImplementation(props => ({
    id: props.id,
    props: props,
    clone: jest.fn().mockReturnThis(),
  })),
}));

jest.mock('@deck.gl/core', () => ({
  Deck: jest.fn().mockImplementation(() => ({
    setProps: jest.fn(),
    finalize: jest.fn(),
  })),
}));

import { DeckProvider } from './deck-provider';

describe('DeckProvider ArcGIS support', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('erstellt ein ArcGIS TileLayer über buildArcgisTileLayer', async () => {
    const provider = new DeckProvider();
    const layer = await (provider as any).buildArcgisTileLayer(
      {
        type: 'arcgis',
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        params: { foo: 'bar' },
        token: 'abc',
        minZoom: 1,
        maxZoom: 16,
      },
      'arcgis-layer',
    );

    expect(layer).toBeTruthy();
    expect(mockTileLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'arcgis-layer',
        data: [expect.stringContaining('foo=bar')],
        minZoom: 1,
        maxZoom: 16,
      }),
    );
    expect(mockTileLayer.mock.calls[0][0].data[0]).toContain('token=abc');
  });
});
