// src/components/v-map-layer-scatterplot/v-map-layer-scatterplot.tsx
import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';

import MSG from '../../utils/messages';
import { log } from '../../utils/logger';

const MSG_COMPONENT: string = 'v-map-layer-scatterplot - ';

export type Color = string | [number, number, number, number?];

@Component({
  tag: 'v-map-layer-scatterplot',
  styleUrl: 'v-map-layer-scatterplot.css',
  shadow: true,
})
export class VMapLayerScatterplot {
  @Element() el!: HTMLElement;

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

  async connectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
  }

  // private parseInline(): any[] {
  //   if (!this.data) return [];
  //   try {
  //     const parsed = JSON.parse(this.data);
  //     return Array.isArray(parsed) ? parsed : [parsed];
  //   } catch (e) {
  //     error('<v-map-layer-scatterplot> invalid JSON in "data"', e);
  //     return [];
  //   }
  // }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);

    this.ready.emit();
  }
  render() {
    return;
  }
}
