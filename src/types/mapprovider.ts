import type { ProviderOptions } from './provideroptions';
import type { LayerConfig } from './layerconfig';
import type { LonLat } from './lonlat';

export type LayerUpdate =
  | {
      [K in LayerConfig['type']]: {
        type: K;
        data: Partial<Extract<LayerConfig, { type: K }>>;
      };
    }[LayerConfig['type']]
  | { type: 'tile3d-style'; data: { style?: Record<string, unknown> } };

export type LayerErrorCallback = (error: { type: 'network'; message: string; cause?: unknown }) => void;

export interface MapProvider {
  init(options: ProviderOptions): Promise<void>;
  destroy(): Promise<void>;

  setOpacity(layerId: string, opacity: number): Promise<void>;
  setVisible(layerId: string, visible: boolean): Promise<void>;
  setZIndex(layerId: string, zIndex: number): Promise<void>;

  /** Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind */
  addLayerToGroup(layer: LayerConfig): Promise<string>;
  updateLayer(layerId: string, update: LayerUpdate): Promise<void>;
  removeLayer(layerId: string): Promise<void>;

  addBaseLayer?(
    layerConfig: LayerConfig,
    basemapid: string,
    layerElementId: string,
  ): Promise<string>;
  setBaseLayer?(groupId: string, layerElementId: string): Promise<void>;

  /** View/Camera setzen; in OL/Cesium meist async (Animations/Promises), daher Promise<void> */
  setView(center: LonLat, zoom: number): Promise<void>;

  /**
   * Aktuelle View/Camera des Providers abfragen. Spiegelt den IST-Stand
   * (nach User-Pan/Zoom) wider, NICHT die initialen Init-Optionen.
   * Wird von `<v-map>`'s `@Watch('zoom')` / `@Watch('center')` Handlern
   * benutzt, um partielle Updates ohne Daten-Verlust zusammenzubauen.
   * Gibt `null` zurück, wenn der Provider noch nicht initialisiert ist.
   */
  getView?(): { center: LonLat; zoom: number } | null;

  ensureGroup(
    groupId: string,
    visible: boolean,
    opts?: { basemapid?: string },
  ): Promise<void>;

  setGroupVisible?(groupId: string, visible: boolean): Promise<void>;

  /** Register a callback for runtime layer errors (tile load, feature fetch, etc.). */
  onLayerError?(layerId: string, callback: LayerErrorCallback): void;
  /** Unregister the runtime error callback and detach native listeners for a layer. */
  offLayerError?(layerId: string): void;

  /** Register a callback for pointer-move with geo-coordinates. Returns unsubscribe function. */
  onPointerMove?(callback: (coordinate: [number, number] | null, pixel: [number, number]) => void): () => void;
}
