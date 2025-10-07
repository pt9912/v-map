// src/components/v-map-layer-geotiff/v-map-layer-geotiff.tsx
import {
  Component,
  Prop,
  Method,
  Event,
  EventEmitter,
  Watch,
  Element,
} from '@stencil/core';

import type { VMapLayer } from '../../types/vmaplayer';
import { VMapEvents } from '../../utils/events';
import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const MSG_COMPONENT: string = 'v-map-layer-geotiff - ';

@Component({
  tag: 'v-map-layer-geotiff',
  styleUrl: 'v-map-layer-geotiff.css',
  shadow: true,
})
export class VMapLayerGeoTIFF implements VMapLayer {
  @Element() el!: HTMLElement;

  /**
   * URL to the GeoTIFF file to be displayed on the map.
   */
  @Prop() url: string = null;

  @Prop() visible: boolean = true;

  /**
   * Opazität der GeoTIFF-Kacheln (0–1).
   * @default 1
   */
  @Prop() opacity: number = 1.0;

  /**
   * Z-index for layer stacking order. Higher values render on top.
   */
  @Prop() zIndex: number = 1000;

  /**
   * Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist.
   * @event ready
   */
  @Event({ eventName: VMapEvents.Ready }) ready!: EventEmitter<void>;

  private didLoad: boolean = false;

  private helper: VMapLayerHelper;

  @Watch('url')
  async onUrlChanged() {
    log(MSG_COMPONENT + 'onUrlChanged');
    await this.helper?.updateLayer({
      type: 'geotiff',
      data: {
        url: this.url,
      },
    });
  }

  @Watch('visible')
  async onVisibleChanged() {
    log(MSG_COMPONENT + 'onVisibleChanged');
    await this.helper?.setVisible(this.visible);
  }

  @Watch('opacity')
  async onOpacityChanged() {
    log(MSG_COMPONENT + 'onOpacityChanged');
    await this.helper?.setOpacity(this.opacity);
  }

  @Watch('zIndex')
  async onZIndexChanged() {
    log(MSG_COMPONENT + 'onZIndexChanged');
    await this.helper?.setZIndex(this.zIndex);
  }

  isReady(): boolean {
    return this.didLoad;
  }

  /**
   * Returns the internal layer ID used by the map provider.
   */
  @Method()
  async getLayerId() {
    return this.helper.getLayerId();
  }

  private createLayerConfig(): LayerConfig {
    return {
      type: 'geotiff',
      visible: this.visible,
      zIndex: this.zIndex,
      opacity: this.opacity,
      url: this.url,
    };
  }

  // /**
  //  * Fügt den GeoTIFF-Layer der Karte hinzu (vom Eltern-<v-map> aufgerufen).
  //  */
  // @Method()
  // async addToMap(_mapElement: HTMLVMapElement) {
  //   await this.helper?.initLayer(() => this.createLayerConfig());
  // }

  async connectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
    //await this.addToMapInternal();
  }

  async componentWillLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_LOAD);
    this.helper = new VMapLayerHelper(this.el);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);

    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);

    this.didLoad = true;
    this.ready.emit();
  }

  async componentWillRender() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_RENDER);
  }

  render() {
    return;
  }
}
