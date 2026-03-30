import type { MapProvider, LayerUpdate, LayerErrorCallback } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';

import { watchElementResize, Unsubscribe } from '../../utils/dom-env';

import * as L from 'leaflet';

import { isBrowser } from '../../utils/dom-env';
import { log, error } from '../../utils/logger';
import type { StyleConfig } from '../../types/styleconfig';
import { DEFAULT_STYLE } from '../../types/styleconfig';
import {
  removeInjectedCss,
  ensureLeafletCss,
  ensureGoogleLogo,
} from './leaflet-helpers';
import { GoogleMapTilesLayer } from './google-map-tiles-layer';
import { GeoTIFFGridLayer } from './GeoTIFFGridLayer';
import type { GeoTIFFGridLayerOptions } from './GeoTIFFGridLayer';
import { WCSGridLayer } from './WCSGridLayer';
import type { WCSGridLayerOptions } from './WCSGridLayer';
import { getColorStops } from '../geotiff/utils/colormap-utils';
import { wellknown } from 'wellknown';
import { GmlParser } from '@npm9912/s-gml';
import type { Style, TextSymbolizer } from 'geostyler-style';
import type * as GeoJSON from 'geojson';

/** GeoJSON Feature type used for Leaflet style/pointToLayer/onEachFeature callbacks */
type GeoJSONFeature = GeoJSON.Feature<GeoJSON.GeometryObject, GeoJSON.GeoJsonProperties>;

type ManagedLeafletLayer = L.Layer & {
  setZIndex?: (zIndex: number) => unknown;
  setOpacity?: (opacity: number) => unknown;
};
type ManagedLayerGroup = L.LayerGroup & {
  _groupId?: string;
  visible?: boolean;
  basemap?: boolean;
};
type AnyLayer = ManagedLeafletLayer | ManagedLayerGroup;
interface OpacityOptions {
  opacity?: number;
  fillOpacity?: number;
}

