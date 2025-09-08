// src/components/v-map-layer-geojson/v-map-layer-geojson.tsx
import { Component, Prop, Element, Method } from '@stencil/core';
import { MapProvider, StyleConfig } from '../v-map/map-provider/map-provider';
import { VMapLayer } from '../../types/vmaplayer';

@Component({
  tag: 'v-map-layer-geojson',
  styleUrl: 'v-map-layer-geojson.css',
  shadow: true,
})
export class VMapLayerGeoJSON implements VMapLayer {
  @Element() el: HTMLElement;

  @Prop() visible: boolean = true;
  @Prop() opacity: number = 1.0;

  @Prop() url: string;
  @Prop() vectorStyle?: StyleConfig;

  @Method()
  async addToMap(mapElement: HTMLVMapElement) {
    const mapProvider: MapProvider = await mapElement.getMapProvider();
    const group = this.el.closest('v-map-layer-group');

    if (group) {
      // Layer zur Gruppe hinzufügen
      await (group as HTMLVMapLayerGroupElement).addLayer({
        type: 'geojson',
        url: this.url,
        style: this.vectorStyle,
      });
    } else {
      // Layer direkt zur Karte hinzufügen
      mapProvider.addLayer({
        type: 'geojson',
        url: this.url,
        style: this.vectorStyle,
      });
    }
  }
}
