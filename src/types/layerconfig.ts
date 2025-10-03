import type { StyleConfig } from './styleconfig';
import type { Color } from './color';
import type { Style } from 'geostyler-style';

export type googleMapType = 'roadmap' | 'satellite' | 'terrain' | 'hybrid';

export type LayerConfig =
  | {
      type: 'geojson';
      url?: string;
      geojson?: string;
      style?: StyleConfig;
      geostylerStyle?: Style;
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
  | {
      type: 'arcgis';
      url: string;
      params?: Record<string, string | number | boolean>;
      token?: string;
      minZoom?: number;
      maxZoom?: number;
      options?: Record<string, unknown>;
      attributions?: string | string[];
      groupId?: string;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    }
  | {
      type: 'google';
      apiKey: string;
      mapType?: googleMapType;
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
      extraParams?: Record<string, string>;
      groupId?: string;
      opacity?: number;
      visible?: boolean;
      zIndex?: number;
      tileSize?: number;
      version?: '1.1.1' | '1.3.0';
      crs?: string;
      format?: string;
      transparent?: string;
      styles?: string;
      minZoom?: number;
      maxZoom?: number;
      time?: string;
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
    }
  | {
      type: 'wfs';
      url: string;
      typeName: string;
      version?: string;
      outputFormat?: string;
      srsName?: string;
      params?: Record<string, string | number | boolean>;
      groupId?: string;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    }
  | {
      type: 'wcs';
      url: string;
      coverageName: string;
      format?: string;
      version?: string;
      projection?: string;
      resolutions?: number[];
      params?: Record<string, string | number | boolean>;
      groupId?: string;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    }
  | {
      type: 'wkt';
      wkt?: string;
      url?: string;
      style?: StyleConfig;
      geostylerStyle?: Style;
      groupId?: string;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    }
  | {
      type: 'tile3d';
      url: string;
      tilesetOptions?: Record<string, unknown>;
      cesiumStyle?: Record<string, unknown>;
      groupId?: string;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    };
