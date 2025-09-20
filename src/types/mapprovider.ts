import type { ProviderOptions } from './provideroptions';
import type { LayerConfig } from './layerconfig';
import type { LonLat } from './lonlat';

export type LayerUpdate = {
  type: string;
  data: any;
};

export interface MapProvider {
  init(options: ProviderOptions): Promise<void>;
  destroy(): Promise<void>;

  setOpacity(layerId: string, opacity: number): Promise<void>;
  setVisible(layerId: string, visible: boolean): Promise<void>;
  setZIndex(layerId: string, zIndex: number): Promise<void>;

  /** Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind */
  addLayer(layer: LayerConfig): Promise<string>;
  updateLayer(layerId: string, update: LayerUpdate): Promise<void>;
  removeLayer(layerId: string): Promise<void>;

  /** View/Camera setzen; in OL/Cesium meist async (Animations/Promises), daher Promise<void> */
  setView(center: LonLat, zoom: number): Promise<void>;

  /** Optional: von v-map-layer-group genutzt, wenn vorhanden */
  ensureGroup?(
    groupId: string,
    opts?: { basemap?: boolean; zIndex?: number },
  ): Promise<void>;
}
