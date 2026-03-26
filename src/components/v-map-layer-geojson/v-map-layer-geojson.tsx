import {
  Component,
  h,
  Element,
  Method,
  Prop,
  Watch,
  Listen,
} from '@stencil/core';
import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import { log, warn } from '../../utils/logger';
import MSG from '../../utils/messages';
import { Style } from 'geostyler-style';
import { isGeoStylerStyle, StyleEvent } from '../../types/styling';
import type { StyleConfig } from '../../types/styleconfig';

const MSG_COMPONENT: string = 'v-map-layer-geojson - ';

@Component({
  tag: 'v-map-layer-geojson',
  shadow: true,
})
export class VMapLayerGeoJSON {
  @Element() el!: HTMLElement;

  /** Prop, die du intern nutzt/weiterverarbeitest */
  @Prop({ mutable: true }) geojson?: string;

  /**
   * URL to fetch GeoJSON data from. Alternative to providing data via slot.
   */
  @Prop({ reflect: true }) url: string | null = null;

  /**
   * Whether the layer is visible on the map.
   */
  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Z-index for layer stacking order. Higher values render on top.
   */
  @Prop({ reflect: true }) zIndex: number = 1000;

  /**
   * Opazität der geojson-Kacheln (0–1).
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1.0;

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

  private geoSlot?: HTMLSlotElement;
  private mo?: MutationObserver;
  private lastString?: string;
  private layerId: string | null = null;
  private didLoad: boolean = false;

  private helper!: VMapLayerHelper;
  private appliedGeostylerStyle?: Style;

  /**
   * Returns the internal layer ID used by the map provider.
   */
  @Method()
  async getLayerId() {
    return this.layerId;
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
    // Slot referenzieren
    this.geoSlot = this.el.shadowRoot!.querySelector(
      'slot[name="geojson"]',
    ) as HTMLSlotElement;

    if (this.geoSlot) {
      // 1) Auf Slot-Zuweisungswechsel reagieren
      this.geoSlot.addEventListener('slotchange', this.onSlotChange);

      // 2) Initial lesen + zugewiesene Nodes beobachten
      this.observeAssignedNodes();
      this.readGeoJsonFromSlot();
    }

    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);

    await this.applyExistingStyles();

    this.didLoad = true;
    //todo    this.ready.emit();
  }

  async disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
    this.mo?.disconnect();
    this.geoSlot?.removeEventListener('slotchange', this.onSlotChange);
    this.helper.removeLayer();
  }

  isReady(): boolean {
    return this.didLoad;
  }

  @Watch('geojson')
  async onGeoJsonChanged(oldValue: string, newValue: string) {
    log(MSG_COMPONENT + 'onGeoJsonChanged');
    // hier deinen Layer aktualisieren
    if (oldValue !== newValue) {
      let geojsonString: string | null = null;
      if (typeof this.geojson === 'object') {
        geojsonString = JSON.stringify(this.geojson);
      } else if (typeof this.geojson === 'string') {
        geojsonString = this.geojson;
      }
      await this.helper?.updateLayer({
        type: 'geojson',
        data: {
          geojson: geojsonString,
        },
      });
      //     await this.helper.initLayer(() => this.createLayerConfig());
    }
  }

  @Watch('url')
  async onUrlChanged(oldValue: string, newValue: string) {
    log(MSG_COMPONENT + 'onUrlChanged');
    if (oldValue !== newValue) {
      await this.helper?.updateLayer({
        type: 'geojson',
        data: {
          url: this.url,
        },
      });
    }
    //    if (oldValue !== newValue) {
    //      await this.helper.initLayer(() => this.createLayerConfig());
    //    }
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
      type: 'geojson',
      data: {
        geojson: this.geojson,
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
      await this.updateLayerWithGeostylerStyle();
    }
  }

  // private isGeostylerFormat(styleComponent: HTMLVMapStyleElement): boolean {
  //   const format = styleComponent.format?.toLowerCase();
  //   return (
  //     format === 'sld' ||
  //     format === 'mapbox-gl' ||
  //     format === 'qgis' ||
  //     format === 'lyrx'
  //   );
  // }

  /**
   * Update the layer with the applied geostyler style
   */
  private async updateLayerWithGeostylerStyle() {
    if (!this.appliedGeostylerStyle || !this.helper) return;

    await this.helper.updateLayer({
      type: 'geojson',
      data: {
        geojson: this.geojson,
        url: this.url,
        geostylerStyle: this.appliedGeostylerStyle,
      },
    });
  }

  private onSlotChange = () => {
    log(MSG_COMPONENT + 'onSlotChange');
    this.observeAssignedNodes();
    this.readGeoJsonFromSlot();
  };

  private observeAssignedNodes() {
    log(MSG_COMPONENT + 'observeAssignedNodes');
    this.mo?.disconnect();
    if (!this.geoSlot) return;
    const nodes = this.geoSlot.assignedNodes({ flatten: true });
    this.mo = new MutationObserver(() => this.readGeoJsonFromSlot());
    for (const n of nodes) {
      // Text- oder Element-Knoten beobachten (inkl. Subtree)
      this.mo.observe(n, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
  }

  private readGeoJsonFromSlot() {
    log(MSG_COMPONENT + 'readGeoJsonFromSlot');
    if (!this.geoSlot) {
      log(MSG_COMPONENT + 'readGeoJsonFromSlot - geoSlot: false');
      return;
    }
    const raw = this.geoSlot
      .assignedNodes({ flatten: true })
      .map(n => n.textContent || '')
      .join('')
      .trim();

    if (!raw) {
      log(MSG_COMPONENT + 'readGeoJsonFromSlot - raw: false');
      return; // nichts/keine Änderung
    }
    if (raw === this.lastString) {
      log(MSG_COMPONENT + 'readGeoJsonFromSlot - raw === this.lastString');
      return; // nichts/keine Änderung
    }

    this.lastString = raw;
    try {
      const geojson = JSON.parse(raw);
      log(MSG_COMPONENT + 'readGeoJsonFromSlot: ', geojson);
      this.geojson = geojson;
      // optional: eigenes Event „data-updated“ feuern
      // this.host.dispatchEvent(new CustomEvent('data-updated', { detail: this.geojson }));
    } catch (e) {
      warn(MSG_COMPONENT + 'Ungültiges JSON im Slot:', e);
    }
  }

  private createLayerConfig(): LayerConfig {
    // Parse iconSize string to array
    const iconSizeArray = this.iconSize
      ? (this.iconSize.split(',').map(s => parseInt(s.trim(), 10)) as [
          number,
          number,
        ])
      : undefined;
    let geojsonString: string | null = null;
    if (typeof this.geojson === 'object') {
      geojsonString = JSON.stringify(this.geojson);
    } else if (typeof this.geojson === 'string') {
      geojsonString = this.geojson;
    }

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
      type: 'geojson',
      opacity: this.opacity,
      visible: this.visible,
      zIndex: this.zIndex,
      url: this.url,
      geojson: geojsonString,
      style,
    };

    // Add geostyler style if available (takes precedence over component style props)
    if (this.appliedGeostylerStyle) {
      config.geostylerStyle = this.appliedGeostylerStyle;
    }

    return config;
  }

  render() {
    return <slot name="geojson" onSlotchange={this.onSlotChange}></slot>;
  }
}
