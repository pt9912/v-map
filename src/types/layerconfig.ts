import type { StyleConfig } from './styleconfig';
import type { Color } from './color';
import type { Style, ColorMap as GeoStylerColorMap } from 'geostyler-style';

export type googleMapType = 'roadmap' | 'satellite' | 'terrain' | 'hybrid';

export type LayerConfig =
  | {
      type: 'geojson';
      url?: string;
      geojson?: string;
      style?: StyleConfig;
      geostylerStyle?: Style;
      groupId?: string;
      groupVisible?: boolean;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    }
  | {
      type: 'osm';
      groupId?: string;
      groupVisible?: boolean;
      url?: string;
      opacity?: number;
      zIndex?: number;
      visible?: boolean;
    }
  | {
      type: 'geotiff';
      groupId?: string;
      groupVisible?: boolean;
      url?: string;
      nodata?: number;
      colorMap?: string | GeoStylerColorMap;
      valueRange?: [number, number];
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
      groupVisible?: boolean;
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
      groupVisible?: boolean;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    }
  | {
      type: 'google';
      apiKey: string;
      mapType?: googleMapType;
      scale?: 'scaleFactor1x' | 'scaleFactor2x' | 'scaleFactor4x';
      highDpi?: boolean;
      opacity?: number;
      visible?: boolean;
      groupId?: string;
      groupVisible?: boolean;
      zIndex?: number;
      maxZoom?: number;
      styles?: Record<string, unknown>[] | string;
      language?: string;
      libraries?: string[];
      region?: string; // nur wenn deine OL-Version das typisiert
      layerTypes?: string[];
      overlay?: boolean;
      imageFormat?: string;
      apiOptions?: string[];
    }
  | {
      type: 'wms';
      url: string;
      layers: string;
      extraParams?: Record<string, string>;
      groupId?: string;
      groupVisible?: boolean;
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

      data?: unknown; //dataSource,
      getFillColor?: Color;
      getRadius?: number;
      opacity?: number;
      visible?: boolean;

      getTooltip?: (info: Record<string, unknown>) => unknown;
      onClick?: (info: Record<string, unknown>) => void;
      onHover?: (info: Record<string, unknown>) => void;
      groupId?: string;
      groupVisible?: boolean;
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
      groupVisible?: boolean;
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
      groupVisible?: boolean;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
      geostylerStyle?: Style;
      style?: StyleConfig;
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
      tileSize?: number;
      minZoom?: number;
      maxZoom?: number;
      groupId?: string;
      groupVisible?: boolean;
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
      groupVisible?: boolean;
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
      groupVisible?: boolean;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    }
  | {
      type: 'terrain-geotiff';
      url: string;
      projection?: string;
      forceProjection?: boolean;
      nodata?: number;
      minZoom?: number;
      maxZoom?: number;
      tileSize?: number;
      meshMaxError?: number;
      wireframe?: boolean;
      texture?: string;
      color?: [number, number, number];
      colorMap?: string | GeoStylerColorMap;
      valueRange?: [number, number];
      elevationScale?: number;
      renderMode?: 'terrain' | 'colormap';
      groupId?: string;
      groupVisible?: boolean;
      zIndex?: number;
      visible?: boolean;
      opacity?: number;
    };
