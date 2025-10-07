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
    layerConfig: LayerConfig,
    layerElementId?: string,
  ): Promise<string> {
    if (!this.mapProvider) throw new Error('Map-Provider nicht verfügbar.');
    if (basemapid) {
      return await this.mapProvider.addBaseLayer(
        {
          ...layerConfig,
          groupId: groupId,
        },
        basemapid,
        layerElementId,
      );
    }
    return await this.mapProvider.addLayerToGroup(
      {
        ...layerConfig,
      },
      groupId,
    );
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
      log(`${this.el.nodeName.toLowerCase()} - Layer wird hinzugefügt`);
      this.mapProvider = await vmap.getMapProvider();
      const groupId: string = await layerGroup.getGroupId();
      this.layerId = await this.addLayer(
        layerGroup.basemapid,
        groupId,
        createLayerConfig(),
        elementId,
      );
      // await (group as HTMLVMapLayergroupElement).addLayer(
      //   createLayerConfig(),
      //   elementId,
      // );
    } //else {
    vmap.addEventListener(VMapEvents.MapProviderReady, (async (
      event: CustomEvent,
    ) => {
      log(
        `${this.el.nodeName.toLowerCase()} - Layer wird verzögert hinzugefügt`,
      );
      const mapEvent = event.detail as MapProviderDetail;
      this.mapProvider = mapEvent.mapProvider;
      const groupId: string = await layerGroup.getGroupId();
      this.layerId = await this.addLayer(
        layerGroup.basemapid,
        groupId,
        createLayerConfig(),
        elementId,
      );
      // this.layerId = await (group as HTMLVMapLayergroupElement).addLayer(
      //   createLayerConfig(),
      //   elementId,
      // );
    }) as EventListener);
    //}
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
        `${this.el.nodeName.toLowerCase()} ist nicht in einer v-map-layergroup enthalten`,
      );
      return;
    }

    const vmap = await this.getVMap();
    if (!vmap) {
      warn(
        `Keine v-map Elternkomponente für ${this.el.nodeName.toLowerCase()} gefunden`,
      );
      return;
    }

    //MapProviderWillShutdown
    vmap.addEventListener(
      VMapEvents.MapProviderWillShutdown,
      async (_event: CustomEvent) => {
        log(`${this.el.nodeName.toLowerCase()} map provider fährt herunter`);
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
