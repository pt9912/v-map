import { Component, Prop, Element, h, Method } from '@stencil/core';
//import { getReadyMapLayers } from '../../utils/layer-helpers';

//import type { VMapLayer } from '../../types/vmaplayer';
//import type { VMapEvents, MapProviderDetail } from '../../utils/events';
import type { MapProvider } from '../../types/mapprovider';
//import type { Flavour } from '../../types/flavour';
//import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
//import type { LonLat } from '../../types/lonlat';
//import type { CssMode } from '../../types/cssmode';

@Component({
  tag: 'v-map-layer-group',
  styleUrl: 'v-map-layer-group.css',
  shadow: true,
})
export class VMapLayerGroup {
  @Element() el!: HTMLElement;

  
/**
 * Sichtbarkeit der gesamten Gruppe.
 * @default true
 */
@Prop() visible: boolean = true;
  
/**
 * Globale Opazität (0–1) für alle Kinder.
 * @default 1
 */
@Prop() opacity: number = 1.0;

  
/**
 * Kennzeichnet diese Gruppe als Basis-Kartenebene (exklusiv sichtbar).
 * @default false
 */
@Prop() basemap = false;
  
/**
 * Eindeutige Gruppen-ID (z. B. für programmatisches Umschalten).
 */
@Prop() groupId: string = Math.random().toString(36).slice(2, 11);

  //private static loadedCSS: { [flavour: string]: boolean } = {};

  async connectedCallback() {
    console.log('v-map-layer-group - connectedCallback');
    const mapElement = this.el.closest('v-map') as HTMLVMapElement | null;
    const mapProviderAvailable: boolean =
      await mapElement?.isMapProviderAvailable?.();
    if (mapProviderAvailable) {
      const mapProvider: MapProvider = await mapElement?.getMapProvider?.();
      if (mapProvider?.ensureGroup) {
        // schöne, explizite API im Provider
        await Promise.resolve(
          mapProvider.ensureGroup(this.groupId, { basemap: this.basemap }),
        );
      }
    }
  }

  async componentWillLoad() {
    console.log('v-map-layer-group - componentWillLoad');
    /*
    const mapElement = this.el.closest('v-map') as HTMLVMapElement;
    if (!mapElement) return;

    const layers = await getReadyMapLayers(this.el);

    layers.forEach(async (layer: VMapLayer) => {
      await layer.addToMap(mapElement.el);
      //      layer.refresh(); // Neu rendern
    });
    */
  }

  async componentDidLoad() {
    console.log('v-map-layer-group - componentDidLoad');
  }

  async componentWillRender() {
    console.log('v-map-layer-osm - componentWillRender');
  }

  
/**
 * Fügt ein Kind-Layer zur Gruppe hinzu.
 * @param layer Layer-Element (Web Component)
 */
@Method()
  async addLayer(layerConfig: LayerConfig): Promise<void> {
    const mapElement = this.el.closest('v-map') as HTMLVMapElement | null;
    const mapProvider: MapProvider = await mapElement?.getMapProvider?.();
    if (!mapProvider) throw new Error('Map-Provider nicht verfügbar.');

    await Promise.resolve(
      mapProvider.addLayer({ ...layerConfig, groupId: this.groupId }),
    );
  }

  render() {
    return <slot />;
  }
}

/*
// src/components/v-map-layer-group/v-map-layer-group.tsx
import { Component, Prop, Element, State, h, Method } from '@stencil/core';

@Component({
  tag: 'v-map-layer-group',
  styleUrl: 'v-map-layer-group.css',
  shadow: true,
})
export class VMapLayerGroup {
  @Element() el: HTMLElement;
  @Prop() groupTitle: string = 'Layer Group';
  @State() private group: any;
  private static loadedCSS: { [flavour: string]: boolean } = {};

  async componentDidLoad() {
    const mapElement = this.el.closest('v-map') as HTMLVMapElement;
    if (!mapElement) return;

    await this.loadProviderCSS(mapElement.flavour);
    await this.addToMap(mapElement);

    const childLayers = Array.from(this.el.children).filter(child => child.tagName.startsWith('V-MAP-LAYER-'));
    for (const child of childLayers) {
      const layerElement = child as HTMLVMapLayerElement;
      if (layerElement.addToMap) {
        await layerElement.addToMap(mapElement, this.group);
      }
    }
  }

  @Method()
  async loadProviderCSS(flavour: 'ol' | 'cesium') {
    if (VMapLayerGroup.loadedCSS[flavour]) return;

    const cssUrl = flavour === 'ol' ? 'https://cdn.jsdelivr.net/npm/ol/ol.css' : 'https://cesium.com/downloads/cesiumjs/releases/1.108/Build/Cesium/Widgets/widgets.css';

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    this.el.shadowRoot.appendChild(link);
    VMapLayerGroup.loadedCSS[flavour] = true;
  }

  @Method()
  async addToMap(mapElement: HTMLVMapElement) {
    if (mapElement.flavour === 'ol') {
      const {
        layer: { Group },
      } = await import('ol/layer');
      this.group = new Group({ layers: [], title: this.title });
      await mapElement.addLayer(this.group);
    }
  }

  render() {
    return <slot></slot>;
  }
}
*/
