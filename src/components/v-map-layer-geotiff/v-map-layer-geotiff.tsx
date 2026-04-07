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
import type { VMapErrorDetail } from '../../utils/events';
import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import type { VMapErrorHost } from '../../layer/v-map-layer-helper';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';
import type { StyleEvent } from '../../types/styling';
import { isGeoStylerStyle } from '../../types/styling';
import type { Style, RasterSymbolizer, ColorMap as GeoStylerColorMap } from 'geostyler-style';

const MSG_COMPONENT: string = 'v-map-layer-geotiff - ';

@Component({
  tag: 'v-map-layer-geotiff',
  styleUrl: 'v-map-layer-geotiff.css',
  shadow: true,
})
export class VMapLayerGeoTIFF implements VMapLayer, VMapErrorHost {
  @Element() el!: HTMLElement;

  /** Current load state of the layer. */
  @Prop({ attribute: 'load-state', reflect: true, mutable: true })
  loadState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

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
  @Prop() zIndex: number = 100;

  /**
   * NoData Values to discard (overriding any nodata values in the metadata).
   */
  @Prop() nodata?: number = null;

  /**
   * ColorMap für die Visualisierung (kann entweder ein vordefinierter Name oder eine GeoStyler ColorMap sein).
   */
  @Prop() colorMap?: string | GeoStylerColorMap = null;

  /**
   * Value range for colormap normalization [min, max].
   */
  @Prop() valueRange?: [number, number] = null;

  /**
   * Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist.
   * @event ready
   */
  @Event({ eventName: VMapEvents.Ready }) ready!: EventEmitter<void>;

  private didLoad: boolean = false;
  private hasLoadedOnce: boolean = false;

  private helper: VMapLayerHelper;

  setLoadState(state: 'idle' | 'loading' | 'ready' | 'error') {
    this.loadState = state;
  }

  /** Returns the last error detail, if any. */
  @Method()
  async getError(): Promise<VMapErrorDetail | undefined> {
    return this.helper?.getError();
  }

  @Watch('url')
  async onUrlChanged() {
    log(MSG_COMPONENT + 'onUrlChanged');
    await this.helper?.updateLayer({
      type: 'geotiff',
      data: {
        url: this.url,
        nodata: this.nodata,
        colorMap: this.colorMap,
        valueRange: this.valueRange,
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

  @Watch('nodata')
  async onNodataChanged() {
    log(MSG_COMPONENT + 'onNodataChanged');
    if (isNaN(this.nodata)) {
      this.nodata = null;
    }
    await this.helper?.updateLayer({
      type: 'geotiff',
      data: {
        url: this.url,
        nodata: this.nodata,
        colorMap: this.colorMap,
        valueRange: this.valueRange,
      },
    });
  }

  @Watch('colorMap')
  async onColorMapChanged() {
    log(MSG_COMPONENT + 'onColorMapChanged');
    await this.helper?.updateLayer({
      type: 'geotiff',
      data: {
        url: this.url,
        nodata: this.nodata,
        colorMap: this.colorMap,
        valueRange: this.valueRange,
      },
    });
  }

  @Watch('valueRange')
  async onValueRangeChanged() {
    log(MSG_COMPONENT + 'onValueRangeChanged');
    await this.helper?.updateLayer({
      type: 'geotiff',
      data: {
        url: this.url,
        nodata: this.nodata,
        colorMap: this.colorMap,
        valueRange: this.valueRange,
      },
    });
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
      nodata: this.nodata,
      colorMap: this.colorMap,
      valueRange: this.valueRange,
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
    if (this.hasLoadedOnce) {
      this.helper.startLoading();
      await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
    }

    // Listen for styleReady events from v-map-style component
    document.addEventListener('styleReady', this.handleStyleReady.bind(this) as EventListener);
  }

  async disconnectedCallback() {
    document.removeEventListener('styleReady', this.handleStyleReady.bind(this) as EventListener);
    await this.helper?.dispose();
  }

  /**
   * Handle styleReady event from v-map-style component
   */
  private async handleStyleReady(event: CustomEvent<StyleEvent>) {
    log(MSG_COMPONENT + 'handleStyleReady');

    const styleEvent = event.detail;

    // Check if this layer is targeted (if layerIds is specified)
    if (styleEvent.layerIds && styleEvent.layerIds.length > 0) {
      const layerId = this.helper?.getLayerId();
      const targetIds = styleEvent.layerIds;

      // Check if this layer is in the target list
      if (layerId && !targetIds.includes(layerId) && !targetIds.includes(this.el.id)) {
        log(MSG_COMPONENT + 'style not targeted for this layer');
        return;
      }
    }

    // Check if it's a GeoStyler Style
    if (!isGeoStylerStyle(styleEvent.style)) {
      log(MSG_COMPONENT + 'not a GeoStyler style');
      return;
    }

    const style = styleEvent.style as Style;

    // Extract RasterSymbolizer from the first matching rule
    const rasterSymbolizer = this.extractRasterSymbolizer(style);

    if (rasterSymbolizer) {
      log(MSG_COMPONENT + 'applying RasterSymbolizer from style');

      // Apply colorMap if present
      if (rasterSymbolizer.colorMap) {
        this.colorMap = rasterSymbolizer.colorMap;
      }

      // Apply opacity if present (and not already set)
      if (rasterSymbolizer.opacity !== undefined && typeof rasterSymbolizer.opacity === 'number') {
        this.opacity = rasterSymbolizer.opacity;
      }

      // Apply visibility if present
      if (rasterSymbolizer.visibility !== undefined && typeof rasterSymbolizer.visibility === 'boolean') {
        this.visible = rasterSymbolizer.visibility;
      }
    }
  }

  /**
   * Extract RasterSymbolizer from GeoStyler Style
   */
  private extractRasterSymbolizer(style: Style): RasterSymbolizer | null {
    for (const rule of style.rules) {
      for (const symbolizer of rule.symbolizers) {
        if (symbolizer.kind === 'Raster') {
          return symbolizer as RasterSymbolizer;
        }
      }
    }
    return null;
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
