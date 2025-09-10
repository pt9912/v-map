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
  @Prop({ reflect: true }) url!: string;
  @Prop({ reflect: true }) layers!: string;
  @Prop({ reflect: true }) styles?: string;
  @Prop({ reflect: true }) format: string = 'image/png';
  @Prop({ reflect: true }) transparent: boolean = true;
  @Prop({ reflect: true }) tiled: boolean = true;
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
