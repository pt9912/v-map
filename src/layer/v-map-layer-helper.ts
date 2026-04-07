import type { LayerConfig } from '../types/layerconfig';

import { VMapEvents, type MapProviderDetail, type VMapErrorDetail } from '../utils/events';
import type { MapProvider, LayerUpdate } from '../types/mapprovider';
import { log, warn } from '../utils/logger';

type VMapHostElement = HTMLVMapElement & { __vMapProvider?: MapProvider | null };

export interface VMapErrorHost {
  /** Called by the helper to set the component load state */
  setLoadState(state: 'idle' | 'loading' | 'ready' | 'error'): void;
}

export class VMapLayerHelper {
  private static readonly RUNTIME_ERROR_DEBOUNCE_MS = 5000;

  private layerId: string | null = null;
  private mapProvider: MapProvider = null;
  private _error?: VMapErrorDetail;
  private host?: VMapErrorHost;
  private initContext?: {
    group: HTMLVMapLayergroupElement;
    vmap: HTMLVMapElement;
    createLayerConfig: () => LayerConfig;
    elementId?: string;
  };
  private listenersBound = false;
  private recreateInFlight = false;
  private lastRuntimeErrorTime = 0;

  constructor(private el: HTMLElement, host?: VMapErrorHost) {
    this.host = host;
  }

  // ── Error / State management ──────────────────────────────────────

  public startLoading(): void {
    // Keep the last error visible during retry until success or new error
    this.host?.setLoadState('loading');
  }

  public markReady(): void {
    this.clearError();
    this.host?.setLoadState('ready');
  }

  public markUpdated(): void {
    // Semantically separate success path for updates, currently identical to markReady()
    this.markReady();
  }

  public setError(detail: VMapErrorDetail): void {
    this._error = detail;
    this.host?.setLoadState('error');
    this.el.dispatchEvent(new CustomEvent(VMapEvents.Error, {
      detail,
      bubbles: true,
      composed: true,
    }));
    warn(`${this.el.nodeName.toLowerCase()} - ${detail.message}`);
  }

  public setRuntimeError(detail: VMapErrorDetail): void {
    const now = Date.now();
    if (now - this.lastRuntimeErrorTime < VMapLayerHelper.RUNTIME_ERROR_DEBOUNCE_MS) {
      return;
    }
    this.lastRuntimeErrorTime = now;
    this.setError(detail);
  }

  public clearError(): void {
    this._error = undefined;
    this.lastRuntimeErrorTime = 0;
  }

  public getError(): VMapErrorDetail | undefined {
    return this._error;
  }

  // ── Layer operations ──────────────────────────────────────────────

  private async addLayer(
    basemapid: string,
    groupId: string,
    groupVisible: boolean,
    layerConfig: LayerConfig,
    layerElementId?: string,
  ): Promise<string> {
    if (!this.mapProvider) {
      warn('Map provider not available.');
      return null;
    }
    if (basemapid) {
      return await this.mapProvider?.addBaseLayer(
        {
          ...layerConfig,
          groupId: groupId,
          groupVisible: groupVisible,
        },
        basemapid,
        layerElementId,
      );
    }
    return await this.mapProvider?.addLayerToGroup({
      ...layerConfig,
      groupId: groupId,
      groupVisible: groupVisible,
    });
  }

  protected async addToMapInternal(
    group: HTMLVMapLayergroupElement,
    vmap: HTMLVMapElement,
    createLayerConfig: () => LayerConfig,
    elementId?: string,
  ) {
    if (this.layerId) {
      this.unregisterLayerError();
      await this.mapProvider?.removeLayer(this.layerId);
      this.layerId = null;
    }

    const isMapProviderAvailable = (await vmap.isMapProviderReady?.()) === true;

    if (isMapProviderAvailable) {
      log(`${this.el.nodeName.toLowerCase()} - layer is being added`);
      this.mapProvider = (vmap as VMapHostElement).__vMapProvider ?? null;
      const groupId: string = await group.getGroupId();
      const groupVisible: boolean = await group.visible;
      if (this.layerId === null && this.mapProvider) {
        try {
          this.layerId = await this.addLayer(
            group.basemapid,
            groupId,
            groupVisible,
            createLayerConfig(),
            elementId,
          );
          if (this.layerId) {
            this.registerLayerError();
            this.markReady();
          } else {
            this.setError({
              type: 'provider',
              message: 'Layer could not be added: provider returned no layer ID',
            });
          }
        } catch (e) {
          this.setError({
            type: 'provider',
            message: `Layer could not be added: ${e instanceof Error ? e.message : String(e)}`,
            cause: e,
          });
        }
      }
    }
  }

  // ── Event binding ─────────────────────────────────────────────────

  private bindMapEventsOnce(): void {
    if (this.listenersBound || !this.initContext) return;
    const { vmap } = this.initContext;

    vmap.addEventListener(VMapEvents.MapProviderReady, this.onMapProviderReady as EventListener);
    vmap.addEventListener(VMapEvents.MapProviderWillShutdown, this.onMapProviderWillShutdown as EventListener);
    this.listenersBound = true;
  }

