// src/components/v-map-layer-geojson/v-map-layer-geojson.tsx
import { Component, Prop, Element, Method } from '@stencil/core';

import type { VMapLayer } from '../../types/vmaplayer';
//import type { VMapEvents, MapProviderDetail } from '../../utils/events';
import type { MapProvider } from '../../types/mapprovider';
//import type { Flavour } from '../../types/flavour';
//import type { ProviderOptions } from '../../types/provideroptions';
//import type { LayerConfig } from '../../types/layerconfig';
//import type { LonLat } from '../../types/lonlat';
//import type { CssMode } from '../../types/cssmode';
import type { StyleConfig } from '../../types/styleconfig';

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
