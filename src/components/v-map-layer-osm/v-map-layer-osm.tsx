// src/components/v-map-layer-osm/v-map-layer-osm.tsx
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
import MSG from '../../utils/messages';
import { log } from '../../utils/logger';

const MSG_COMPONENT: string = 'v-map-layer-osm - ';

@Component({
  tag: 'v-map-layer-osm',
  styleUrl: 'v-map-layer-osm.css',
  shadow: true,
})
export class VMapLayerOSM implements VMapLayer {
  @Element() el!: HTMLElement;

  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Opazität der OSM-Kacheln (0–1).
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1.0;

  /**
   * Z-index for layer stacking order. Higher values render on top.
   */
  @Prop({ reflect: true }) zIndex: number = 10;

  /**
   * Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server.
   */
  @Prop({ reflect: true }) url: string = 'https://tile.openstreetmap.org';

  /**
   * Wird ausgelöst, wenn der OSM-Layer bereit ist.
   * @event ready
   */
  @Event({ eventName: VMapEvents.Ready }) ready!: EventEmitter<void>;

  private didLoad: boolean = false;

  private helper: VMapLayerHelper;

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

  @Watch('url')
  async onUrlChanged(oldValue: string, newValue: string) {
    log(MSG_COMPONENT + 'onUrlChanged');
    if (oldValue !== newValue) {
      await this.helper?.updateLayer({
        type: 'osm',
        data: {
          url: this.url,
        },
      });
    }
    //    if (oldValue !== newValue) {
    //      await this.helper.initLayer(() => this.createLayerConfig());
    //    }
  }

  isReady(): boolean {
    return this.didLoad;
  }

  /**
   * Returns the internal layer ID used by the map provider.
   */
  @Method()
  async getLayerId() {
    return this.helper?.getLayerId();
  }

  private createLayerConfig(): LayerConfig {
    return {
      type: 'osm',
      url: this.url,
      visible: this.visible,
      zIndex: this.zIndex,
      opacity: this.opacity,
    };
  }

  async connectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
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

  async disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
    await this.helper?.removeLayer();
  }

  render() {
    return;
  }
}
