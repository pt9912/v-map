import type { ProviderOptions } from './provideroptions';
import type { LayerConfig } from './layerconfig';
import type { LonLat } from './lonlat';

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
