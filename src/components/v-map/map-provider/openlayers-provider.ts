// src/components/v-map/map-provider/openlayers-provider.ts
//import { loadOl } from '../../../lib/ol-loader';

import { OL_VERSION } from '../../../lib/versions.gen';

import type Map from 'ol/Map';
import MapClass from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import type BaseLayer from 'ol/layer/Base';
import type LayerGroup from 'ol/layer/Group';

import {
  MapProvider,
  ProviderOptions,
  LayerConfig,
  LonLat,
} from './map-provider';

type AnyLayer = BaseLayer | LayerGroup;

/** CSS in ShadowRoot injizieren – ohne '?inline', kompatibel zu Stencil/Rollup */
async function injectOlCss(shadowRoot?: ShadowRoot) {
  if (!shadowRoot) return;
  const id = 'ol-css-sheet';
  // Doppeltes Einfügen vermeiden
  if (shadowRoot.querySelector(`style[data-id="${id}"]`)) return;

  const url = `https://cdn.jsdelivr.net/npm/ol@${OL_VERSION}/ol.css`;
  const css = await (await fetch(url)).text();

  if ('adoptedStyleSheets' in Document.prototype) {
    const sheet = new CSSStyleSheet();
    await sheet.replace(css);
    // @ts-ignore
    shadowRoot.adoptedStyleSheets = [
      ...(shadowRoot.adoptedStyleSheets ?? []),
      sheet,
    ];
  } else {
    const style = document.createElement('style');
    style.setAttribute('data-id', id);
    style.textContent = css;
    shadowRoot.appendChild(style);
  }
}

export class OpenLayersProvider implements MapProvider {
  private map!: Map;
  private layers: AnyLayer[] = [];
  private googleLogoAdded = false;

  async init(options: ProviderOptions) {
    const sr =
      options.target.getRootNode() instanceof ShadowRoot
        ? (options.target.getRootNode() as ShadowRoot)
        : undefined;
    await injectOlCss(sr);

    this.map = new MapClass({
      target: options.target,
      //      layers: [new TileLayer({ source: new OSM() })],
      layers: [],
      view: new View({
        center: fromLonLat(options?.mapInitOptions?.center ?? [0, 0]),
        zoom: options?.mapInitOptions?.zoom ?? 2,
      }),
    });

    new ResizeObserver(() => this.map?.updateSize()).observe(options.target);
  }

  async destroy() {
    this.map?.setTarget(undefined as any);
    this.map = undefined;
  }

  async addLayer(layerConfig: LayerConfig) {
    if ('groupId' in layerConfig && layerConfig.groupId) {
      await this.addLayerToGroup(
        layerConfig as LayerConfig & { groupId: string },
      ).catch(console.error);
    } else {
      await this.addStandaloneLayer(layerConfig).catch(console.error);
    }
  }

  private async addStandaloneLayer(layerConfig: LayerConfig) {
    const layer = (await this.createLayer(layerConfig)) as AnyLayer;
    this.map.addLayer(layer);
    this.layers.push(layer);
  }

  private async addLayerToGroup(
    layerConfig: LayerConfig & { groupId: string },
  ) {
    const { default: LayerGroup } = await import('ol/layer/Group');
    let group = this.layers.find(
      l => (l as LayerGroup).get?.('groupId') === layerConfig.groupId,
    ) as LayerGroup | undefined;

    if (!group) {
      group = new LayerGroup({
        layers: [],
        properties: { groupId: layerConfig.groupId },
      });
      this.map.addLayer(group);
      this.layers.push(group);
    }

    const layer = (await this.createLayer(layerConfig)) as AnyLayer;
    group.getLayers().push(layer as AnyLayer);
  }

  private async createLayer(
    layerConfig: LayerConfig,
  ): Promise<BaseLayer | LayerGroup> {
    switch (layerConfig.type) {
      case 'geojson':
        return this.createGeoJSONLayer(
          layerConfig as Extract<LayerConfig, { type: 'geojson' }>,
        );
      case 'xyz':
        return this.createXYZLayer(
          layerConfig as Extract<LayerConfig, { type: 'xyz' }>,
        );
      case 'google':
        return this.createGoogleLayer(
          layerConfig as Extract<LayerConfig, { type: 'google' }>,
        );
      case 'osm':
        return this.createOSMLayer();
      case 'wms':
        return this.createWMSLayer(
          layerConfig as Extract<LayerConfig, { type: 'wms' }>,
        );
      default:
        throw new Error(`Unsupported layer type: ${(layerConfig as any).type}`);
    }
  }

  private async createGeoJSONLayer(
    config: Extract<LayerConfig, { type: 'geojson' }>,
  ) {
    const [
      { default: VectorLayer },
      { default: VectorSource },
      { default: GeoJSON },
      { default: Style },
      { default: Fill },
      { default: Stroke },
    ] = await Promise.all([
      import('ol/layer/Vector'),
      import('ol/source/Vector'),
      import('ol/format/GeoJSON'),
      import('ol/style/Style'),
      import('ol/style/Fill'),
      import('ol/style/Stroke'),
    ]);

    return new VectorLayer({
      source: new VectorSource({ url: config.url, format: new GeoJSON() }),
      style: config.style
        ? new Style({
            fill: new Fill({
              color: config.style.fillColor ?? 'rgba(255,0,0,0.2)',
            }),
            stroke: new Stroke({
              color: config.style.strokeColor ?? '#ff0000',
              width: config.style.strokeWidth ?? 2,
            }),
          })
        : undefined,
    });
  }

