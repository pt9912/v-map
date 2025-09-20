import { OL_VERSION } from '../../lib/versions.gen';

import type Map from 'ol/Map';

//import type View from 'ol/View';
//import { fromLonLat } from 'ol/proj';
//import type TileLayer from 'ol/layer/Tile';
//import type OSM from 'ol/source/OSM';

import type { ProjectionLike } from 'ol/proj';
import type VectorSource from 'ol/source/Vector';
import type Layer from 'ol/layer/Layer';
import type BaseLayer from 'ol/layer/Base';
import type VectorLayer from 'ol/layer/Vector';

import type LayerGroup from 'ol/layer/Group';

import type { MapProvider, LayerUpdate } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';

type AnyLayer = BaseLayer | LayerGroup | VectorLayer;

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
  private projection: ProjectionLike = 'EPSG:3857';

  async init(options: ProviderOptions) {
    const [{ default: View }] = await Promise.all([import('ol/View')]);
    const [{ default: Map }] = await Promise.all([import('ol/Map')]);
    const [{ fromLonLat }] = await Promise.all([import('ol/proj')]);

    await injectOlCss(options.shadowRoot);

    Object.assign(options.target.style, {
      width: '100%',
      height: '100%',
      position: 'relative',
      background: '#fff',
    });

    this.map = new Map({
      target: options.target,
      //      layers: [new TileLayer({ source: new OSM() })],
      layers: [],
      view: new View({
        projection: this.projection,
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

  async updateLayer(layerId: string, update: LayerUpdate): Promise<void> {
    const layer = await this._getLayerById(layerId);
    switch (update.type) {
      case 'geojson':
        await this.updateGeoJSONLayer(layer, update.data);
        break;
      case 'osm':
        await this.updateOSMLayer(layer, update.data);
        break;
    }
  }

  async addLayer(layerConfig: LayerConfig): Promise<string> {
    let layerId: string = null;
    let layer: Layer = null;
    if ('groupId' in layerConfig && layerConfig.groupId) {
      try {
        layer = await this.addLayerToGroup(
          layerConfig as LayerConfig & { groupId: string },
        );
      } catch (ex) {
        console.error('addLayer - Unerwarteter Fehler:', ex);
        return null;
      }
    } else {
      try {
        layer = await this.addStandaloneLayer(layerConfig);
      } catch (ex) {
        console.error('addLayer - Unerwarteter Fehler:', ex);
        return null;
      }
    }
    if (layer) {
      layerId = crypto.randomUUID();
      layer.set('id', layerId, false);

      if ((layerConfig as any).opacity !== undefined) {
        await layer.setOpacity((layerConfig as any).opacity);
      }
      if ((layerConfig as any).zIndex !== undefined) {
        layer.setZIndex((layerConfig as any).zIndex);
      }
      if ((layerConfig as any).visible) {
        layer.setVisible(true);
      } else if ((layerConfig as any).visible === false) {
        layer.setVisible(false);
      }
      return layerId;
    }

    return layerId;
  }

  private async addStandaloneLayer(layerConfig: LayerConfig): Promise<Layer> {
    const layer = await this.createLayer(layerConfig);
    this.map.addLayer(layer);
    this.layers.push(layer);
    return layer;
  }

  private async addLayerToGroup(
    layerConfig: LayerConfig & { groupId: string },
  ): Promise<Layer> {
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

    const layer = await this.createLayer(layerConfig);
    group.getLayers().push(layer);
    layer.set('group', group);
    return layer;
  }

  private async createLayer(layerConfig: LayerConfig): Promise<Layer> {
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
        return this.createOSMLayer(
          layerConfig as Extract<LayerConfig, { type: 'osm' }>,
        );
      case 'wms':
        return this.createWMSLayer(
          layerConfig as Extract<LayerConfig, { type: 'wms' }>,
        );
      default:
        throw new Error(`Unsupported layer type: ${(layerConfig as any).type}`);
    }
  }

  private async updateOSMLayer(layer: Layer, data: any) {
    const [{ default: OSM }] = await Promise.all([import('ol/source/OSM')]);

    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (data.url) {
      url = data.url + '/{z}/{x}/{y}.png';
    }

    layer.setSource(
      new OSM({
        url: url,
      }),
    );
  }

  private async updateGeoJSONLayer(layer: Layer, data: any) {
    let vectorSource: VectorSource = null;
    const geojsonOptions = {
      featureProjection: this.projection,
    };
    const [{ default: VectorSource }, { default: GeoJSON }] = await Promise.all(
      [import('ol/source/Vector'), import('ol/format/GeoJSON')],
    );
    if (data.geojson) {
      const geojsonObject = JSON.parse(data.geojson);
      vectorSource = new VectorSource({
        features: new GeoJSON(geojsonOptions).readFeatures(geojsonObject),
      });
    } else {
      vectorSource = new VectorSource({
        url: data.url,
        format: new GeoJSON(geojsonOptions),
      });
    }
    layer.setSource(vectorSource);
  }

  private async createGeoJSONLayer(
    config: Extract<LayerConfig, { type: 'geojson' }>,
  ): Promise<Layer> {
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

    let vectorSource: VectorSource = null;
    const geojsonOptions = {
      featureProjection: this.projection,
    };
    if (config.geojson) {
      const geojsonObject = JSON.parse(config.geojson);
      vectorSource = new VectorSource({
        features: new GeoJSON(geojsonOptions).readFeatures(geojsonObject),
      });
    } else {
      vectorSource = new VectorSource({
        url: config.url,
        format: new GeoJSON(geojsonOptions),
      });
    }
    const layer = new VectorLayer({
      source: vectorSource,
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
    return layer;
  }

  private async createXYZLayer(
    config: Extract<LayerConfig, { type: 'xyz' }>,
  ): Promise<Layer> {
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
  ): Promise<Layer> {
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

  private async createOSMLayer(
    config: Extract<LayerConfig, { type: 'osm' }>,
  ): Promise<Layer> {
    const [{ default: TileLayer }, { default: OSM }] = await Promise.all([
      import('ol/layer/Tile'),
      import('ol/source/OSM'),
    ]);

    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (config.url) {
      url = config.url + '/{z}/{x}/{y}.png';
    }
    const layer = new TileLayer({
      source: new OSM({
        url: url,
      }),
    });
    return layer;
  }

  private async createWMSLayer(
    config: Extract<LayerConfig, { type: 'wms' }>,
  ): Promise<Layer> {
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
    const [{ fromLonLat }] = await Promise.all([import('ol/proj')]);
    if (!this.map) return;
    this.map
      .getView()
      .animate({ center: fromLonLat(center), zoom, duration: 0 });
  }

  private async _forEachLayer(layerOrGroup, callback): Promise<boolean> {
    const { default: LayerGroup } = await import('ol/layer/Group');
    // Wenn das aktuelle Objekt eine LayerGroup ist, rufen wir die Funktion für jedes Kind erneut auf
    if (layerOrGroup instanceof LayerGroup) {
      const layers = layerOrGroup.getLayers().getArray(); // Array der Unter‑Layer
      for (const child of layers) {
        if (await this._forEachLayer(child, callback)) {
          return true;
        }
      }
    } else {
      // Es handelt sich um einen normalen Layer → Callback ausführen
      if (callback(layerOrGroup)) {
        return true;
      }
    }
    return false;
  }

  private async _getLayerById(layerId): Promise<Layer> {
    if (!this.map) {
      return null;
    }
    let layerFound = null;
    await this._forEachLayer(this.map.getLayerGroup(), layer => {
      if (layer.get('id') === layerId) {
        layerFound = layer;
        return true;
      }
    });
    return layerFound;
  }

  async removeLayer(layerId: string): Promise<void> {
    if (!layerId) {
      return;
    }
    const layer = await this._getLayerById(layerId);
    if (layer) {
      const group = layer.get('group');
      group.getLayers().remove(layer);
      //this.map.removeLayer(layer);
    }
  }

  async setOpacity(layerId: string, opacity: number): Promise<void> {
    if (!layerId) {
      return;
    }
    const layer = await this._getLayerById(layerId);
    if (layer) {
      layer.setOpacity(opacity);
    }
  }

  async setZIndex(layerId: string, zIndex: number): Promise<void> {
    if (!layerId) {
      return;
    }
    const layer = await this._getLayerById(layerId);
    if (layer) {
      layer.setZIndex(zIndex);
    }
  }

  async setVisible(layerId: string, visible: boolean): Promise<void> {
    const layer = await this._getLayerById(layerId);
    if (layer) {
      layer.setVisible(visible);
    }
  }

  getMap() {
    return this.map;
  }
}
