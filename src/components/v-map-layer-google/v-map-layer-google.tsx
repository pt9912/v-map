// src/components/v-map-layer-google/v-map-layer-google.tsx
import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import type { MapProvider } from '../v-map/map-provider/map-provider';
import { VMapEvents, type MapProviderDetail } from '../../utils/events';

/**
 * Google Maps Basemap Layer
 */
@Component({
  tag: 'v-map-layer-google',
  styleUrl: 'v-map-layer-google.css',
  shadow: true,
})
export class VMapLayerGoogle {
  @Element() el!: HTMLElement;
  @Prop({ reflect: true }) mapType:
    | 'roadmap'
    | 'satellite'
    | 'terrain'
    | 'hybrid' = 'roadmap';
  @Prop({ reflect: true }) apiKey?: string;
  @Prop({ reflect: true }) language?: string;
  @Prop({ reflect: true }) region?: string;
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
      type: 'google',
      mapType: this.mapType,
      apiKey: this.apiKey,
      language: this.language,
      region: this.region,
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
