import type { MapProvider } from '../types/mapprovider';

// events.ts
export const VMapEvents = {
  Ready: 'ready',
  Error: 'vmap-error',
  MapProviderReady: 'map-provider-ready',
  MapProviderWillShutdown: 'map-provider-will-shutdown',
  MapMouseMove: 'map-mousemove',
  ViewChange: 'vmap-view-change',
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

/** Detail payload for `vmap-view-change` events. Fired when the user
 *  pans or zooms the map via direct interaction (mouse wheel, pinch,
 *  drag, double-click). NOT fired for programmatic changes via the
 *  `zoom` / `center` props — those originate from the consuming app
 *  and looping them back would create a feedback cycle. */
export interface ViewChangeDetail {
  center: [number, number];
  zoom: number;
}
