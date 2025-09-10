// src/components/v-map-layer-xyz/v-map-layer-xyz.tsx
import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { VMapEvents, type MapProviderDetail } from '../../utils/events';

import type { MapProvider } from '../../types/mapprovider';
//import type { Flavour } from '../../types/flavour';
//import type { ProviderOptions } from '../../types/provideroptions';
//import type { LayerConfig } from '../../types/layerconfig';
//import type { LonLat } from '../../types/lonlat';
//import type { CssMode } from '../../types/cssmode';

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
  private mapProvider?: MapProvider;

  async connectedCallback() {
    const mapEl = this.el.closest('v-map') as HTMLElement | null;
    if (!mapEl) return;
    await customElements.whenDefined('v-map');
    mapEl.addEventListener(VMapEvents.MapProviderReady, ((
      ev: CustomEvent<MapProviderDetail>,
    ) => {
      const provider = ev.detail.mapProvider as MapProvider;
      this.mapProvider = provider;
      this.attach().catch(console.error);
    }) as EventListener);
  }

  private async attach() {
    await this.mapProvider.addLayer({
      type: 'xyz',
      url: this.url,
      attributions: this.attributions,
      maxZoom: this.maxZoom,
      tileSize: this.tileSize,
      subdomains: this.subdomains ? this.subdomains.split(',') : undefined,
      visible: this.visible,
      opacity: this.opacity,
    } as any);
  }

  async componentDidLoad() {
    this.ready.emit();
  }
  render() {
    return;
  }
}
