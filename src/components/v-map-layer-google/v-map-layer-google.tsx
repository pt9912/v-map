// src/components/v-map-layer-google/v-map-layer-google.tsx
import { Component, Prop, Element, Event, EventEmitter, Watch, Method } from '@stencil/core';

import { log } from '../../utils/logger';
import MSG from '../../utils/messages';
import type { VMapErrorDetail } from '../../utils/events';
import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper, type VMapErrorHost } from '../../layer/v-map-layer-helper';

const MSG_COMPONENT: string = 'v-map-layer-google - ';

/**
 * Google Maps Basemap Layer
 */
@Component({
  tag: 'v-map-layer-google',
  styleUrl: 'v-map-layer-google.css',
  shadow: true,
})
export class VMapLayerGoogle implements VMapErrorHost {
  @Element() el!: HTMLElement;

  @Prop({ attribute: 'load-state', reflect: true, mutable: true })
  loadState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

  /**
   * Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".
   * @default "roadmap"
   */
  @Prop({ reflect: true }) mapType:
    | 'roadmap'
    | 'satellite'
    | 'terrain'
    | 'hybrid' = 'roadmap';

  /**
   * Google Maps API-Schlüssel.
   * @example
   * <v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
   */
  @Prop({ reflect: true }) apiKey?: string;

  /**
   * Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").
   * @default "en"
   */
  @Prop({ reflect: true }) language?: string;

  /**
   * Region-Bias (ccTLD/Region-Code, z. B. "DE", "US").
   * Beeinflusst Labels/Suchergebnisse.
   */
  @Prop({ reflect: true }) region?: string;

  /**
   * Sichtbarkeit des Layers.
   * @default true
   */
  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Opazität des Layers (0–1).
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1.0;

  /**
   * Scale factor for tile display.
   * @default "scaleFactor1x"
   */
  @Prop({ reflect: true }) scale?: 'scaleFactor1x' | 'scaleFactor2x' | 'scaleFactor4x';

  /**
   * Maximum zoom level for the layer.
   */
  @Prop({ reflect: true }) maxZoom?: number;

  /**
   * Custom styles for the Google Map (JSON array of styling objects).
   * Can be passed as JSON string or array.
   */
  @Prop({ mutable: true }) styles?: Record<string, unknown>[] | string;

  /**
   * Google Maps libraries to load (comma-separated string).
   * @example "geometry,places,drawing"
   */
  @Prop({ reflect: true }) libraries?: string;

  /**
   * Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
   * @event ready
   */
  @Event() ready!: EventEmitter<void>;

  private hasLoadedOnce: boolean = false;
  private helper: VMapLayerHelper;

  setLoadState(state: 'idle' | 'loading' | 'ready' | 'error') {
    this.loadState = state;
  }

  @Method()
  async getError(): Promise<VMapErrorDetail | undefined> {
    return this.helper?.getError();
  }

  @Watch('styles')
  parseStyles(newValue: Record<string, unknown>[] | string) {
    if (typeof newValue === 'string') {
      try {
        const parsed = JSON.parse(newValue);
        // Update the prop with the parsed array
        this.styles = parsed;
      } catch (e) {
        this.helper?.setError({ type: 'parse', message: 'Invalid JSON in styles attribute', attribute: 'styles', cause: e });
      }
    }
  }

  private createLayerConfig(): LayerConfig {
    return {
      type: 'google',
      apiKey: this.apiKey ?? '',
      mapType: this.mapType,
      language: this.language,
      region: this.region,
      visible: this.visible,
      opacity: this.opacity,
      scale: this.scale,
      maxZoom: this.maxZoom,
      styles: this.styles,
      libraries: this.libraries ? this.libraries.split(',').map(s => s.trim()) : undefined,
    };
  }

  async connectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
    // Parse styles on initial load if they are a string
    if (typeof this.styles === 'string') {
      this.parseStyles(this.styles);
    }
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
