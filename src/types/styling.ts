import { Style } from 'geostyler-style';

export type Cesium3DTileStyle = Record<string, unknown>;

export type StyleFormat =
  | 'sld'
  | 'mapbox-gl'
  | 'qgis'
  | 'lyrx'
  | 'cesium-3d-tiles'
  | 'geostyler';

export type ResolvedStyle = Style | Cesium3DTileStyle;

// export interface StyleConfig {
//   format: StyleFormat;
//   source: string;
//   layerTargets?: string[];
// }

export interface StyleApplyOptions {
  /**
   * Layer IDs to apply the style to.
   */
  layerIds?: string[];

  /**
   * Whether to replace existing styles or merge with them.
   * @default 'replace'
   */
  mode?: 'replace' | 'merge';

  /**
   * Optional priority for style application.
   */
  priority?: number;
}

// export interface ParsedStyleInfo {
//   style: ResolvedStyle;
//   format: StyleFormat;
//   source: string;
//   appliedLayers: string[];
//   timestamp: number;
// }

// export interface StyleEvent {
//   type: 'load' | 'apply' | 'error' | 'remove';
//   style?: ResolvedStyle;
//   error?: Error;
//   layerIds?: string[];
// }

export type StyleEvent = {
  style?: ResolvedStyle;
  layerIds?: string[];
};

function isArrayLike(val: unknown): val is { length: number } {
  return (
    val != null &&
    typeof (val as { length?: unknown }).length === 'number' &&
    (Array.isArray(val) || typeof (val as Record<number, unknown>)[0] !== 'undefined')
  );
}

export function isGeoStylerStyle(obj: unknown): obj is Style {
  // Schnell‑Abbruch, wenn kein Objekt vorliegt
  if (typeof obj !== 'object' || obj === null) return false;

  const u = obj as Style;

  // Pflichtfelder prüfen
  return typeof u.name === 'string' && isArrayLike(u.rules);
}