  private async createXYZLayer(config: Extract<LayerConfig, { type: 'xyz' }>) {
    const [{ default: TileLayer }, { default: XYZ }] = await Promise.all([
      import('ol/layer/Tile'),
      import('ol/source/XYZ'),
    ]);
    return new TileLayer({
      source: new XYZ({
        url: config.url,
        attributions: config.attributions,
        maxZoom: config.maxZoom ?? 19,
        ...(config.options ?? {}),
      }),
    });
  }

  private async createGoogleLayer(
    config: Extract<LayerConfig, { type: 'google' }>,
  ): Promise<import('ol/layer/Tile').default> {
    const [{ default: TileLayer }, { default: Google }] = await Promise.all([
      import('ol/layer/Tile'),
      import('ol/source/Google'),
    ]);

    if (!config.apiKey) {
      throw new Error("Google-Layer benötigt 'apiKey' (Google Maps Platform).");
    }

    // Optionen auf ol/source/Google abbilden
    const source = new Google({
      key: config.apiKey,
      mapType: config.mapType ?? 'roadmap', // roadmap | satellite | terrain | hybrid
      // optional:
      scale: config.scale ?? 'scaleFactor2x', // 'scaleFactor1x' | 'scaleFactor2x' | 'scaleFactor4x'
      highDpi: config.highDpi ?? true,
      language: (config as any).language, // falls ihr's im Typ ergänzt
      region: (config as any).region,
      imageFormat: (config as any).imageFormat, // 'png' | 'png8' | ...
      styles: (config as any).styles, // MapStyleArray
      layerTypes: (config as any).layerTypes, // z. B. ['LayerRoadmap']
    });

    source.on('change', () => {
      if (source.getState() === 'error') {
        // Fehler transparent machen (z.B. ungültiger Key / Billing)
        const err = (source as any).getError?.();
        console.error('Google source error', err);
        alert(err ?? 'Google source error');
      }
    });

    const layer = new TileLayer({ source });

    // Google Logo/Branding: als Control ergänzen (unten links)
    if (!this.googleLogoAdded) {
      const [{ default: Control }] = await Promise.all([
        import('ol/control/Control'),
      ]);
      class GoogleLogoControl extends Control {
        constructor() {
          const el = document.createElement('img');
          el.style.pointerEvents = 'none';
          el.style.position = 'absolute';
          el.style.bottom = '5px';
          el.style.left = '5px';
          el.style.height = '18px';
          el.alt = 'Google';
          el.src =
            'https://developers.google.com/static/maps/documentation/images/google_on_white.png';
          super({ element: el });
        }
      }
      this.map.addControl(new GoogleLogoControl());
      this.googleLogoAdded = true;
    }

    return layer;
  }

  // private async createGoogleLayer(
  //   config: Extract<LayerConfig, { type: 'google' }>,
  // ): Promise<import('ol/layer/Tile').default> {
  //   const [{ default: TileLayer }, { default: Google }] = await Promise.all([
  //     import('ol/layer/Tile'),
  //     import('ol/source/Google'),
  //   ]);

  //   const source = new Google({
  //     key: config.apiKey,
  //     ...(config.mapType ? { mapType: config.mapType } : {}),
  //     ...(config.scale ? { scale: config.scale } : { scale: 'scaleFactor2x' }),
  //     ...(config.highDpi !== undefined
  //       ? { highDpi: config.highDpi }
  //       : { highDpi: true }),
  //   });

  //   source.on('change', () => {
  //     if (source.getState() === 'error') {
  //       alert((source as any).getError?.() ?? 'Google source error');
  //     }
  //   });

  //   const layer = new TileLayer({ source });

  //   if (!this.googleLogoAdded) {
  //     const [{ default: Control }] = await Promise.all([
  //       import('ol/control/Control'),
  //     ]);
  //     class GoogleLogoControl extends Control {
  //       constructor() {
  //         const el = document.createElement('img');
  //         el.style.pointerEvents = 'none';
  //         el.style.position = 'absolute';
  //         el.style.bottom = '5px';
  //         el.style.left = '5px';
  //         el.src =
  //           'https://developers.google.com/static/maps/documentation/images/google_on_white.png';
  //         super({ element: el });
  //       }
  //     }
  //     this.map.addControl(new GoogleLogoControl());
  //     this.googleLogoAdded = true;
  //   }

  //   return layer;
  // }

  private async createOSMLayer() {
    return new TileLayer({ source: new OSM() });
  }

  private async createWMSLayer(config: Extract<LayerConfig, { type: 'wms' }>) {
    const [{ default: TileLayer }, { default: TileWMS }] = await Promise.all([
      import('ol/layer/Tile'),
      import('ol/source/TileWMS'),
    ]);
    return new TileLayer({
      source: new TileWMS({
        url: config.url,
        params: {
          LAYERS: config.layers,
          TILED: true,
          ...(config.params ?? {}),
        },
      }),
    });
  }

  /*ensureGroup
      if (mapProvider.flavour === 'ol') {
      const { Group } = await import('ol/layer');
      this.groupLayer = new Group({ layers: [] });
      mapProvider.getMap().addLayer(this.groupLayer);
    }

    */

  async setView(center: LonLat, zoom: number) {
    if (!this.map) return;
    this.map
      .getView()
      .animate({ center: fromLonLat(center), zoom, duration: 0 });
  }

  getMap() {
    return this.map;
  }
}
