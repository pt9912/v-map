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
import type { VMapErrorHost } from '../../layer/v-map-layer-helper';
import { log } from '../../utils/logger';
import type { VMapErrorDetail } from '../../utils/events';

const MSG_COMPONENT = 'v-map-layer-wcs - ';

@Component({
  tag: 'v-map-layer-wcs',
  styleUrl: 'v-map-layer-wcs.css',
  shadow: true,
})
export class VMapLayerWcs implements VMapErrorHost {
  @Element() el!: HTMLElement;

  /** Current load state of the layer. */
  @Prop({ attribute: 'load-state', reflect: true, mutable: true })
  loadState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

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
  private hasLoadedOnce = false;

  private helper: VMapLayerHelper;

  setLoadState(state: 'idle' | 'loading' | 'ready' | 'error') {
    this.loadState = state;
  }

  /** Returns the last error detail, if any. */
  @Method()
  async getError(): Promise<VMapErrorDetail | undefined> {
    return this.helper?.getError();
  }

  componentWillLoad() {
    log(MSG_COMPONENT + 'componentWillLoad');
    this.helper = new VMapLayerHelper(this.el, this);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + 'componentDidLoad');
    this.helper.startLoading();
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
    this.didLoad = true;
    this.hasLoadedOnce = true;
  }

  async connectedCallback() {
    if (!this.hasLoadedOnce) return;
    this.helper.startLoading();
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
  }

  async disconnectedCallback() {
    log(MSG_COMPONENT + 'disconnectedCallback');
    await this.helper?.dispose();
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
      data: this.createLayerConfig() as Extract<LayerConfig, { type: 'wcs' }>,
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
      this.helper?.setError({ type: 'parse', message: 'Invalid params JSON', attribute: 'params', cause: error });
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
      this.helper?.setError({ type: 'parse', message: 'Invalid resolutions JSON', attribute: 'resolutions', cause: error });
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
