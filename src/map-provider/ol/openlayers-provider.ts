import type Map from 'ol/Map';

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
import { log, error } from '../../utils/logger';
import { injectOlCss } from './openlayers-helper';

type AnyLayer = BaseLayer | LayerGroup | VectorLayer;

export class OpenLayersProvider implements MapProvider {
  private map!: Map;
  private layers: AnyLayer[] = [];
  private baseLayers: Layer[] = [];
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
      case 'wms':
        await this.updateWMSLayer(layer, update.data);
        break;
      case 'wkt':
        await this.updateWKTLayer(layer, update.data);
        break;
      case 'geotiff':
        await this.updateGeoTIFFLayer(layer, update.data);
        break;
    }
  }

  private async _ensureGroup(groupId: string): Promise<LayerGroup> {
    const { default: LayerGroup } = await import('ol/layer/Group');
    let group = this.layers.find(
      l => (l as LayerGroup).get?.('groupId') === groupId,
    ) as LayerGroup | undefined;

    if (!group) {
      group = new LayerGroup({
        layers: [],
        properties: { groupId: groupId },
      });
      this.map.addLayer(group);
      this.layers.push(group);
    }
    return group;
  }

  async setBaseLayer(groupId: string, layerElementId: string): Promise<void> {
    if (layerElementId === null) {
      log('ol - setBaseLayer - layerElementId is null.');
      return;
    }
    let group = this.layers.find(
      l => (l as LayerGroup).get?.('groupId') === groupId,
    ) as LayerGroup | undefined;

    const layer = this.baseLayers.find(
      l => l.get('layerElementId') === layerElementId,
    );
    if (layer === undefined) {
      log(
        'ol - setBaseLayer - layer not found. layerElementId: ' +
          layerElementId,
      );
      return;
    }

    group.getLayers().clear();
    group.getLayers().push(layer);
    //group.set('layerId', layerId, false);
  }

  async addBaseLayer(
    layerConfig: LayerConfig,
    basemapid: string,
    layerElementId: string,
  ): Promise<string> {
    if (layerElementId === undefined || layerElementId === null) {
      log('ol - addBaseLayer - layerElementId not set.');
      return null;
    }
    if (basemapid === undefined || basemapid === null) {
      log('ol - addBaseLayer - basemapid not set.');
    }

    const group = await this._ensureGroup(layerConfig.groupId);
    group.set('basemap', true, false);

    const layer = await this.createLayer(layerConfig);

    layer.set('group', group);
    this.baseLayers.push(layer);

    let layerId: string = null;
    if (layer) {
      layerId = crypto.randomUUID();
      layer.set('id', layerId, false);

      layer.set('layerElementId', layerElementId, false);

      if ((layerConfig as any).opacity !== undefined) {
        layer.setOpacity((layerConfig as any).opacity);
      }
      if ((layerConfig as any).zIndex !== undefined) {
        layer.setZIndex((layerConfig as any).zIndex);
      }
      if ((layerConfig as any).visible) {
        layer.setVisible(true);
      } else if ((layerConfig as any).visible === false) {
        layer.setVisible(false);
      }

      if (basemapid === layerElementId) {
        group.getLayers().clear();
        group.getLayers().push(layer);
        //group.set('layerId', layerId, false);
      }
    }
    return layerId;
  }

  async addLayerToGroup(
    layerConfig: LayerConfig,
    groupId: string,
  ): Promise<string> {
    const group = await this._ensureGroup(groupId);

    const layer = await this.createLayer(layerConfig);

    if (layer === null) {
      return null;
    }
    layer.set('group', group);
    group.getLayers().push(layer);

    const layerId = crypto.randomUUID();
    layer.set('id', layerId, false);

    if ((layerConfig as any).opacity !== undefined) {
      layer.setOpacity((layerConfig as any).opacity);
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

  // async addLayer(layerConfig: LayerConfig): Promise<string> {
  //   let layerId: string = null;
  //   let layer: Layer = null;
  //   if ('groupId' in layerConfig && layerConfig.groupId) {
  //     try {
  //       layer = await this.addLayerToGroup(
  //         layerConfig as LayerConfig & { groupId: string },
  //       );
  //     } catch (ex) {
  //       error('addLayer - Unerwarteter Fehler:', ex);
  //       return null;
  //     }
  //   } else {
  //     try {
  //       layer = await this.addStandaloneLayer(layerConfig);
  //     } catch (ex) {
  //       error('addLayer - Unerwarteter Fehler:', ex);
  //       return null;
  //     }
  //   }
  //   if (layer) {
  //     layerId = crypto.randomUUID();
  //     layer.set('id', layerId, false);

  //     if ((layerConfig as any).opacity !== undefined) {
  //       layer.setOpacity((layerConfig as any).opacity);
  //     }
  //     if ((layerConfig as any).zIndex !== undefined) {
  //       layer.setZIndex((layerConfig as any).zIndex);
  //     }
  //     if ((layerConfig as any).visible) {
  //       layer.setVisible(true);
  //     } else if ((layerConfig as any).visible === false) {
  //       layer.setVisible(false);
  //     }
  //     return layerId;
  //   }

  //   return layerId;
  // }

  // private async addStandaloneLayer(layerConfig: LayerConfig): Promise<Layer> {
  //   const layer = await this.createLayer(layerConfig);
  //   this.map.addLayer(layer);
  //   this.layers.push(layer);
  //   return layer;
  // }

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

  private async updateWMSLayer(layer: Layer, data: any): Promise<void> {
    const [{ default: TileWMS }] = await Promise.all([
      import('ol/source/TileWMS'),
    ]);

    layer.setSource(
      new TileWMS({
        url: data.url,
        params: {
          LAYERS: data.layers,
          TILED: true,
          ...(data.params ?? {}),
        },
      }),
    );
  }

  private async updateOSMLayer(layer: Layer, data: any): Promise<void> {
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
      { default: Circle },
      { default: Icon },
      { default: Text },
    ] = await Promise.all([
      import('ol/layer/Vector'),
      import('ol/source/Vector'),
      import('ol/format/GeoJSON'),
      import('ol/style/Style'),
      import('ol/style/Fill'),
      import('ol/style/Stroke'),
      import('ol/style/Circle'),
      import('ol/style/Icon'),
      import('ol/style/Text'),
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

    // Create enhanced style function
    const styleFunction = (feature: any) => {
      const styles = [];
      const geometry = feature.getGeometry();
      const geometryType = geometry.getType();

      // Base style configuration
      const style = config.style || {};

      // Create fill style
      const fillColor = style.fillColor ?? 'rgba(0,100,255,0.3)';
      const fillOpacity = style.fillOpacity ?? 0.3;
      const fill = new Fill({
        color: this.applyOpacity(fillColor, fillOpacity),
      });

      // Create stroke style
      const strokeColor = style.strokeColor ?? 'rgba(0,100,255,1)';
      const strokeOpacity = style.strokeOpacity ?? 1;
      const strokeWidth = style.strokeWidth ?? 2;
      const stroke = new Stroke({
        color: this.applyOpacity(strokeColor, strokeOpacity),
        width: strokeWidth,
        lineDash: style.strokeDashArray,
      });

      // Point styling
      if (geometryType === 'Point') {
        if (style.iconUrl) {
          // Icon style for points
          styles.push(new Style({
            image: new Icon({
              src: style.iconUrl,
              size: style.iconSize || [32, 32],
              anchor: style.iconAnchor || [0.5, 1],
            }),
          }));
        } else {
          // Circle style for points
          const pointColor = style.pointColor ?? 'rgba(0,100,255,1)';
          const pointOpacity = style.pointOpacity ?? 1;
          const pointRadius = style.pointRadius ?? 6;

          styles.push(new Style({
            image: new Circle({
              radius: pointRadius,
              fill: new Fill({
                color: this.applyOpacity(pointColor, pointOpacity),
              }),
              stroke: stroke,
            }),
          }));
        }
      } else {
        // Polygon and line styling
        styles.push(new Style({
          fill: geometryType.includes('Polygon') ? fill : undefined,
          stroke: stroke,
        }));
      }

      // Text labeling
      if (style.textProperty && feature.get(style.textProperty)) {
        const textColor = style.textColor ?? '#000000';
        const textSize = style.textSize ?? 12;
        const textHaloColor = style.textHaloColor;
        const textHaloWidth = style.textHaloWidth ?? 2;
        const textOffset = style.textOffset || [0, 0];

        styles.push(new Style({
          text: new Text({
            text: String(feature.get(style.textProperty)),
            font: `${textSize}px Arial`,
            fill: new Fill({ color: textColor }),
            stroke: textHaloColor ? new Stroke({
              color: textHaloColor,
              width: textHaloWidth,
            }) : undefined,
            offsetX: textOffset[0],
            offsetY: textOffset[1],
          }),
        }));
      }

      return styles;
    };

    const layer = new VectorLayer({
      source: vectorSource,
      style: config.style ? styleFunction : undefined,
    });
    return layer;
  }

  // Helper method to apply opacity to colors
  private applyOpacity(color: string, opacity: number): string {
    if (color.startsWith('rgba')) {
      // Extract rgb values and apply new opacity
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    } else if (color.startsWith('rgb')) {
      const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    } else if (color.startsWith('#')) {
      // Convert hex to rgba
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color; // Return original if can't parse
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
        error('Google source error', err);
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
          ...(config.extraParams ?? {}),
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
    if (layerFound) return layerFound;

    layerFound = this.baseLayers.find(l => l.get('id') === layerId);
    if (layerFound === undefined) return null;
    return layerFound;
  }

  private async _getLayerGroupById(groupId): Promise<LayerGroup> {
    if (!this.map) {
      return null;
    }
    let group = this.layers.find(
      l => (l as LayerGroup).get?.('groupId') === groupId,
    ) as LayerGroup | undefined;
    if (group !== undefined) return group;
    return null;
  }

  async removeLayer(layerId: string): Promise<void> {
    if (!layerId) {
      return;
    }
    const layer = await this._getLayerById(layerId);
    if (layer) {
      const group = layer.get('group');
      if (group) group.getLayers().remove(layer);
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

  async setGroupVisible(groupId: string, visible: boolean): Promise<void> {
    const layer = await this._getLayerGroupById(groupId);
    if (layer) {
      layer.setVisible(visible);
    }
  }

  private async updateWKTLayer(layer: Layer, data: any): Promise<void> {
    const [
      { default: VectorSource },
      { default: WKT },
    ] = await Promise.all([
      import('ol/source/Vector'),
      import('ol/format/WKT'),
    ]);

    const wktFormat = new WKT();
    let vectorSource: VectorSource = null;

    if (data.wkt) {
      // Parse WKT string directly
      const feature = wktFormat.readFeature(data.wkt, {
        featureProjection: this.projection,
      });
      vectorSource = new VectorSource({
        features: [feature],
      });
    } else if (data.url) {
      // Fetch WKT from URL
      const response = await fetch(data.url);
      if (!response.ok) throw new Error(`Failed to fetch WKT: ${response.status}`);
      const wktText = await response.text();
      const feature = wktFormat.readFeature(wktText, {
        featureProjection: this.projection,
      });
      vectorSource = new VectorSource({
        features: [feature],
      });
    }

    if (vectorSource) {
      (layer as VectorLayer).setSource(vectorSource);
    }
  }

  private async createWKTLayer(
    config: Extract<LayerConfig, { type: 'wkt' }>,
  ): Promise<Layer> {
    const [
      { default: VectorLayer },
      { default: VectorSource },
      { default: WKT },
      { default: Style },
      { default: Fill },
      { default: Stroke },
      { default: Circle },
      { default: Icon },
      { default: Text },
    ] = await Promise.all([
      import('ol/layer/Vector'),
      import('ol/source/Vector'),
      import('ol/format/WKT'),
      import('ol/style/Style'),
      import('ol/style/Fill'),
      import('ol/style/Stroke'),
      import('ol/style/Circle'),
      import('ol/style/Icon'),
      import('ol/style/Text'),
    ]);

    const wktFormat = new WKT();
    let vectorSource: VectorSource = null;

    const wktOptions = {
      featureProjection: this.projection,
    };

    if (config.wkt) {
      // Parse WKT string directly
      try {
        const feature = wktFormat.readFeature(config.wkt, wktOptions);
        vectorSource = new VectorSource({
          features: [feature],
        });
      } catch (e) {
        error('Failed to parse WKT:', e);
        vectorSource = new VectorSource({ features: [] });
      }
    } else if (config.url) {
      // Fetch WKT from URL
      try {
        const response = await fetch(config.url);
        if (!response.ok) throw new Error(`Failed to fetch WKT: ${response.status}`);
        const wktText = await response.text();
        const feature = wktFormat.readFeature(wktText, wktOptions);
        vectorSource = new VectorSource({
          features: [feature],
        });
      } catch (e) {
        error('Failed to load WKT from URL:', e);
        vectorSource = new VectorSource({ features: [] });
      }
    } else {
      vectorSource = new VectorSource({ features: [] });
    }

    // Create enhanced style function (reuse the same logic as GeoJSON)
    const styleFunction = (feature: any) => {
      const styles = [];
      const geometry = feature.getGeometry();
      const geometryType = geometry.getType();

      // Base style configuration
      const style = config.style || {};

      // Create fill style
      const fillColor = style.fillColor ?? 'rgba(0,100,255,0.3)';
      const fillOpacity = style.fillOpacity ?? 0.3;
      const fill = new Fill({
        color: this.applyOpacity(fillColor, fillOpacity),
      });

      // Create stroke style
      const strokeColor = style.strokeColor ?? 'rgba(0,100,255,1)';
      const strokeOpacity = style.strokeOpacity ?? 1;
      const strokeWidth = style.strokeWidth ?? 2;
      const stroke = new Stroke({
        color: this.applyOpacity(strokeColor, strokeOpacity),
        width: strokeWidth,
        lineDash: style.strokeDashArray,
      });

      // Point styling
      if (geometryType === 'Point') {
        if (style.iconUrl) {
          // Icon style for points
          styles.push(new Style({
            image: new Icon({
              src: style.iconUrl,
              size: style.iconSize || [32, 32],
              anchor: style.iconAnchor || [0.5, 1],
            }),
          }));
        } else {
          // Circle style for points
          const pointColor = style.pointColor ?? 'rgba(0,100,255,1)';
          const pointOpacity = style.pointOpacity ?? 1;
          const pointRadius = style.pointRadius ?? 6;

          styles.push(new Style({
            image: new Circle({
              radius: pointRadius,
              fill: new Fill({
                color: this.applyOpacity(pointColor, pointOpacity),
              }),
              stroke: stroke,
            }),
          }));
        }
      } else {
        // Polygon and line styling
        styles.push(new Style({
          fill: geometryType.includes('Polygon') ? fill : undefined,
          stroke: stroke,
        }));
      }

      // Text labeling
      if (style.textProperty && feature.get(style.textProperty)) {
        const textColor = style.textColor ?? '#000000';
        const textSize = style.textSize ?? 12;
        const textHaloColor = style.textHaloColor;
        const textHaloWidth = style.textHaloWidth ?? 2;
        const textOffset = style.textOffset || [0, 0];

        styles.push(new Style({
          text: new Text({
            text: String(feature.get(style.textProperty)),
            font: `${textSize}px Arial`,
            fill: new Fill({ color: textColor }),
            stroke: textHaloColor ? new Stroke({
              color: textHaloColor,
              width: textHaloWidth,
            }) : undefined,
            offsetX: textOffset[0],
            offsetY: textOffset[1],
          }),
        }));
      }

      return styles;
    };

    const layer = new VectorLayer({
      source: vectorSource,
      style: config.style ? styleFunction : undefined,
      opacity: config.opacity ?? 1,
      visible: config.visible ?? true,
      zIndex: config.zIndex ?? 1000,
    });

    return layer;
  }

  private async createGeoTIFFLayer(
    config: Extract<LayerConfig, { type: 'geotiff' }>,
  ): Promise<Layer> {
    const [{ default: GeoTIFF }, { default: TileLayer }] = await Promise.all([
      import('ol/source/GeoTIFF'),
      import('ol/layer/Tile'),
    ]);

    if (!config.url) {
      throw new Error('GeoTIFF layer requires a URL');
    }

    const source = new GeoTIFF({
      sources: [
        {
          url: config.url,
        },
      ],
    });

    const layer = new TileLayer({
      source,
      opacity: config.opacity ?? 1,
      visible: config.visible ?? true,
      zIndex: config.zIndex ?? 1000,
    });

    return layer;
  }

  private async updateGeoTIFFLayer(layer: Layer, data: any): Promise<void> {
    const [{ default: GeoTIFF }] = await Promise.all([
      import('ol/source/GeoTIFF'),
    ]);

    if (!data.url) {
      throw new Error('GeoTIFF update requires a URL');
    }

    const newSource = new GeoTIFF({
      sources: [
        {
          url: data.url,
        },
      ],
    });

    (layer as any).setSource(newSource);
  }

  getMap() {
    return this.map;
  }
}
