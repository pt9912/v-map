import type { MapProvider } from '../types/mapprovider';

// events.ts
export const VMapEvents = {
  Ready: 'ready',
  MapProviderReady: 'map-provider-ready',
  MapProviderWillShutdown: 'map-provider-will-shutdown',
} as const;

export type VMapEventMap = {
  [VMapEvents.Ready]: void;
};

export interface MapProviderDetail {
  mapProvider: MapProvider;
}
