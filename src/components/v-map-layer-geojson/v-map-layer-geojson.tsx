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
  
/**
 * Globale Deck-/Provider-Opacity des Layers (0–1).
 * @default 1
 */
@Prop() opacity: number = 1.0;

  
/**
 * URL zu einer GeoJSON-Ressource. Alternativ kann GeoJSON
 * direkt über einen Prop/Slot gesetzt werden.
 */
@Prop() url: string;
  
/**
 * Vektor-Style-Funktion bzw. Style-Objekt (providerabhängig).
 * Erlaubt die Anpassung von Füllfarbe, Linienbreite etc.
 */
@Prop() vectorStyle?: StyleConfig;

  
/**
 * Fügt den Layer der aktuellen Karte hinzu (wird meist vom Elternelement aufgerufen).
 * @param map Referenz auf die Map/Provider-Instanz.
 */
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
