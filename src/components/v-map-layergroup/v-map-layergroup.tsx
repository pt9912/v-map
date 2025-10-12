import { Watch, Component, Prop, Element, h, Method } from '@stencil/core';
import type { MapProvider } from '../../types/mapprovider';
import { VMapEvents, type MapProviderDetail } from '../../utils/events';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const MSG_COMPONENT: string = 'v-map-layergroup - ';

@Component({
  tag: 'v-map-layergroup',
  styleUrl: 'v-map-layergroup.css',
  shadow: true,
})
export class VMapLayerGroup {
  @Element() el!: HTMLElement;

  /**
   * Sichtbarkeit der gesamten Gruppe.
   * @default true
   */
  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Globale Opazität (0–1) für alle Kinder.
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1.0;

  // /**
  //  * Kennzeichnet diese Gruppe als Basis-Kartenebene (exklusiv sichtbar).
  //  * @default false
  //  */
  // @Prop({ reflect: true }) basemap = false;

  /**
   * Base map identifier for this layer group. When set, layers in this group will be treated as base map layers.
   */
  @Prop({ reflect: true }) basemapid: string | null = null;

  // /**
  //  * Eindeutige Gruppen-ID (z. B. für programmatisches Umschalten).
  //  */
  // @Prop({ reflect: true }) groupId: string = Math.random()
  //   .toString(36)
  //   .slice(2, 11);

  private mapProvider: MapProvider = null;
  private groupId: string = crypto.randomUUID();

  @Watch('visible')
  async onVisibleChanged() {
    log(MSG_COMPONENT + 'onVisibleChanged');
    if (this.mapProvider?.setGroupVisible) {
      await this.mapProvider.setGroupVisible(this.groupId, this.visible);
    }
  }

  @Watch('basemapid')
  async onBaseMapIdChanged() {
    log(MSG_COMPONENT + 'onBaseMapIdChanged');
    if (this.mapProvider?.setBaseLayer) {
      await this.mapProvider.setBaseLayer(this.groupId, this.basemapid);
    }
  }

  private async init(mapProvider: MapProvider) {
    if (this.mapProvider != null) return;
    this.mapProvider = mapProvider;
    if (this.mapProvider === null) return;

    if (this.mapProvider?.ensureGroup) {
      await this.mapProvider.ensureGroup(this.groupId, this.visible, {
        basemapid: this.basemapid,
      });
    }
    await this.mapProvider?.setGroupVisible(this.groupId, this.visible);
    await this.mapProvider?.setBaseLayer(this.groupId, this.basemapid);
  }

  async connectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
    const mapElement = this.el.closest('v-map') as HTMLVMapElement | null;

    await customElements.whenDefined('v-map');
    const vmap = mapElement as HTMLVMapElement;

    const mapProviderAvailable: boolean = (await mapElement?.getMapProvider?.())
      ? true
      : false;
    if (mapProviderAvailable) {
      const mapProvider = await mapElement?.getMapProvider?.();
      await this.init(mapProvider);
    }
    vmap.addEventListener(VMapEvents.MapProviderReady, (async (
      event: CustomEvent,
    ) => {
      log(`${MSG_COMPONENT}map provider ready`);
      const mapEvent = event.detail as MapProviderDetail;
      await this.init(mapEvent.mapProvider);
    }) as EventListener);

    vmap.addEventListener(
      VMapEvents.MapProviderWillShutdown,
      async (_event: CustomEvent) => {
        log(`${MSG_COMPONENT}map provider shutting down`);
        this.mapProvider = null;
      },
    );
  }

  async componentWillLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_LOAD);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);
  }

  async componentWillRender() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_RENDER);
  }

  @Method()
  async getGroupId(): Promise<string> {
    return this.groupId;
  }

  render() {
    return <slot />;
  }
}
