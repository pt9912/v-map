// src/components/v-map/map-provider/map-provider.ts
export type LonLat = [number, number];

export type MapInitOptions = {
  center?: [number, number];
  zoom?: number;
  // ggf. später mehr (projection, controls, ...):
  // projection?: 'EPSG:3857' | 'EPSG:4326';
};

export type CssMode = 'inline-min' | 'cdn' | 'none' | 'bundle';

export type ProviderOptions = {
  target: HTMLElement;
  shadowRoot?: ShadowRoot;
  mapInitOptions?: MapInitOptions;
  cssMode?: CssMode;
};

export interface MapProvider {
  init(options: ProviderOptions): Promise<void>;
  destroy(): Promise<void>;

  /** Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind */
  addLayer(layer: LayerConfig): Promise<void>;

  /** View/Camera setzen; in OL/Cesium meist async (Animations/Promises), daher Promise<void> */
  setView(center: LonLat, zoom: number): Promise<void>;

  /** Optional: von v-map-layer-group genutzt, wenn vorhanden */
  ensureGroup?(
    groupId: string,
    opts?: { basemap?: boolean; zIndex?: number },
  ): Promise<void>;
}

export interface StyleConfig {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export type LayerConfig =
  | { type: 'geojson'; url: string; style?: StyleConfig; groupId?: string }
  | { type: 'osm'; groupId?: string }
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
    };
