import { Component, Prop, Element, Method, State, Watch, h } from '@stencil/core';
import { LayerConfig } from 'src/components';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import { log } from '../../utils/logger';

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

  componentWillLoad() {
    log(MSG_COMPONENT + 'componentWillLoad');
    this.helper = new VMapLayerHelper(this.el);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + 'componentDidLoad');
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
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

  private createLayerConfig(): LayerConfig {
    const config: LayerConfig = {
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
    } as LayerConfig;

    return config;
  }

  render() {
    return <slot></slot>;
  }
}
