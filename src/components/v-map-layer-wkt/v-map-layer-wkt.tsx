// src/components/v-map-layer-wkt/v-map-layer-wkt.tsx
import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { VMapEvents, type MapProviderDetail } from '../../utils/events';

import type { MapProvider } from '../../types/mapprovider';
//import type { Flavour } from '../../types/flavour';
//import type { ProviderOptions } from '../../types/provideroptions';
//import type { LayerConfig } from '../../types/layerconfig';
//import type { LonLat } from '../../types/lonlat';
//import type { CssMode } from '../../types/cssmode';

@Component({
  tag: 'v-map-layer-wkt',
  styleUrl: 'v-map-layer-wkt.css',
  shadow: true,
})
export class VMapLayerWkt {
  @Element() el!: HTMLElement;

  /**
   * WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").
   */
  @Prop({ reflect: true }) wkt?: string;

  /**
   * URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).
   */
  @Prop({ reflect: true }) url?: string;

  /**
   * Sichtbarkeit des Layers.
   * @default true
   */
  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Globale Opazität (0–1).
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1.0;

  /**
   * Signalisiert, dass das WKT-Layer initialisiert ist.
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
      type: 'wkt',
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
