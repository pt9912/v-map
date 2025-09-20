import type { StyleConfig } from './styleconfig';
import type { Color } from './color';

export type LayerConfig =
  | {
      type: 'geojson';
      url?: string;
      geojson?: string;
      style?: StyleConfig;
      groupId?: string;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    }
  | {
      type: 'osm';
      groupId?: string;
      url?: string;
      opacity?: number;
      zIndex?: number;
      visible?: boolean;
    }
  | {
      type: 'geotiff';
      groupId?: string;
      url?: string;
      opacity?: number;
      zIndex?: number;
      visible?: boolean;
    }
  | {
      type: 'xyz';
      url: string;
      attributions?: string | string[];
      maxZoom?: number;
      options?: Record<string, unknown>;
      groupId?: string;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    }
  | { type: 'arcgis'; url: string; groupId?: string }
  | {
      type: 'google';
      apiKey: string;
      mapType?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
      scale?: 'scaleFactor1x' | 'scaleFactor2x';
      highDpi?: boolean;
      opacity?: number;
      visible?: boolean;
      groupId?: string;
      zIndex?: number;
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
      opacity?: number;
      visible?: boolean;
      zIndex?: number;
    }
  | {
      type: 'scatterplot';

      data?: any; //dataSource,
      getFillColor?: Color;
      getRadius?: number;
      opacity?: number;
      visible?: boolean;

      getTooltip?: (info: any) => any;
      onClick?: (info: any) => void;
      onHover?: (info: any) => void;
      groupId?: string;
      zIndex?: number;
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
      opacity?: number;
      visible?: boolean;
      zIndex?: number;
    };
