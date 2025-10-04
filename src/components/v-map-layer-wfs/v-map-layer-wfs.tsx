import { Component, Prop, Element, Method, State, Watch, Listen, h } from '@stencil/core';
import { LayerConfig } from 'src/components';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import { log } from '../../utils/logger';
import { Style } from 'geostyler-style';
import { isGeoStylerStyle, StyleEvent } from '../../types/styling';

const MSG_COMPONENT = 'v-map-layer-wfs - ';

@Component({
  tag: 'v-map-layer-wfs',
  styleUrl: 'v-map-layer-wfs.css',
  shadow: true,
})
export class VMapLayerWfs {
  @Element() el!: HTMLElement;

  /** WFS Endpunkt (z. B. https://server/wfs). */
  @Prop({ reflect: true }) url!: string;

  /** Feature-Typ (typeName) des WFS. */
  @Prop({ reflect: true }) typeName!: string;

  /** WFS Version, Standard 1.1.0. */
  @Prop({ reflect: true }) version: string = '1.1.0';

  /** Ausgabeformat, z. B. application/json. */
  @Prop({ reflect: true }) outputFormat: string = 'application/json';

  /** Ziel-Referenzsystem, Standard EPSG:3857. */
  @Prop({ reflect: true }) srsName: string = 'EPSG:3857';

  /** Zusätzliche Parameter als JSON-String. */
  @Prop({ reflect: true }) params?: string;

  /** Sichtbarkeit des Layers. */
  @Prop({ reflect: true }) visible: boolean = true;

  /** Opazität (0–1). */
  @Prop({ reflect: true }) opacity: number = 1;

  /** Z-Index für Rendering. */
  @Prop({ reflect: true }) zIndex: number = 1000;

  @State() private didLoad = false;

  private helper: VMapLayerHelper;
  private appliedGeostylerStyle?: Style;

  componentWillLoad() {
    log(MSG_COMPONENT + 'componentWillLoad');
    this.helper = new VMapLayerHelper(this.el);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + 'componentDidLoad');
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
    await this.applyExistingStyles();
    this.didLoad = true;
  }

  async disconnectedCallback() {
    log(MSG_COMPONENT + 'disconnectedCallback');
    await this.helper?.removeLayer();
  }

  /** Gibt `true` zurück, sobald der Layer initialisiert wurde. */
  @Method()
  async isReady(): Promise<boolean> {
    return this.didLoad;
  }

  @Watch('visible')
  async onVisibleChanged() {
    if (!this.didLoad) return;
    await this.helper?.setVisible(this.visible);
  }

  @Watch('opacity')
  async onOpacityChanged() {
    if (!this.didLoad) return;
    await this.helper?.setOpacity(this.opacity);
  }

  @Watch('zIndex')
  async onZIndexChanged() {
    if (!this.didLoad) return;
    await this.helper?.setZIndex(this.zIndex);
  }

  @Watch('url')
  @Watch('typeName')
  @Watch('version')
  @Watch('outputFormat')
  @Watch('srsName')
  @Watch('params')
  async onSourceChanged() {
    if (!this.didLoad) return;
    await this.helper?.updateLayer({
      type: 'wfs',
      data: this.createLayerConfig(),
    });
  }

  private parseParams(): Record<string, string | number | boolean> | undefined {
    if (!this.params) return undefined;
    try {
      const parsed = JSON.parse(this.params);
      if (parsed && typeof parsed === 'object') {
        return parsed as Record<string, string | number | boolean>;
      }
    } catch (error) {
      log(MSG_COMPONENT + 'Invalid params JSON, ignoring', error);
    }
    return undefined;
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
      type: 'wfs',
      data: {
        url: this.url,
        typeName: this.typeName,
        version: this.version,
        outputFormat: this.outputFormat,
        srsName: this.srsName,
        params: this.parseParams(),
        geostylerStyle: this.appliedGeostylerStyle,
      },
    });
  }

  private createLayerConfig(): LayerConfig {
    const config: Extract<LayerConfig, { type: 'wfs' }> = {
      type: 'wfs',
      url: this.url,
      typeName: this.typeName,
      version: this.version,
      outputFormat: this.outputFormat,
      srsName: this.srsName,
      params: this.parseParams(),
      visible: this.visible,
      opacity: this.opacity,
      zIndex: this.zIndex,
    };

    // Add geostyler style if available
    if (this.appliedGeostylerStyle) {
      config.geostylerStyle = this.appliedGeostylerStyle;
    }

    return config;
  }

  render() {
    return <slot></slot>;
  }
}
