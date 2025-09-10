// src/components/v-map-layer-scatterplot/v-map-layer-scatterplot.tsx
import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';

import { VMapEvents, type MapProviderDetail } from '../../utils/events';
import type { MapProvider } from '../../types/mapprovider';
//import type { Flavour } from '../../types/flavour';
//import type { ProviderOptions } from '../../types/provideroptions';
//import type { LayerConfig } from '../../types/layerconfig';
//import type { LonLat } from '../../types/lonlat';
//import type { CssMode } from '../../types/cssmode';

export type Color = string | [number, number, number, number?];

@Component({
  tag: 'v-map-layer-scatterplot',
  styleUrl: 'v-map-layer-scatterplot.css',
  shadow: true,
})
export class VMapLayerScatterplot {
  @Element() el!: HTMLElement;

  @Prop({ reflect: true }) data?: string; // inline JSON array
  @Prop({ reflect: true }) url?: string; // external source
  @Prop({ reflect: true }) getFillColor: Color = '#3388ff';
  @Prop({ reflect: true }) getRadius: number = 1000;
  @Prop({ reflect: true }) opacity: number = 1.0;
  @Prop({ reflect: true }) visible: boolean = true;

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

  private parseInline(): any[] {
    if (!this.data) return [];
    try {
      const parsed = JSON.parse(this.data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error('<v-map-layer-scatterplot> invalid JSON in "data"', e);
      return [];
    }
  }

  private async attach() {
    const dataSource = this.url ? this.url : this.parseInline();
    await this.mapProvider.addLayer({
      type: 'scatterplot',
      id: 'scatterplot-' + Math.random().toString(36).slice(2),
      data: dataSource,
      getFillColor: this.getFillColor as any,
      getRadius: this.getRadius,
      opacity: this.opacity,
      visible: this.visible,
    } as any);
  }

  async componentDidLoad() {
    this.ready.emit();
  }
  render() {
    return;
  }
}
