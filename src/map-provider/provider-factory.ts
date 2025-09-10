import type { MapProvider } from '../types/mapprovider';
import type { Flavour } from '../types/flavour';

/*
import type { OpenLayersProvider } from './openlayers-provider';
import type { CesiumProvider } from './cesium-provider';
import type { LeafletProvider } from './leaflet-provider';
import type { DeckProvider } from './deck-provider';

export type AnyProvider =
  | OpenLayersProvider
  | CesiumProvider
  | LeafletProvider
  | DeckProvider;
*/
export async function createProvider(engine: Flavour): Promise<MapProvider> {
  switch (engine) {
    case 'ol':
      return new (
        await import('./ol/openlayers-provider')
      ).OpenLayersProvider();
    case 'cesium':
      return new (await import('./cesium/cesium-provider')).CesiumProvider();
    case 'deck':
      return new (await import('./deck/deck-provider')).DeckProvider();
    case 'leaflet':
      return new (await import('./leaflet/leaflet-provider')).LeafletProvider();
    default:
      throw new Error(`Unbekannte Engine: ${engine as string}`);
  }
}
