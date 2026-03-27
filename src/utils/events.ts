import type { MapProvider } from '../types/mapprovider';

// events.ts
export const VMapEvents = {
  Ready: 'ready',
  MapProviderReady: 'map-provider-ready',
  MapProviderWillShutdown: 'map-provider-will-shutdown',
  MapMouseMove: 'map-mousemove',
} as const;

export type VMapEventMap = {
  [VMapEvents.Ready]: void;
};

export interface MapProviderDetail {
  mapProvider: MapProvider;
}

export interface MapMouseMoveDetail {
  coordinate: [number, number] | null;
  pixel: [number, number];
}
