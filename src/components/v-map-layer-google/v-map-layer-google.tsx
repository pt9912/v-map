// src/components/v-map-layer-google/v-map-layer-google.tsx
import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { VMapEvents, type MapProviderDetail } from '../../utils/events';

//import type { VMapLayer } from '../../types/vmaplayer';
//import type { VMapEvents, MapProviderDetail } from '../../utils/events';
import type { MapProvider } from '../../types/mapprovider';
//import type { Flavour } from '../../types/flavour';
//import type { ProviderOptions } from '../../types/provideroptions';
//import type { LayerConfig } from '../../types/layerconfig';
//import type { LonLat } from '../../types/lonlat';
//import type { CssMode } from '../../types/cssmode';

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
 * Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
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
