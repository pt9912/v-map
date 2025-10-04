import type { MapProvider, LayerUpdate } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';

import { watchElementResize, Unsubscribe } from '../../utils/dom-env';

// Leaflet ESM
import * as L from 'leaflet';

import { isBrowser } from '../../utils/dom-env';
import { log, error } from '../../utils/logger';
import type { StyleConfig } from '../../types/styleconfig';
import { DEFAULT_STYLE } from '../../types/styleconfig';
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
      case 'arcgis':
        await this.updateArcGISLayer(layer, update.data);
        break;
      case 'wkt':
        await this.updateWKTLayer(layer, update.data);
        break;
      case 'geotiff':
        await this.updateGeoTIFFLayer(layer, update.data);
        break;
      case 'wfs':
        await this.updateWFSLayer(layer, update.data);
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
      // Use geostyler style if available, otherwise use provided style or default style
      let layerOptions: L.GeoJSONOptions = {};

      if (config.geostylerStyle) {
        layerOptions = await this.createGeostylerLeafletOptions(
          config.geostylerStyle,
        );
      } else {
        const style = config.style ? { ...DEFAULT_STYLE, ...config.style } : DEFAULT_STYLE;
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
      attribution: config.attributions,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      ...(config.options ?? {}),
    };

    return L.tileLayer(arcgisUrl, options);
  }

  private async updateArcGISLayer(layer: L.Layer, data: any) {
    const params = {
      ...(data?.params ?? {}),
    } as Record<string, string | number | boolean>;

    if (data?.token) {
      params.token = data.token;
    }

    const targetUrl = data?.url ?? (layer as any).options?.url ?? '';
    const nextUrl = this.buildArcGISUrl(targetUrl, params);

    if ((layer as any).setUrl) {
      (layer as any).setUrl(nextUrl);
    }
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

  private async updateWKTLayer(layer: L.Layer, data: any): Promise<void> {
    if (!(layer instanceof L.GeoJSON)) return;

    let geoJsonData = null;
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
  ): Promise<L.Layer> {
    let geoJsonData = null;

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
        geoJsonData = { type: 'FeatureCollection', features: [] };
      }
    } else {
      geoJsonData = { type: 'FeatureCollection', features: [] };
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
      const style = config.style ? { ...DEFAULT_STYLE, ...config.style } : DEFAULT_STYLE;
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
    if (typeof (layer as any).getBounds === 'function') {
      log('[Leaflet WKT] Layer bounds:', (layer as any).getBounds());
    }

    return layer;
  }

  private async wktToGeoJSON(wkt: string): Promise<any> {
    try {
      // Use wellknown library to parse WKT into GeoJSON (browser-compatible)
      const wellknown = await import('wellknown');
      const geoJSON = wellknown.parse(wkt);

      if (!geoJSON) {
        throw new Error('Failed to parse WKT - returned null');
      }

      // Return as a Feature
      const feature = {
        type: 'Feature',
        geometry: geoJSON,
        properties: {},
      };

      // Debug output to browser console
      log('[Leaflet WKT] Input WKT:', wkt);
      log('[Leaflet WKT] Generated GeoJSON:', JSON.stringify(feature, null, 2));

      return {
        type: 'FeatureCollection',
        features: [feature],
      };
    } catch (e) {
      error('[Leaflet WKT] Failed to parse WKT:', wkt, e);
      // If parsing fails, return empty FeatureCollection
      return { type: 'FeatureCollection', features: [] };
    }
  }

  private async createGeoTIFFLayer(
    config: Extract<LayerConfig, { type: 'geotiff' }>,
  ): Promise<L.Layer> {
    if (!config.url) {
      throw new Error('GeoTIFF layer requires a URL');
    }

    try {
      // Dynamic import of georaster dependencies
      const [{ default: parseGeoraster }, GeoRasterLayer] = await Promise.all([
        import('georaster' as any),
        import('georaster-layer-for-leaflet' as any),
      ]);

      // Fetch and parse the GeoTIFF
      const response = await fetch(config.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch GeoTIFF: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);

      // Create the layer using georaster-layer-for-leaflet
      const layer = new GeoRasterLayer.default({
        georaster: georaster,
        opacity: config.opacity ?? 1.0,
        resolution: 256, // Adjust as needed
      }) as L.Layer;

      return layer;
    } catch (error) {
      error('Failed to create GeoTIFF layer:', error);
      // Return a placeholder layer in case of error
      return L.layerGroup([]);
    }
  }

  private async updateGeoTIFFLayer(layer: L.Layer, data: any): Promise<void> {
    if (!data.url) {
      throw new Error('GeoTIFF update requires a URL');
    }

    try {
      // Dynamic import of georaster dependencies
      const [{ default: parseGeoraster }, GeoRasterLayer] = await Promise.all([
        import('georaster' as any),
        import('georaster-layer-for-leaflet' as any),
      ]);

      // Fetch and parse the new GeoTIFF
      const response = await fetch(data.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch GeoTIFF: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);

      // Update the layer's georaster
      if ((layer as any).updateGeoraster) {
        (layer as any).updateGeoraster(georaster);
      } else {
        // If update method not available, remove and re-add
        if (this.map && layer && this.map.hasLayer(layer)) {
          this.map.removeLayer(layer);
        }

        const newLayer = new GeoRasterLayer.default({
          georaster: georaster,
          opacity: 1.0,
          resolution: 256,
        });

        if (this.map) {
          newLayer.addTo(this.map);
        }
      }
    } catch (error) {
      error('Failed to update GeoTIFF layer:', error);
    }
  }

  // ========== Enhanced Styling Methods ==========

  /**
   * Convert a Geostyler style to Leaflet GeoJSON options
   */
  private async createGeostylerLeafletOptions(
    geostylerStyle: any,
  ): Promise<L.GeoJSONOptions> {
    // Helper to extract static value from GeoStyler property
    const getValue = (prop: any, defaultValue: any = undefined) => {
      if (prop === undefined || prop === null) return defaultValue;
      // If it's a GeoStyler function object, we can't evaluate it here - return default
      if (typeof prop === 'object' && prop.name) return defaultValue;
      return prop;
    };

    const options: L.GeoJSONOptions = {
      style: (feature: any) => {
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
                            .map((v: any) => getValue(v, 0) as number)
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

      pointToLayer: (_feature: any, latlng: L.LatLng) => {
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

      onEachFeature: (feature: any, layer: L.Layer) => {
        if (geostylerStyle.rules) {
          for (const rule of geostylerStyle.rules) {
            if (rule.symbolizers) {
              for (const symbolizer of rule.symbolizers) {
                if (symbolizer.kind === 'Text') {
                  const labelProp = (symbolizer as any).label;
                  if (
                    labelProp &&
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
    return (feature: any): L.PathOptions => {
      const geometryType = feature.geometry?.type;

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
    feature: any,
    latlng: L.LatLng,
    style?: StyleConfig,
  ): L.Layer {
    let finalStyle: StyleConfig = { ...(style ?? {}) };
    if (style?.styleFunction) {
      const conditionalStyle = style.styleFunction(feature) as StyleConfig | undefined;
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
    feature: any,
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
      const style = config.style ? { ...DEFAULT_STYLE, ...config.style } : DEFAULT_STYLE;
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

  private async updateWFSLayer(layer: L.GeoJSON, data: any): Promise<void> {
    const geojson = await this.fetchWFSFromUrl(data);
    layer.clearLayers();
    layer.addData(geojson);
  }

  private async fetchWFSFromUrl(
    config: Extract<LayerConfig, { type: 'wfs' }>,
  ): Promise<any> {
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

    const outputFormat = (config.outputFormat ?? 'application/json').toLowerCase();

    // Handle JSON formats
    if (
      outputFormat.includes('json') ||
      outputFormat.includes('geojson') ||
      outputFormat === 'application/json'
    ) {
      return await response.json();
    }

    // Handle GML formats - parse XML to GeoJSON using gml2geojson
    if (
      outputFormat.includes('gml') ||
      outputFormat.includes('xml')
    ) {
      const xml = await response.text();
      const { parseGML } = await import('gml2geojson');
      return parseGML(xml);
    }

    // Default: try to parse as JSON
    return await response.json();
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
