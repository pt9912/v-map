import type { MapProvider, LayerUpdate } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';

import { watchElementResize, Unsubscribe } from '../../utils/dom-env';

// Leaflet ESM
import * as L from 'leaflet';

import { isBrowser } from '../../utils/dom-env';
import { log } from '../../utils/logger';
import {
  removeInjectedCss,
  ensureLeafletCss,
  loadGoogleMapsApi,
  ensureGoogleMutantLoaded,
  ensureGoogleLogo,
} from './leaflet-helpers';

type AnyLayer = L.Layer | L.LayerGroup;
interface OpacityOptions {
  opacity?: number;
  fillOpacity?: number;
}

export class LeafletProvider implements MapProvider {
  private map?: L.Map;
  private layers: AnyLayer[] = [];
  private baseLayers: L.Layer[] = [];
  private hiddenLayerGroups: L.LayerGroup[] = [];
  private googleLogoAdded: boolean = false;
  private unsubscribeResize: Unsubscribe;
  private shadowRoot: ShadowRoot;
  private injectedStyle: HTMLStyleElement;

  async init(options: ProviderOptions) {
    if (!isBrowser()) return;

    this.shadowRoot = options.shadowRoot;
    this.injectedStyle = ensureLeafletCss(options.cssMode, this.shadowRoot);

    const [lon, lat] = (options?.mapInitOptions?.center ?? [0, 0]) as LonLat;

    this.map = L.map(options.target, {
      zoomControl: true,
      attributionControl: true,
    }).setView([lat, lon], options?.mapInitOptions?.zoom ?? 2);

    this.unsubscribeResize = watchElementResize(
      options.target,
      () => {
        this.map?.invalidateSize();
      },
      {
        attributes: true,
        attributeFilter: ['style', 'class'],
      },
    );
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

  // private async addStandaloneLayer(layerConfig: LayerConfig): Promise<L.Layer> {
  //   const layer = await this.createLayer(layerConfig);
  //   layer.addTo(this.map!);
  //   this.layers.push(layer);
  // }

  async addLayerToGroup(
    layerConfig: LayerConfig,
    groupId: string,
  ): Promise<string> {
    const group = await this._ensureGroup(groupId);

    const layer = await this.createLayer(layerConfig);

    if (layer == null) {
      return null;
    }
    group.addLayer(layer);

    const layerId = L.Util.stamp(layer); //layer._leaflet_id;
    layer.vmapVisible = true;
    layer.vmapOpacity = 1.0;

    if ((layerConfig as any).opacity !== undefined) {
      this.setOpacityByLayer(layer, (layerConfig as any).opacity);
    }
    if ((layerConfig as any).zIndex !== undefined) {
      layer.setZIndex((layerConfig as any).zIndex);
    }
    if ((layerConfig as any).visible) {
      this.setVisibleByLayer(layer, true);
    } else if ((layerConfig as any).visible === false) {
      this.setVisibleByLayer(layer, false);
    }

    return layerId;
  }

  // async addLayer(config: LayerConfig): Promise<string> {
  //   if (!this.map) return;
  //   let layer: L.Layer = null;
  //   if ('groupId' in config && config.groupId) {
  //     try {
  //       layer = await this.addLayerToGroup(
  //         config as LayerConfig & { groupId: string },
  //       );
  //     } catch (ex) {
  //       error('addLayer - Unerwarteter Fehler:', ex);
  //       return null;
  //     }
  //   } else {
  //     try {
  //       layer = await this.addStandaloneLayer(config);
  //     } catch (ex) {
  //       error('addLayer - Unerwarteter Fehler:', ex);
  //       return null;
  //     }
  //   }
  //   if (layer == null) {
  //     return null;
  //   }
  //   const layerId = L.Util.stamp(layer); //layer._leaflet_id;
  //   layer.vmapVisible = true;
  //   layer.vmapOpacity = 1.0;

  //   if ((config as any).opacity !== undefined) {
  //     this.setOpacityByLayer(layer, (config as any).opacity);
  //   }
  //   if ((config as any).zIndex !== undefined) {
  //     layer.setZIndex((config as any).zIndex);
  //   }
  //   if ((config as any).visible) {
  //     this.setVisibleByLayer(layer, true);
  //   } else if ((config as any).visible === false) {
  //     this.setVisibleByLayer(layer, false);
  //   }

  //   return layerId;
  // }

  async addBaseLayer(
    layerConfig: LayerConfig,
    basemapid: string,
    layerElementId: string,
  ): Promise<string> {
    if (layerElementId === undefined || layerElementId === null) {
      log('leaflet - addBaseLayer - layerElementId not set.');
      return null;
    }
    if (basemapid === undefined || basemapid === null) {
      log('leaflet - addBaseLayer - basemapid not set.');
    }

    const group = await this._ensureGroup(layerConfig.groupId);
    group.basemap = true;

    const layer = await this.createLayer(layerConfig);

    //    layer.group = group;
    this.baseLayers.push(layer);
    if (layer == null) {
      return null;
    }
    layer.layerElementId = layerElementId;

    const layerId = L.Util.stamp(layer); //layer._leaflet_id;
    layer.vmapVisible = true;
    layer.vmapOpacity = 1.0;

    if ((layerConfig as any).opacity !== undefined) {
      this.setOpacityByLayer(layer, (layerConfig as any).opacity);
    }
    if ((layerConfig as any).zIndex !== undefined) {
      layer.setZIndex((layerConfig as any).zIndex);
    }
    if ((layerConfig as any).visible) {
      this.setVisibleByLayer(layer, true);
    } else if ((layerConfig as any).visible === false) {
      this.setVisibleByLayer(layer, false);
    }
    if (basemapid === layerElementId) {
      const prev_layer = group.getLayers()[0];
      if (prev_layer) {
        this.map.removeLayer(prev_layer);
        group.clearLayers();
      }
      group.addLayer(layer);
      layer.addTo(this.map!);
      //group.layerId = layerId;
    }
    return layerId;
  }

  async setBaseLayer(groupId: string, layerElementId: string): Promise<void> {
    if (layerElementId === null) {
      log('leaflet - setBaseLayer - layerElementId is null.');
      return;
    }
    let group = this.layers.find(
      l => (l as L.LayerGroup)?._groupId === groupId,
    ) as L.LayerGroup | undefined;

    const layer = this.baseLayers.find(
      l => l.layerElementId === layerElementId,
    );
    if (layer === undefined) {
      log(
        'leaflet - setBaseLayer - layer not found. layerElementId: ' +
          layerElementId,
      );
      return;
    }

    const prev_layer = group.getLayers()[0];
    if (prev_layer) {
      this.map.removeLayer(prev_layer);
      group.clearLayers();
    }
    group.addLayer(layer);
    layer.addTo(this.map!);
    //group.layerId = layerId;

    //group.set('layerId', layerId, false);
  }

  private async _getLayerById(layerId): Promise<L.Layer> {
    let layerFound = null;
    this.map.eachLayer(layer => {
      if (layer._leaflet_id === layerId) {
        layerFound = layer;
      }
    });
    if (layerFound) return layerFound;

    layerFound = this.baseLayers.find(l => l._leaflet_id === layerId);
    if (layerFound === undefined) return null;
    return layerFound;
  }

  private async createLayer(layerConfig: LayerConfig): Promise<L.Layer> {
    switch (layerConfig.type) {
      case 'geojson':
        return this.createGeoJSONLayer(
          layerConfig as Extract<LayerConfig, { type: 'geojson' }>,
        );
      case 'xyz':
        return this.createXYZLayer(
          layerConfig as Extract<LayerConfig, { type: 'xyz' }>,
        );
      case 'osm':
        return this.createOSMLayer(
          layerConfig as Extract<LayerConfig, { type: 'osm' }>,
        );
      case 'wms':
        return this.createWMSLayer(
          layerConfig as Extract<LayerConfig, { type: 'wms' }>,
        );
      case 'google':
        return this.createGoogleLayer(
          layerConfig as Extract<LayerConfig, { type: 'google' }>,
        );
      default:
        throw new Error(`Unsupported layer type: ${(layerConfig as any).type}`);
    }
  }

  private async updateGeoJSONLayer(layer: L.Layer, data: any) {
    let geoJsonData = null;
    if (data.geojson) {
      geoJsonData = JSON.parse(data.geojson);
    } else if (data.url) {
      const res = await fetch(data.url);
      if (!res.ok)
        throw new Error(
          `GeoJSON fetch failed: ${res.status} ${res.statusText}`,
        );
      geoJsonData = await res.json();
    }
    layer.clearLayers();
    layer.addData(geoJsonData);
  }

  private async createGeoJSONLayer(
    config: Extract<LayerConfig, { type: 'geojson' }>,
  ): Promise<L.GeoJSON> {
    let data = null;
    if (config.geojson) {
      data = JSON.parse(config.geojson);
    } else if (config.url) {
      const res = await fetch(config.url);
      if (!res.ok)
        throw new Error(
          `GeoJSON fetch failed: ${res.status} ${res.statusText}`,
        );
      data = await res.json();
    }
    if (data) {
      const layer = L.geoJSON(data, {
        style: config.style
          ? () => ({
              fillColor: config.style!.fillColor ?? 'rgba(255,0,0,0.2)',
              color: config.style!.strokeColor ?? '#ff0000',
              weight: config.style!.strokeWidth ?? 2,
            })
          : undefined,
      });

      return layer;
    }
    return null;
  }

  private async createXYZLayer(
    config: Extract<LayerConfig, { type: 'xyz' }>,
  ): Promise<L.TileLayer> {
    const layer = L.tileLayer(config.url, {
      attribution: config.attributions,
      maxZoom: (config as any).maxZoom ?? 19,
      ...(config.options ?? {}),
    } as L.TileLayerOptions);
    return layer;
  }

  private async updateOSMLayer(layer: L.Layer, data: any) {
    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (data.url) {
      url = data.url + '/{z}/{x}/{y}.png';
    }
    layer.setUrl(url);
  }

  private async createOSMLayer(
    cfg: Extract<LayerConfig, { type: 'osm' }>,
  ): Promise<L.TileLayer> {
    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (cfg.url) {
      url = cfg.url + '/{z}/{x}/{y}.png';
    }
    return L.tileLayer(url, {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    });
  }

  private async createWMSLayer(
    config: Extract<LayerConfig, { type: 'wms' }>,
  ): Promise<L.TileLayer.WMS> {
    return L.tileLayer.wms(config.url, {
      layers: config.layers,
      format: config.format ?? 'image/png',
      transparent: config.transparent ?? true,
      ...(config.extraParams ?? {}),
    } as L.WMSOptions);
  }

  private async createGoogleLayer(
    config: Extract<LayerConfig, { type: 'google' }>,
  ): Promise<L.GridLayer> {
    if (!this.map) throw new Error('Map not initialized');
    if (!config.apiKey)
      throw new Error("Google-Layer benötigt 'apiKey' (Google Maps Platform).");

    await loadGoogleMapsApi(config.apiKey, {
      language: config.language,
      region: config.region,
      libraries: config.libraries,
    });

    const type = (config.mapType ?? 'roadmap') as
      | 'roadmap'
      | 'satellite'
      | 'terrain'
      | 'hybrid';

    await ensureGoogleMutantLoaded();

    // googleMutant-Optionen
    const mutantOpts: any = {
      type,
      maxZoom: config.maxZoom ?? 21,
      styles: config.styles,
    };

    const gLayer = (L.gridLayer as any).googleMutant(mutantOpts) as L.GridLayer;

    ensureGoogleLogo(this.map, () => {
      this.googleLogoAdded = true;
      log(
        'v-map - provider - leaflet - googleLogoAdded: ',
        this.googleLogoAdded,
      );
    });
    return gLayer;
  }

  async destroy() {
    this.unsubscribeResize?.();
    removeInjectedCss(this.shadowRoot, this.injectedStyle);
    for (const l of this.layers) {
      this.map?.removeLayer(l);
    }
    this.layers = [];
    this.map?.remove();
    this.map = undefined;
  }

  async setView([lon, lat]: LonLat, zoom: number) {
    this.map?.setView([lat, lon], zoom, { animate: false });
  }

  async removeLayer(layerId: string): Promise<void> {
    if (!layerId) {
      return;
    }
    const layer = await this._getLayerById(layerId);
    if (layer) {
      this.map.removeLayer(layer);
    }
  }

  async setZIndex(layerId: string, zIndex: number): Promise<void> {
    if (!layerId) {
      return;
    }
    const layer = await this._getLayerById(layerId);
    if (layer) {
      if (typeof layer.setZIndex === 'function') {
        layer.setZIndex(zIndex);
      } //todo
    }
  }

  async setOpacity(layerId: string, opacity: number): Promise<void> {
    if (!layerId) return;

    const layer = await this._getLayerById(layerId);
    this.setOpacityByLayer(layer, opacity);
  }

  private setOpacityByLayer(layer: L.Layer, opacity: number): Promise<void> {
    if (!layer) return;

    // 1. Speichere die Ziel-Opazität (auch wenn Layer unsichtbar)
    layer.vmapOpacity = opacity;
    if (layer.vmapVisible === undefined) {
      layer.vmapVisible = true;
    }

    // 2. Wende sie nur an, wenn der Layer sichtbar IST ODER GEMACHT WIRD
    //    (vermeidet unnötige setOpacity-Aufrufe, wenn vmapVisible=false)
    if (layer.vmapVisible !== false) {
      this.setLayerOpacity(layer, opacity);
    }
  }

  async setVisible(layerId: string, visible: boolean): Promise<void> {
    if (!layerId) return;
    const layer = await this._getLayerById(layerId);
    this.setVisibleByLayer(layer, visible);
  }

  private setVisibleByLayer(layer: L.Layer, visible: boolean): Promise<void> {
    if (!layer) return;

    // 1. Aktualisiere den Sichtbarkeitszustand
    layer.vmapVisible = visible;
    if (layer.vmapOpacity === undefined) {
      layer.vmapOpacity = 1.0;
    }

    // 2. Setze die Opazität basierend auf dem neuen Zustand:
    const targetOpacity = visible ? layer.vmapOpacity : 0.0;
    this.setLayerOpacity(layer, targetOpacity);
  }

  private setLayerOpacity(
    layer: L.Layer,
    options: OpacityOptions | number,
  ): void {
    if (!layer) return;

    const opacity =
      typeof options === 'number' ? options : options.opacity ?? 1;
    const fillOpacity =
      typeof options === 'number' ? options : options.fillOpacity ?? opacity;

    if (layer instanceof L.GeoJSON || layer instanceof L.LayerGroup) {
      layer.eachLayer(subLayer => this.setLayerOpacity(subLayer, options));
    } else if (layer instanceof L.Path) {
      layer.setStyle({ opacity, fillOpacity });
    } else if (layer instanceof L.Marker) {
      const marker = layer as L.Marker;
      marker.setOpacity(opacity);
    } else if ('setOpacity' in layer) {
      (layer as L.GridLayer).setOpacity(opacity);
    }
  }

  private async _ensureGroup(groupId: string): Promise<L.LayerGroup> {
    let group = await this._getLayerGroupById(groupId);
    if (!group) {
      group = L.layerGroup();
      (group as any)._groupId = groupId;
      group.addTo(this.map!);
      group.visible = true;
      this.layers.push(group);
    }
    return group;
  }

  private async _getLayerGroupById(groupId): Promise<L.LayerGroup> {
    if (!this.map) {
      return null;
    }
    let group = this.layers.find(
      l => l instanceof L.LayerGroup && (l as any)._groupId === groupId,
    ) as L.LayerGroup | undefined;
    if (!group) {
      group = this.hiddenLayerGroups.find(lg => lg._groupId === groupId);
      if (!group) return null;
    }
    return group;
  }

  async setGroupVisible(groupId: string, visible: boolean): Promise<void> {
    const layerGroup = await this._getLayerGroupById(groupId);
    if (layerGroup) {
      if (layerGroup.visible === visible) return;
      if (layerGroup.visible === false) {
        layerGroup.addTo(this.map);
        // remove layergroup from hidden list
        this.hiddenLayerGroups = this.hiddenLayerGroups.filter(
          lg => lg._groupId !== groupId,
        );
        layerGroup.visible = visible;
      } else if (layerGroup.visible === true) {
        this.map.removeLayer(layerGroup);
        // add layergroup to hidden list
        layerGroup.visible = visible;
        this.hiddenLayerGroups.push(layerGroup);
      }
    }
  }

  getMap() {
    return this.map;
  }
}
