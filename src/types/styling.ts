import { Style } from 'geostyler-style';

export type StyleFormat = 'sld' | 'mapbox-gl' | 'lyrx';

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
  style: Style;
  format: StyleFormat;
  source: string;
  appliedLayers: string[];
  timestamp: number;
}

export interface StyleEvent {
  type: 'load' | 'apply' | 'error' | 'remove';
  style?: Style;
  error?: Error;
  layerIds?: string[];
}