  private readonly onMapProviderReady = async (event: CustomEvent) => {
    log(`${this.el.nodeName.toLowerCase()} - layer add deferred`);
    const mapEvent = event.detail as MapProviderDetail;
    this.mapProvider = mapEvent.mapProvider;
    if (!this.layerId && this.initContext) {
      this.startLoading();
      const { group, vmap, createLayerConfig, elementId } = this.initContext;
      await this.addToMapInternal(group, vmap, createLayerConfig, elementId);
    }
  };

  private readonly onMapProviderWillShutdown = async (_event: CustomEvent) => {
    log(`${this.el.nodeName.toLowerCase()} - map provider shutting down`);
    this.mapProvider = null;
    this.layerId = null;
    this.clearError();
    this.host?.setLoadState('idle');
  };

  // ── Mutators ──────────────────────────────────────────────────────

  public async setVisible(visible: boolean): Promise<void> {
    if (!this.layerId || !this.mapProvider) {
      return;
    }
    try {
      await this.mapProvider.setVisible(this.layerId, visible);
    } catch (e) {
      this.setError({
        type: 'provider',
        message: `setVisible failed: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    }
  }

  public async setOpacity(opacity: number): Promise<void> {
    if (!this.layerId || !this.mapProvider) {
      return;
    }
    try {
      await this.mapProvider.setOpacity(this.layerId, opacity);
    } catch (e) {
      this.setError({
        type: 'provider',
        message: `setOpacity failed: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    }
  }

  public async setZIndex(zIndex: number): Promise<void> {
    if (!this.layerId || !this.mapProvider) {
      return;
    }
    try {
      await this.mapProvider.setZIndex(this.layerId, zIndex);
    } catch (e) {
      this.setError({
        type: 'provider',
        message: `setZIndex failed: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    }
  }

  public async updateLayer(update: LayerUpdate): Promise<void> {
    if (!this.layerId || !this.mapProvider) {
      await this.recreateLayer();
      return;
    }
    try {
      await this.mapProvider.updateLayer(this.layerId, update);
      this.markUpdated();
    } catch (e) {
      this.setError({
        type: 'provider',
        message: `updateLayer failed: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    }
  }

  // ── Lifecycle ─────────────────────────────────────────────────────

  public async recreateLayer(): Promise<void> {
    if (!this.initContext || this.recreateInFlight) return;
    this.recreateInFlight = true;
    this.startLoading();
    const { group, vmap, createLayerConfig, elementId } = this.initContext;
    try {
      await this.addToMapInternal(group, vmap, createLayerConfig, elementId);
    } finally {
      this.recreateInFlight = false;
    }
  }

  public async initLayer(
    createLayerConfig: () => LayerConfig,
    elementId?: string,
  ) {
    const group = this.el.closest('v-map-layergroup') as HTMLVMapLayergroupElement;
    if (!group) {
      warn(
        `${this.el.nodeName.toLowerCase()} is not inside a v-map-layergroup`,
      );
      return;
    }

    const vmap = await this.getVMap();
    if (!vmap) {
      warn(
        `No parent v-map component found for ${this.el.nodeName.toLowerCase()}`,
      );
      return;
    }

    this.initContext = { group, vmap, createLayerConfig, elementId };
    this.bindMapEventsOnce();

    await this.addToMapInternal(group, vmap, createLayerConfig, elementId);
  }

  public async dispose(): Promise<void> {
    if (this.initContext && this.listenersBound) {
      const { vmap } = this.initContext;
      vmap.removeEventListener(VMapEvents.MapProviderReady, this.onMapProviderReady as EventListener);
      vmap.removeEventListener(VMapEvents.MapProviderWillShutdown, this.onMapProviderWillShutdown as EventListener);
    }
    // listenersBound = false enables re-binding on a later connectedCallback()/initLayer()
    this.listenersBound = false;
    await this.removeLayer();
    this.clearError();
    this.host?.setLoadState('idle');
  }

  // ── Accessors ─────────────────────────────────────────────────────

  public getMapProvider(): MapProvider {
    return this.mapProvider;
  }

  public getLayerId(): string {
    return this.layerId;
  }

  public async removeLayer() {
    this.unregisterLayerError();
    await this.mapProvider?.removeLayer(this.layerId);
    this.layerId = null;
  }

  private registerLayerError(): void {
    if (this.layerId && this.mapProvider?.onLayerError) {
      this.mapProvider.onLayerError(this.layerId, (err) => {
        this.setRuntimeError({
          type: err.type,
          message: err.message,
          cause: err.cause,
        });
      });
    }
  }

  private unregisterLayerError(): void {
    if (this.layerId && this.mapProvider?.offLayerError) {
      this.mapProvider.offLayerError(this.layerId);
    }
  }

  private async getVMap(): Promise<HTMLVMapElement> {
    log(`${this.el.nodeName.toLowerCase()} - getVMap`);
    const mapElement = this.el.closest('v-map') as HTMLElement;
    if (!mapElement) {
      log(`${this.el.nodeName.toLowerCase()} - getVMap - v-map not found.`);
      return null;
    }
    await customElements.whenDefined('v-map');
    const vmap = mapElement as HTMLVMapElement;
    log(`${this.el.nodeName.toLowerCase()} - getVMap - assigned.`);
    return vmap;
  }
}
