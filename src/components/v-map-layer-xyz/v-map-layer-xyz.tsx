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
  @Prop({ reflect: true }) url!: string;
  @Prop({ reflect: true }) attributions?: string;
  @Prop({ reflect: true }) maxZoom?: number;
  @Prop({ reflect: true }) tileSize?: number;
  @Prop({ reflect: true }) subdomains?: string;
  @Prop({ reflect: true }) visible: boolean = true;
  @Prop({ reflect: true }) opacity: number = 1.0;
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
