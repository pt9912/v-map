import { Style } from 'geostyler-style';

export type Cesium3DTilesStyle = Record<string, unknown>;

export type StyleFormat = 'sld' | 'mapbox-gl' | 'lyrx' | 'cesium-3d-tiles';

export interface StyleConfig {
  format: StyleFormat;
  source: string;
  layerTargets?: string[];
}

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

export interface ParsedStyleInfo {
  style: Style | Cesium3DTilesStyle;
  format: StyleFormat;
  source: string;
  appliedLayers: string[];
  timestamp: number;
}

export interface StyleEvent {
  type: 'load' | 'apply' | 'error' | 'remove';
  style?: Style | Cesium3DTilesStyle;
  error?: Error;
  layerIds?: string[];
}
