import type { LayerConfig } from '../types/layerconfig';

import { VMapEvents, type MapProviderDetail } from '../utils/events';
import type { MapProvider, LayerUpdate } from '../types/mapprovider';
import { log, warn } from '../utils/logger';

export class VMapLayerHelper {
  private layerId: string | null = null;
  private mapProvider: MapProvider = null;

  constructor(private el: HTMLElement) {}

  private async addLayer(
    basemapid: string,
    groupId: string,
    groupVisible: boolean,
    layerConfig: LayerConfig,
    layerElementId?: string,
  ): Promise<string> {
    if (!this.mapProvider) {
      //throw new Error('Map provider not available.');
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
    group: Element,
    vmap: HTMLVMapElement,
    createLayerConfig: () => LayerConfig,
    elementId?: string,
  ) {
    if (this.layerId) {
      await this.mapProvider?.removeLayer(this.layerId);
      this.layerId = null;
    }

    const layerGroup: HTMLVMapLayergroupElement =
      group as HTMLVMapLayergroupElement;

    const isMapProviderAvailable = (await vmap.getMapProvider()) ? true : false;

    if (isMapProviderAvailable) {
      log(`${this.el.nodeName.toLowerCase()} - layer is being added`);
      this.mapProvider = await vmap.getMapProvider();
      const groupId: string = await layerGroup.getGroupId();
      const groupVisible: boolean = await layerGroup.visible;
      if (this.layerId === null && this.mapProvider) {
        try {
          this.layerId = await this.addLayer(
            layerGroup.basemapid,
            groupId,
            groupVisible,
            createLayerConfig(),
            elementId,
          );
        } catch (e) {
          warn(`${this.el.nodeName.toLowerCase()} - failed to add layer: ${(e as Error).message}`);
        }
      }
    }
    vmap.addEventListener(VMapEvents.MapProviderReady, (async (
      event: CustomEvent,
    ) => {
      log(`${this.el.nodeName.toLowerCase()} - layer add deferred`);
      const mapEvent = event.detail as MapProviderDetail;
      this.mapProvider = mapEvent.mapProvider;
      if (this.layerId === null && this.mapProvider) {
        try {
          const groupId: string = await layerGroup.getGroupId();
          const groupVisible: boolean = await layerGroup.visible;
          this.layerId = await this.addLayer(
            layerGroup.basemapid,
            groupId,
            groupVisible,
            createLayerConfig(),
            elementId,
          );
        } catch (e) {
          warn(`${this.el.nodeName.toLowerCase()} - failed to add layer: ${(e as Error).message}`);
        }
      }
    }) as EventListener);
  }

  public async setVisible(visible: boolean): Promise<void> {
    await this.mapProvider?.setVisible(this.layerId, visible);
  }

  public async setOpacity(opacity: number): Promise<void> {
    await this.mapProvider?.setOpacity(this.layerId, opacity);
  }

  public async setZIndex(zIndex: number): Promise<void> {
    await this.mapProvider?.setZIndex(this.layerId, zIndex);
  }

  public getMapProvider(): MapProvider {
    return this.mapProvider;
  }

  public getLayerId(): string {
    return this.layerId;
  }

  public async removeLayer() {
    await this.mapProvider?.removeLayer(this.layerId);
    this.layerId = null;
  }

  public async updateLayer(update: LayerUpdate) {
    await this.mapProvider?.updateLayer(this.layerId, update);
  }

  public async initLayer(
    createLayerConfig: () => LayerConfig,
    elementId?: string,
  ) {
    const group = this.el.closest('v-map-layergroup');
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

    //MapProviderWillShutdown
    vmap.addEventListener(
      VMapEvents.MapProviderWillShutdown,
      async (_event: CustomEvent) => {
        log(`${this.el.nodeName.toLowerCase()} - map provider shutting down`);
        this.mapProvider = null;
        this.layerId = null;
      },
    );

    await this.addToMapInternal(
      group,
      vmap as HTMLVMapElement,
      createLayerConfig,
      elementId,
    );
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
