import { Component, Prop, Element, Event, EventEmitter, Method } from '@stencil/core';

import { log } from '../../utils/logger';
import MSG from '../../utils/messages';
import type { VMapErrorDetail } from '../../utils/events';
import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper, type VMapErrorHost } from '../../layer/v-map-layer-helper';

const MSG_COMPONENT: string = 'v-map-layer-xyz - ';

/**
 * XYZ Tile Layer
 */
@Component({
  tag: 'v-map-layer-xyz',
  styleUrl: 'v-map-layer-xyz.css',
  shadow: true,
})
export class VMapLayerXyz implements VMapErrorHost {
  @Element() el!: HTMLElement;

  /** Current load state of the layer. */
  @Prop({ attribute: 'load-state', reflect: true, mutable: true })
  loadState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

  /**
   * URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".
   */
  @Prop({ reflect: true }) url!: string;

  /**
   * Attributions-/Copyright-Text (HTML erlaubt).
   */
  @Prop({ reflect: true }) attributions?: string;

  /**
   * Maximaler Zoomlevel, den der Tile-Server liefert.
   * @default 19
   */
  @Prop({ reflect: true }) maxZoom?: number;

  /**
   * Größe einer Kachel in Pixeln.
   * @default 256
   */
  @Prop({ reflect: true }) tileSize?: number;

  /**
   * Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").
   */
  @Prop({ reflect: true }) subdomains?: string;

  /**
   * Sichtbarkeit des XYZ-Layers.
   * @default true
   */
  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Opazität (0–1).
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1.0;

  /**
   * Wird ausgelöst, wenn der XYZ-Layer bereit ist.
   * @event ready
   */
  @Event() ready!: EventEmitter<void>;

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

  private createLayerConfig(): LayerConfig {
    const options: Record<string, unknown> = {};
    if (this.tileSize != null) options.tileSize = this.tileSize;
    if (this.subdomains != null) options.subdomains = this.subdomains;

    return {
      type: 'xyz',
      url: this.url,
      attributions: this.attributions,
      maxZoom: this.maxZoom,
      visible: this.visible,
      opacity: this.opacity,
      ...(Object.keys(options).length > 0 ? { options } : {}),
    };
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

  render() {
    return;
  }
}
