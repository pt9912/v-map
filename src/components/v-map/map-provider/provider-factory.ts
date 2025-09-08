import type { OpenLayersProvider } from './openlayers-provider';
import type { CesiumProvider } from './cesium-provider';
import type { LeafletProvider } from './leaflet-provider';

export type Flavour = 'ol' | 'cesium' | 'leaflet';
export type AnyProvider = OpenLayersProvider | CesiumProvider | LeafletProvider;

export async function createProvider(engine: Flavour): Promise<AnyProvider> {
  switch (engine) {
    case 'ol':
      return new (await import('./openlayers-provider')).OpenLayersProvider();
    case 'cesium':
      return new (await import('./cesium-provider')).CesiumProvider();
    case 'leaflet':
      return new (await import('./leaflet-provider')).LeafletProvider();
    default:
      throw new Error(`Unbekannte Engine: ${engine as string}`);
  }
}
