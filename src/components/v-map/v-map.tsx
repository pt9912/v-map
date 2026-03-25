// src/components/v-map/v-map.tsx
import {
  Component,
  Prop,
  Element,
  h,
  Method,
  Event,
  EventEmitter,
  Watch,
} from '@stencil/core';

import { createProvider } from '../../map-provider/provider-factory';

import type { Flavour } from '../../types/flavour';
import type { MapProvider } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';

import type { LonLat } from '../../types/lonlat';
import type { CssMode } from '../../types/cssmode';
import type { MapInitOptions } from '../../types/mapinitoptions';

import { ensureImportMap } from '../../lib/ensure-importmap';

import { VMapEvents, type MapProviderDetail } from '../../utils/events';
import { watchElementResize, Unsubscribe } from '../../utils/dom-env';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const NOOP_PROVIDER: MapProvider = {
  async init() {},
  async destroy() {},
  async setOpacity() {},
  async setVisible() {},
  async setZIndex() {},
  async addLayerToGroup() {
    return null;
  },
  async updateLayer() {},
  async removeLayer() {},
  async setView() {},
  async addBaseLayer() {
    return null;
  },
  async setBaseLayer() {},
  async ensureGroup() {},
  async setGroupVisible() {},
};

const MSG_COMPONENT: string = 'v-map - ';

@Component({
  tag: 'v-map',
  styleUrl: 'v-map.css',
  shadow: true,
})
export class VMap {
  @Element() el!: HTMLElement;

  /**
   * Zu verwendender Karten-Provider.
   * Unterstützte Werte: "ol" | "leaflet" | "cesium" | "deck".
   * @default "ol"
   * @example
   * <v-map flavour="leaflet"></v-map>
   */
  @Prop({ reflect: true }) flavour: Flavour = 'ol';

  /**
   * Mittelpunkt der Karte im **WGS84**-Koordinatensystem.
   * Erwartet [lon, lat] (Längengrad, Breitengrad).
   * @default [0, 0]
   * @example
   * <v-map center="[11.5761, 48.1371]" zoom="12"></v-map>
   */
  @Prop() center: string = '0,0';

  /**
   * Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20).
   * @default 3
   */
  @Prop() zoom: number = 2;

  /** Falls true, injiziert v-map automatisch die Import-Map. */
  @Prop() useDefaultImportMap: boolean = true;

  /**
   * Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts).
   * Bei `true` werden keine Provider initialisiert.
   * @default false
   */
  @Prop() cssMode: CssMode = 'cdn';

  /**
   * Wird ausgelöst, sobald der Karten-Provider initialisiert wurde und Layers entgegennimmt.
   * `detail` enthält `{ provider, flavour }`.
   * @event mapProviderReady
   */
  @Event({
    eventName: VMapEvents.MapProviderReady,
    bubbles: true,
    composed: false,
    cancelable: true, // optional, falls Parent „abbrechen“ können soll
  })
  mapProviderReady!: EventEmitter<MapProviderDetail>;

  // KEIN @State – keine Re-Renders nötig
  private mapProvider!: MapProvider;
  private mapState: string = 'unavailable';
  private mapContainer!: HTMLDivElement;
  private unsubscribeResize: Unsubscribe;

  @Watch('flavour')
  async onFlavourChanged(oldValue: string, newValue: string) {
    log(MSG_COMPONENT + 'onFlavourChanged');
    if (oldValue !== newValue) {
      this.reset();
      // await this.createMap();
    }
  }

  private reset() {
    this.unsubscribeResize?.();

    const mapProvider = this.mapProvider;
    this.mapProvider = null;

    const payLoad: MapProviderDetail = {
      mapProvider: NOOP_PROVIDER,
    };
    // this.mapProviderReady.emit(payLoad);
    this.el.dispatchEvent(
      new CustomEvent(VMapEvents.MapProviderWillShutdown, {
        detail: payLoad, // deine Payload
        bubbles: false, // blubbert nach oben
        composed: false, // geht über Shadow-Grenzen
        cancelable: true, // Parent kann preventDefault() aufrufen
      }),
    );

    mapProvider?.destroy();
    this.mapState = 'unavailable';
  }

  private async createMap() {
    this.mapContainer = this.ensureContainer();
    if (this.mapState === 'creating') {
      log('Map already in creating state.');
      return;
    }
    this.mapState = 'creating';
    this.mapProvider = await createProvider(this.flavour);
    let mapInitOpts: MapInitOptions = { zoom: this.zoom };
    if (this.center) {
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
      mapInitOpts.center = centerLL;
    }
    const opts: ProviderOptions = {
      target: this.mapContainer,
      shadowRoot: this.el.shadowRoot!,
      mapInitOptions: mapInitOpts,
      cssMode: this.cssMode,
    };
    await this.mapProvider.init(opts);
    this.mapState = 'available';
    this.unsubscribeResize = watchElementResize(this.el, async () => {
      await this.mapProvider?.setView(mapInitOpts.center, mapInitOpts.zoom);
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
  }

  async componentWillLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_LOAD);
    if (this.useDefaultImportMap) {
      log(MSG_COMPONENT + MSG.COMPONENT_WILL_LOAD + ' - useDefaultImportMap');
      ensureImportMap();
    }
  }

  // async componentDidLoad() {
  //   log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);

  //   //test
  // }

  async componentWillRender() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_RENDER);
  }

  async componentDidRender() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_RENDER);

    await this.createMap();

    this.el.addEventListener(VMapEvents.MapProviderReady, ((
      event: CustomEvent<MapProviderDetail>,
    ) => {
      log(MSG_COMPONENT + 'test - event: ', event);
    }) as EventListener);
  }

  disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
    this.reset();
  }

  /**
   * Liefert die aktive Provider-Instanz (z. B. OL-, Leaflet- oder Deck-Wrapper).
   * Nützlich für fortgeschrittene Integrationen.
   * @returns Promise mit der Provider-Instanz oder `undefined`, falls noch nicht bereit.
   */
  @Method()
  async getMapProvider(): Promise<MapProvider> {
    if (!this.mapProvider || this.mapProvider == NOOP_PROVIDER) {
      //throw new Error('Map-Provider noch nicht initialisiert.');
      log(MSG_COMPONENT + 'Map provider not yet ready.');
    }
    return this.mapProvider;
  }

  /**
   * Setzt Kartenzentrum und Zoom (optional animiert).
   * @param center [lon, lat] in WGS84
   * @param zoom   Zoomstufe
   * @param options Zusätzliche Optionen (z. B. { animate: true, duration: 300 })
   * @example
   * await mapEl.setView([7.1, 50.7], 10, { animate: true, duration: 400 });
   */
  @Method()
  async setView(coordinates: [number, number], zoom: number): Promise<void> {
    if (!this.mapProvider || this.mapProvider == NOOP_PROVIDER)
      throw new Error(MSG_COMPONENT + 'Map-Provider noch nicht initialisiert.');
    await Promise.resolve(this.mapProvider?.setView(coordinates, zoom));
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
    log(MSG_COMPONENT + MSG.COMPONENT_RENDER);
    //return <div id="map-container"></div>;
    return (
      <div>
        <slot></slot>
      </div>
    );
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
