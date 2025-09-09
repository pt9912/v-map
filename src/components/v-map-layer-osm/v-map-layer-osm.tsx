// src/components/v-map-layer-osm/v-map-layer-osm.tsx
import {
  Component,
  Prop,
  Element,
  Method,
  Event,
  EventEmitter,
} from '@stencil/core';
import { MapProvider } from '../v-map/map-provider/map-provider';
import { VMapLayer } from '../../types/vmaplayer';
import { VMapEvents, MapProviderDetail } from '../../utils/events';

@Component({
  tag: 'v-map-layer-osm',
  styleUrl: 'v-map-layer-osm.css',
  shadow: true,
})
export class VMapLayerOSM implements VMapLayer {
  @Element() el: HTMLElement;

  @Prop() visible: boolean = true;
  @Prop() opacity: number = 1.0;

  @Event({ eventName: VMapEvents.Ready }) ready!: EventEmitter<void>;

  private didLoad: boolean = false;
  private mapProvider: MapProvider;

  isReady(): boolean {
    return this.didLoad;
  }
  /*
  @Listen(VMapEvents.MapProviderReady) // hört auf Events, die bis zum Host hochbubblen
  async onMapProviderReady(ev: CustomEvent<MapProviderDetail>) {
    console.log('v-map-layer-osm - event - MapProvider ready');
    this.mapProvider = ev.detail.mapProvider;

    await this.addToMapInternal();
  }
*/
  private async addToMapInternal() {
    if (!this.mapProvider) return;
    await this.mapProvider.addLayer({ type: 'osm' });
  }

  @Method()
  async addToMap(mapElement: HTMLVMapElement) {
    if (!this.mapProvider) {
      this.mapProvider = await mapElement.getMapProvider();
    }
    await this.addToMapInternal();
  }

  async connectedCallback() {
    console.log('v-map-layer-osm - connectedCallback');

    const mapElement = this.el.closest('v-map') as HTMLElement;
    if (!mapElement) return;

    await customElements.whenDefined('v-map');
    var vmap = mapElement;

    vmap.addEventListener(VMapEvents.MapProviderReady, (async (
      event: CustomEvent,
    ) => {
      var mapEvent: MapProviderDetail = event.detail as MapProviderDetail;
      this.mapProvider = mapEvent.mapProvider;
      await this.addToMapInternal();
    }) as EventListener);
    /*
    vmap['el'].addEventListener(VMapEvents.MapProviderReady, ((
      event: CustomEvent<MapProviderDetail>,
    ) => {
      var mapEvent: MapProviderDetail = event.detail as MapProviderDetail;
      this.mapProvider = mapEvent.mapProvider;
    }) as EventListener);
     */
  }

  async componentWillLoad() {
    console.log('v-map-layer-osm - componentWillLoad');
  }

  async componentDidLoad() {
    console.log('v-map-layer-osm - componentDidLoad');
    this.didLoad = true;
    this.ready.emit();
  }

  async componentWillRender() {
    console.log('v-map-layer-osm - componentWillRender');
  }

  render() {
    return;
  }
}
