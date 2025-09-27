// src/components/v-map-layer-wkt/v-map-layer-wkt.tsx
import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';

import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const MSG_COMPONENT: string = 'v-map-layer-wkt - ';

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

  async connectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
  }

  // private wktToGeoJSON(wkt: string): any {
  //   const s = wkt.trim().toUpperCase();
  //   if (s.startsWith('POINT')) {
  //     const inside = wkt
  //       .substring(wkt.indexOf('(') + 1, wkt.lastIndexOf(')'))
  //       .trim();
  //     const [x, y] = inside.split(/[\s]+/).map(parseFloat);
  //     return {
  //       type: 'Feature',
  //       geometry: { type: 'Point', coordinates: [x, y] },
  //       properties: {},
  //     };
  //   }
  //   if (s.startsWith('LINESTRING')) {
  //     const inside = wkt
  //       .substring(wkt.indexOf('(') + 1, wkt.lastIndexOf(')'))
  //       .trim();
  //     const coords = inside
  //       .split(',')
  //       .map(p => p.trim().split(/[\s]+/).map(parseFloat));
  //     return {
  //       type: 'Feature',
  //       geometry: { type: 'LineString', coordinates: coords },
  //       properties: {},
  //     };
  //   }
  //   if (s.startsWith('POLYGON')) {
  //     const inside = wkt
  //       .substring(wkt.indexOf('(') + 1, wkt.lastIndexOf(')'))
  //       .trim();
  //     const rings = inside.split('),(').map(r => r.replace(/[()]/g, '').trim());
  //     const coords = rings.map(r =>
  //       r.split(',').map(p => p.trim().split(/[\s]+/).map(parseFloat)),
  //     );
  //     return {
  //       type: 'Feature',
  //       geometry: { type: 'Polygon', coordinates: coords },
  //       properties: {},
  //     };
  //   }
  //   return { type: 'FeatureCollection', features: [] };
  // }

  // private async resolveGeoJsonUrl(): Promise<string | null> {
  //   if (this.url) {
  //     if (this.url.endsWith('.geojson') || this.url.endsWith('.json'))
  //       return this.url;
  //     const res = await fetch(this.url);
  //     if (!res.ok) throw new Error('WKT fetch failed: ' + res.status);
  //     const text = await res.text();
  //     const gj = this.wktToGeoJSON(text);
  //     const blob = new Blob([JSON.stringify(gj)], {
  //       type: 'application/geo+json',
  //     });
  //     return URL.createObjectURL(blob);
  //   }
  //   if (this.wkt) {
  //     const gj = this.wktToGeoJSON(this.wkt);
  //     const blob = new Blob([JSON.stringify(gj)], {
  //       type: 'application/geo+json',
  //     });
  //     return URL.createObjectURL(blob);
  //   }
  //   return null;
  // }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);

    this.ready.emit();
  }
  render() {
    return;
  }
}
