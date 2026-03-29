// src/components/v-map-layer-scatterplot/v-map-layer-scatterplot.tsx
import { Component, Prop, Element, Event, EventEmitter, Method } from '@stencil/core';

import MSG from '../../utils/messages';
import { log } from '../../utils/logger';
import type { VMapErrorDetail } from '../../utils/events';
import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper, type VMapErrorHost } from '../../layer/v-map-layer-helper';

const MSG_COMPONENT: string = 'v-map-layer-scatterplot - ';

export type Color = string | [number, number, number, number?];

@Component({
  tag: 'v-map-layer-scatterplot',
  styleUrl: 'v-map-layer-scatterplot.css',
  shadow: true,
})
export class VMapLayerScatterplot implements VMapErrorHost {
  @Element() el!: HTMLElement;

  @Prop({ attribute: 'load-state', reflect: true, mutable: true })
  loadState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

  /**
   * Datenquelle für Punkte. Erwartet Objekte mit mindestens
   * einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.
   */
  @Prop({ reflect: true }) data?: string; // inline JSON array

  /**
   * Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.
   */
  @Prop({ reflect: true }) url?: string; // external source

  /**
   * Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe
   * z. B. [r,g,b] oder CSS-Farbe (providerabhängig).
   */
  @Prop({ reflect: true }) getFillColor: Color = '#3388ff';

  /**
   * Funktion/konstanter Wert für den Punkt-Radius.
   * @default 4
   */
  @Prop({ reflect: true }) getRadius: number = 1000;

  /**
   * Globale Opazität (0–1).
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1.0;

  /**
   * Sichtbarkeit des Layers.
   * @default true
   */
  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Wird ausgelöst, sobald der Scatterplot registriert wurde.
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

  private createLayerConfig(): LayerConfig {
    return {
      type: 'scatterplot',
      data: this.data,
      getFillColor: this.getFillColor,
      getRadius: this.getRadius,
      opacity: this.opacity,
      visible: this.visible,
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
