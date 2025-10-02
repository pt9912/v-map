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
import { Style } from 'geostyler-style';

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
      case 'wfs':
        await this.updateWFSLayer(layer, update.data);
        break;
      case 'wcs':
        await this.updateWCSLayer(layer, update.data);
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
      case 'wfs':
        return this.createWFSLayer(
          layerConfig as Extract<LayerConfig, { type: 'wfs' }>,
        );
      case 'wcs':
        return this.createWCSLayer(
          layerConfig as Extract<LayerConfig, { type: 'wcs' }>,
        );
      case 'arcgis':
        return this.createArcGISLayer(
          layerConfig as Extract<LayerConfig, { type: 'arcgis' }>,
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

  private async updateWFSLayer(layer: Layer, data: any) {
    const merged = this.mergeLayerConfig(layer, 'wfsConfig', data);
    const geojson = await this.fetchWFSGeoJSON(merged);
    const vectorSource = await this.createVectorSourceFromGeoJSON(geojson);
    layer.setSource(vectorSource);
  }

  private async updateWCSLayer(layer: Layer, data: any) {
    const merged = this.mergeLayerConfig(layer, 'wcsConfig', data);
    const source = await this.createWcsSource(merged);
    (layer as any).setSource(source);
  }

  private async updateArcGISLayer(layer: Layer, data: any): Promise<void> {
    const [{ default: TileArcGISRest }] = await Promise.all([
      import('ol/source/TileArcGISRest'),
    ]);

    const currentSource: any = (layer as any).getSource?.();
    const params = {
      ...(currentSource?.getParams?.() ?? {}),
      ...(data?.params ?? {}),
    } as Record<string, any>;

    if (data?.token) {
      params.token = data.token;
    }

    const sourceOptions: Record<string, any> = {
      url: data?.url ?? currentSource?.getUrls?.()?.[0] ?? currentSource?.getUrl?.(),
      params,
      ...(data?.options ?? {}),
    };

    const arcgisSource = new TileArcGISRest(sourceOptions);
    (layer as any).setSource?.(arcgisSource);
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
          styles.push(
            new Style({
              image: new Icon({
                src: style.iconUrl,
                size: style.iconSize || [32, 32],
                anchor: style.iconAnchor || [0.5, 1],
              }),
            }),
          );
        } else {
          // Circle style for points
          const pointColor = style.pointColor ?? 'rgba(0,100,255,1)';
          const pointOpacity = style.pointOpacity ?? 1;
          const pointRadius = style.pointRadius ?? 6;

          styles.push(
            new Style({
              image: new Circle({
                radius: pointRadius,
                fill: new Fill({
                  color: this.applyOpacity(pointColor, pointOpacity),
                }),
                stroke: stroke,
              }),
            }),
          );
        }
      } else {
        // Polygon and line styling
        styles.push(
          new Style({
            fill: geometryType.includes('Polygon') ? fill : undefined,
            stroke: stroke,
          }),
        );
      }

      // Text labeling
      if (style.textProperty && feature.get(style.textProperty)) {
        const textColor = style.textColor ?? '#000000';
        const textSize = style.textSize ?? 12;
        const textHaloColor = style.textHaloColor;
        const textHaloWidth = style.textHaloWidth ?? 2;
        const textOffset = style.textOffset || [0, 0];

        styles.push(
          new Style({
            text: new Text({
              text: String(feature.get(style.textProperty)),
              font: `${textSize}px Arial`,
              fill: new Fill({ color: textColor }),
              stroke: textHaloColor
                ? new Stroke({
                    color: textHaloColor,
                    width: textHaloWidth,
                  })
                : undefined,
              offsetX: textOffset[0],
              offsetY: textOffset[1],
            }),
          }),
        );
      }

      return styles;
    };

    // Use geostyler style if available, otherwise use default style function
    let layerStyle;
    if ((config as any).geostylerStyle) {
      layerStyle = await this.createGeostylerStyleFunction(
        (config as any).geostylerStyle,
      );
    } else if (config.style) {
      layerStyle = styleFunction;
    }

    const layer = new VectorLayer({
      source: vectorSource,
      style: layerStyle,
    });
    return layer;
  }

  private async createWFSLayer(
    config: Extract<LayerConfig, { type: 'wfs' }>,
  ): Promise<Layer> {
    const [{ default: VectorLayer }] = await Promise.all([
      import('ol/layer/Vector'),
    ]);

    const geojson = await this.fetchWFSGeoJSON(config);
    const vectorSource = await this.createVectorSourceFromGeoJSON(geojson);

    const layer = new VectorLayer({
      source: vectorSource,
      visible: config.visible ?? true,
    });
    layer.setOpacity(config.opacity ?? 1);
    layer.set('wfsConfig', config, false);
    return layer as unknown as Layer;
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

  /**
   * Convert a Geostyler style to OpenLayers style function
   */
  private async createGeostylerStyleFunction(geostylerStyle: Style) {
    const [
      { default: Style },
      { default: Fill },
      { default: Stroke },
      { default: Circle },
      { default: Icon },
      { default: Text },
    ] = await Promise.all([
      import('ol/style/Style'),
      import('ol/style/Fill'),
      import('ol/style/Stroke'),
      import('ol/style/Circle'),
      import('ol/style/Icon'),
      import('ol/style/Text'),
    ]);

    // Helper to extract static value from GeoStyler property (could be function or value)
    const getValue = (prop: any, defaultValue: any = undefined) => {
      if (prop === undefined || prop === null) return defaultValue;
      // If it's a GeoStyler function object, we can't evaluate it here - return default
      if (typeof prop === 'object' && prop.name) return defaultValue;
      return prop;
    };

    return (feature: any) => {
      const styles = [];
      const geometry = feature.getGeometry();
      const geometryType = geometry.getType();

      // Process each rule in the geostyler style
      if (geostylerStyle.rules) {
        for (const rule of geostylerStyle.rules) {
          // TODO: Add filter evaluation for rule.filter

          if (rule.symbolizers) {
            for (const symbolizer of rule.symbolizers) {
              switch (symbolizer.kind) {
                case 'Fill':
                  if (geometryType.includes('Polygon')) {
                    const fillColor = getValue(symbolizer.color, 'rgba(0,100,255,0.3)') as string;
                    const outlineColor = getValue(symbolizer.outlineColor) as string | undefined;
                    const outlineWidth = getValue(symbolizer.outlineWidth, 1) as number;

                    styles.push(
                      new Style({
                        fill: new Fill({
                          color: fillColor,
                        }),
                        stroke: outlineColor
                          ? new Stroke({
                              color: outlineColor,
                              width: outlineWidth,
                            })
                          : undefined,
                      }),
                    );
                  }
                  break;

                case 'Line':
                  {
                    const lineColor = getValue(symbolizer.color, 'rgba(0,100,255,1)') as string;
                    const lineWidth = getValue(symbolizer.width, 1) as number;
                    const dashArray = symbolizer.dasharray
                      ? (Array.isArray(symbolizer.dasharray)
                          ? symbolizer.dasharray.map(v => getValue(v, 0) as number)
                          : undefined)
                      : undefined;

                    styles.push(
                      new Style({
                        stroke: new Stroke({
                          color: lineColor,
                          width: lineWidth,
                          lineDash: dashArray,
                        }),
                      }),
                    );
                  }
                  break;

                case 'Mark':
                  if (geometryType === 'Point') {
                    const markColor = getValue(symbolizer.color, 'rgba(0,100,255,1)') as string;
                    const markRadius = getValue(symbolizer.radius, 6) as number;
                    const strokeColor = getValue(symbolizer.strokeColor) as string | undefined;
                    const strokeWidth = getValue(symbolizer.strokeWidth, 1) as number;

                    styles.push(
                      new Style({
                        image: new Circle({
                          radius: markRadius,
                          fill: new Fill({
                            color: markColor,
                          }),
                          stroke: strokeColor
                            ? new Stroke({
                                color: strokeColor,
                                width: strokeWidth,
                              })
                            : undefined,
                        }),
                      }),
                    );
                  }
                  break;

                case 'Icon':
                  if (geometryType === 'Point') {
                    const iconSrc = getValue(symbolizer.image) as string | undefined;
                    const iconSize = getValue(symbolizer.size, 32) as number;
                    const iconOpacity = getValue(symbolizer.opacity, 1) as number;

                    if (iconSrc && typeof iconSrc === 'string') {
                      styles.push(
                        new Style({
                          image: new Icon({
                            src: iconSrc,
                            size: [iconSize, iconSize],
                            opacity: iconOpacity,
                          }),
                        }),
                      );
                    }
                  }
                  break;

                case 'Text':
                  {
                    const labelProp = (symbolizer as any).label;
                    if (labelProp && feature.get(labelProp)) {
                      const textColor = getValue(symbolizer.color, '#000000') as string;
                      const textSize = getValue(symbolizer.size, 12) as number;
                      const textFont = getValue((symbolizer as any).font, 'Arial') as string;
                      const haloColor = getValue((symbolizer as any).haloColor) as string | undefined;
                      const haloWidth = getValue((symbolizer as any).haloWidth, 1) as number;
                      const offset = (symbolizer as any).offset;
                      const offsetX = offset && Array.isArray(offset) ? getValue(offset[0], 0) as number : 0;
                      const offsetY = offset && Array.isArray(offset) ? getValue(offset[1], 0) as number : 0;

                      styles.push(
                        new Style({
                          text: new Text({
                            text: String(feature.get(labelProp)),
                            font: `${textSize}px ${textFont}`,
                            fill: new Fill({
                              color: textColor,
                            }),
                            stroke: haloColor
                              ? new Stroke({
                                  color: haloColor,
                                  width: haloWidth,
                                })
                              : undefined,
                            offsetX: offsetX,
                            offsetY: offsetY,
                          }),
                        }),
                      );
                    }
                  }
                  break;
              }
            }
          }
        }
      }
      return styles.length > 0 ? styles : undefined;
    };
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
    const [{ default: VectorSource }, { default: WKT }] = await Promise.all([
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
      if (!response.ok)
        throw new Error(`Failed to fetch WKT: ${response.status}`);
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
        if (!response.ok)
          throw new Error(`Failed to fetch WKT: ${response.status}`);
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
          styles.push(
            new Style({
              image: new Icon({
                src: style.iconUrl,
                size: style.iconSize || [32, 32],
                anchor: style.iconAnchor || [0.5, 1],
              }),
            }),
          );
        } else {
          // Circle style for points
          const pointColor = style.pointColor ?? 'rgba(0,100,255,1)';
          const pointOpacity = style.pointOpacity ?? 1;
          const pointRadius = style.pointRadius ?? 6;

          styles.push(
            new Style({
              image: new Circle({
                radius: pointRadius,
                fill: new Fill({
                  color: this.applyOpacity(pointColor, pointOpacity),
                }),
                stroke: stroke,
              }),
            }),
          );
        }
      } else {
        // Polygon and line styling
        styles.push(
          new Style({
            fill: geometryType.includes('Polygon') ? fill : undefined,
            stroke: stroke,
          }),
        );
      }

      // Text labeling
      if (style.textProperty && feature.get(style.textProperty)) {
        const textColor = style.textColor ?? '#000000';
        const textSize = style.textSize ?? 12;
        const textHaloColor = style.textHaloColor;
        const textHaloWidth = style.textHaloWidth ?? 2;
        const textOffset = style.textOffset || [0, 0];

        styles.push(
          new Style({
            text: new Text({
              text: String(feature.get(style.textProperty)),
              font: `${textSize}px Arial`,
              fill: new Fill({ color: textColor }),
              stroke: textHaloColor
                ? new Stroke({
                    color: textHaloColor,
                    width: textHaloWidth,
                  })
                : undefined,
              offsetX: textOffset[0],
              offsetY: textOffset[1],
            }),
          }),
        );
      }

      return styles;
    };

    // Use geostyler style if available, otherwise use default style function
    let layerStyle;
    if ((config as any).geostylerStyle) {
      layerStyle = await this.createGeostylerStyleFunction(
        (config as any).geostylerStyle,
      );
    } else if (config.style) {
      layerStyle = styleFunction;
    }

    const layer = new VectorLayer({
      source: vectorSource,
      style: layerStyle,
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

  private async createWCSLayer(
    config: Extract<LayerConfig, { type: 'wcs' }>,
  ): Promise<Layer> {
    const [{ default: ImageLayer }] = await Promise.all([
      import('ol/layer/Image'),
    ]);

    const source = await this.createWcsSource(config);
    const layer = new ImageLayer({
      source,
      visible: config.visible ?? true,
      opacity: config.opacity ?? 1,
    });
    layer.set('wcsConfig', config, false);
    return layer as unknown as Layer;
  }

  private async fetchWFSGeoJSON(
    config: Extract<LayerConfig, { type: 'wfs' }>,
  ): Promise<any> {
    const baseParams = {
      service: 'WFS',
      request: 'GetFeature',
      version: config.version ?? '1.1.0',
      typeName: config.typeName,
      outputFormat: config.outputFormat ?? 'application/json',
      srsName: config.srsName ?? (this.projection as string),
    };

    const params = { ...baseParams, ...(config.params ?? {}) };
    const requestUrl = this.appendParams(config.url, params);

    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(
        `WFS request failed (${response.status} ${response.statusText})`,
      );
    }
    return await response.json();
  }

  private async createVectorSourceFromGeoJSON(geojson: any): Promise<VectorSource> {
    const [{ default: VectorSource }, { default: GeoJSON }] = await Promise.all([
      import('ol/source/Vector'),
      import('ol/format/GeoJSON'),
    ]);

    const format = new GeoJSON({ featureProjection: this.projection });
    return new VectorSource({
      features: format.readFeatures(geojson),
    });
  }

  private mergeLayerConfig(
    layer: Layer,
    key: string,
    data: any,
  ) {
    const previous = (layer as any).get?.(key) ?? {};
    const merged = { ...previous, ...data };
    (layer as any).set?.(key, merged, false);
    return merged;
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

  private async createWcsSource(
    config: Extract<LayerConfig, { type: 'wcs' }>,
  ) {
    const [
      { default: ImageWMS },
    ] = await Promise.all([
      import('ol/source/ImageWMS'),
    ]);

    const params = {
      SERVICE: 'WCS',
      REQUEST: 'GetCoverage',
      VERSION: config.version ?? '1.1.0',
      FORMAT: config.format ?? 'image/tiff',
      COVERAGE: config.coverageName,
      coverageId: config.coverageName,
      ...((config.params as any) ?? {}),
    };

    const query = this.appendParams(config.url, params);

    return new ImageWMS({
      url: query,
      params: {},
      projection: config.projection ?? this.projection,
      resolutions: config.resolutions,
      ratio: 1,
    });
  }

  private async createArcGISLayer(
    config: Extract<LayerConfig, { type: 'arcgis' }>,
  ): Promise<Layer> {
    const [{ default: TileLayer }] = await Promise.all([
      import('ol/layer/Tile'),
    ]);
    const [{ default: TileArcGISRest }] = await Promise.all([
      import('ol/source/TileArcGISRest'),
    ]);

    const params = {
      ...(config.params ?? {}),
    } as Record<string, any>;

    if (config.token) {
      params.token = config.token;
    }

    const sourceOptions: Record<string, any> = {
      url: config.url,
      params,
      ...(config.options ?? {}),
    };

    const layer = new TileLayer({
      source: new TileArcGISRest(sourceOptions),
      visible: config.visible ?? true,
    });

    return layer as unknown as Layer;
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
