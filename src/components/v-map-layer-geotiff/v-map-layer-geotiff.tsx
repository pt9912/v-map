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
import { LayerConfig } from 'src/components';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';

@Component({
  tag: 'v-map-layer-geotiff',
  styleUrl: 'v-map-layer-geotiff.css',
  shadow: true,
})
export class VMapLayerGeoTIFF implements VMapLayer {
  @Element() el!: HTMLElement;

  @Prop() url: string = null;

  @Prop() visible: boolean = true;

  /**
   * Opazität der GeoTIFF-Kacheln (0–1).
   * @default 1
   */
  @Prop() opacity: number = 1.0;

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
    console.log('v-map-layer-geotiff - onUrlChanged');
    await this.helper?.updateLayer({
      type: 'geotiff',
      data: {
        url: this.url,
      },
    });
  }

  @Watch('visible')
  async onVisibleChanged() {
    console.log('v-map-layer-geotiff - onVisibleChanged');
    await this.helper?.setVisible(this.visible);
  }

  @Watch('opacity')
  async onOpacityChanged() {
    console.log('v-map-layer-geotiff - onOpacityChanged');
    await this.helper?.setOpacity(this.opacity);
  }

  @Watch('zIndex')
  async onZIndexChanged() {
    console.log('v-map-layer-geotiff - onZIndexChanged');
    await this.helper?.setZIndex(this.zIndex);
  }

  isReady(): boolean {
    return this.didLoad;
  }

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
    console.log('v-map-layer-geotiff - connectedCallback');
    //await this.addToMapInternal();
  }

  async componentWillLoad() {
    console.log('v-map-layer-geotiff - componentWillLoad');
    this.helper = new VMapLayerHelper(this.el);
  }

  async componentDidLoad() {
    console.log('v-map-layer-geotiff - componentDidLoad');

    await this.helper.initLayer(() => this.createLayerConfig());

    this.didLoad = true;
    this.ready.emit();
  }

  async componentWillRender() {
    console.log('v-map-layer-geotiff - componentWillRender');
  }

  render() {
    return;
  }
}
