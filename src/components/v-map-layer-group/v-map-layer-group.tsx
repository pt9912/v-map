import { Component, Prop, Element, h, Method } from '@stencil/core';
import type { MapProvider } from '../../types/mapprovider';
import type { LayerConfig } from '../../types/layerconfig';

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
  }

  async componentDidLoad() {
    console.log('v-map-layer-group - componentDidLoad');
  }

  async componentWillRender() {
    console.log('v-map-layer-group - componentWillRender');
  }

  /**
   * Fügt ein Kind-Layer zur Gruppe hinzu.
   * @param layer Layer-Element (Web Component)
   */
  @Method()
  async addLayer(layerConfig: LayerConfig): Promise<string> {
    const mapElement = this.el.closest('v-map') as HTMLVMapElement | null;
    const mapProvider: MapProvider = await mapElement?.getMapProvider?.();
    if (!mapProvider) throw new Error('Map-Provider nicht verfügbar.');

    return await mapProvider.addLayer({
      ...layerConfig,
      groupId: this.groupId,
    });
  }

  render() {
    return <slot />;
  }
}