export class LeafletProvider implements MapProvider {
  private map?: L.Map;
  private layers: AnyLayer[] = [];
  private baseLayers: ManagedLeafletLayer[] = [];
  private hiddenLayerGroups: ManagedLayerGroup[] = [];
  private googleLogoAdded: boolean = false;
  private unsubscribeResize: Unsubscribe;
  private shadowRoot: ShadowRoot;
  private injectedStyle: HTMLStyleElement;
  private layerErrorCallbacks = new Map<string, LayerErrorCallback>();
  private layerErrorCleanups = new Map<string, () => void>();

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
      case 'arcgis':
        await this.updateArcGISLayer(layer, update.data);
        break;
      case 'wkt':
        await this.updateWKTLayer(layer, update.data);
        break;
      case 'geotiff':
        await this.updateGeoTIFFLayer(layer, update.data);
        break;
      case 'wcs':
        await this.updateWCSLayer(layer, update.data);
        break;
      case 'wfs':
        if (layer instanceof L.GeoJSON) {
          await this.updateWFSLayer(layer, update.data);
        }
        break;
    }
  }

  // private async addStandaloneLayer(layerConfig: LayerConfig): Promise<L.Layer> {
  //   const layer = await this.createLayer(layerConfig);
  //   layer.addTo(this.map!);
  //   this.layers.push(layer);
  // }

  async addLayerToGroup(layerConfig: LayerConfig): Promise<string> {
    const group = await this._ensureGroup(
      layerConfig.groupId,
      layerConfig.groupVisible,
    );

    const layer = await this.createLayer(layerConfig);

    if (layer == null) {
      return null;
    }
    group.addLayer(layer);

    const layerId = this.getLayerId(layer);
    layer.vmapVisible = true;
    layer.vmapOpacity = 1.0;

    if (layerConfig.opacity !== undefined) {
      this.setOpacityByLayer(layer, layerConfig.opacity);
    }
    if (layerConfig.zIndex !== undefined) {
      layer.setZIndex?.(layerConfig.zIndex);
    }
    if (layerConfig.visible) {
      this.setVisibleByLayer(layer, true);
    } else if (layerConfig.visible === false) {
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

  //   if (config.opacity !== undefined) {
  //     this.setOpacityByLayer(layer, config.opacity);
  //   }
  //   if (config.zIndex !== undefined) {
  //     layer.setZIndex(config.zIndex);
  //   }
  //   if (config.visible) {
  //     this.setVisibleByLayer(layer, true);
  //   } else if (config.visible === false) {
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

    const group = await this._ensureGroup(
      layerConfig.groupId,
      layerConfig.groupVisible,
    );
    group.basemap = true;

    const layer = await this.createLayer(layerConfig);

    //    layer.group = group;
    this.baseLayers.push(layer);
    if (layer == null) {
      return null;
    }
    layer.layerElementId = layerElementId;

    const layerId = this.getLayerId(layer);
    layer.vmapVisible = true;
    layer.vmapOpacity = 1.0;

    if (layerConfig.opacity !== undefined) {
      this.setOpacityByLayer(layer, layerConfig.opacity);
    }
    if (layerConfig.zIndex !== undefined) {
      layer.setZIndex?.(layerConfig.zIndex);
    }
    if (layerConfig.visible) {
      this.setVisibleByLayer(layer, true);
    } else if (layerConfig.visible === false) {
      this.setVisibleByLayer(layer, false);
    }
    if (basemapid === layerElementId) {
      const prev_layer = group.getLayers()[0];
      if (prev_layer) {
        this.map.removeLayer(prev_layer);
        group.clearLayers();
      }
      group.addLayer(layer);
      if (group.visible) {
        layer.addTo(this.map!);
      }
      //group.layerId = layerId;
    }
    return layerId;
  }

  async setBaseLayer(groupId: string, layerElementId: string): Promise<void> {
    if (layerElementId === null) {
      log('leaflet - setBaseLayer - layerElementId is null.');
      return;
    }
    const group = this.layers.find(
      l => (l as ManagedLayerGroup)._groupId === groupId,
    ) as ManagedLayerGroup | undefined;

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
    if (!group) {
      return;
    }

    const prev_layer = group.getLayers()[0];
    if (prev_layer) {
      this.map.removeLayer(prev_layer);
      group.clearLayers();
    }
    group.addLayer(layer);
    ////layer.addTo(this.map!);
    //group.layerId = layerId;

    //group.set('layerId', layerId, false);
  }

  private getLayerId(layer: L.Layer): string {
    return String(L.Util.stamp(layer));
  }

  private normalizeAttribution(
    attribution?: string | string[],
  ): string | undefined {
    if (Array.isArray(attribution)) {
      return attribution.join(', ');
    }
    return attribution;
  }

  private async _getLayerById(
    layerId: string,
  ): Promise<ManagedLeafletLayer | null> {
    let layerFound: ManagedLeafletLayer | null = null;
    this.map?.eachLayer(layer => {
      if (this.getLayerId(layer) === layerId) {
        layerFound = layer as ManagedLeafletLayer;
      }
    });
    if (layerFound) return layerFound;

    layerFound =
      this.baseLayers.find(l => this.getLayerId(l) === layerId) ?? null;
    if (layerFound === undefined) return null;
    return layerFound;
  }

  private async createLayer(
    layerConfig: LayerConfig,
  ): Promise<ManagedLeafletLayer | null> {
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
      case 'wcs':
        return this.createWCSLayer(
          layerConfig as Extract<LayerConfig, { type: 'wcs' }>,
        );
      case 'wfs':
        return this.createWFSLayer(
          layerConfig as Extract<LayerConfig, { type: 'wfs' }>,
        );
      case 'arcgis':
        return this.createArcGISLayer(
          layerConfig as Extract<LayerConfig, { type: 'arcgis' }>,
        );
      case 'google':
        return this.createGoogleLayer(
          layerConfig as Extract<LayerConfig, { type: 'google' }>,
        );
      case 'wkt':
        return this.createWKTLayer(
          layerConfig as Extract<LayerConfig, { type: 'wkt' }>,
        );
      case 'geotiff':
        return this.createGeoTIFFLayer(
          layerConfig as Extract<LayerConfig, { type: 'geotiff' }>,
        );
      default:
        throw new Error(`Unsupported layer type: ${(layerConfig as LayerConfig).type}`);
    }
  }

  private async updateGeoJSONLayer(layer: L.Layer, data: Partial<Extract<LayerConfig, { type: 'geojson' }>>) {
    if (!(layer instanceof L.GeoJSON)) return;

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
      // Use geostyler style if available, otherwise use provided style or default style
      let layerOptions: L.GeoJSONOptions = {};

      if (config.geostylerStyle) {
        layerOptions = await this.createGeostylerLeafletOptions(
          config.geostylerStyle,
        );
      } else {
        const style = config.style
          ? { ...DEFAULT_STYLE, ...config.style }
          : DEFAULT_STYLE;
        layerOptions = {
          style: this.createLeafletStyle(style),
          pointToLayer: (feature, latlng) =>
            this.createLeafletPoint(feature, latlng, style),
          onEachFeature: (feature, layer) =>
            this.bindLeafletPopup(feature, layer, style),
        };
      }

      const layer = L.geoJSON(data, layerOptions);
      return layer;
    }
    return null;
  }

  private async createXYZLayer(
    config: Extract<LayerConfig, { type: 'xyz' }>,
  ): Promise<L.TileLayer> {
    const layer = L.tileLayer(config.url, {
      attribution: this.normalizeAttribution(config.attributions),
      maxZoom: config.maxZoom ?? 19,
      ...(config.options ?? {}),
    } as L.TileLayerOptions);
    return layer;
  }

  private async updateOSMLayer(layer: L.Layer, data: Partial<Extract<LayerConfig, { type: 'osm' }>>) {
    if (!('setUrl' in layer) || typeof layer.setUrl !== 'function') return;

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

  private buildArcGISUrl(
    url: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    if (!params || Object.keys(params).length === 0) return url;
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    });
    if (query.toString().length === 0) return url;
    return `${url}${url.includes('?') ? '&' : '?'}${query.toString()}`;
  }

  private async createArcGISLayer(
    config: Extract<LayerConfig, { type: 'arcgis' }>,
  ): Promise<L.TileLayer> {
    const params = {
      ...(config.params ?? {}),
    } as Record<string, string | number | boolean>;

    if (config.token) {
      params.token = config.token;
    }

    const arcgisUrl = this.buildArcGISUrl(config.url, params);

    const options: L.TileLayerOptions = {
      attribution: this.normalizeAttribution(config.attributions),
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      ...(config.options ?? {}),
    };

    return L.tileLayer(arcgisUrl, options);
  }

  private async updateArcGISLayer(layer: L.Layer, data: Partial<Extract<LayerConfig, { type: 'arcgis' }>>) {
    const params = {
      ...(data?.params ?? {}),
    } as Record<string, string | number | boolean>;

    if (data?.token) {
      params.token = data.token;
    }

    const tileLayer = layer as L.TileLayer;
    const targetUrl = data?.url ?? (tileLayer.options as Record<string, unknown>)?.url as string ?? '';
    const nextUrl = this.buildArcGISUrl(targetUrl, params);

    if ('setUrl' in tileLayer && typeof tileLayer.setUrl === 'function') {
      tileLayer.setUrl(nextUrl);
    }
  }

  private async createGoogleLayer(
    config: Extract<LayerConfig, { type: 'google' }>,
  ): Promise<L.GridLayer> {
    if (!this.map) throw new Error('Map not initialized');
    if (!config.apiKey)
      throw new Error("Google-Layer benötigt 'apiKey' (Google Maps Platform).");

    const parsedStyles =
      typeof config.styles === 'string'
        ? this.tryParseStyles(config.styles)
        : config.styles;

    const googleLayer = new GoogleMapTilesLayer({
      apiKey: config.apiKey,
      mapType: config.mapType ?? 'roadmap',
      language: config.language,
      region: config.region,
      scale: config.scale,
      highDpi: config.highDpi,
      layerTypes: config.layerTypes,
      overlay: config.overlay,
      styles: Array.isArray(parsedStyles) ? parsedStyles : undefined,
      imageFormat: config.imageFormat,
      apiOptions: config.apiOptions,
      maxZoom: config.maxZoom ?? 22,
    });

    ensureGoogleLogo(this.map, () => {
      this.googleLogoAdded = true;
      log(
        'v-map - provider - leaflet - googleLogoAdded: ',
        this.googleLogoAdded,
      );
    });
    return googleLayer;
  }

  private tryParseStyles(value: string): Record<string, unknown>[] | undefined {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      error('Failed to parse Google styles JSON');
      return undefined;
    }
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

  onLayerError(layerId: string, callback: LayerErrorCallback): void {
    this.layerErrorCallbacks.set(layerId, callback);
    this._getLayerById(layerId).then(layer => {
      if (!layer) return;
      const handler = () => { callback({ type: 'network', message: 'Tile load error' }); };
      layer.on('tileerror', handler);
      this.layerErrorCleanups.set(layerId, () => layer.off('tileerror', handler));
    });
  }

  offLayerError(layerId: string): void {
    this.layerErrorCleanups.get(layerId)?.();
    this.layerErrorCleanups.delete(layerId);
    this.layerErrorCallbacks.delete(layerId);
  }

  async removeLayer(layerId: string): Promise<void> {
    if (!layerId) {
      return;
    }
    this.offLayerError(layerId);
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

  private setOpacityByLayer(
    layer: ManagedLeafletLayer | null,
    opacity: number,
  ): Promise<void> {
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

  private setVisibleByLayer(
    layer: ManagedLeafletLayer | null,
    visible: boolean,
  ): Promise<void> {
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

    const hasLeafletClass = (
      candidate: L.Layer,
      className: 'GeoJSON' | 'LayerGroup' | 'Path' | 'Marker',
    ): boolean => {
      if (!(className in L)) return false;
      const ctor = (L as unknown as Record<string, unknown>)[className];
      return (
        typeof ctor === 'function' &&
        candidate instanceof (ctor as new (...args: never[]) => object)
      );
    };

    const isLayerCollection = (
      candidate: L.Layer,
    ): candidate is L.GeoJSON | L.LayerGroup =>
      hasLeafletClass(candidate, 'GeoJSON') ||
      hasLeafletClass(candidate, 'LayerGroup');
    const isPathLayer = (candidate: L.Layer): candidate is L.Path =>
      hasLeafletClass(candidate, 'Path');
    const isMarkerLayer = (candidate: L.Layer): candidate is L.Marker =>
      hasLeafletClass(candidate, 'Marker');

    if (isLayerCollection(layer)) {
      layer.eachLayer(subLayer => this.setLayerOpacity(subLayer, options));
    } else if (isPathLayer(layer)) {
      layer.setStyle({ opacity, fillOpacity });
    } else if (isMarkerLayer(layer)) {
      layer.setOpacity(opacity);
    } else if ('setOpacity' in layer) {
      (layer as L.GridLayer).setOpacity(opacity);
    }
  }

  async ensureGroup(
    groupId: string,
    visible: boolean,
    _opts?: { basemapid?: string },
  ): Promise<void> {
    await this._ensureGroup(groupId, visible);
  }

  private async _ensureGroup(
    groupId: string,
    visible?: boolean,
  ): Promise<L.LayerGroup> {
    let group = await this._getLayerGroupById(groupId);
    if (!group) {
      group = L.layerGroup() as ManagedLayerGroup;
      group._groupId = groupId;
      group.visible = true;
      group.addTo(this.map!);
      this.layers.push(group);
    }
    this.setGroupVisible(
      groupId,
      visible !== undefined ? visible : true,
    );
    return group;
  }

  private async _getLayerGroupById(
    groupId,
  ): Promise<ManagedLayerGroup | null> {
    if (!this.map) {
      return null;
    }
    let group = this.layers.find(
      l => l instanceof L.LayerGroup && l._groupId === groupId,
    ) as ManagedLayerGroup | undefined;
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

  private async updateWKTLayer(layer: L.Layer, data: Partial<Extract<LayerConfig, { type: 'wkt' }>>): Promise<void> {
    if (!(layer instanceof L.GeoJSON)) return;

    let geoJsonData: GeoJSON.FeatureCollection | null = null;
    if (data.wkt) {
      geoJsonData = await this.wktToGeoJSON(data.wkt);
    } else if (data.url) {
      try {
        const response = await fetch(data.url);
        if (!response.ok)
          throw new Error(`Failed to fetch WKT: ${response.status}`);
        const wktText = await response.text();
        geoJsonData = await this.wktToGeoJSON(wktText);
      } catch (e) {
        error('Failed to load WKT from URL:', e);
        return;
      }
    }

    if (geoJsonData) {
      (layer as L.GeoJSON).clearLayers();

      // Update layer options to use enhanced styling
      const geoJsonLayer = layer as L.GeoJSON;
      geoJsonLayer.options.style = this.createLeafletStyle(data.style);
      geoJsonLayer.options.pointToLayer = (feature, latlng) =>
        this.createLeafletPoint(feature, latlng, data.style);
      geoJsonLayer.options.onEachFeature = (feature, layer) =>
        this.bindLeafletPopup(feature, layer, data.style);

      geoJsonLayer.addData(geoJsonData);
    }
  }

  private async createWKTLayer(
    config: Extract<LayerConfig, { type: 'wkt' }>,
  ): Promise<ManagedLeafletLayer | null> {
    let geoJsonData: GeoJSON.FeatureCollection | null = null;
    const emptyCollection: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

    if (config.wkt) {
      geoJsonData = await this.wktToGeoJSON(config.wkt);
    } else if (config.url) {
      try {
        const response = await fetch(config.url);
        if (!response.ok)
          throw new Error(`Failed to fetch WKT: ${response.status}`);
        const wktText = await response.text();
        geoJsonData = await this.wktToGeoJSON(wktText);
      } catch (e) {
        error('Failed to load WKT from URL:', e);
        geoJsonData = emptyCollection;
      }
    } else {
      geoJsonData = emptyCollection;
    }

    log('[Leaflet WKT] Creating layer with GeoJSON data:', geoJsonData);
    log('[Leaflet WKT] Config:', config);

    // Use geostyler style if available, otherwise use config style or default
    let layerOptions: L.GeoJSONOptions = {};

    if (config.geostylerStyle) {
      layerOptions = await this.createGeostylerLeafletOptions(
        config.geostylerStyle,
      );
    } else {
      const style = config.style
        ? { ...DEFAULT_STYLE, ...config.style }
        : DEFAULT_STYLE;
      layerOptions = {
        style: this.createLeafletStyle(style),
        pointToLayer: (feature, latlng) =>
          this.createLeafletPoint(feature, latlng, style),
        onEachFeature: (feature, layer) =>
          this.bindLeafletPopup(feature, layer, style),
      };
    }

    log('[Leaflet WKT] Layer options:', layerOptions);

    const layer = L.geoJSON(geoJsonData, layerOptions);

    log('[Leaflet WKT] Created layer:', layer);
    if (typeof layer.getBounds === 'function') {
      log('[Leaflet WKT] Layer bounds:', layer.getBounds());
    }

    return layer;
  }

  private async wktToGeoJSON(wkt: string): Promise<GeoJSON.FeatureCollection> {
    try {
      // Use wellknown library to parse WKT into GeoJSON (browser-compatible)
      const geoJSON = wellknown.parse(wkt);

      if (!geoJSON) {
        throw new Error('Failed to parse WKT - returned null');
      }

      // Return as a Feature
      const feature: GeoJSON.Feature = {
        type: 'Feature',
        geometry: geoJSON as GeoJSON.Geometry,
        properties: {},
      };

      // Debug output to browser console
      log('[Leaflet WKT] Input WKT:', wkt);
      log('[Leaflet WKT] Generated GeoJSON:', JSON.stringify(feature, null, 2));

      const fc: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [feature],
      };
      return fc;
    } catch (e) {
      error('[Leaflet WKT] Failed to parse WKT:', wkt, e);
      // If parsing fails, return empty FeatureCollection
      const empty: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
      return empty;
    }
  }

  private async createGeoTIFFLayer(
    config: Extract<LayerConfig, { type: 'geotiff' }>,
  ): Promise<ManagedLeafletLayer | null> {
    if (!config.url) {
      throw new Error('GeoTIFF layer requires a URL');
    }

    try {
      const layer = new GeoTIFFGridLayer({
        url: config.url,
        tileSize: 256,
        colorMap: config.colorMap as Parameters<typeof getColorStops>[0],
        valueRange: config.valueRange,
        nodata: config.nodata,
        resolution: (config as Record<string, unknown>).resolution as GeoTIFFGridLayerOptions['resolution'],
        resampleMethod: (config as Record<string, unknown>).resampleMethod as GeoTIFFGridLayerOptions['resampleMethod'],
        viewProjection: this.map.options.crs.code,
      });
      if (config.opacity !== undefined) {
        (layer as ManagedLeafletLayer).setOpacity?.(config.opacity);
      }
      if (config.zIndex !== undefined) {
        (layer as ManagedLeafletLayer).setZIndex?.(config.zIndex);
      }
      return layer;
    } catch (err) {
      error('Failed to create GeoTIFF layer:', err);
      // Return a placeholder layer in case of error
      return L.layerGroup([]) as ManagedLeafletLayer;
    }
  }

  private async updateGeoTIFFLayer(layer: L.Layer, data: Partial<Extract<LayerConfig, { type: 'geotiff' }>>): Promise<void> {
    if (!data.url) {
      throw new Error('GeoTIFF update requires a URL');
    }

    if (!layer) return;
    if (!(layer instanceof GeoTIFFGridLayer)) return;
    const extData = data as Record<string, unknown>;
    await layer.updateSource({
      url: data.url,
      colorMap: data.colorMap as Parameters<typeof getColorStops>[0],
      valueRange: data.valueRange,
      nodata: data.nodata,
      resolution: extData.resolution as GeoTIFFGridLayerOptions['resolution'],
      resampleMethod: extData.resampleMethod as GeoTIFFGridLayerOptions['resampleMethod'],
    });
  }

  private async createWCSLayer(
    config: Extract<LayerConfig, { type: 'wcs' }>,
  ): Promise<ManagedLeafletLayer> {
    if (!config.url) {
      throw new Error('WCS layer requires a URL');
    }

    if (!config.coverageName) {
      throw new Error('WCS layer requires a coverageName');
    }

    try {
      const wcsOptions: WCSGridLayerOptions = {
        url: config.url,
        coverageName: config.coverageName,
        version: config.version ?? '2.0.1',
        format: config.format ?? 'image/tiff',
        projection: config.projection ?? 'EPSG:4326',
        params: config.params,
      };

      // Add GridLayer options
      if (config.tileSize) wcsOptions.tileSize = config.tileSize;
      if (config.minZoom !== undefined) wcsOptions.minZoom = config.minZoom;
      if (config.maxZoom !== undefined) wcsOptions.maxZoom = config.maxZoom;

      const layer = new WCSGridLayer(wcsOptions);

      if (config.opacity !== undefined) {
        (layer as ManagedLeafletLayer).setOpacity?.(config.opacity);
      }

      if (config.zIndex !== undefined) {
        (layer as ManagedLeafletLayer).setZIndex?.(config.zIndex);
      }

      return layer;
    } catch (err) {
      error('[Leaflet WCS] Failed to create WCS layer:', err);
      // Return a placeholder layer in case of error
      return L.layerGroup([]) as unknown as ManagedLeafletLayer;
    }
  }

  private async updateWCSLayer(layer: L.Layer, data: Partial<Extract<LayerConfig, { type: 'wcs' }>>): Promise<void> {
    if (!layer) return;

    if (layer instanceof WCSGridLayer) {
      const updateOptions: Partial<WCSGridLayerOptions> = {};

      if (data.url) updateOptions.url = data.url;
      if (data.coverageName) updateOptions.coverageName = data.coverageName;
      if (data.version) updateOptions.version = data.version;
      if (data.format) updateOptions.format = data.format;
      if (data.projection) updateOptions.projection = data.projection;
      if (data.params) updateOptions.params = data.params;

      layer.updateOptions(updateOptions);
    }
  }

  // ========== Enhanced Styling Methods ==========

  /**
   * Convert a Geostyler style to Leaflet GeoJSON options
   */
  private async createGeostylerLeafletOptions(
    geostylerStyle: Style,
  ): Promise<L.GeoJSONOptions> {
    // Helper to extract static value from GeoStyler property
    const getValue = (prop: unknown, defaultValue: unknown = undefined): unknown => {
      if (prop === undefined || prop === null) return defaultValue;
      // If it's a GeoStyler function object, we can't evaluate it here - return default
      if (typeof prop === 'object' && (prop as Record<string, unknown>).name) return defaultValue;
      return prop;
    };

    const options: L.GeoJSONOptions = {
      style: (feature?: GeoJSONFeature) => {
        const geometryType = feature?.geometry?.type;
        let leafletStyle: L.PathOptions = {};

        if (geostylerStyle.rules) {
          for (const rule of geostylerStyle.rules) {
            if (rule.symbolizers) {
              for (const symbolizer of rule.symbolizers) {
                switch (symbolizer.kind) {
                  case 'Fill':
                    if (
                      geometryType === 'Polygon' ||
                      geometryType === 'MultiPolygon'
                    ) {
                      const fillColor = getValue(
                        symbolizer.color,
                        'rgba(0,100,255,0.3)',
                      ) as string;
                      const fillOpacity = getValue(
                        symbolizer.opacity,
                        0.3,
                      ) as number;
                      const outlineColor = getValue(
                        symbolizer.outlineColor,
                        'rgba(0,100,255,1)',
                      ) as string;
                      const outlineWidth = getValue(
                        symbolizer.outlineWidth,
                        1,
                      ) as number;

                      leafletStyle = {
                        ...leafletStyle,
                        fillColor: fillColor,
                        fillOpacity: fillOpacity,
                        color: outlineColor,
                        weight: outlineWidth,
                      };
                    }
                    break;

                  case 'Line':
                    const lineColor = getValue(
                      symbolizer.color,
                      'rgba(0,100,255,1)',
                    ) as string;
                    const lineWidth = getValue(symbolizer.width, 2) as number;
                    const dashArray = symbolizer.dasharray
                      ? Array.isArray(symbolizer.dasharray)
                        ? symbolizer.dasharray
                            .map((v: unknown) => getValue(v, 0) as number)
                            .join(',')
                        : undefined
                      : undefined;

                    leafletStyle = {
                      ...leafletStyle,
                      color: lineColor,
                      weight: lineWidth,
                      dashArray: dashArray,
                    };
                    break;
                }
              }
            }
          }
        }

        return leafletStyle;
      },

      pointToLayer: (_feature: GeoJSONFeature, latlng: L.LatLng) => {
        if (geostylerStyle.rules) {
          for (const rule of geostylerStyle.rules) {
            if (rule.symbolizers) {
              for (const symbolizer of rule.symbolizers) {
                switch (symbolizer.kind) {
                  case 'Mark':
                    const markColor = getValue(
                      symbolizer.color,
                      'rgba(0,100,255,1)',
                    ) as string;
                    const markRadius = getValue(symbolizer.radius, 6) as number;
                    const strokeColor = getValue(
                      symbolizer.strokeColor,
                      'rgba(0,100,255,1)',
                    ) as string;
                    const strokeWidth = getValue(
                      symbolizer.strokeWidth,
                      2,
                    ) as number;

                    return L.circleMarker(latlng, {
                      radius: markRadius,
                      fillColor: markColor,
                      fillOpacity: 1,
                      color: strokeColor,
                      weight: strokeWidth,
                    });

                  case 'Icon':
                    const iconSrc = getValue(symbolizer.image) as
                      | string
                      | undefined;
                    const iconSize = getValue(symbolizer.size, 32) as number;

                    if (iconSrc && typeof iconSrc === 'string') {
                      const icon = L.icon({
                        iconUrl: iconSrc,
                        iconSize: [iconSize, iconSize],
                        iconAnchor: [iconSize / 2, iconSize],
                      });
                      return L.marker(latlng, { icon });
                    }
                    break;
                }
              }
            }
          }
        }

        // Default point style
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: 'rgba(0,100,255,1)',
          fillOpacity: 1,
          color: 'rgba(0,100,255,1)',
          weight: 2,
        });
      },

      onEachFeature: (feature: GeoJSONFeature, layer: L.Layer) => {
        if (geostylerStyle.rules) {
          for (const rule of geostylerStyle.rules) {
            if (rule.symbolizers) {
              for (const symbolizer of rule.symbolizers) {
                if (symbolizer.kind === 'Text') {
                  const labelProp = (symbolizer as TextSymbolizer).label;
                  if (
                    labelProp &&
                    typeof labelProp === 'string' &&
                    feature.properties &&
                    feature.properties[labelProp]
                  ) {
                    const textContent = String(feature.properties[labelProp]);
                    const textColor = getValue(
                      symbolizer.color,
                      '#000000',
                    ) as string;
                    const textSize = getValue(symbolizer.size, 12) as number;

                    const styledText = `<div style="color: ${textColor}; font-size: ${textSize}px; font-family: Arial, sans-serif;">${textContent}</div>`;

                    layer.bindTooltip(styledText, {
                      permanent: true,
                      direction: 'center',
                      className: 'leaflet-tooltip-custom',
                    });
                  }
                }
              }
            }
          }
        }
      },
    };

    return options;
  }

  private createLeafletStyle(style?: StyleConfig) {
    return (feature?: GeoJSONFeature): L.PathOptions => {
      const geometryType = feature?.geometry?.type;

      const fillColor = style?.fillColor ?? 'rgba(0,100,255,0.3)';
      const fillOpacity = style?.fillOpacity ?? 0.3;
      const strokeColor = style?.strokeColor ?? 'rgba(0,100,255,1)';
      const strokeOpacity = style?.strokeOpacity ?? 1;
      const strokeWidth = style?.strokeWidth ?? 2;

      if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
        return {
          fillColor,
          fillOpacity,
          color: strokeColor,
          opacity: strokeOpacity,
          weight: strokeWidth,
          dashArray: style?.strokeDashArray
            ? style.strokeDashArray.join(',')
            : undefined,
        };
      }

      if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
        return {
          color: strokeColor,
          opacity: strokeOpacity,
          weight: strokeWidth,
          dashArray: style?.strokeDashArray
            ? style.strokeDashArray.join(',')
            : undefined,
        };
      }

      return {};
    };
  }

  private createLeafletPoint(
    feature: GeoJSONFeature,
    latlng: L.LatLng,
    style?: StyleConfig,
  ): L.Layer {
    let finalStyle: StyleConfig = { ...(style ?? {}) };
    if (style?.styleFunction) {
      const conditionalStyle = style.styleFunction(feature) as
        | StyleConfig
        | undefined;
      if (conditionalStyle) {
        finalStyle = {
          ...style,
          ...conditionalStyle,
        };
      }
    }

    if (finalStyle?.iconUrl) {
      // Create icon marker
      const iconSize = finalStyle.iconSize || [32, 32];
      const iconAnchor = finalStyle.iconAnchor || [
        iconSize[0] / 2,
        iconSize[1],
      ];

      const icon = L.icon({
        iconUrl: finalStyle.iconUrl,
        iconSize: iconSize,
        iconAnchor: iconAnchor,
      });

      return L.marker(latlng, { icon });
    } else {
      // Create circle marker
      const pointColor = finalStyle?.pointColor ?? 'rgba(0,100,255,1)';
      const pointOpacity = finalStyle?.pointOpacity ?? 1;
      const pointRadius = finalStyle?.pointRadius ?? 6;
      const strokeColor = finalStyle?.strokeColor ?? 'rgba(0,100,255,1)';
      const strokeOpacity = finalStyle?.strokeOpacity ?? 1;
      const strokeWidth = finalStyle?.strokeWidth ?? 2;

      return L.circleMarker(latlng, {
        radius: pointRadius,
        fillColor: pointColor,
        fillOpacity: pointOpacity,
        color: strokeColor,
        opacity: strokeOpacity,
        weight: strokeWidth,
      });
    }
  }

  private bindLeafletPopup(
    feature: GeoJSONFeature,
    layer: L.Layer,
    style?: StyleConfig,
  ): void {
    // Text labeling via popup or tooltip - handle undefined style
    if (
      style?.textProperty &&
      feature.properties &&
      feature.properties[style.textProperty]
    ) {
      const textContent = String(feature.properties[style.textProperty]);
      const textColor = style?.textColor ?? '#000000';
      const textSize = style?.textSize ?? 12;

      // Create styled text content
      const styledText = `<div style="color: ${textColor}; font-size: ${textSize}px; font-family: Arial, sans-serif;">${textContent}</div>`;

      // Bind as permanent tooltip for labels or popup for clickable info
      layer.bindTooltip(styledText, {
        permanent: true,
        direction: 'center',
        className: 'leaflet-tooltip-custom',
      });
    }
  }

  private async createWFSLayer(
    config: Extract<LayerConfig, { type: 'wfs' }>,
  ): Promise<L.GeoJSON> {
    const geojson = await this.fetchWFSFromUrl(config);

    // Use geostyler style if available, otherwise use provided style or default style
    let layerOptions: L.GeoJSONOptions = {};

    if (config.geostylerStyle) {
      layerOptions = await this.createGeostylerLeafletOptions(
        config.geostylerStyle,
      );
    } else {
      const style = config.style
        ? { ...DEFAULT_STYLE, ...config.style }
        : DEFAULT_STYLE;
      layerOptions = {
        style: this.createLeafletStyle(style),
        pointToLayer: (feature, latlng) =>
          this.createLeafletPoint(feature, latlng, style),
        onEachFeature: (feature, layer) =>
          this.bindLeafletPopup(feature, layer, style),
      };
    }

    const layer = L.geoJSON(geojson, layerOptions);
    return layer;
  }

  private async updateWFSLayer(layer: L.GeoJSON, data: Partial<Extract<LayerConfig, { type: 'wfs' }>>): Promise<void> {
    const geojson = await this.fetchWFSFromUrl(data as Extract<LayerConfig, { type: 'wfs' }>);
    layer.clearLayers();
    layer.addData(geojson);
  }

  private async fetchWFSFromUrl(
    config: Extract<LayerConfig, { type: 'wfs' }>,
  ): Promise<GeoJSON.GeoJsonObject> {
    const baseParams = {
      service: 'WFS',
      request: 'GetFeature',
      version: config.version ?? '1.1.0',
      typeName: config.typeName,
      outputFormat: config.outputFormat ?? 'application/json',
      srsName: config.srsName ?? 'EPSG:4326',
    };

    const params = { ...baseParams, ...(config.params ?? {}) };
    const requestUrl = this.appendParams(config.url, params);

    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(
        `WFS request failed (${response.status} ${response.statusText})`,
      );
    }

    const outputFormat = (
      config.outputFormat ?? 'application/json'
    ).toLowerCase();

    // Handle JSON formats
    if (
      outputFormat.includes('json') ||
      outputFormat.includes('geojson') ||
      outputFormat === 'application/json'
    ) {
      return (await response.json()) as GeoJSON.GeoJsonObject;
    }

    // Handle GML formats - parse XML to GeoJSON using gml2geojson
    if (outputFormat.includes('gml') || outputFormat.includes('xml')) {
      const xml = await response.text();
      const parser = new GmlParser();
      return (await parser.parse(xml)) as GeoJSON.GeoJsonObject;
    }

    // Default: try to parse as JSON
    return (await response.json()) as GeoJSON.GeoJsonObject;
  }

  private appendParams(
    baseUrl: string,
    params: Record<string, string | number | boolean>,
  ): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    });
    if (!query.toString()) return baseUrl;
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${query.toString()}`;
  }

  getMap() {
    return this.map;
  }
}
