// src/components/v-map-layer-wms/v-map-layer-wms.tsx
import {
  Watch,
  Component,
  Prop,
  Method,
  Element,
  Event,
  EventEmitter,
} from '@stencil/core';
//import { VMapEvents, type MapProviderDetail } from '../../utils/events';
//import type { MapProvider } from '../../types/mapprovider';
import type { VMapErrorDetail } from '../../utils/events';
import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import type { VMapErrorHost } from '../../layer/v-map-layer-helper';
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
export class VMapLayerWms implements VMapErrorHost {
  @Element() el!: HTMLElement;

  @Prop({ attribute: 'load-state', reflect: true, mutable: true })
  loadState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

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

  /**
   * Z-index for layer stacking order. Higher values render on top.
   */
  @Prop({ reflect: true }) zIndex: number = 10;

  /**
   * Signalisiert, dass der WMS-Layer bereit ist.
   * @event ready
   */
  @Event() ready!: EventEmitter<void>;
  //private mapProvider?: MapProvider;

  private hasLoadedOnce: boolean = false;
  private helper: VMapLayerHelper;

  setLoadState(state: 'idle' | 'loading' | 'ready' | 'error') {
    this.loadState = state;
  }

  @Method()
  async getError(): Promise<VMapErrorDetail | undefined> {
    return this.helper?.getError();
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
        styles: this.styles,
        format: this.format,
        transparent: String(this.transparent),
      },
    });
  }

  async connectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
    if (!this.hasLoadedOnce) return;
    this.helper.startLoading();
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
  }

  async componentWillLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_LOAD);
    this.helper = new VMapLayerHelper(this.el, this);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);

    this.helper.startLoading();
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);

    this.hasLoadedOnce = true;
    this.ready.emit();
  }

  async disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
    await this.helper?.dispose();
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
