import {
  Component,
  Prop,
  Element,
  Method,
  State,
  Watch,
  h,
} from '@stencil/core';
import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import { log } from '../../utils/logger';

const MSG_COMPONENT = 'v-map-layer-wcs - ';

@Component({
  tag: 'v-map-layer-wcs',
  styleUrl: 'v-map-layer-wcs.css',
  shadow: true,
})
export class VMapLayerWcs {
  @Element() el!: HTMLElement;

  /** Basis-URL des WCS-Dienstes. */
  @Prop({ reflect: true }) url!: string;

  /** Coverage-Name/ID. */
  @Prop({ reflect: true }) coverageName!: string;

  /** Ausgabeformat, z. B. image/tiff. */
  @Prop({ reflect: true }) format: string = 'image/tiff';

  /** WCS-Version. */
  @Prop({ reflect: true }) version: string = '1.1.0';

  /** Projektion (Projection) für die Quelle. */
  @Prop({ reflect: true }) projection?: string;

  /** Auflösungen als JSON-Array, z. B. [1000,500]. */
  @Prop({ reflect: true }) resolutions?: string;

  /** Zusätzliche Parameter als JSON-String. */
  @Prop({ reflect: true }) params?: string;

  /** Sichtbarkeit des Layers. */
  @Prop({ reflect: true }) visible: boolean = true;

  /** Opazität (0–1). */
  @Prop({ reflect: true }) opacity: number = 1;

  /** Z-Index für die Darstellung. */
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
  @Watch('coverageName')
  @Watch('format')
  @Watch('version')
  @Watch('projection')
  @Watch('resolutions')
  @Watch('params')
  async onSourceChanged() {
    if (!this.didLoad) return;
    await this.helper?.updateLayer({
      type: 'wcs',
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

  private parseResolutions(): number[] | undefined {
    if (!this.resolutions) return undefined;
    try {
      const parsed = JSON.parse(this.resolutions);
      if (
        Array.isArray(parsed) &&
        parsed.every(value => typeof value === 'number')
      ) {
        return parsed as number[];
      }
    } catch (error) {
      log(MSG_COMPONENT + 'Invalid resolutions JSON, ignoring', error);
    }
    return undefined;
  }

  private createLayerConfig(): LayerConfig {
    return {
      type: 'wcs',
      url: this.url,
      coverageName: this.coverageName,
      format: this.format,
      version: this.version,
      projection: this.projection,
      resolutions: this.parseResolutions(),
      params: this.parseParams(),
      visible: this.visible,
      opacity: this.opacity,
      zIndex: this.zIndex,
    } as LayerConfig;
  }

  render() {
    return <slot></slot>;
  }
}
