import { vi, describe, it, expect, beforeEach } from 'vitest';

/* ------------------------------------------------------------------ */
/*  vi.hoisted mocks                                                   */
/* ------------------------------------------------------------------ */
const { mockOlProvider, mockCesiumProvider, mockDeckProvider, mockLeafletProvider } = vi.hoisted(() => {
  const olInst = { _type: 'ol' };
  const cesiumInst = { _type: 'cesium' };
  const deckInst = { _type: 'deck' };
  const leafletInst = { _type: 'leaflet' };

  return {
    mockOlProvider: olInst,
    mockCesiumProvider: cesiumInst,
    mockDeckProvider: deckInst,
    mockLeafletProvider: leafletInst,
  };
});

vi.mock('./ol/openlayers-provider', () => ({
  OpenLayersProvider: vi.fn().mockImplementation(function () {
    return mockOlProvider;
  }),
}));

vi.mock('./cesium/cesium-provider', () => ({
  CesiumProvider: vi.fn().mockImplementation(function () {
    return mockCesiumProvider;
  }),
}));

vi.mock('./deck/deck-provider', () => ({
  DeckProvider: vi.fn().mockImplementation(function () {
    return mockDeckProvider;
  }),
}));

vi.mock('./leaflet/leaflet-provider', () => ({
  LeafletProvider: vi.fn().mockImplementation(function () {
    return mockLeafletProvider;
  }),
}));

vi.mock('../utils/logger', () => ({
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}));

import { createProvider } from './provider-factory';

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */
describe('createProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates an OpenLayers provider for engine "ol"', async () => {
    const provider = await createProvider('ol');
    expect(provider).toBe(mockOlProvider);
  });

  it('creates a Cesium provider for engine "cesium"', async () => {
    const provider = await createProvider('cesium');
    expect(provider).toBe(mockCesiumProvider);
  });

  it('creates a Deck provider for engine "deck"', async () => {
    const provider = await createProvider('deck');
    expect(provider).toBe(mockDeckProvider);
  });

  it('creates a Leaflet provider for engine "leaflet"', async () => {
    const provider = await createProvider('leaflet');
    expect(provider).toBe(mockLeafletProvider);
  });

  it('throws for an unknown engine', async () => {
    await expect(
      createProvider('unknown-engine' as any),
    ).rejects.toThrow('Unbekannte Engine: unknown-engine');
  });
});
