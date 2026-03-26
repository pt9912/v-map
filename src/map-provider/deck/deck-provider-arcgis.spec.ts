import { vi } from 'vitest';

const { mockTileLayer } = vi.hoisted(() => ({
  mockTileLayer: vi.fn().mockImplementation(function (this: any, props: any) {
    return {
      id: props.id,
      props,
      clone: vi.fn().mockReturnValue({ id: props.id, props }),
    };
  }),
}));

vi.mock('@deck.gl/geo-layers', () => ({
  TileLayer: mockTileLayer,
}));

vi.mock('@deck.gl/layers', () => ({
  BitmapLayer: vi.fn().mockImplementation(props => ({ id: props.id, props })),
  GeoJsonLayer: vi.fn().mockImplementation(props => ({
    id: props.id,
    props: props,
    clone: vi.fn().mockReturnThis(),
  })),
  ScatterplotLayer: vi.fn().mockImplementation(props => ({
    id: props.id,
    props: props,
    clone: vi.fn().mockReturnThis(),
  })),
}));

vi.mock('@deck.gl/core', () => ({
  Deck: vi.fn().mockImplementation(() => ({
    setProps: vi.fn(),
    finalize: vi.fn(),
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
