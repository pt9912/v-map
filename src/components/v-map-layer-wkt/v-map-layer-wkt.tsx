// src/components/v-map-layer-wkt/v-map-layer-wkt.tsx
import {
  Component,
  Prop,
  Element,
  Event,
  EventEmitter,
  Watch,
  Method,
  Listen,
} from '@stencil/core';

import type { VMapLayer } from '../../types/vmaplayer';
import { VMapEvents } from '../../utils/events';
import type { VMapErrorDetail } from '../../utils/events';
import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import type { VMapErrorHost } from '../../layer/v-map-layer-helper';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';
import { Style } from 'geostyler-style';
import { isGeoStylerStyle, StyleEvent } from '../../types/styling';
import type { StyleConfig } from '../../types/styleconfig';

const MSG_COMPONENT: string = 'v-map-layer-wkt - ';

@Component({
  tag: 'v-map-layer-wkt',
  styleUrl: 'v-map-layer-wkt.css',
  shadow: true,
})
export class VMapLayerWkt implements VMapLayer, VMapErrorHost {
  @Element() el!: HTMLElement;

  /** Current load state of the layer. */
  @Prop({ attribute: 'load-state', reflect: true, mutable: true })
  loadState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

  /**
   * WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").
   */
  @Prop({ reflect: true }) wkt?: string;

  /**
   * URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).
   */
  @Prop({ reflect: true }) url?: string;

  /**
   * Sichtbarkeit des Layers.
   * @default true
   */
  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Globale Opazität (0–1).
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1.0;

  /**
   * Z-index for layer stacking order. Higher values render on top.
   */
  @Prop({ reflect: true }) zIndex: number = 1000;

  // ========== Styling Properties ==========

  /**
   * Fill color for polygon geometries (CSS color value)
   * @default 'rgba(0,100,255,0.3)'
   */
  @Prop({ reflect: true }) fillColor?: string;

  /**
   * Fill opacity for polygon geometries (0-1)
   * @default 0.3
   */
  @Prop({ reflect: true }) fillOpacity?: number;

  /**
   * Stroke color for lines and polygon outlines (CSS color value)
   * @default 'rgba(0,100,255,1)'
   */
  @Prop({ reflect: true }) strokeColor?: string;

  /**
   * Stroke width in pixels
   * @default 2
   */
  @Prop({ reflect: true }) strokeWidth?: number;

  /**
   * Stroke opacity (0-1)
   * @default 1
   */
  @Prop({ reflect: true }) strokeOpacity?: number;

  /**
   * Point radius for point geometries in pixels
   * @default 6
   */
  @Prop({ reflect: true }) pointRadius?: number;

  /**
   * Point color for point geometries (CSS color value)
   * @default 'rgba(0,100,255,1)'
   */
  @Prop({ reflect: true }) pointColor?: string;

  /**
   * Icon URL for point features (alternative to pointColor/pointRadius)
   */
  @Prop({ reflect: true }) iconUrl?: string;

  /**
   * Icon size as [width, height] in pixels (comma-separated string like "32,32")
   * @default "32,32"
   */
  @Prop({ reflect: true }) iconSize?: string;

  /**
   * Text property name from feature properties to display as label
   */
  @Prop({ reflect: true }) textProperty?: string;

  /**
   * Text color for labels (CSS color value)
   * @default '#000000'
   */
  @Prop({ reflect: true }) textColor?: string;

  /**
   * Text size for labels in pixels
   * @default 12
   */
  @Prop({ reflect: true }) textSize?: number;

