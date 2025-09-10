// src/components/v-map-layer-wms/v-map-layer-wms.tsx
import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { VMapEvents, type MapProviderDetail } from '../../utils/events';
import type { MapProvider } from '../../types/mapprovider';

/**
 * OGC WMS Layer
 */
@Component({
  tag: 'v-map-layer-wms',
  styleUrl: 'v-map-layer-wms.css',
  shadow: true,
})
export class VMapLayerWms {
  @Element() el!: HTMLElement;
  
/**
 * Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).
 */
@Prop({ reflect: true }) url!: string;
  
/**
 * Kommagetrennte Layer-Namen (z. B. "topp:states").
 */
@Prop({ reflect: true }) layers!: string;
  
/**
 * WMS-`STYLES` Parameter (kommagetrennt).
 * @default ""
 */
@Prop({ reflect: true }) styles?: string;
  
/**
 * Bildformat des GetMap-Requests.
 * @default "image/png"
 */
@Prop({ reflect: true }) format: string = 'image/png';
  
/**
 * Transparente Kacheln anfordern.
 * @default true
 */
@Prop({ reflect: true }) transparent: boolean = true;
  
/**
 * Tiled/geslicete Requests verwenden (falls Server unterstützt).
 * @default true
 */
@Prop({ reflect: true }) tiled: boolean = true;
  
/**
 * Sichtbarkeit des WMS-Layers.
 * @default true
 */
@Prop({ reflect: true }) visible: boolean = true;
  
/**
 * Globale Opazität des WMS-Layers (0–1).
 * @default 1
 */
@Prop({ reflect: true }) opacity: number = 1.0;
  
/**
 * Signalisiert, dass der WMS-Layer bereit ist.
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
      type: 'wms',
      url: this.url,
      layers: this.layers,
      params: {
        styles: this.styles,
        format: this.format,
        transparent: this.transparent,
        tiled: this.tiled,
      },
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
