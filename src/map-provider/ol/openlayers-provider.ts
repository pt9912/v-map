import Map from 'ol/Map';
import View from 'ol/View';
import type Layer from 'ol/layer/Layer';
import type BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import Google from 'ol/source/Google';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import OlImageWrapper from 'ol/Image';
import ImageSource from 'ol/source/Image';
import GeoJSON from 'ol/format/GeoJSON';
import GML2 from 'ol/format/GML2';
import GML3 from 'ol/format/GML3';
import GML32 from 'ol/format/GML32';
import WKT from 'ol/format/WKT';
import Control from 'ol/control/Control';
import OlStyle from 'ol/style/Style';
import OlFill from 'ol/style/Fill';
import OlStroke from 'ol/style/Stroke';
import OlCircle from 'ol/style/Circle';
import OlIcon from 'ol/style/Icon';
import OlText from 'ol/style/Text';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { fromLonLat, toLonLat, type ProjectionLike } from 'ol/proj';
import type Projection from 'ol/proj/Projection';
import type { FeatureLike } from 'ol/Feature';
import type FeatureFormat from 'ol/format/Feature';
import type { Extent } from 'ol/extent';

import type { MapProvider, LayerUpdate, LayerErrorCallback } from '../../types/mapprovider';
import type TileSource from 'ol/source/Tile';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';
import type { StyleConfig } from '../../types/styleconfig';
import { DEFAULT_STYLE } from '../../types/styleconfig';
import { log, error } from '../../utils/logger';
import { injectOlCss } from './openlayers-helper';
import type {
  Style as GeoStylerStyle,
  TextSymbolizer,
} from 'geostyler-style';

import { createCustomGeoTiff } from './CustomGeoTiff';

import WebGLTileLayer from 'ol/layer/WebGLTile';
import type { SourceInfo } from 'ol/source/GeoTIFF';

type AnyLayer = BaseLayer | LayerGroup | VectorLayer;

/** Properties common to every LayerConfig variant */
interface LayerConfigCommon {
  opacity?: number;
  zIndex?: number;
  visible?: boolean;
}

export class OpenLayersProvider implements MapProvider {
  private map!: Map;
  private layers: AnyLayer[] = [];
  private baseLayers: Layer[] = [];
  private googleLogoAdded = false;
  private projection: ProjectionLike = 'EPSG:3857';
  private layerErrorCallbacks: globalThis.Map<string, LayerErrorCallback> = new globalThis.Map();
  private layerErrorCleanups: globalThis.Map<string, () => void> = new globalThis.Map();

  async init(options: ProviderOptions) {
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
    this.map?.setTarget(undefined);
    this.map = undefined as unknown as Map;
  }

