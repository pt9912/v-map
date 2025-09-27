// src/components/v-map-layer-wms/v-map-layer-wms.tsx
import {
  Watch,
  Component,
  Prop,
  Element,
  Event,
  EventEmitter,
} from '@stencil/core';
//import { VMapEvents, type MapProviderDetail } from '../../utils/events';
//import type { MapProvider } from '../../types/mapprovider';
import { LayerConfig } from 'src/components';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import MSG from '../../utils/messages';
import { log } from '../../utils/logger';

const MSG_COMPONENT: string = 'v-map-layer-wms - ';

/**
 * OGC WMS Layer
 */
@Component({
  tag: 'v-map-layer-wms',
  styleUrl: 'v-map-layer-wms.css',
  shadow: true,
})
export class VMapLayerWms {
  @Element() el!: HTMLElement;

  /**
   * Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).
   */
  @Prop({ reflect: true }) url!: string;

  /**
   * Kommagetrennte Layer-Namen (z. B. "topp:states").
   */
  @Prop({ reflect: true }) layers!: string;

  /**
   * WMS-`STYLES` Parameter (kommagetrennt).
   * @default ""
   */
  @Prop({ reflect: true }) styles?: string;

  /**
   * Bildformat des GetMap-Requests.
   * @default "image/png"
   */
  @Prop({ reflect: true }) format: string = 'image/png';

  /**
   * Transparente Kacheln anfordern.
   * @default true
   */
  @Prop({ reflect: true }) transparent: boolean = true;

  /**
   * Tiled/geslicete Requests verwenden (falls Server unterstützt).
   * @default true
   */
  @Prop({ reflect: true }) tiled: boolean = true;

  /**
   * Sichtbarkeit des WMS-Layers.
   * @default true
   */
  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Globale Opazität des WMS-Layers (0–1).
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1.0;

  @Prop({ reflect: true }) zIndex: number = 10;

  /**
   * Signalisiert, dass der WMS-Layer bereit ist.
   * @event ready
   */
  @Event() ready!: EventEmitter<void>;
  //private mapProvider?: MapProvider;

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
      await this.updateLayer();
    }
  }

  @Watch('layers')
  async onLayersChanged(oldValue: string, newValue: string) {
    log(MSG_COMPONENT + 'onLayersChanged');
    if (oldValue !== newValue) {
      await this.updateLayer();
    }
  }

  @Watch('styles')
  async onStylesChanged(oldValue: string, newValue: string) {
    log(MSG_COMPONENT + 'onStylesChanged');
    if (oldValue !== newValue) {
      await this.updateLayer();
    }
  }

  private async updateLayer() {
    await this.helper?.updateLayer({
      type: 'wms',
      data: {
        url: this.url,
        layers: this.layers,
        params: {
          styles: this.styles,
          format: this.format,
          transparent: this.transparent,
          tiled: this.tiled,
        },
      },
    });
  }

  // private async attach() {
  //   await this.mapProvider.addLayer({
  //     type: 'wms',
  //     url: this.url,
  //     layers: this.layers,
  //     params: {
  //       styles: this.styles,
  //       format: this.format,
  //       transparent: this.transparent,
  //       tiled: this.tiled,
  //     },
  //     visible: this.visible,
  //     opacity: this.opacity,
  //   } as any);
  // }

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

    //todo this.didLoad = true;
    this.ready.emit();
  }

  async disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
    this.helper.removeLayer();
  }

  private createLayerConfig(): LayerConfig {
    return {
      type: 'wms',
      url: this.url,
      layers: this.layers,
      transparent: String(this.transparent),
      styles: this.styles,
      format: this.format,
      extraParams: {
        tiled: String(this.tiled),
      },
      visible: this.visible,
      opacity: this.opacity,
      zIndex: this.zIndex,
    };
  }

  render() {
    return;
  }
}
