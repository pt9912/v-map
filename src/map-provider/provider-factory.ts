import type { MapProvider } from '../types/mapprovider';
import type { Flavour } from '../types/flavour';

/** Exhaustiveness-Guard für Switch/Union */
function assertNever(x: never, msg?: string): never {
  throw new Error(msg ?? `Unbekannte Engine: ${String(x)}`);
}

/**
 * Erzeugt eine konkrete Karten-Provider-Instanz abhängig vom gewählten Flavour.
 *
 * Unterstützt:
 * - "ol"      → OpenLayers
 * - "cesium"  → CesiumJS
 * - "deck"    → Deck.gl
 * - "leaflet" → Leaflet
 */
export async function createProvider(engine: Flavour): Promise<MapProvider> {
  switch (engine) {
    case 'ol': {
      const { OpenLayersProvider } = await import('./ol/openlayers-provider');
      return new OpenLayersProvider();
    }
    case 'cesium': {
      const { CesiumProvider } = await import('./cesium/cesium-provider');
      return new CesiumProvider();
    }
    case 'deck': {
      const { DeckProvider } = await import('./deck/deck-provider');
      return new DeckProvider();
    }
    case 'leaflet': {
      const { LeafletProvider } = await import('./leaflet/leaflet-provider');
      return new LeafletProvider();
    }
    default: {
      // Exhaustiveness: Falls Flavour erweitert wird, meckert TS hier
      return assertNever(
        engine as never,
        `Unbekannte Engine: ${engine as string}`,
      );
    }
  }
}
