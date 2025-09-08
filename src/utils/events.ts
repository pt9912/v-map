import { MapProvider } from '../components/v-map/map-provider/map-provider';

// events.ts
export const VMapEvents = {
  Ready: 'ready',
  MapProviderReady: 'map-provider-ready',
} as const;

export type VMapEventMap = {
  [VMapEvents.Ready]: void;
};

export interface MapProviderDetail {
  mapProvider: MapProvider;
}
