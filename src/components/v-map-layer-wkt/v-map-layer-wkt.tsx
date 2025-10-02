// src/components/v-map-layer-wkt/v-map-layer-wkt.tsx
import { Component, Prop, Element, Event, EventEmitter, Watch, Method, Listen } from '@stencil/core';

import type { VMapLayer } from '../../types/vmaplayer';
import { VMapEvents } from '../../utils/events';
import { LayerConfig } from 'src/components';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';
import { Style } from 'geostyler-style';

const MSG_COMPONENT: string = 'v-map-layer-wkt - ';

@Component({
  tag: 'v-map-layer-wkt',
  styleUrl: 'v-map-layer-wkt.css',
  shadow: true,
})
export class VMapLayerWkt implements VMapLayer {
  @Element() el!: HTMLElement;

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
  private helper: VMapLayerHelper;
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
  async onStyleReady(event: CustomEvent<Style>) {
    const styleComponent = event.target as HTMLVMapStyleElement;
    if (this.isTargetedByStyle(styleComponent)) {
      log(MSG_COMPONENT + 'Applying geostyler style');
      this.appliedGeostylerStyle = event.detail;
      await this.updateLayerWithGeostylerStyle();
    }
  }

  /**
   * Check if this layer is targeted by a style component
   */
  private isTargetedByStyle(styleComponent: HTMLVMapStyleElement): boolean {
    const layerTargets = styleComponent.layerTargets;
    if (!layerTargets) return false;

    const targets = layerTargets.split(',').map(id => id.trim());
    return targets.includes(this.el.id) || targets.length === 0;
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
  }

  private createLayerConfig(): LayerConfig {
    // Parse iconSize string to array
    const iconSizeArray = this.iconSize
      ? this.iconSize.split(',').map(s => parseInt(s.trim(), 10)) as [number, number]
      : undefined;

    const config: LayerConfig = {
      type: 'wkt',
      wkt: this.wkt,
      url: this.url,
      visible: this.visible,
      zIndex: this.zIndex,
      opacity: this.opacity,
      style: {
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
      },
    };

    // Add geostyler style if available (takes precedence over component style props)
    if (this.appliedGeostylerStyle) {
      (config as any).geostylerStyle = this.appliedGeostylerStyle;
    }

    return config;
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

  async disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
    this.helper.removeLayer();
  }

  render() {
    return;
  }
}
