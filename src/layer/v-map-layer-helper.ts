import { LayerConfig } from 'src/components';
import { VMapEvents, type MapProviderDetail } from '../utils/events';
import type { MapProvider, LayerUpdate } from '../types/mapprovider';

export class VMapLayerHelper {
  private layerId: string | null = null;
  private mapProvider: MapProvider = null;

  constructor(private el: HTMLElement) {}

  protected async addToMapInternal(
    group: Element,
    vmap: HTMLVMapElement,
    createLayerConfig: () => LayerConfig,
  ) {
    if (this.layerId) {
      await this.mapProvider?.removeLayer(this.layerId);
      this.layerId = null;
    }

    const isMapProviderAvailable = await vmap.isMapProviderAvailable();

    if (isMapProviderAvailable) {
      console.log(`${this.el.nodeName.toLowerCase()} - Layer wird hinzugefügt`);
      this.mapProvider = await vmap.getMapProvider();
      this.layerId = await (group as HTMLVMapLayerGroupElement).addLayer(
        createLayerConfig(),
      );
    } //else {
    vmap.addEventListener(VMapEvents.MapProviderReady, (async (
      event: CustomEvent,
    ) => {
      console.log(
        `${this.el.nodeName.toLowerCase()} - Layer wird verzögert hinzugefügt`,
      );
      const mapEvent = event.detail as MapProviderDetail;
      this.mapProvider = mapEvent.mapProvider;
      this.layerId = await (group as HTMLVMapLayerGroupElement).addLayer(
        createLayerConfig(),
      );
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

  public async updateLayer(update: LayerUpdate) {
    await this.mapProvider?.updateLayer(this.layerId, update);
  }

  public async initLayer(createLayerConfig: () => LayerConfig) {
    const group = this.el.closest('v-map-layer-group');
    if (!group) {
      console.warn(
        `${this.el.nodeName.toLowerCase()} ist nicht in einer v-map-layer-group enthalten`,
      );
      return;
    }

    const vmap = await this.getVMap();
    if (!vmap) {
      console.warn(
        `Keine v-map Elternkomponente für ${this.el.nodeName.toLowerCase()} gefunden`,
      );
      return;
    }

    //MapProviderWillShutdown
    vmap.addEventListener(
      VMapEvents.MapProviderWillShutdown,
      async (_event: CustomEvent) => {
        console.log(
          `${this.el.nodeName.toLowerCase()} map provider fährt herunter`,
        );
        this.mapProvider = null;
        this.layerId = null;
      },
    );

    await this.addToMapInternal(
      group,
      vmap as HTMLVMapElement,
      createLayerConfig,
    );
  }

  private async getVMap(): Promise<HTMLVMapElement> {
    console.log(`${this.el.nodeName.toLowerCase()} - getVMap`);
    const mapElement = this.el.closest('v-map') as HTMLElement;
    if (!mapElement) {
      console.log(
        `${this.el.nodeName.toLowerCase()} - getVMap - v-map not found.`,
      );
      return null;
    }
    await customElements.whenDefined('v-map');
    const vmap = mapElement as HTMLVMapElement;
    console.log(`${this.el.nodeName.toLowerCase()} - getVMap - assigned.`);
    return vmap;
  }
}
