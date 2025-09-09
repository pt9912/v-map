// src/components/v-map/v-map.tsx
import {
  Component,
  Prop,
  Element,
  h,
  Method,
  Event,
  EventEmitter,
} from '@stencil/core';
//import { MapProviderFactory } from './map-provider/map-provider';
import type { Flavour } from './map-provider/provider-factory';
import { createProvider } from './map-provider/provider-factory';
import type {
  MapProvider,
  MapInitOptions,
  LonLat,
  ProviderOptions,
  CssMode,
} from './map-provider/map-provider';
import { ensureImportMap } from '../../lib/ensure-importmap';

import { VMapEvents, MapProviderDetail } from '../../utils/events';
import { watchElementResize, Unsubscribe } from '../../utils/dom-env';

@Component({
  tag: 'v-map',
  styleUrl: 'v-map.css',
  shadow: true,
})
export class VMap {
  @Element() el!: HTMLElement;

  @Prop() flavour: Flavour = 'ol';
  @Prop() center: string = '0,0';
  @Prop() zoom: number = 2;

  /** Falls true, injiziert v-map automatisch die Import-Map. */
  @Prop() useDefaultImportMap: boolean = true;

  @Prop() cssMode: CssMode = 'cdn';

  @Event({
    eventName: VMapEvents.MapProviderReady,
    bubbles: true,
    composed: false,
    cancelable: true, // optional, falls Parent „abbrechen“ können soll
  })
  mapProviderReady!: EventEmitter<MapProviderDetail>;

  // KEIN @State – keine Re-Renders nötig
  private mapProvider!: MapProvider;
  private mapContainer!: HTMLDivElement;
  private unsubscribeResize: Unsubscribe;

  async componentWillLoad() {
    console.log('v-map - componentWillLoad');
    if (this.useDefaultImportMap) {
      ensureImportMap();
    }
  }

  async componentDidLoad() {
    console.log('v-map - componentDidLoad');

    //test
    this.el.addEventListener(VMapEvents.MapProviderReady, ((
      event: CustomEvent<MapProviderDetail>,
    ) => {
      console.log('v-map - test - event: ', event);
    }) as EventListener);

    this.mapContainer = this.ensureContainer();
    this.mapProvider = await createProvider(this.flavour);
    const centerLL: LonLat = this.center.split(',').map(parseFloat) as [
      number,
      number,
    ];
    const [centerLon, centerLat] = centerLL;
    if (!Number.isFinite(centerLon) || !Number.isFinite(centerLat)) {
      throw new Error(
        `<v-map>: Ungültiges center-Prop: "${this.center}" (erwartet "lon,lat")`,
      );
    }
    const mapInitOpts: MapInitOptions = { center: centerLL, zoom: this.zoom };
    const opts: ProviderOptions = {
      target: this.mapContainer,
      shadowRoot: this.el.shadowRoot!,
      mapInitOptions: mapInitOpts,
      cssMode: this.cssMode,
    };
    await this.mapProvider.init(opts);

    this.unsubscribeResize = watchElementResize(this.el, () => {
      this.mapProvider.setView(mapInitOpts.center, mapInitOpts.zoom);
    });

    const payLoad: MapProviderDetail = {
      mapProvider: this.mapProvider,
    };
    // this.mapProviderReady.emit(payLoad);
    this.el.dispatchEvent(
      new CustomEvent(VMapEvents.MapProviderReady, {
        detail: payLoad, // deine Payload
        bubbles: false, // blubbert nach oben
        composed: false, // geht über Shadow-Grenzen
        cancelable: true, // Parent kann preventDefault() aufrufen
      }),
    );

    // Optional: vorhandene v-map-layer-group initialisieren (nur falls du wirklich
    // eine explizite Registrierung beim Provider willst)
    const groups = Array.from(this.el.querySelectorAll('v-map-layer-group'));
    for (const group of groups) {
      // Warten, bis das Custom Element ready ist
      const readyGroup = (await (group as any).componentOnReady?.()) ?? group;

      const groupId = (readyGroup as any).groupId as string | undefined;
      const basemap = (readyGroup as any).basemap as boolean | undefined;

      if (groupId && typeof this.mapProvider['ensureGroup'] === 'function') {
        // @ts-ignore – optionale API
        await this.mapProvider.ensureGroup(groupId, { basemap: !!basemap });
      }
    }

    // // Container holen
    // const container = this.el.shadowRoot?.querySelector(
    //   '#map-container',
    // ) as HTMLDivElement | null;
    // if (!container) throw new Error('<v-map>: #map-container nicht gefunden');
    // this.mapContainer = container;

    // await this.loadProviderCSS(this.flavour);

    // // Provider instanziieren
    // this.mapProvider = MapProviderFactory.create(this.flavour);

    // // Center parsen
    // const [lonStr, latStr] = this.center.split(',');
    // const lon = Number(lonStr);
    // const lat = Number(latStr);
    // if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
    //   throw new Error(
    //     `<v-map>: Ungültiges center-Prop: "${this.center}" (erwartet "lon,lat")`,
    //   );
    // }

    // await this.mapProvider.init(this.mapContainer, {
    //   center: [lon, lat] as [number, number],
    //   zoom: this.zoom,
    // });

    // // Optional: vorhandene v-map-layer-group initialisieren (nur falls du wirklich
    // // eine explizite Registrierung beim Provider willst)
    // const groups = Array.from(this.el.querySelectorAll('v-map-layer-group'));
    // for (const group of groups) {
    //   // Warten, bis das Custom Element ready ist
    //   const readyGroup = (await (group as any).componentOnReady?.()) ?? group;
    //   // Falls du wie vorgeschlagen eine ensureGroup-API im Provider hast:
    //   const groupId = (readyGroup as any).groupId as string | undefined;
    //   const basemap = (readyGroup as any).basemap as boolean | undefined;

    //   if (groupId && typeof this.mapProvider['ensureGroup'] === 'function') {
    //     // @ts-ignore – optionale API
    //     await this.mapProvider.ensureGroup(groupId, { basemap: !!basemap });
    //   }
    // }
  }

