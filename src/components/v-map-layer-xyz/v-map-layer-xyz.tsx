import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';

import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const MSG_COMPONENT: string = 'v-map-layer-xyz - ';

/**
 * XYZ Tile Layer
 */
@Component({
  tag: 'v-map-layer-xyz',
  styleUrl: 'v-map-layer-xyz.css',
  shadow: true,
})
export class VMapLayerXyz {
  @Element() el!: HTMLElement;

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

  async connectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);

    this.ready.emit();
  }
  render() {
    return;
  }
}
