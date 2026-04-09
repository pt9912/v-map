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

import { VMapEvents, type MapProviderDetail, type MapMouseMoveDetail, type ViewChangeDetail } from '../../utils/events';
import { watchElementResize, Unsubscribe } from '../../utils/dom-env';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const NOOP_PROVIDER: MapProvider = {
  async init() { },
  async destroy() { },
  async setOpacity() { },
  async setVisible() { },
  async setZIndex() { },
  async addLayerToGroup() {
    return null;
  },
  async updateLayer() { },
  async removeLayer() { },
  async setView() { },
  async addBaseLayer() {
    return null;
  },
  async setBaseLayer() { },
  async ensureGroup() { },
  async setGroupVisible() { },
};

const MSG_COMPONENT: string = 'v-map - ';
type VMapHostElement = HTMLElement & { __vMapProvider?: MapProvider | null };

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
  private unsubscribePointerMove: (() => void) | null = null;
  private unsubscribeViewChange: (() => void) | null = null;

  // Feedback-loop guard for the bidirectional zoom/center binding.
  // When v-map calls setView() programmatically (from @Watch), the
  // provider fires its native moveend / camera.changed event, which
  // our onViewChange callback would pick up and re-dispatch as
  // vmap-view-change. Without this guard the consuming app would see
  // a "bounced" event and might re-set the prop, creating a loop.
  private _isSettingView = false;
  private _lastProgrammaticZoom: number | null = null;
  private _lastProgrammaticCenter: LonLat | null = null;

  @Watch('flavour')
  async onFlavourChanged(newValue: string, oldValue: string) {
    log(MSG_COMPONENT + 'onFlavourChanged');
    if (newValue !== oldValue) {
      this.reset();
      // await this.createMap();
    }
  }

  /**
   * When the `zoom` prop changes from outside (e.g. a slider in the
   * consuming app), update the underlying provider's view *without*
   * resetting the user's current center. We query the live center
   * from the provider via getView() because the user may have panned
   * the map since init - the original `this.center` prop is the seed
   * value, not the current state.
   */
  @Watch('zoom')
  async onZoomChanged(newValue: number, oldValue: number) {
    if (newValue === oldValue) return;
    if (this.mapState !== 'available' || !this.mapProvider) return;
    const view = this.mapProvider.getView?.();
    const currentCenter: LonLat = view?.center ?? this.parseCenter();
    log(MSG_COMPONENT + 'onZoomChanged ' + newValue);
    this._isSettingView = true;
    this._lastProgrammaticZoom = newValue;
    this._lastProgrammaticCenter = currentCenter;
    try {
      await this.mapProvider.setView(currentCenter, newValue);
    } finally {
      queueMicrotask(() => { this._isSettingView = false; });
    }
  }

  /**
   * Same idea for `center`: keep the user's current zoom intact when
   * the parent updates only the center.
   */
  @Watch('center')
  async onCenterChanged(newValue: string, oldValue: string) {
    if (newValue === oldValue) return;
    if (this.mapState !== 'available' || !this.mapProvider) return;
    const view = this.mapProvider.getView?.();
    const currentZoom = view?.zoom ?? this.zoom;
    const newCenter = this.parseCenter(newValue);
    log(MSG_COMPONENT + 'onCenterChanged ' + newValue);
    this._isSettingView = true;
    this._lastProgrammaticZoom = currentZoom;
    this._lastProgrammaticCenter = newCenter;
    try {
      await this.mapProvider.setView(newCenter, currentZoom);
    } finally {
      queueMicrotask(() => { this._isSettingView = false; });
    }
  }

  private parseCenter(raw: string = this.center): LonLat {
    const parts = raw.split(',').map(parseFloat) as [number, number];
    if (!Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) {
      throw new Error(
        `<v-map>: Ungültiges center-Prop: "${raw}" (erwartet "lon,lat")`,
      );
    }
    return parts;
  }

  private reset() {
    this.unsubscribeResize?.();
    this.unsubscribePointerMove?.();
    this.unsubscribePointerMove = null;
    this.unsubscribeViewChange?.();
    this.unsubscribeViewChange = null;

    const mapProvider = this.mapProvider;
    this.mapProvider = null;
    (this.el as VMapHostElement).__vMapProvider = null;

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
    // Guard against the *two* states where re-entering would corrupt
    // the provider:
    //   1. 'creating' — a previous componentDidRender call is still
    //      awaiting provider.init(); a second call would race against
    //      it and double-initialise.
    //   2. 'available' — the map is already up. componentDidRender
    //      fires on every Stencil re-render (e.g. when an outside
    //      slider mutates the `zoom` prop), and without this branch
    //      we would call provider.init() again on the existing
    //      container. OpenLayers tolerates that silently, but
    //      Leaflet throws "Map container is already initialized" and
    //      Deck/Cesium leak the previous instance. The @Watch
    //      handlers (onZoomChanged / onCenterChanged) are responsible
    //      for propagating prop changes to the live provider — we
    //      should not recreate the map here.
    if (this.mapState === 'creating' || this.mapState === 'available') {
      log('Map already created (' + this.mapState + ').');
      return;
    }
    this.mapState = 'creating';
    this.mapProvider = await createProvider(this.flavour);
    const mapInitOpts: MapInitOptions = { zoom: this.zoom };
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
    (this.el as VMapHostElement).__vMapProvider = this.mapProvider;
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

    // Mouse-move → Geo-Koordinaten (provider-spezifisch)
    if (this.mapProvider?.onPointerMove) {
      this.unsubscribePointerMove = this.mapProvider.onPointerMove((coordinate, pixel) => {
        this.el.dispatchEvent(
          new CustomEvent<MapMouseMoveDetail>(VMapEvents.MapMouseMove, {
            detail: { coordinate, pixel },
            bubbles: true,
            composed: true,
          }),
        );
      });
    }

    // View change → bidirectional zoom/center binding. The provider
    // fires this for BOTH user interactions AND programmatic setView()
    // calls. We suppress the latter via the _isSettingView flag and a
    // value-comparison guard to break the feedback loop.
    if (this.mapProvider?.onViewChange) {
      this.unsubscribeViewChange = this.mapProvider.onViewChange((view) => {
        if (this._isSettingView) return;
        if (
          this._lastProgrammaticZoom !== null &&
          Math.abs(view.zoom - this._lastProgrammaticZoom) < 0.05 &&
          this._lastProgrammaticCenter !== null &&
          Math.abs(view.center[0] - this._lastProgrammaticCenter[0]) < 0.0001 &&
          Math.abs(view.center[1] - this._lastProgrammaticCenter[1]) < 0.0001
        ) {
          return;
        }
        this._lastProgrammaticZoom = null;
        this._lastProgrammaticCenter = null;
        this.el.dispatchEvent(
          new CustomEvent<ViewChangeDetail>(VMapEvents.ViewChange, {
            detail: { center: view.center, zoom: view.zoom },
            bubbles: true,
            composed: true,
          }),
        );
      });
    }
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
   * Gibt zurück, ob der Karten-Provider initialisiert wurde und verwendet werden kann.
   * @returns Promise mit `true`, sobald der Provider bereit ist, sonst `false`.
   */
  @Method()
  async isMapProviderReady(): Promise<boolean> {
    const isReady =
      this.mapProvider !== null &&
      this.mapProvider !== undefined &&
      this.mapProvider !== NOOP_PROVIDER;

    if (!isReady) {
      log(MSG_COMPONENT + 'Map provider not yet ready.');
    }

    return isReady;
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