  disconnectedCallback() {
    console.log('v-map - disconnectedCallback');
    this.unsubscribeResize?.();
    this.mapProvider?.destroy();
  }
  /*
  @Method()
  async loadProviderCSS(flavour: string) {
    const cssUrls: Record<string, string> = {
      ol: 'https://cdn.jsdelivr.net/npm/ol@10.6.1/ol.min.css',
      cesium:
        'https://cesium.com/downloads/cesiumjs/releases/1.133/Build/Cesium/Widgets/widgets.css',
      leaflet: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
      mapbox: 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css',
      google: '', // Google Maps lädt CSS automatisch
      arcgis:
        'https://js.arcgis.com/4.24/@arcgis/core/assets/esri/themes/light/main.css',
    };

    //    if (VMap.loadedCSS[flavour]) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrls[flavour];
    this.el.shadowRoot.appendChild(link);
    //  VMap.loadedCSS[flavour] = true;
  }
    */

  @Method()
  async addLayer(layerConfig: any): Promise<void> {
    if (!this.mapProvider)
      throw new Error('Map-Provider noch nicht initialisiert.');
    await Promise.resolve(this.mapProvider.addLayer(layerConfig));
  }

  @Method()
  async getMapProvider(): Promise<MapProvider> {
    if (!this.mapProvider) {
      //throw new Error('Map-Provider noch nicht initialisiert.');
      console.log('Map-Provider noch nicht initialisiert.');
    }
    return this.mapProvider;
  }

  @Method()
  async isMapProviderAvailable(): Promise<boolean> {
    if (!this.mapProvider) return false;
    return true;
  }

  @Method()
  async setView(coordinates: [number, number], zoom: number): Promise<void> {
    if (!this.mapProvider)
      throw new Error('Map-Provider noch nicht initialisiert.');
    await Promise.resolve(this.mapProvider.setView(coordinates, zoom));
  }

  private ensureContainer() {
    let el = this.el.shadowRoot!.querySelector('#map') as HTMLDivElement;
    if (!el) {
      el = document.createElement('div');
      el.id = 'map';
      el.style.cssText =
        'position:relative;width:100%;height:100%;display:block;';
      this.el.shadowRoot!.appendChild(el);
    }
    return el;
  }

  render() {
    console.log('v-map - render');
    //return <div id="map-container"></div>;
    return <slot></slot>;
  }

  // render() {
  //   return (
  //     <div id="map-container" style={{ width: '100%', height: '100%' }}>
  //       <slot></slot>
  //     </div>
  //   );
  // }
}
/*
export interface VMap {
  flavour: 'ol' | 'cesium' | 'leaflet';
  center: string;
  zoom: number;
}
*/