  /**
   * Signalisiert, dass das WKT-Layer initialisiert ist.
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
  private appliedGeostylerStyle?: Style;

  @Watch('wkt')
  async onWktChanged(oldValue: string, newValue: string) {
    log(MSG_COMPONENT + 'onWktChanged');
    if (oldValue !== newValue) {
      await this.helper?.updateLayer({
        type: 'wkt',
        data: {
          wkt: this.wkt,
          url: this.url,
        },
      });
    }
  }

  @Watch('url')
  async onUrlChanged(oldValue: string, newValue: string) {
    log(MSG_COMPONENT + 'onUrlChanged');
    if (oldValue !== newValue) {
      await this.helper?.updateLayer({
        type: 'wkt',
        data: {
          wkt: this.wkt,
          url: this.url,
        },
      });
    }
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

  // ========== Styling Property Watchers ==========

  @Watch('fillColor')
  @Watch('fillOpacity')
  @Watch('strokeColor')
  @Watch('strokeWidth')
  @Watch('strokeOpacity')
  @Watch('pointRadius')
  @Watch('pointColor')
  @Watch('iconUrl')
  @Watch('iconSize')
  @Watch('textProperty')
  @Watch('textColor')
  @Watch('textSize')
  async onStyleChanged() {
    log(MSG_COMPONENT + 'onStyleChanged');
    // Trigger layer recreation with new style
    await this.helper?.updateLayer({
      type: 'wkt',
      data: {
        wkt: this.wkt,
        url: this.url,
      },
    });
  }

  /**
   * Listen for style events from v-map-style components
   */
  @Listen('styleReady', { target: 'document' })
  async onStyleReady(event: CustomEvent<StyleEvent>) {
    if (isGeoStylerStyle(event.detail.style)) {
      if (this.isTargetedByStyle(event.detail.layerIds)) {
        log(MSG_COMPONENT + 'Applying geostyler style');
        this.appliedGeostylerStyle = event.detail.style as Style;
        await this.updateLayerWithGeostylerStyle();
      }
    }
  }

  /**
   * Check if this layer is targeted by a style component
   */
  private isTargetedByStyle(layerIds?: string[]): boolean {
    if (!layerIds) return false;
    return layerIds.includes(this.el.id) || layerIds.length === 0;
  }

  private async applyExistingStyles() {
    const styleComponents = Array.from(
      document.querySelectorAll('v-map-style'),
    ) as HTMLVMapStyleElement[];

    this.appliedGeostylerStyle = undefined;
    for (const styleComponent of styleComponents) {
      const style = styleComponent.getStyle
        ? await styleComponent.getStyle()
        : undefined;
      if (!style) continue;
      if (!isGeoStylerStyle(style)) continue;

      const layerTargetIds = styleComponent.getLayerTargetIds
        ? await styleComponent.getLayerTargetIds()
        : undefined;
      if (!layerTargetIds) continue;
      if (!this.isTargetedByStyle(layerTargetIds)) continue;

      log(MSG_COMPONENT + 'Applying existing geostyler style');
      this.appliedGeostylerStyle = style as Style;
      break;
    }
    await this.updateLayerWithGeostylerStyle();
  }

  /**
   * Update the layer with the applied geostyler style
   */
  private async updateLayerWithGeostylerStyle() {
    if (!this.appliedGeostylerStyle || !this.helper) return;

    await this.helper.updateLayer({
      type: 'wkt',
      data: {
        wkt: this.wkt,
        url: this.url,
        geostylerStyle: this.appliedGeostylerStyle,
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

  async connectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
    if (!this.hasLoadedOnce) return;
    this.helper.startLoading();
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
  }

  private createLayerConfig(): LayerConfig {
    // Parse iconSize string to array
    const iconSizeArray = this.iconSize
      ? (this.iconSize.split(',').map(s => parseInt(s.trim(), 10)) as [
          number,
          number,
        ])
      : undefined;

    const style: StyleConfig = {
      fillColor: this.fillColor,
      fillOpacity: this.fillOpacity,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeOpacity: this.strokeOpacity,
      pointRadius: this.pointRadius,
      pointColor: this.pointColor,
      iconUrl: this.iconUrl,
      iconSize: iconSizeArray,
      textProperty: this.textProperty,
      textColor: this.textColor,
      textSize: this.textSize,
    };
    const config: LayerConfig = {
      type: 'wkt',
      wkt: this.wkt,
      url: this.url,
      visible: this.visible,
      zIndex: this.zIndex,
      opacity: this.opacity,
      style,
    };

    // Add geostyler style if available (takes precedence over component style props)
    if (this.appliedGeostylerStyle) {
      config.geostylerStyle = this.appliedGeostylerStyle;
    }

    return config;
  }

  async componentWillLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_LOAD);
    this.helper = new VMapLayerHelper(this.el, this);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);

    this.helper.startLoading();
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);

    await this.applyExistingStyles();

    this.hasLoadedOnce = true;
    this.didLoad = true;
    this.ready.emit();
  }

  async disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
    await this.helper?.dispose();
  }

  render() {
    return;
  }
}
