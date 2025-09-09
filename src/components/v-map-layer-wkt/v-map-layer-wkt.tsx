// src/components/v-map-layer-wkt/v-map-layer-wkt.tsx
import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import type { MapProvider } from '../v-map/map-provider/map-provider';
import { VMapEvents, type MapProviderDetail } from '../../utils/events';

@Component({
  tag: 'v-map-layer-wkt',
  styleUrl: 'v-map-layer-wkt.css',
  shadow: true,
})
export class VMapLayerWkt {
  @Element() el!: HTMLElement;
  @Prop({ reflect: true }) wkt?: string;
  @Prop({ reflect: true }) url?: string;
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

  private wktToGeoJSON(wkt: string): any {
    const s = wkt.trim().toUpperCase();
    if (s.startsWith('POINT')) {
      const inside = wkt
        .substring(wkt.indexOf('(') + 1, wkt.lastIndexOf(')'))
        .trim();
      const [x, y] = inside.split(/[\s]+/).map(parseFloat);
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [x, y] },
        properties: {},
      };
    }
    if (s.startsWith('LINESTRING')) {
      const inside = wkt
        .substring(wkt.indexOf('(') + 1, wkt.lastIndexOf(')'))
        .trim();
      const coords = inside
        .split(',')
        .map(p => p.trim().split(/[\s]+/).map(parseFloat));
      return {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: coords },
        properties: {},
      };
    }
    if (s.startsWith('POLYGON')) {
      const inside = wkt
        .substring(wkt.indexOf('(') + 1, wkt.lastIndexOf(')'))
        .trim();
      const rings = inside.split('),(').map(r => r.replace(/[()]/g, '').trim());
      const coords = rings.map(r =>
        r.split(',').map(p => p.trim().split(/[\s]+/).map(parseFloat)),
      );
      return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: coords },
        properties: {},
      };
    }
    return { type: 'FeatureCollection', features: [] };
  }

  private async resolveGeoJsonUrl(): Promise<string | null> {
    if (this.url) {
      if (this.url.endsWith('.geojson') || this.url.endsWith('.json'))
        return this.url;
      const res = await fetch(this.url);
      if (!res.ok) throw new Error('WKT fetch failed: ' + res.status);
      const text = await res.text();
      const gj = this.wktToGeoJSON(text);
      const blob = new Blob([JSON.stringify(gj)], {
        type: 'application/geo+json',
      });
      return URL.createObjectURL(blob);
    }
    if (this.wkt) {
      const gj = this.wktToGeoJSON(this.wkt);
      const blob = new Blob([JSON.stringify(gj)], {
        type: 'application/geo+json',
      });
      return URL.createObjectURL(blob);
    }
    return null;
  }

  private async attach() {
    const url = await this.resolveGeoJsonUrl();
    if (!url) return;
    await this.mapProvider.addLayer({
      type: 'geojson',
      url,
      // @ts-ignore
      visible: this.visible,
      // @ts-ignore
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