  async updateLayer(layerId: string, update: LayerUpdate): Promise<void> {
    const layer = await this._getLayerById(layerId);
    switch (update.type) {
      case 'geojson':
        await this.updateGeoJSONLayer(layer as VectorLayer, update.data);
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
        await this.updateWKTLayer(layer as VectorLayer, update.data);
        break;
      case 'geotiff':
        await this.updateGeoTIFFLayer(layer, update.data);
        break;
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
  ): Promise<LayerGroup> {
    if (!this.map) {
      return null;
    }
    let group = this.layers.find(
      l => (l as LayerGroup).get?.('groupId') === groupId,
    ) as LayerGroup | undefined;

    if (!group) {
      group = new LayerGroup({
        layers: [],
        properties: {
          groupId: groupId,
          visible: typeof visible !== undefined ? visible : true,
        },
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
    const group = this.layers.find(
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

    const group = await this._ensureGroup(
      layerConfig.groupId,
      layerConfig.groupVisible,
    );
    if (group == null) {
      return null;
    }
    group.set('basemap', true, false);

    const layer = await this.createLayer(layerConfig);
    if (layer == null) {
      return null;
    }

    layer.set('group', group);
    this.baseLayers.push(layer);

    let layerId: string = null;
    if (layer) {
      layerId = crypto.randomUUID();
      layer.set('id', layerId, false);

      layer.set('layerElementId', layerElementId, false);

      const common = layerConfig as LayerConfigCommon;
      if (common.opacity !== undefined) {
        layer.setOpacity(common.opacity);
      }
      if (common.zIndex !== undefined) {
        layer.setZIndex(common.zIndex);
      }
      if (common.visible) {
        layer.setVisible(true);
      } else if (common.visible === false) {
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

  async addLayerToGroup(layerConfig: LayerConfig): Promise<string> {
    const group = await this._ensureGroup(
      layerConfig.groupId,
      layerConfig.groupVisible,
    );
    if (group == null) {
      return null;
    }
    const layer = await this.createLayer(layerConfig);
    if (layer === null) {
      return null;
    }
    layer.set('group', group);
    group.getLayers().push(layer);

    const layerId = crypto.randomUUID();
    layer.set('id', layerId, false);

    const common = layerConfig as LayerConfigCommon;
    if (common.opacity !== undefined) {
      layer.setOpacity(common.opacity);
    }
    if (common.zIndex !== undefined) {
      layer.setZIndex(common.zIndex);
    }
    if (common.visible) {
      layer.setVisible(true);
    } else if (common.visible === false) {
      layer.setVisible(false);
    }
    return layerId;
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
        throw new Error(`Unsupported layer type: ${(layerConfig as Record<string, unknown>).type}`);
    }
  }

  private async updateWMSLayer(layer: Layer, data: Partial<Extract<LayerConfig, { type: 'wms' }>>): Promise<void> {
    layer.setSource(
      new TileWMS({
        url: data.url,
        params: {
          LAYERS: data.layers,
          TILED: true,
          ...(data.extraParams ?? {}),
        },
      }),
    );
  }

  private async updateOSMLayer(layer: Layer, data: Partial<Extract<LayerConfig, { type: 'osm' }>>): Promise<void> {
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

  private async updateGeoJSONLayer(layer: VectorLayer, data: Partial<Extract<LayerConfig, { type: 'geojson' }>>) {
    let vectorSource: VectorSource = null;
    const geojsonOptions = {
      featureProjection: this.projection,
    };
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

    let layerStyle;
    if (data.geostylerStyle) {
      layerStyle = await this.createGeostylerStyleFunction(data.geostylerStyle);
    } else if (data.style) {
      layerStyle = await this.createEnhancedStyleFunction(data.style);
    }
    if (layerStyle) {
      layer.setStyle(layerStyle);
    }
  }

  private async updateWFSLayer(layer: Layer, data: Partial<Extract<LayerConfig, { type: 'wfs' }>>) {
    const merged = this.mergeLayerConfig(layer, 'wfsConfig', data) as unknown as Extract<LayerConfig, { type: 'wfs' }>;

    const vectorSource = await this.createWFSSpource(merged);
    layer.setSource(vectorSource);

    // Apply style if provided
    let layerStyle;
    if (merged.geostylerStyle) {
      layerStyle = await this.createGeostylerStyleFunction(
        merged.geostylerStyle,
      );
    } else if (merged.style) {
      layerStyle = await this.createEnhancedStyleFunction(merged.style);
    }
    if (layerStyle) {
      (layer as VectorLayer).setStyle(layerStyle);
    }
  }

  private async updateWCSLayer(layer: Layer, data: Partial<Extract<LayerConfig, { type: 'wcs' }>>) {
    const merged = this.mergeLayerConfig(layer, 'wcsConfig', data);
    const source = await this.createWcsSource(merged as Extract<LayerConfig, { type: 'wcs' }>);
    (layer as ImageLayer<ImageSource>).setSource(source);
  }

  private async updateArcGISLayer(layer: Layer, data: Partial<Extract<LayerConfig, { type: 'arcgis' }>>): Promise<void> {
    const tileLayer = layer as TileLayer;
    const currentSource = tileLayer.getSource() as TileArcGISRest | null;
    const params = {
      ...(currentSource?.getParams?.() ?? {}),
      ...(data?.params ?? {}),
    } as Record<string, string | number | boolean>;

    if (data?.token) {
      params.token = data.token;
    }

    const sourceOptions: Record<string, unknown> = {
      url:
        data?.url ??
        currentSource?.getUrls?.()?.[0],
      params,
      ...(data?.options ?? {}),
    };

    const arcgisSource = new TileArcGISRest(sourceOptions);
    tileLayer.setSource(arcgisSource);
  }

  private async createEnhancedStyleFunction(style: StyleConfig) {
    // Helper method to apply opacity to colors
    function applyOpacity(color: string, opacity: number): string {
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

    return (feature: FeatureLike) => {
      const styles: OlStyle[] = [];
      const geometry = feature.getGeometry();
      const geometryType = geometry.getType();

      // Create fill style
      const fillColor = style.fillColor ?? 'rgba(0,100,255,0.3)';
      const fillOpacity = style.fillOpacity ?? 0.3;
      const fill = new OlFill({
        color: applyOpacity(fillColor, fillOpacity),
      });

      // Create stroke style
      const strokeColor = style.strokeColor ?? 'rgba(0,100,255,1)';
      const strokeOpacity = style.strokeOpacity ?? 1;
      const strokeWidth = style.strokeWidth ?? 2;
      const stroke = new OlStroke({
        color: applyOpacity(strokeColor, strokeOpacity),
        width: strokeWidth,
        lineDash: style.strokeDashArray,
      });

      // Point styling
      if (geometryType === 'Point') {
        if (style.iconUrl) {
          // Icon style for points
          styles.push(
            new OlStyle({
              image: new OlIcon({
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
            new OlStyle({
              image: new OlCircle({
                radius: pointRadius,
                fill: new OlFill({
                  color: applyOpacity(pointColor, pointOpacity),
                }),
                stroke: stroke,
              }),
            }),
          );
        }
      } else {
        // Polygon and line styling
        styles.push(
          new OlStyle({
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
          new OlStyle({
            text: new OlText({
              text: String(feature.get(style.textProperty)),
              font: `${textSize}px Arial`,
              fill: new OlFill({ color: textColor }),
              stroke: textHaloColor
                ? new OlStroke({
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
  }

  private async createGeoJSONLayer(
    config: Extract<LayerConfig, { type: 'geojson' }>,
  ): Promise<Layer> {
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

    // // Create enhanced style function
    // const styleFunction = (feature: any) => {
    //   const styles = [];
    //   const geometry = feature.getGeometry();
    //   const geometryType = geometry.getType();

    //   // Base style configuration
    //   const style = config.style || {};

    //   // Create fill style
    //   const fillColor = style.fillColor ?? 'rgba(0,100,255,0.3)';
    //   const fillOpacity = style.fillOpacity ?? 0.3;
    //   const fill = new Fill({
    //     color: this.applyOpacity(fillColor, fillOpacity),
    //   });

    //   // Create stroke style
    //   const strokeColor = style.strokeColor ?? 'rgba(0,100,255,1)';
    //   const strokeOpacity = style.strokeOpacity ?? 1;
    //   const strokeWidth = style.strokeWidth ?? 2;
    //   const stroke = new Stroke({
    //     color: this.applyOpacity(strokeColor, strokeOpacity),
    //     width: strokeWidth,
    //     lineDash: style.strokeDashArray,
    //   });

    //   // Point styling
    //   if (geometryType === 'Point') {
    //     if (style.iconUrl) {
    //       // Icon style for points
    //       styles.push(
    //         new Style({
    //           image: new Icon({
    //             src: style.iconUrl,
    //             size: style.iconSize || [32, 32],
    //             anchor: style.iconAnchor || [0.5, 1],
    //           }),
    //         }),
    //       );
    //     } else {
    //       // Circle style for points
    //       const pointColor = style.pointColor ?? 'rgba(0,100,255,1)';
    //       const pointOpacity = style.pointOpacity ?? 1;
    //       const pointRadius = style.pointRadius ?? 6;

    //       styles.push(
    //         new Style({
    //           image: new Circle({
    //             radius: pointRadius,
    //             fill: new Fill({
    //               color: this.applyOpacity(pointColor, pointOpacity),
    //             }),
    //             stroke: stroke,
    //           }),
    //         }),
    //       );
    //     }
    //   } else {
    //     // Polygon and line styling
    //     styles.push(
    //       new Style({
    //         fill: geometryType.includes('Polygon') ? fill : undefined,
    //         stroke: stroke,
    //       }),
    //     );
    //   }

    //   // Text labeling
    //   if (style.textProperty && feature.get(style.textProperty)) {
    //     const textColor = style.textColor ?? '#000000';
    //     const textSize = style.textSize ?? 12;
    //     const textHaloColor = style.textHaloColor;
    //     const textHaloWidth = style.textHaloWidth ?? 2;
    //     const textOffset = style.textOffset || [0, 0];

    //     styles.push(
    //       new Style({
    //         text: new Text({
    //           text: String(feature.get(style.textProperty)),
    //           font: `${textSize}px Arial`,
    //           fill: new Fill({ color: textColor }),
    //           stroke: textHaloColor
    //             ? new Stroke({
    //                 color: textHaloColor,
    //                 width: textHaloWidth,
    //               })
    //             : undefined,
    //           offsetX: textOffset[0],
    //           offsetY: textOffset[1],
    //         }),
    //       }),
    //     );
    //   }

    //   return styles;
    // };

    // Use geostyler style if available, otherwise use default style function
    let layerStyle;
    if (config.geostylerStyle) {
      layerStyle = await this.createGeostylerStyleFunction(
        config.geostylerStyle,
      );
    } else {
      const style = config.style
        ? { ...DEFAULT_STYLE, ...config.style }
        : DEFAULT_STYLE;
      layerStyle = await this.createEnhancedStyleFunction(style);
    }

    const layer = new VectorLayer({
      source: vectorSource,
      style: layerStyle,
    });
    return layer;
  }

  private async createWFSSpource(
    config: Extract<LayerConfig, { type: 'wfs' }>,
  ): Promise<VectorSource> {
    const outputFormat = (
      config.outputFormat ?? 'application/json'
    ).toLowerCase();
    let format: FeatureFormat = new GeoJSON();
    switch (outputFormat) {
      case 'gml2':
        format = new GML2();
        break;
      case 'gml3':
        format = new GML3();
        break;
      case 'gml32':
        format = new GML32();
        break;
    }

    const urlFunction = this.getWFSGetFeatureUrl(config);

    const vectorSource = new VectorSource({
      format: format,
      url: urlFunction,
      strategy: bboxStrategy,
    });
    return vectorSource;
  }

  private async createWFSLayer(
    config: Extract<LayerConfig, { type: 'wfs' }>,
  ): Promise<Layer> {
    const vectorSource = await this.createWFSSpource(config);

    // Use geostyler style if available, otherwise use default style function
    let layerStyle;
    if (config.geostylerStyle) {
      layerStyle = await this.createGeostylerStyleFunction(
        config.geostylerStyle,
      );
    } else {
      const style = config.style
        ? { ...DEFAULT_STYLE, ...config.style }
        : DEFAULT_STYLE;
      layerStyle = await this.createEnhancedStyleFunction(style);
    }

    const layer = new VectorLayer({
      source: vectorSource,
      style: layerStyle,
    });
    layer.set('wfsConfig', config, false);
    return layer;
  }

  // private async createWFSLayer2(
  //   config: Extract<LayerConfig, { type: 'wfs' }>,
  // ): Promise<Layer> {
  //   const [{ default: VectorLayer }] = await Promise.all([
  //     import('ol/layer/Vector'),
  //   ]);

  //   const geojson = await this.fetchWFSFromUrl(config);
  //   const vectorSource = await this.createVectorSourceFromGeoJSON(geojson);

  //   // Use geostyler style if available, otherwise use default style function
  //   let layerStyle;
  //   if (config.geostylerStyle) {
  //     layerStyle = await this.createGeostylerStyleFunction(
  //       config.geostylerStyle,
  //     );
  //   } else {
  //     const style = config.style
  //       ? { ...DEFAULT_STYLE, ...config.style }
  //       : DEFAULT_STYLE;
  //     layerStyle = await this.createEnhancedStyleFunction(style);
  //   }

  //   const layer = new VectorLayer({
  //     source: vectorSource,
  //     style: layerStyle,
  //     visible: config.visible ?? true,
  //   });
  //   layer.set('wfsConfig', config, false);
  //   return layer as unknown as Layer;
  // }

  /**
   * Convert a GeoStyler style to an OpenLayers style function.
   *
   * TODO: Replace this hand-rolled conversion (~200 lines) with
   * geostyler-openlayers-parser's writeStyle(). The official parser
   * covers more symbolizer types, handles filters, and stays in sync
   * with the GeoStyler spec. See:
   * https://github.com/geostyler/geostyler-openlayers-parser
   */
  private async createGeostylerStyleFunction(geostylerStyle: GeoStylerStyle) {
    // Helper to extract static value from GeoStyler property (could be function or value)
    const getValue = (prop: unknown, defaultValue: unknown = undefined): unknown => {
      if (prop === undefined || prop === null) return defaultValue;
      // If it's a GeoStyler function object, we can't evaluate it here - return default
      if (typeof prop === 'object' && (prop as Record<string, unknown>).name) return defaultValue;
      return prop;
    };

    return (feature: FeatureLike) => {
      const styles: OlStyle[] = [];
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
                    const fillColor = getValue(
                      symbolizer.color,
                      'rgba(0,100,255,0.3)',
                    ) as string;
                    const outlineColor = getValue(symbolizer.outlineColor) as
                      | string
                      | undefined;
                    const outlineWidth = getValue(
                      symbolizer.outlineWidth,
                      1,
                    ) as number;

                    styles.push(
                      new OlStyle({
                        fill: new OlFill({
                          color: fillColor,
                        }),
                        stroke: outlineColor
                          ? new OlStroke({
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
                    const lineColor = getValue(
                      symbolizer.color,
                      'rgba(0,100,255,1)',
                    ) as string;
                    const lineWidth = getValue(symbolizer.width, 1) as number;
                    const dashArray = symbolizer.dasharray
                      ? Array.isArray(symbolizer.dasharray)
                        ? symbolizer.dasharray.map(
                            v => getValue(v, 0) as number,
                          )
                        : undefined
                      : undefined;

                    styles.push(
                      new OlStyle({
                        stroke: new OlStroke({
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
                    const markColor = getValue(
                      symbolizer.color,
                      'rgba(0,100,255,1)',
                    ) as string;
                    const markRadius = getValue(symbolizer.radius, 6) as number;
                    const strokeColor = getValue(symbolizer.strokeColor) as
                      | string
                      | undefined;
                    const strokeWidth = getValue(
                      symbolizer.strokeWidth,
                      1,
                    ) as number;

                    styles.push(
                      new OlStyle({
                        image: new OlCircle({
                          radius: markRadius,
                          fill: new OlFill({
                            color: markColor,
                          }),
                          stroke: strokeColor
                            ? new OlStroke({
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
                    const iconSrc = getValue(symbolizer.image) as
                      | string
                      | undefined;
                    const iconSize = getValue(symbolizer.size, 32) as number;
                    const iconOpacity = getValue(
                      symbolizer.opacity,
                      1,
                    ) as number;

                    if (iconSrc && typeof iconSrc === 'string') {
                      styles.push(
                        new OlStyle({
                          image: new OlIcon({
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
                    const textSym = symbolizer as TextSymbolizer;
                    const labelProp = getValue(textSym.label) as string | undefined;
                    if (labelProp && feature.get(labelProp)) {
                      const textColor = getValue(
                        textSym.color,
                        '#000000',
                      ) as string;
                      const textSize = getValue(textSym.size, 12) as number;
                      const textFont = getValue(
                        textSym.font?.[0],
                        'Arial',
                      ) as string;
                      const haloColor = getValue(
                        textSym.haloColor,
                      ) as string | undefined;
                      const haloWidth = getValue(
                        textSym.haloWidth,
                        1,
                      ) as number;
                      const offset = textSym.offset;
                      const offsetX =
                        offset && Array.isArray(offset)
                          ? (getValue(offset[0], 0) as number)
                          : 0;
                      const offsetY =
                        offset && Array.isArray(offset)
                          ? (getValue(offset[1], 0) as number)
                          : 0;

                      styles.push(
                        new OlStyle({
                          text: new OlText({
                            text: String(feature.get(labelProp)),
                            font: `${textSize}px ${textFont}`,
                            fill: new OlFill({
                              color: textColor,
                            }),
                            stroke: haloColor
                              ? new OlStroke({
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
      language: config.language,
      region: config.region,
      imageFormat: config.imageFormat,
      styles: config.styles as Record<string, unknown>[],
      layerTypes: config.layerTypes,
    });

    source.on('change', () => {
      if (source.getState() === 'error') {
        // Fehler transparent machen (z.B. ungültiger Key / Billing)
        const err = source.getError();
        error('Google source error', err);
        this.map.getTargetElement()?.dispatchEvent(
          new CustomEvent('google-source-error', {
            detail: { message: err ?? 'Google source error' },
            bubbles: true,
            composed: true,
          }),
        );
      }
    });

    const layer = new TileLayer({ source });

    // Google Logo/Branding: als Control ergänzen (unten links)
    if (!this.googleLogoAdded) {
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

  // ── Runtime error listeners ──────────────────────────────────────

  onLayerError(layerId: string, callback: LayerErrorCallback): void {
    this.layerErrorCallbacks.set(layerId, callback);
    this._getLayerById(layerId).then(layer => {
      if (!layer) return;
      this.attachSourceErrorListeners(layerId, layer);
    });
  }

  offLayerError(layerId: string): void {
    this.layerErrorCleanups.get(layerId)?.();
    this.layerErrorCleanups.delete(layerId);
    this.layerErrorCallbacks.delete(layerId);
  }

  private attachSourceErrorListeners(layerId: string, layer: Layer | BaseLayer): void {
    // Clean up previous listeners for this layer (e.g. after source replacement)
    this.layerErrorCleanups.get(layerId)?.();

    const cb = this.layerErrorCallbacks.get(layerId);
    if (!cb) return;

    const source = (layer as Layer).getSource?.();
    if (!source) return;

    const cleanups: Array<() => void> = [];

    // Tile sources (OSM, XYZ, WMS, ArcGIS, Google)
    if ('getTile' in source || source instanceof TileWMS || source instanceof OSM || source instanceof XYZ || source instanceof Google || source instanceof TileArcGISRest) {
      const handler = () => { cb({ type: 'network', message: 'Tile load error' }); };
      (source as TileSource).on('tileloaderror', handler);
      cleanups.push(() => (source as TileSource).un('tileloaderror', handler));
    }

    // Vector sources (GeoJSON URL, WFS)
    if (source instanceof VectorSource) {
      const handler = () => { cb({ type: 'network', message: 'Feature load error' }); };
      source.on('featuresloaderror', handler);
      cleanups.push(() => source.un('featuresloaderror', handler));
    }

    // Image sources (WCS)
    if (source instanceof ImageSource) {
      const handler = () => { cb({ type: 'network', message: 'Image load error' }); };
      source.on('imageloaderror', handler);
      cleanups.push(() => source.un('imageloaderror', handler));
    }

    // Re-attach on source replacement (e.g. updateWMSLayer)
    const sourceChangeHandler = () => {
      this.attachSourceErrorListeners(layerId, layer);
    };
    layer.on('change:source' as never, sourceChangeHandler);
    cleanups.push(() => layer.un('change:source' as never, sourceChangeHandler));

    this.layerErrorCleanups.set(layerId, () => cleanups.forEach(fn => fn()));
  }

  async setView(center: LonLat, zoom: number) {
    if (!this.map) return;
    this.map
      .getView()
      .animate({ center: fromLonLat(center), zoom, duration: 0 });
  }

  getView(): { center: LonLat; zoom: number } | null {
    if (!this.map) return null;
    const view = this.map.getView();
    const centerMercator = view.getCenter();
    if (!centerMercator) return null;
    const [lon, lat] = toLonLat(centerMercator);
    return {
      center: [lon, lat],
      zoom: view.getZoom() ?? 0,
    };
  }

  private async _forEachLayer(layerOrGroup: AnyLayer, callback: (layer: AnyLayer) => boolean): Promise<boolean> {
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

  private async _getLayerById(layerId: string): Promise<Layer> {
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

  private async _getLayerGroupById(groupId: string): Promise<LayerGroup> {
    if (!this.map) {
      return null;
    }
    const group = this.layers.find(
      l => (l as LayerGroup).get?.('groupId') === groupId,
    ) as LayerGroup | undefined;
    if (group !== undefined) return group;
    return null;
  }

  async removeLayer(layerId: string): Promise<void> {
    if (!layerId) {
      return;
    }
    this.offLayerError(layerId);
    const layer = await this._getLayerById(layerId);
    if (layer) {
      const group = layer.get('group');
      if (group) group.getLayers().remove(layer);
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

  private async updateWKTLayer(layer: VectorLayer, data: Partial<Extract<LayerConfig, { type: 'wkt' }>>): Promise<void> {
    const wktFormat = new WKT();
    let vectorSource: VectorSource = null;

    // Get the view's projection to ensure correct coordinate transformation
    const viewProjection = this.map?.getView()?.getProjection();

    if (data.wkt) {
      // Parse WKT string directly
      const feature = wktFormat.readFeature(data.wkt, {
        dataProjection: 'EPSG:4326',
        featureProjection: viewProjection,
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
        dataProjection: 'EPSG:4326',
        featureProjection: viewProjection,
      });
      vectorSource = new VectorSource({
        features: [feature],
      });
    }

    if (vectorSource) {
      layer.setSource(vectorSource);
    }

    let layerStyle;
    if (data.geostylerStyle) {
      layerStyle = await this.createGeostylerStyleFunction(data.geostylerStyle);
    } else if (data.style) {
      layerStyle = await this.createEnhancedStyleFunction(data.style);
    }
    if (layerStyle) {
      layer.setStyle(layerStyle);
    }
  }

  private async createWKTLayer(
    config: Extract<LayerConfig, { type: 'wkt' }>,
  ): Promise<Layer> {
    const wktFormat = new WKT();
    let vectorSource: VectorSource = null;

    // Get the view's projection to ensure correct coordinate transformation
    const viewProjection = this.map?.getView()?.getProjection();

    if (config.wkt) {
      // Parse WKT string directly
      try {
        const feature = wktFormat.readFeature(config.wkt, {
          dataProjection: 'EPSG:4326',
          featureProjection: viewProjection,
        });
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
        const feature = wktFormat.readFeature(wktText, {
          dataProjection: 'EPSG:4326',
          featureProjection: viewProjection,
        });
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

    // Use geostyler style if available, otherwise use default style function
    let layerStyle;
    if (config.geostylerStyle) {
      layerStyle = await this.createGeostylerStyleFunction(
        config.geostylerStyle,
      );
    } else {
      const style = config.style
        ? { ...DEFAULT_STYLE, ...config.style }
        : DEFAULT_STYLE;
      layerStyle = await this.createEnhancedStyleFunction(style);
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
    if (!config.url) {
      throw new Error('GeoTIFF layer requires a URL');
    }

    const srcInfo: SourceInfo = {
      url: config.url,
    };
    if (config.nodata !== null && !isNaN(config.nodata)) {
      srcInfo.nodata = config.nodata;
    }
    const CustomGeoTiff = await createCustomGeoTiff({
      sources: [srcInfo],
      wrapX: false, // Prevent rendering tiles beyond extent
    });
    const source = new CustomGeoTiff();
    await source.registerProjectionIfNeeded();

    const layer = new WebGLTileLayer({
      source,
      opacity: config.opacity ?? 1,
      visible: config.visible ?? true,
      zIndex: config.zIndex ?? 100,
    });

    return layer;
  }

  // private async createGeoTIFFLayer(
  //   config: Extract<LayerConfig, { type: 'geotiff' }>,
  // ): Promise<Layer> {
  //   if (!config.url) {
  //     throw new Error('GeoTIFF layer requires a URL');
  //   }
  //   createCustomGeoTiff;
  //   const source = new GeoTIFF({
  //     sources: [
  //       {
  //         url: config.url,
  //       },
  //     ],
  //   });

  //   const layer = new TileLayer({
  //     source,
  //     opacity: config.opacity ?? 1,
  //     visible: config.visible ?? true,
  //     zIndex: config.zIndex ?? 1000,
  //   });

  //   return layer;
  // }

  private async createWCSLayer(
    config: Extract<LayerConfig, { type: 'wcs' }>,
  ): Promise<Layer> {
    const source = await this.createWcsSource(config);
    const layer = new ImageLayer({
      source,
      visible: config.visible ?? true,
      opacity: config.opacity ?? 1,
    });
    layer.set('wcsConfig', config, false);
    return layer as unknown as Layer;
  }

  private getWFSGetFeatureUrl(
    config: Extract<LayerConfig, { type: 'wfs' }>,
  ): (extent: Extent) => string {
    return (extent: Extent) => {
      const wfsVersion = config.version ?? '1.1.0';
      const baseParams = {
        service: 'WFS',
        request: 'GetFeature',
        version: wfsVersion,
        typeName: config.typeName,
        outputFormat: config.outputFormat ?? 'application/json',
        bbox: extent.join(','),
        srsName: config.srsName ?? (this.projection as string),
      };

      const params = { ...baseParams, ...(config.params ?? {}) };
      const requestUrl = this.appendParams(config.url, params);
      return requestUrl;
    };
  }

  /**
   * Erstellt eine WCS GetCoverage URL mit dynamischem BBOX für WCS 2.0.1 und 1.x.x
   */
  private getWCSGetCoverageUrl(
    config: Extract<LayerConfig, { type: 'wcs' }>,
    resolution: number,
  ): (extent: number[]) => string {
    return (extent: number[]) => {
      const wcsVersion = config.version ?? '2.0.1';
      const format = config.format ?? 'image/tiff';
      const projection = config.projection ?? (this.projection as string);

      const params: Record<string, string | number> = {
        SERVICE: 'WCS',
        REQUEST: 'GetCoverage',
        VERSION: wcsVersion,
        FORMAT: format,
      };

      // WCS 2.0.1 verwendet andere Parameter als 1.x.x
      if (wcsVersion.startsWith('2.0')) {
        // WCS 2.0.1: coverageId und subset Parameter
        params.coverageId = config.coverageName;

        // BBOX als subset Parameter für WCS 2.0.1
        // subset=X(minx,maxx)&subset=Y(miny,maxy)
        const [minx, miny, maxx, maxy] = extent;
        params['subset'] = `X(${minx},${maxx})`;
        params['subset2'] = `Y(${miny},${maxy})`;

        // Ausgabeformat-Optionen für GeoTIFF FLOAT32
        if (format.includes('tiff') || format.includes('geotiff')) {
          // Für GeoTIFF können wir geotiff:compression etc. in params übergeben
          params['geotiff:compression'] = 'LZW';
        }
      } else {
        // WCS 1.x.x: COVERAGE und BBOX Parameter
        params.COVERAGE = config.coverageName;
        params.BBOX = extent.join(',');
        params.CRS = projection;

        // Width und Height für 1.x.x berechnen
        const width = Math.round((extent[2] - extent[0]) / resolution);
        const height = Math.round((extent[3] - extent[1]) / resolution);
        params.WIDTH = width;
        params.HEIGHT = height;
      }

      // Zusätzliche Parameter aus config hinzufügen (nur string/number)
      if (config.params) {
        Object.entries(config.params).forEach(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number') {
            params[key] = value;
          }
        });
      }

      // Für WCS 2.0.1 müssen subset Parameter speziell behandelt werden
      if (wcsVersion.startsWith('2.0')) {
        const subset2 = params['subset2'];
        delete params['subset2'];

        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query.append(key, String(value));
          }
        });
        // Zweiten subset Parameter hinzufügen
        if (subset2) {
          query.append('subset', String(subset2));
        }

        const baseUrl = config.url;
        return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${query.toString()}`;
      } else {
        return this.appendParams(config.url, params);
      }
    };
  }

  // private async fetchWFSFromUrl(
  //   config: Extract<LayerConfig, { type: 'wfs' }>,
  // ): Promise<any> {
  //   const wfsVersion = config.version ?? '1.1.0';
  //   const baseParams = {
  //     service: 'WFS',
  //     request: 'GetFeature',
  //     version: wfsVersion,
  //     typeName: config.typeName,
  //     outputFormat: config.outputFormat ?? 'application/json',
  //     srsName: config.srsName ?? (this.projection as string),
  //   };

  //   const params = { ...baseParams, ...(config.params ?? {}) };
  //   const requestUrl = this.appendParams(config.url, params);

  //   const response = await fetch(requestUrl);
  //   if (!response.ok) {
  //     throw new Error(
  //       `WFS request failed (${response.status} ${response.statusText})`,
  //     );
  //   }

  //   const outputFormat = (
  //     config.outputFormat ?? 'application/json'
  //   ).toLowerCase();

  //   // Handle JSON formats
  //   if (
  //     outputFormat.includes('json') ||
  //     outputFormat.includes('geojson') ||
  //     outputFormat === 'application/json'
  //   ) {
  //     return await response.json();
  //   }

  //   // Handle GML formats using OpenLayers WFS parser
  //   if (outputFormat.includes('gml') || outputFormat.includes('xml')) {
  //     const text = await response.text();
  //     const [
  //       { default: WFS },
  //       { default: GeoJSON },
  //       { default: GML2 },
  //       { default: GML3 },
  //       { default: GML32 },
  //     ] = await Promise.all([
  //       import('ol/format/WFS'),
  //       import('ol/format/GeoJSON'),
  //       import('ol/format/GML2'),
  //       import('ol/format/GML3'),
  //       import('ol/format/GML32'),
  //     ]);
  //     const wfsOptions: any = {};
  //     wfsOptions.version = wfsVersion;
  //     switch (outputFormat) {
  //       case 'gml2':
  //         wfsOptions.gmlFormat = new GML2();
  //         break;
  //       case 'gml3':
  //         wfsOptions.gmlFormat = new GML3();
  //         break;
  //       case 'gml32':
  //         wfsOptions.gmlFormat = new GML32();
  //         break;
  //     }

  //     const wfsFormat = new WFS(wfsOptions);
  //     const features = wfsFormat.readFeatures(text);

  //     // Convert features to GeoJSON
  //     const geojsonFormat = new GeoJSON();
  //     const geojson = JSON.parse(
  //       geojsonFormat.writeFeatures(features, {
  //         featureProjection: this.projection,
  //         dataProjection: config.srsName ?? (this.projection as string),
  //       }),
  //     );

  //     return geojson;
  //   }

  //   // Default: try to parse as JSON
  //   return await response.json();
  // }

  // private async createVectorSourceFromGeoJSON(
  //   geojson: any,
  // ): Promise<VectorSource> {
  //   const [{ default: VectorSource }, { default: GeoJSON }] = await Promise.all(
  //     [import('ol/source/Vector'), import('ol/format/GeoJSON')],
  //   );

  //   const format = new GeoJSON({ featureProjection: this.projection });
  //   return new VectorSource({
  //     features: format.readFeatures(geojson),
  //   });
  // }

  private mergeLayerConfig(layer: Layer, key: string, data: Record<string, unknown>): Record<string, unknown> {
    const previous = (layer.get(key) as Record<string, unknown>) ?? {};
    const merged = { ...previous, ...data };
    layer.set(key, merged, false);
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

  /**
   * Erstellt eine WCS Image Source mit dynamischem BBOX-basierten Loading
   * Unterstützt WCS 2.0.1 und 1.x.x mit GeoTIFF FLOAT32
   */
  private async createWcsSource(config: Extract<LayerConfig, { type: 'wcs' }>) {
    const projection = config.projection ?? this.projection;
    const resolution = this.map?.getView()?.getResolution() ?? 1;
    const urlFunction = this.getWCSGetCoverageUrl(config, resolution);

    // Custom Image Source für WCS mit dynamischem BBOX
    class WCSImageSource extends ImageSource {
      private urlFunction_: (extent: number[]) => string;

      constructor(urlFunction: (extent: number[]) => string) {
        super({
          projection: projection,
          resolutions: config.resolutions,
          // imageLoadFunction wird automatisch verwendet wenn url() implementiert ist
        });
        this.urlFunction_ = urlFunction;
      }

      // Überschreibe url()-Methode für dynamische URL-Generierung
      getImageInternal(
        extent: Extent,
        resolution: number,
        pixelRatio: number,
        _projection: Projection,
      ): OlImageWrapper {
        const url = this.urlFunction_(extent);

        // Erstelle Image mit der generierten URL
        const image = new OlImageWrapper(extent, resolution, pixelRatio, url);

        // Setze Custom Loader für CORS
        image.load = () => {
          const img = image.getImage() as HTMLImageElement;
          if (img.src !== url) {
            img.crossOrigin = 'anonymous';
            img.src = url;
          }
        };

        return image;
      }
    }

    return new WCSImageSource(urlFunction);
  }

  private async createArcGISLayer(
    config: Extract<LayerConfig, { type: 'arcgis' }>,
  ): Promise<Layer> {
    const params: Record<string, string | number | boolean> = {
      ...(config.params ?? {}),
    };

    if (config.token) {
      params.token = config.token;
    }

    const sourceOptions: Record<string, unknown> = {
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

  private async updateGeoTIFFLayer(layer: Layer, data: Partial<Extract<LayerConfig, { type: 'geotiff' }>>): Promise<void> {
    if (!data.url) {
      throw new Error('GeoTIFF update requires a URL');
    }

    const srcInfo: SourceInfo = {
      url: data.url,
    };
    if (data.nodata !== null && data.nodata !== undefined && !isNaN(data.nodata)) {
      srcInfo.nodata = data.nodata;
    }

    const CustomGeoTiff = await createCustomGeoTiff({
      sources: [srcInfo],
      wrapX: false, // Prevent rendering tiles beyond extent
    });
    const source = new CustomGeoTiff();
    await source.registerProjectionIfNeeded();

    // Update source on the layer
    (layer as WebGLTileLayer).setSource(source);
  }

  getMap() {
    return this.map;
  }
}
