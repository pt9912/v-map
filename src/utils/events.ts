import type { MapProvider } from '../types/mapprovider';

// events.ts
export const VMapEvents = {
  Ready: 'ready',
  Error: 'vmap-error',
  MapProviderReady: 'map-provider-ready',
  MapProviderWillShutdown: 'map-provider-will-shutdown',
  MapMouseMove: 'map-mousemove',
} as const;

export interface VMapErrorDetail {
  /** Error category */
  type: 'network' | 'validation' | 'parse' | 'provider';
  /** Human-readable error message */
  message: string;
  /** Affected prop/attribute (if applicable) */
  attribute?: string;
  /** Original thrown value (if available) */
  cause?: unknown;
}

export type VMapEventMap = {
  [VMapEvents.Ready]: void;
  [VMapEvents.Error]: VMapErrorDetail;
};

export interface MapProviderDetail {
  mapProvider: MapProvider;
}

export interface MapMouseMoveDetail {
  coordinate: [number, number] | null;
  pixel: [number, number];
}
