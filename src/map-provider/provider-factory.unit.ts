import { afterEach, describe, expect, it, vi } from 'vitest';

const {
  logMock,
  OpenLayersProviderMock,
  CesiumProviderMock,
  DeckProviderMock,
  LeafletProviderMock,
} = vi.hoisted(() => ({
  logMock: vi.fn(),
  OpenLayersProviderMock: vi.fn(),
  CesiumProviderMock: vi.fn(),
  DeckProviderMock: vi.fn(),
  LeafletProviderMock: vi.fn(),
}));

vi.mock('../utils/logger', () => ({
  log: logMock,
}));

vi.mock('./ol/openlayers-provider', () => ({
  OpenLayersProvider: OpenLayersProviderMock,
}));

vi.mock('./cesium/cesium-provider', () => ({
  CesiumProvider: CesiumProviderMock,
}));

vi.mock('./deck/deck-provider', () => ({
  DeckProvider: DeckProviderMock,
}));

vi.mock('./leaflet/leaflet-provider', () => ({
  LeafletProvider: LeafletProviderMock,
}));

async function loadFactory() {
  vi.resetModules();
  return import('./provider-factory');
}

describe('provider-factory unit', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('creates the expected provider for each supported flavour', async () => {
    OpenLayersProviderMock.mockImplementation(function OpenLayersProvider() {
      return { engine: 'ol' };
    });
    CesiumProviderMock.mockImplementation(function CesiumProvider() {
      return { engine: 'cesium' };
    });
    DeckProviderMock.mockImplementation(function DeckProvider() {
      return { engine: 'deck' };
    });
    LeafletProviderMock.mockImplementation(function LeafletProvider() {
      return { engine: 'leaflet' };
    });

    const { createProvider } = await loadFactory();

    await expect(createProvider('ol')).resolves.toEqual({ engine: 'ol' });
    await expect(createProvider('cesium')).resolves.toEqual({ engine: 'cesium' });
    await expect(createProvider('deck')).resolves.toEqual({ engine: 'deck' });
    await expect(createProvider('leaflet')).resolves.toEqual({ engine: 'leaflet' });
  });

  it('logs and rethrows provider creation errors', async () => {
    const providerError = new Error('deck failed');
    DeckProviderMock.mockImplementation(function DeckProvider() {
      throw providerError;
    });

    const { createProvider } = await loadFactory();

    await expect(createProvider('deck')).rejects.toThrow('deck failed');
    expect(logMock).toHaveBeenCalledWith(providerError);
  });

  it('rejects unsupported flavours at runtime', async () => {
    const { createProvider } = await loadFactory();

    await expect(createProvider('unknown' as never)).rejects.toThrow(
      'Unbekannte Engine: unknown',
    );
    expect(logMock).toHaveBeenCalledTimes(1);
  });
});
