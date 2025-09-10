import type { StyleConfig } from './styleconfig';
import type { Color } from './color';

export type LayerConfig =
  | { type: 'geojson'; url: string; style?: StyleConfig; groupId?: string }
  | { type: 'osm'; groupId?: string; url?: string }
  | {
      type: 'xyz';
      url: string;
      attributions?: string | string[];
      maxZoom?: number;
      options?: Record<string, unknown>;
      groupId?: string;
    }
  | { type: 'arcgis'; url: string; groupId?: string }
  | {
      type: 'google';
      apiKey: string;
      mapType?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
      scale?: 'scaleFactor1x' | 'scaleFactor2x';
      highDpi?: boolean;
      groupId?: string;
      maxZoom?: number;
      styles?: string;
      language?: string;
      libraries?: string[];
      region?: string; // nur wenn deine OL-Version das typisiert
    }
  | {
      type: 'wms';
      url: string;
      layers: string;
      params?: Record<string, string>;
      groupId?: string;
    }
  | {
      type: 'scatterplot';

      id?: string;
      data?: any; //dataSource,
      getFillColor?: Color;
      getRadius?: number;
      opacity?: number;
      visible?: boolean;

      getTooltip?: (info: any) => any;
      onClick?: (info: any) => void;
      onHover?: (info: any) => void;
      groupId?: string;
    }
  | {
      type: 'terrain';
      elevationData: string;
      texture?: string;
      elevationDecoder?: { r: number; g: number; b: number; offset: number };
      wireframe?: boolean;
      color?: [number, number, number];
      minZoom?: number;
      maxZoom?: number;
      meshMaxError?: number;
      groupId?: string;
    };
