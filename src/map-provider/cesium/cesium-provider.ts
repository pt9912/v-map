// CesiumProvider.ts – relevante Ergänzungen
import { CesiumLayerGroups, AnyLayer } from './CesiumLayerGroups';
import type { ILayer } from './i-layer';
import { LayerManager } from './layer-manager';

import { log, warn } from '../../utils/logger';
import { loadCesium, injectWidgetsCss } from '../../lib/cesium-loader';

import type { MapProvider, LayerUpdate } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';
import type { Style } from 'geostyler-style';
import type { StyleConfig } from '../../types/styleconfig';

import { AsyncMutex } from '../../utils/async-mutex';

type CesiumModule = typeof import('cesium');
import {
  type Viewer,
  type ImageryLayer,
  type GeoJsonDataSource,
  type Cesium3DTileset,
} from 'cesium';

type UrlTemplateOptions = ConstructorParameters<
  CesiumModule['UrlTemplateImageryProvider']
>[0];

/**
 * Entfernt das von Cesium injectWidgetsCss() eingefügte CSS.
 * Funktioniert sowohl, wenn das Element eine ID hat,
 * als auch wenn es keine ID besitzt (neue Cesium‑Versionen).
 */
function removeCesiumWidgetsCss(shadowRoot: ShadowRoot): void {
  if (!shadowRoot) return;

  // NodeList → echtes Array konvertieren
  const styles = Array.from(shadowRoot.querySelectorAll('style'));

  for (const style of styles) {
    if (style.textContent?.includes('.cesium-credit-lightbox-overlay')) {
      style.remove(); // modernes DOM‑API
      // oder für sehr alte Browser:
      // style.parentNode?.removeChild(style);
      log('v-map - provider - cesium - Cesium‑Widget‑CSS entfernt');
      break; // wir haben das gesuchte Style‑Tag gefunden
    }
  }
}

class CesiumTerrainLayer implements ILayer {
  private options: any;
  private opacity = 1;
  private previousProvider: any;

  constructor(
    private Cesium: CesiumModule,
    private viewer: Viewer,
    private provider: any,
    options: Partial<Extract<LayerConfig, { type: 'terrain' }>>,
  ) {
    this.options = options ?? {};
    this.previousProvider = viewer.terrainProvider;
    this.viewer.terrainProvider = this.provider;
  }

  getOptions() {
    return this.options;
  }

  setOptions(options: any): void {
    this.options = options;
  }

  getVisible(): boolean {
    return this.viewer.scene.globe.show;
  }

  setVisible(value: boolean): void {
    this.viewer.scene.globe.show = value;
  }

  getOpacity(): number {
    return this.opacity;
  }

  setOpacity(value: number): void {
    this.opacity = value;
    const globe: any = this.viewer.scene.globe;
    if (!globe.translucency) {
      try {
        globe.translucency = new this.Cesium.GlobeTranslucency();
        globe.translucency.enabled = true;
      } catch (error) {
        warn('Cesium terrain opacity not supported', error);
        return;
      }
    }
    globe.translucency.enabled = value < 1;
    globe.translucency.frontFaceAlpha = value;
  }

  getZIndex(): number {
    return 0;
  }

  async setZIndex(_zIndex: number): Promise<void> {
    return;
  }

  remove(): void {
    try {
      this.viewer.terrainProvider = this.previousProvider
        ? this.previousProvider
        : new this.Cesium.EllipsoidTerrainProvider();
      this.viewer.scene.globe.show = true;
    } catch (error) {
      warn('Cesium terrain reset failed', error);
    }
  }
}

export class CesiumProvider implements MapProvider {
  private viewer: Viewer;
  private Cesium: CesiumModule;
  private layerManager: LayerManager;
  private shadowRoot: ShadowRoot;

  private layerGroups = new CesiumLayerGroups();
  private layerManagerMutex = new AsyncMutex();

  async init(options: ProviderOptions) {
    this.shadowRoot = options.shadowRoot;

    const sr =
      options.target.getRootNode() instanceof ShadowRoot
        ? (options.target.getRootNode() as ShadowRoot)
        : undefined;
    await injectWidgetsCss(sr);

    this.Cesium = await loadCesium();

    /*
    this.viewer = new this.Cesium.Viewer(container, {
      terrainProvider: await this.Cesium.createWorldTerrainAsync(),
      ...options,
    });
*/
    Cesium.Ion.defaultAccessToken = null;

    this.viewer = new this.Cesium.Viewer(options.target, {
      baseLayer: false,
      baseLayerPicker: false, // Remove the base layer picker if you don’t need to switch layers
      terrainProvider: new Cesium.EllipsoidTerrainProvider(), // Use a simple ellipsoid terrain
    });
    //this.viewer.scene.terrainProvider..removeAll();
    this.viewer.scene.primitives.removeAll();
    this.viewer.scene.backgroundColor = this.Cesium.Color.WHITE;
    this.viewer.scene.globe.baseColor = this.Cesium.Color.WHITE;
    this.viewer.scene.globe.depthTestAgainstTerrain = false;
    // this.viewer.terrainProvider = null;
    /*
    if (options.center) {
      await this.viewer.camera.flyTo({
        destination: this.Cesium.Cartesian3.fromDegrees(
          options.center.longitude,
          options.center.latitude,
          1000,
        ),
      });
    }
      */
    this.layerManager = new LayerManager(this.Cesium, this.viewer);
  }

  async destroy() {
    removeCesiumWidgetsCss(this.shadowRoot);
    this.viewer?.destroy();
    this.viewer = undefined;
  }

  private async createLayer(
    layerConfig: LayerConfig,
    layerId: string,
  ): Promise<AnyLayer> {
    let wrapper = null;

    switch (layerConfig.type) {
      case 'geojson': {
        const options: GeoJsonDataSource.LoadOptions = {
          // clampToGround: true,
          //fill: Cesium.Color.RED,
        };
        const geojsonConfig = layerConfig as Extract<
          LayerConfig,
          { type: 'geojson' }
        >;
        const ds = await this.createGeoJSONLayer(geojsonConfig, options);
        wrapper = this.layerManager.addLayer(layerId, ds);
        wrapper.setOptions(options);
        break;
      }
      case 'osm': {
        const iLayer = await this.createOSMLayer(
          layerConfig as Extract<LayerConfig, { type: 'osm' }>,
        );
        wrapper = this.layerManager.addLayer(layerId, iLayer);
        break;
      }
      case 'google': {
        const iLayer = await this.createGoogleLayer(
          layerConfig as Extract<LayerConfig, { type: 'google' }>,
        );
        wrapper = this.layerManager.addLayer(layerId, iLayer);
        break;
      }
      case 'terrain': {
        const terrainLayer = await this.createTerrainLayer(
          layerConfig as Extract<LayerConfig, { type: 'terrain' }>,
        );
        wrapper = this.layerManager.addCustomLayer(layerId, terrainLayer);
        break;
      }
      case 'xyz': {
        const iLayer = await this.createXYZLayer(
          layerConfig as Extract<LayerConfig, { type: 'xyz' }>,
        );
        wrapper = this.layerManager.addLayer(layerId, iLayer);
        break;
      }
      case 'wms': {
        const iLayer = await this.addWMSLayer(layerConfig as any);
        wrapper = this.layerManager.addLayer(layerId, iLayer);
        break;
      }
      case 'arcgis': {
        await this.addArcGISLayer(layerConfig as any);
        //todo  wrapper = this.layerManager.addLayer(layerId, iLayer);
        break;
      }
      case 'wfs': {
        const options = { clampToGround: true };
        const wfsConfig = layerConfig as Extract<LayerConfig, { type: 'wfs' }>;
        const ds = await this.createWFSLayer(wfsConfig, options);
        wrapper = this.layerManager.addLayer(layerId, ds);
        wrapper.setOptions(options);
        break;
      }
      case 'wkt': {
        const options = { clampToGround: true };
        const wktConfig = layerConfig as Extract<LayerConfig, { type: 'wkt' }>;
        const ds = await this.createWKTLayer(wktConfig, options);
        wrapper = this.layerManager.addLayer(layerId, ds);
        wrapper.setOptions(options);
        break;
      }
      case 'geotiff': {
        const iLayer = await this.createGeoTIFFLayer(
          layerConfig as Extract<LayerConfig, { type: 'geotiff' }>,
        );
        wrapper = this.layerManager.addLayer(layerId, iLayer);
        break;
      }
      case 'tile3d': {
        const tileset = await this.createTile3DLayer(
          layerConfig as Extract<LayerConfig, { type: 'tile3d' }>,
        );
        wrapper = this.layerManager.addLayer(layerId, tileset);
        wrapper.setOptions((layerConfig as any).tilesetOptions ?? {});
        if ((layerConfig as any).cesiumStyle && 'setStyle' in wrapper) {
          (wrapper as any).setStyle((layerConfig as any).cesiumStyle);
        }
        break;
      }
      default:
        throw new Error(`Unsupported layer type: ${(layerConfig as any).type}`);
    }

    if (!wrapper) return null;

    // zIndex/Opacity/Visible zuerst auf dem Layer anwenden (bleiben „Originalzustand“ der Gruppe)
    if ((layerConfig as any).zIndex !== undefined)
      await wrapper.setZIndex((layerConfig as any).zIndex);
    if ((layerConfig as any).opacity !== undefined)
      wrapper.setOpacity((layerConfig as any).opacity);
    if ((layerConfig as any).visible !== undefined)
      wrapper.setVisible((layerConfig as any).visible);

    return wrapper;
  }

  // ---------- Layer anlegen (mit Group & Basemap-Key) ----------
  async addLayerToGroup(
    layerConfig: LayerConfig,
    groupId: string,
  ): Promise<string> {
    return await this.layerManagerMutex.runExclusive(async () => {
      const layerId = crypto.randomUUID();
      let wrapper = await this.createLayer(layerConfig, layerId);

      // >>> In Gruppenverwaltung registrieren (inkl. Basemap-Key)
      const elementId: string | null =
        (layerConfig as any).layerElementId ??
        (layerConfig as any).elementId ??
        null;

      this.layerGroups.addLayerToGroup(groupId, {
        id: layerId,
        elementId,
        layer: wrapper,
      });

      // Regeln anwenden (sichtbar/basemap)
      this.layerGroups.apply();
      return layerId;
    });
  }

  // ---------- Basemap-API analog deck ----------
  async setBaseLayer(groupId: string, layerElementId: string): Promise<void> {
    await this.layerManagerMutex.runExclusive(async () => {
      this.layerGroups.setBasemap(groupId, layerElementId ?? null);
      this.layerGroups.apply();
    });
  }

  // Optional: Helper wie in deck.addBaseLayer(...)
  async addBaseLayer(
    layerConfig: LayerConfig,
    basemapid: string,
    layerElementId: string,
  ): Promise<string> {
    if (!layerElementId || !basemapid) return null;
    return await this.layerManagerMutex.runExclusive(async () => {
      const layerId = crypto.randomUUID();
      let wrapper = await this.createLayer(layerConfig, layerId);

      this.layerGroups.addLayerToGroup(layerConfig.groupId, {
        id: layerId,
        elementId: layerElementId,
        layer: wrapper,
      });

      this.layerGroups.setBasemap(layerConfig.groupId ?? 'basemap', basemapid);
      this.layerGroups.apply();
      return layerId;
    });
  }

  // ---------- Sichtbarkeit/Z-Index/Opacity bleiben wie gehabt ----------
  async setGroupVisible(groupId: string, visible: boolean): Promise<void> {
    this.layerGroups.setGroupVisible(groupId, visible);
    this.layerGroups.apply();
  }

  async removeLayer(layerId: string): Promise<void> {
    if (!layerId) return;
    await this.layerManagerMutex.runExclusive(async () => {
      // erst aus Viewer entfernen (bestehende Logik)
      this.layerManager.removeLayer(layerId);
      // dann aus Gruppen
      this.layerGroups.removeLayer(layerId, true);
      this.layerGroups.apply();
    });
  }

  // updateLayer, setOpacity, setZIndex, setVisible bleiben – du änderst damit den
  // „Originalzustand“ der Layer. Danach LayerGroups.apply() aufrufen, damit
  // Gruppen-/Basemap-Regeln sofort wieder durchgesetzt werden:
  async setOpacity(layerId: string, opacity: number): Promise<void> {
    this.layerManager.setOpacity(layerId, opacity);
    this.layerGroups.apply();
  }
  async setVisible(layerId: string, visible: boolean): Promise<void> {
    this.layerManager.setVisible(layerId, visible);
    this.layerGroups.apply();
  }
  async setZIndex(layerId: string, zIndex: number): Promise<void> {
    // Note: layerManager.setZIndex calls layer.setZIndex which is async (returns Promise<void>)
    // even though the manager method itself is not marked as async. The await is kept here
    // for future compatibility when the manager method becomes properly async.
    await this.layerManager.setZIndex(layerId, zIndex);
    // Z-Order ist unabhängig von Basemap/Group-Visible, aber apply() schadet nicht
    this.layerGroups.apply();
  }

  // ========== Enhanced Styling Helper Methods ==========

  /**
   * Apply Geostyler styling to a GeoJsonDataSource
   */
  private applyGeostylerStyling(
    dataSource: GeoJsonDataSource,
    geostylerStyle: Style,
  ) {
    (dataSource as any).__vmapLockOpacity = true;
    // Helper to extract static value from GeoStyler property
    const getValue = (prop: any, defaultValue: any = undefined) => {
      if (prop === undefined || prop === null) return defaultValue;
      // If it's a GeoStyler function object, we can't evaluate it here - return default
      if (typeof prop === 'object' && prop.name) return defaultValue;
      return prop;
    };

    const toNumber = (value: any, fallback?: number) => {
      if (value == null) return fallback;
      if (typeof value === 'number') return value;
      const n = Number(value);
      return Number.isFinite(n) ? n : fallback;
    };

    const entities = dataSource.entities.values;

    if (geostylerStyle.rules) {
      for (const rule of geostylerStyle.rules) {
        if (rule.symbolizers) {
          for (const symbolizer of rule.symbolizers) {
            for (let i = 0; i < entities.length; i++) {
              const entity = entities[i];

              switch (symbolizer.kind) {
                case 'Fill':
                  if (entity.polygon) {
                    const fillColor = getValue(
                      symbolizer.color,
                      'rgba(0,100,255,0.3)',
                    ) as string;
                    const fillOpacity = toNumber(
                      getValue(symbolizer.opacity, 0.3),
                      0.3,
                    );
                    const outlineColor = getValue(
                      symbolizer.outlineColor,
                      'rgba(0,100,255,1)',
                    ) as string;
                    const outlineWidth = getValue(
                      symbolizer.outlineWidth,
                      1,
                    ) as number;

                    let polygonColor = this.parseCesiumColor(
                      fillColor,
                      this.Cesium.Color.BLUE.withAlpha(0.3),
                    );
                    if (fillOpacity !== undefined && fillOpacity !== null) {
                      polygonColor = this.applyCesiumOpacity(
                        polygonColor,
                        fillOpacity,
                      );
                    }

                    //outline color
                    const outlineCesiumColor = this.parseCesiumColor(
                      outlineColor,
                      this.Cesium.Color.BLUE,
                    );

                    log(
                      'v-map - provider - cesium - applyGeostylerStyling: Fill',
                      {
                        fillColor,
                        fillOpacity,
                        computedFill: polygonColor?.toString?.(),
                        outlineColor,
                        outlineWidth,
                      },
                    );

                    //fill
                    entity.polygon.fill = new this.Cesium.ConstantProperty(
                      true,
                    );
                    //fill color
                    entity.polygon.material =
                      new this.Cesium.ColorMaterialProperty(polygonColor);

                    //outline
                    entity.polygon.outline = new this.Cesium.ConstantProperty(
                      true,
                    );
                    entity.polygon.outlineColor =
                      new this.Cesium.ConstantProperty(outlineCesiumColor);
                    entity.polygon.outlineWidth =
                      new this.Cesium.ConstantProperty(outlineWidth);
                    //entity.polygon.height = new this.Cesium.ConstantProperty(0);

                    //
                    entity.polygon.extrudedHeight = undefined;
                    entity.polygon.heightReference =
                      new this.Cesium.ConstantProperty(
                        this.Cesium.HeightReference.CLAMP_TO_GROUND, //NONE,
                      );
                    entity.polygon.perPositionHeight =
                      new this.Cesium.ConstantProperty(false);
                    entity.polygon.classificationType =
                      new this.Cesium.ConstantProperty(
                        this.Cesium.ClassificationType.BOTH,
                      );
                  }
                  break;

                case 'Line':
                  if (entity.polyline) {
                    const lineColor = getValue(
                      symbolizer.color,
                      'rgba(0,100,255,1)',
                    ) as string;
                    const lineWidth = toNumber(
                      getValue(symbolizer.width, 2),
                      2,
                    );
                    const lineOpacity = toNumber(
                      getValue(symbolizer.opacity, 1),
                      1,
                    );

                    let materialColor = this.parseCesiumColor(
                      lineColor,
                      this.Cesium.Color.BLUE,
                    );
                    if (lineOpacity !== undefined && lineOpacity !== null) {
                      materialColor = this.applyCesiumOpacity(
                        materialColor,
                        lineOpacity,
                      );
                    }

                    log(
                      'v-map - provider - cesium - applyGeostylerStyling: Line',
                      {
                        lineColor,
                        lineOpacity,
                        computedColor: materialColor?.toString?.(),
                        lineWidth,
                      },
                    );

                    entity.polyline.material =
                      new this.Cesium.ColorMaterialProperty(materialColor);
                    entity.polyline.width = new this.Cesium.ConstantProperty(
                      lineWidth,
                    );
                  }
                  break;

                case 'Mark':
                  if (entity.point) {
                    const pointColor = getValue(
                      symbolizer.color,
                      'rgba(0,100,255,1)',
                    ) as string;
                    const pointRadius = toNumber(
                      getValue(symbolizer.radius, 6),
                      6,
                    );
                    const pointOpacity = toNumber(
                      getValue(symbolizer.opacity, 1),
                      1,
                    );

                    let materialColor = this.parseCesiumColor(
                      pointColor,
                      this.Cesium.Color.BLUE,
                    );
                    if (pointOpacity !== undefined && pointOpacity !== null) {
                      materialColor = this.applyCesiumOpacity(
                        materialColor,
                        pointOpacity,
                      );
                    }

                    log(
                      'v-map - provider - cesium - applyGeostylerStyling: Mark',
                      {
                        pointColor,
                        pointOpacity,
                        computedColor: materialColor?.toString?.(),
                        pointRadius,
                      },
                    );

                    entity.point.color = new this.Cesium.ConstantProperty(
                      materialColor,
                    );
                    entity.point.pixelSize = new this.Cesium.ConstantProperty(
                      pointRadius,
                    );
                  }
                  break;

                case 'Icon':
                  if (entity.point) {
                    const iconSrc = getValue(symbolizer.image) as
                      | string
                      | undefined;
                    const iconSize = toNumber(
                      getValue(symbolizer.size, 32),
                      32,
                    );
                    const iconOpacity = toNumber(
                      getValue(symbolizer.opacity, 1),
                      1,
                    );

                    if (iconSrc && typeof iconSrc === 'string') {
                      entity.billboard = new this.Cesium.BillboardGraphics({
                        image: new this.Cesium.ConstantProperty(iconSrc),
                        width: new this.Cesium.ConstantProperty(iconSize),
                        height: new this.Cesium.ConstantProperty(iconSize),
                        verticalOrigin: new this.Cesium.ConstantProperty(
                          this.Cesium.VerticalOrigin.BOTTOM,
                        ),
                        color:
                          iconOpacity !== undefined && iconOpacity !== null
                            ? new this.Cesium.ConstantProperty(
                                this.Cesium.Color.WHITE.withAlpha(iconOpacity),
                              )
                            : undefined,
                      });
                      entity.point.show = new this.Cesium.ConstantProperty(
                        false,
                      );

                      log(
                        'v-map - provider - cesium - applyGeostylerStyling: Icon',
                        {
                          iconSrc,
                          iconSize,
                          iconOpacity,
                        },
                      );
                    }
                  }
                  break;

                case 'Text':
                  const labelProp = (symbolizer as any).label;
                  if (
                    labelProp &&
                    entity.properties &&
                    entity.properties[labelProp]
                  ) {
                    const textColor = getValue(
                      symbolizer.color,
                      '#000000',
                    ) as string;
                    const textSize = toNumber(
                      getValue(symbolizer.size, 12),
                      12,
                    );
                    const textOpacity = toNumber(
                      getValue(symbolizer.opacity, 1),
                      1,
                    );

                    let labelColor = this.parseCesiumColor(
                      textColor,
                      this.Cesium.Color.WHITE,
                    );
                    if (textOpacity !== undefined && textOpacity !== null) {
                      labelColor = this.applyCesiumOpacity(
                        labelColor,
                        textOpacity,
                      );
                    }

                    log(
                      'v-map - provider - cesium - applyGeostylerStyling: Text',
                      {
                        labelProp,
                        textColor,
                        textOpacity,
                        computedColor: labelColor?.toString?.(),
                        textSize,
                      },
                    );

                    const textValue =
                      entity.properties[labelProp]?.getValue?.(
                        this.viewer.clock.currentTime,
                      ) ??
                      entity.properties[labelProp]?._value ??
                      '';

                    entity.label = new this.Cesium.LabelGraphics({
                      text: new this.Cesium.ConstantProperty(String(textValue)),
                      font: new this.Cesium.ConstantProperty(
                        `${textSize}px Arial`,
                      ),
                      fillColor: new this.Cesium.ConstantProperty(labelColor),
                      verticalOrigin: new this.Cesium.ConstantProperty(
                        this.Cesium.VerticalOrigin.BOTTOM,
                      ),
                    });
                  }
                  break;
              }
            }
          }
        }
      }
    }
  }

  /**
   * Convert CSS color to Cesium Color
   */
  private parseCesiumColor(color: string | undefined, defaultColor: any): any {
    if (!color) return defaultColor;

    // Handle hex colors
    if (color.startsWith('#')) {
      return this.Cesium.Color.fromCssColorString(color);
    }

    // Handle rgba/rgb colors
    if (color.includes('rgb')) {
      return this.Cesium.Color.fromCssColorString(color);
    }

    // Try to parse as CSS color string
    try {
      return this.Cesium.Color.fromCssColorString(color);
    } catch {
      return defaultColor;
    }
  }

  /**
   * Apply opacity to Cesium color
   */
  private applyCesiumOpacity(color: any, opacity: number): any {
    if (!color) return color;
    return color.withAlpha(opacity);
  }

  /**
   * Create Cesium styling options from StyleConfig
   */
  private createCesiumStyle(style: StyleConfig = {}) {
    // Default colors
    const defaultFillColor = this.Cesium.Color.BLUE.withAlpha(0.3);
    const defaultStrokeColor = this.Cesium.Color.BLUE;
    const defaultPointColor = this.Cesium.Color.BLUE;

    // Parse colors
    const fillColor = this.parseCesiumColor(style.fillColor, defaultFillColor);
    const strokeColor = this.parseCesiumColor(
      style.strokeColor,
      defaultStrokeColor,
    );
    const pointColor = this.parseCesiumColor(
      style.pointColor,
      defaultPointColor,
    );

    // Apply opacity
    const finalFillColor =
      style.fillOpacity !== undefined
        ? this.applyCesiumOpacity(fillColor, style.fillOpacity)
        : fillColor;

    const finalStrokeColor =
      style.strokeOpacity !== undefined
        ? this.applyCesiumOpacity(strokeColor, style.strokeOpacity)
        : strokeColor;

    const finalPointColor =
      style.pointOpacity !== undefined
        ? this.applyCesiumOpacity(pointColor, style.pointOpacity)
        : pointColor;

    return {
      // Polygon styling
      fill: true,
      fillColor: finalFillColor,
      outline: true,
      outlineColor: finalStrokeColor,
      outlineWidth: style.strokeWidth ?? 2,
      extrudedHeight: style.extrudeHeight,
      heightReference: style.zOffset
        ? this.Cesium.HeightReference.RELATIVE_TO_GROUND
        : this.Cesium.HeightReference.CLAMP_TO_GROUND,

      // Point styling
      pixelSize: style.pointRadius ?? 8,
      color: finalPointColor,
      scaleByDistance: style.pointRadius
        ? new this.Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)
        : undefined,

      // Line styling
      width: style.strokeWidth ?? 2,
      clampToGround: !style.zOffset,

      // Text/Label styling
      labelText: style.textProperty,
      labelFont: style.textSize
        ? `${style.textSize}pt monospace`
        : '12pt monospace',
      labelFillColor: style.textColor
        ? this.parseCesiumColor(style.textColor, this.Cesium.Color.WHITE)
        : this.Cesium.Color.WHITE,
      labelOutlineColor: style.textHaloColor
        ? this.parseCesiumColor(style.textHaloColor, this.Cesium.Color.BLACK)
        : this.Cesium.Color.BLACK,
      labelOutlineWidth: style.textHaloWidth ?? 1,
      labelPixelOffset: style.textOffset
        ? new this.Cesium.Cartesian2(style.textOffset[0], style.textOffset[1])
        : this.Cesium.Cartesian2.ZERO,

      // 3D specific
      height: style.zOffset ?? 0,
    };
  }

  /**
   * Apply enhanced styling to a GeoJsonDataSource
   */
  private applyEnhancedStyling(
    dataSource: GeoJsonDataSource,
    style: StyleConfig = {},
  ) {
    const cesiumStyle = this.createCesiumStyle(style);

    const entities = dataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];

      let finalStyle = cesiumStyle;
      if (style.styleFunction && entity.properties) {
        const feature = {
          properties: entity.properties._propertyNames.reduce(
            (props: any, name: string) => {
              props[name] = entity.properties[name]?._value;
              return props;
            },
            {},
          ),
          geometry: entity,
        };
        const conditionalStyle = style.styleFunction(feature);
        if (conditionalStyle) {
          finalStyle = {
            ...cesiumStyle,
            ...this.createCesiumStyle(conditionalStyle as StyleConfig),
          };
        }
      }

      if (entity.polygon) {
        entity.polygon.fill = new this.Cesium.ConstantProperty(finalStyle.fill);
        entity.polygon.material = new this.Cesium.ColorMaterialProperty(
          finalStyle.fillColor,
        );
        entity.polygon.outline = new this.Cesium.ConstantProperty(
          finalStyle.outline,
        );
        entity.polygon.outlineColor = new this.Cesium.ConstantProperty(
          finalStyle.outlineColor,
        );
        entity.polygon.outlineWidth = new this.Cesium.ConstantProperty(
          finalStyle.outlineWidth,
        );
        entity.polygon.height =
          finalStyle.height !== undefined
            ? new this.Cesium.ConstantProperty(finalStyle.height)
            : undefined;
        entity.polygon.extrudedHeight =
          finalStyle.extrudedHeight !== undefined
            ? new this.Cesium.ConstantProperty(finalStyle.extrudedHeight)
            : undefined;
        entity.polygon.heightReference =
          finalStyle.heightReference !== undefined
            ? new this.Cesium.ConstantProperty(finalStyle.heightReference)
            : undefined;
      }

      if (entity.polyline) {
        entity.polyline.material = new this.Cesium.ColorMaterialProperty(
          finalStyle.outlineColor,
        );
        entity.polyline.width = new this.Cesium.ConstantProperty(
          finalStyle.width,
        );
        entity.polyline.clampToGround = new this.Cesium.ConstantProperty(
          finalStyle.clampToGround,
        );
      }

      if (entity.point) {
        entity.point.pixelSize = new this.Cesium.ConstantProperty(
          finalStyle.pixelSize,
        );
        entity.point.color = new this.Cesium.ConstantProperty(finalStyle.color);
        const scaleByDistance = finalStyle.scaleByDistance;
        entity.point.scaleByDistance = scaleByDistance
          ? new this.Cesium.ConstantProperty(scaleByDistance)
          : undefined;

        if (style.iconUrl) {
          entity.billboard = new this.Cesium.BillboardGraphics({
            image: new this.Cesium.ConstantProperty(style.iconUrl),
            width: new this.Cesium.ConstantProperty(
              style.iconSize ? style.iconSize[0] : 32,
            ),
            height: new this.Cesium.ConstantProperty(
              style.iconSize ? style.iconSize[1] : 32,
            ),
            verticalOrigin: new this.Cesium.ConstantProperty(
              this.Cesium.VerticalOrigin.BOTTOM,
            ),
            scaleByDistance: scaleByDistance
              ? new this.Cesium.ConstantProperty(scaleByDistance)
              : undefined,
          });
          entity.point.show = new this.Cesium.ConstantProperty(false);
        }
      }

      if (
        style.textProperty &&
        entity.properties &&
        entity.properties[style.textProperty]
      ) {
        const textValue =
          entity.properties[style.textProperty]?.getValue?.(
            this.viewer.clock.currentTime,
          ) ??
          entity.properties[style.textProperty]?._value ??
          '';

        entity.label = new this.Cesium.LabelGraphics({
          text: new this.Cesium.ConstantProperty(String(textValue)),
          font: new this.Cesium.ConstantProperty(finalStyle.labelFont),
          fillColor: new this.Cesium.ConstantProperty(
            finalStyle.labelFillColor,
          ),
          outlineColor: new this.Cesium.ConstantProperty(
            finalStyle.labelOutlineColor,
          ),
          outlineWidth: new this.Cesium.ConstantProperty(
            finalStyle.labelOutlineWidth,
          ),
          pixelOffset: new this.Cesium.ConstantProperty(
            finalStyle.labelPixelOffset,
          ),
          verticalOrigin: new this.Cesium.ConstantProperty(
            this.Cesium.VerticalOrigin.BOTTOM,
          ),
        });
      }
    }
  }

  private async createWKTLayer(
    config: Extract<LayerConfig, { type: 'wkt' }>,
    options: any,
  ): Promise<GeoJsonDataSource> {
    const geoJsonData = await this.wktToGeoJSON(config);

    const dataSource: GeoJsonDataSource =
      await this.Cesium.GeoJsonDataSource.load(geoJsonData, options);

    // Apply geostyler style if provided, otherwise use enhanced styling
    if (config.geostylerStyle) {
      this.applyGeostylerStyling(dataSource, config.geostylerStyle);
    } else if (config.style) {
      this.applyEnhancedStyling(dataSource, config.style);
    }

    return dataSource;
  }

  private async wktToGeoJSON(
    config: Extract<LayerConfig, { type: 'wkt' }>,
  ): Promise<any> {
    const wktText = await this.resolveWktText(config);

    const wellknownModule = await import('wellknown');
    const parseFn =
      typeof wellknownModule.default === 'function'
        ? wellknownModule.default
        : (wellknownModule as any).parse;

    if (typeof parseFn !== 'function') {
      throw new Error('wellknown parser not available');
    }

    const geometry = parseFn(wktText);

    if (!geometry) {
      throw new Error('Failed to parse WKT');
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry,
        },
      ],
    };
  }

  private async resolveWktText(
    config: Extract<LayerConfig, { type: 'wkt' }>,
  ): Promise<string> {
    if (config.wkt) return config.wkt;
    if (config.url) {
      const response = await fetch(config.url);
      if (!response.ok)
        throw new Error(`Failed to fetch WKT: ${response.status}`);
      return await response.text();
    }
    throw new Error('Either wkt or url must be provided');
  }

  private async createGeoJSONLayer(
    config: Extract<LayerConfig, { type: 'geojson' }>,
    options: any,
  ): Promise<GeoJsonDataSource> {
    let geojson_or_url = null;
    if (config.geojson) {
      geojson_or_url = JSON.parse(config.geojson);
    } else {
      geojson_or_url = config.url;
    }

    //https://cesium.com/learn/ion-sdk/ref-doc/GeoJsonDataSource.html
    const dataSource: GeoJsonDataSource =
      await this.Cesium.GeoJsonDataSource.load(geojson_or_url, options);

    // Apply geostyler style if provided, otherwise use enhanced styling
    if (config.geostylerStyle) {
      this.applyGeostylerStyling(dataSource, config.geostylerStyle);
    } else if (config.style) {
      this.applyEnhancedStyling(dataSource, config.style);
    }

    return dataSource;
  }

  private async createWFSLayer(
    config: Extract<LayerConfig, { type: 'wfs' }>,
    options: any,
  ): Promise<GeoJsonDataSource> {
    // Fetch GeoJSON from WFS server
    const geojson = await this.fetchWFSFromUrl(config);

    // Load GeoJSON into Cesium DataSource
    const dataSource: GeoJsonDataSource =
      await this.Cesium.GeoJsonDataSource.load(geojson, options);

    // Apply geostyler style if provided, otherwise use enhanced styling
    if (config.geostylerStyle) {
      this.applyGeostylerStyling(dataSource, config.geostylerStyle);
    } else if (config.style) {
      this.applyEnhancedStyling(dataSource, config.style);
    }

    return dataSource;
  }

  private async createOSMLayer(
    cfg: Extract<LayerConfig, { type: 'osm' }>,
  ): Promise<ImageryLayer> {
    return new this.Cesium.ImageryLayer(
      new this.Cesium.OpenStreetMapImageryProvider({
        url: cfg.url || 'https://a.tile.openstreetmap.org',
      }),
    );
  }

  private async createGoogleLayer(
    config: Extract<LayerConfig, { type: 'google' }>,
  ): Promise<ImageryLayer> {
    if (!config.apiKey) {
      throw new Error("Google-Layer benötigt 'apiKey' (Google Maps Platform).");
    }

    // Load Google Maps JavaScript API
    await this.loadGoogleMapsApi(config.apiKey, {
      language: config.language,
      region: config.region,
      libraries: config.libraries,
    });

    const mapType = config.mapType || 'roadmap';
    const googleMapTypeId = this.getGoogleMapTypeId(mapType);

    // Use a simpler approach with UrlTemplateImageryProvider and custom URL generator
    const Cesium = this.Cesium;

    // Create a custom URL template that we'll handle in the urlSchemeZeroPadding function
    const customUrlTemplate =
      'https://maps.googleapis.com/maps/api/staticmap?template';

    const googleImageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: customUrlTemplate,
      maximumLevel: config.maxZoom || 19,
      minimumLevel: 0,
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      credit: 'Google Maps',

      // Override URL generation using urlSchemeZeroPadding as a custom URL builder
      urlSchemeZeroPadding: {
        '{x}': '',
        '{y}': '',
        '{z}': '',
      },
    });

    // Override the buildImageResource method to use Google Static Maps API
    (googleImageryProvider as any).buildImageResource = function (
      x: number,
      y: number,
      level: number,
    ) {
      const tilingScheme = new Cesium.WebMercatorTilingScheme();
      const rectangle = tilingScheme.tileXYToRectangle(x, y, level);
      const west = Cesium.Math.toDegrees(rectangle.west);
      const south = Cesium.Math.toDegrees(rectangle.south);
      const east = Cesium.Math.toDegrees(rectangle.east);
      const north = Cesium.Math.toDegrees(rectangle.north);

      // Center point of the tile
      const centerLat = (south + north) / 2;
      const centerLng = (west + east) / 2;

      // Build Google Static Maps API URL
      const params = new URLSearchParams({
        center: `${centerLat},${centerLng}`,
        zoom: level.toString(),
        size: '256x256',
        scale: config.scale === 'scaleFactor1x' ? '1' : '2',
        maptype: googleMapTypeId,
        key: config.apiKey,
        format: 'png',
      });

      if (config.language) {
        params.set('language', config.language);
      }

      if (config.region) {
        params.set('region', config.region);
      }

      const url = `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;

      return new Cesium.Resource({ url });
    };

    // Add Google logo for compliance
    this.ensureGoogleLogo();

    return new this.Cesium.ImageryLayer(googleImageryProvider, {
      alpha: config.opacity ?? 1,
      show: config.visible ?? true,
    });
  }

  private getGoogleMapTypeId(mapType: string): string {
    switch (mapType) {
      case 'roadmap':
        return 'roadmap';
      case 'satellite':
        return 'satellite';
      case 'terrain':
        return 'terrain';
      case 'hybrid':
        return 'hybrid';
      default:
        return 'roadmap';
    }
  }

  /**
   * Load Google Maps JavaScript API
   */
  private async loadGoogleMapsApi(
    apiKey: string,
    opts?: { language?: string; region?: string; libraries?: string[] },
  ): Promise<void> {
    if ((window as any).google?.maps) return;

    await new Promise<void>((resolve, reject) => {
      const cbName =
        '___cesiumGoogleInit___' + Math.random().toString(36).slice(2);
      (window as any)[cbName] = () => resolve();

      const script = document.createElement('script');
      const params = new URLSearchParams({
        key: apiKey,
        callback: cbName,
        v: 'weekly',
      });
      if (opts?.language) params.set('language', opts.language);
      if (opts?.region) params.set('region', opts.region);
      if (opts?.libraries?.length)
        params.set('libraries', opts.libraries.join(','));

      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.onerror = () =>
        reject(new Error('Google Maps JS API failed to load'));
      document.head.appendChild(script);
    });
  }

  /**
   * Add Google logo for compliance
   */
  private ensureGoogleLogo(): void {
    if (
      !this.viewer?.container ||
      (this.viewer.container as any)._googleLogoAdded
    )
      return;

    const logo = document.createElement('img');
    logo.src =
      'https://developers.google.com/static/maps/documentation/images/google_on_white.png';
    logo.alt = 'Google';
    logo.style.position = 'absolute';
    logo.style.bottom = '6px';
    logo.style.left = '6px';
    logo.style.height = '18px';
    logo.style.pointerEvents = 'none';
    logo.style.zIndex = '1000';

    this.viewer.container.appendChild(logo);
    (this.viewer.container as any)._googleLogoAdded = true;
  }

  private async createXYZLayer(
    config: Extract<LayerConfig, { type: 'xyz' }>,
  ): Promise<ImageryLayer> {
    if (!config.url) {
      throw new Error('XYZ layer requires a url');
    }

    const credit = Array.isArray(config.attributions)
      ? config.attributions.join(', ')
      : config.attributions;

    const providerOptions = {
      url: config.url,
      credit,
      maximumLevel: config.maxZoom,
      ...(config.options || {}),
    } as UrlTemplateOptions;

    const provider = new this.Cesium.UrlTemplateImageryProvider(
      providerOptions,
    );

    const layerOptions = {
      alpha: config.opacity ?? 1,
      show: config.visible ?? true,
    };

    return new this.Cesium.ImageryLayer(provider, layerOptions);
  }

  private async createTerrainLayer(
    config: Extract<LayerConfig, { type: 'terrain' }>,
  ): Promise<CesiumTerrainLayer> {
    let provider: any;
    if (config.elevationData) {
      provider = await this.Cesium.CesiumTerrainProvider.fromUrl(
        config.elevationData,
      );
    } else {
      provider = await this.Cesium.createWorldTerrainAsync();
    }

    const layer = new CesiumTerrainLayer(
      this.Cesium,
      this.viewer,
      provider,
      config,
    );

    if (config.visible !== undefined) {
      layer.setVisible(config.visible);
    }
    if (config.opacity !== undefined) {
      layer.setOpacity(config.opacity);
    }

    return layer;
  }

  private async addWMSLayer(
    config: Extract<LayerConfig, { type: 'wms' }>,
  ): Promise<ImageryLayer> {
    return new this.Cesium.ImageryLayer(
      new this.Cesium.WebMapServiceImageryProvider({
        url: config.url,
        layers: config.layers,
        parameters: config.extraParams,
      }),
    );
  }

  private async addArcGISLayer(
    config: Extract<LayerConfig, { type: 'arcgis' }>,
  ) {
    //"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    const provider = await this.Cesium.ArcGisMapServerImageryProvider.fromUrl(
      config.url,
    );
    this.viewer.imageryLayers.addImageryProvider(provider);
  }

  private async createGeoTIFFLayer(
    config: Extract<LayerConfig, { type: 'geotiff' }>,
  ): Promise<ImageryLayer> {
    if (!config.url) {
      throw new Error('GeoTIFF layer requires a URL');
    }

    try {
      // Use TIFFImageryProvider if available, otherwise fallback to SingleTileImageryProvider
      // Note: This implementation assumes you have TIFFImageryProvider available
      // For a more robust solution, you might want to dynamically import it

      // Option 1: Try using TIFFImageryProvider (requires tiff-imagery-provider package)
      try {
        const TIFFImageryProvider = (
          await import('tiff-imagery-provider' as any)
        ).default;
        const provider = await TIFFImageryProvider.fromUrl(config.url);

        return new this.Cesium.ImageryLayer(provider, {
          alpha: config.opacity ?? 1.0,
          show: config.visible ?? true,
        });
      } catch (tiffError) {
        console.warn(
          'TIFFImageryProvider not available, falling back to SingleTileImageryProvider',
        );

        // Option 2: Fallback to SingleTileImageryProvider
        // This assumes the GeoTIFF can be displayed as a simple image
        const provider = new this.Cesium.SingleTileImageryProvider({
          url: config.url,
          rectangle: this.Cesium.Rectangle.fromDegrees(-180, -90, 180, 90), // Default world bounds
        });

        return new this.Cesium.ImageryLayer(provider, {
          alpha: config.opacity ?? 1.0,
          show: config.visible ?? true,
        });
      }
    } catch (error) {
      console.error('Failed to create GeoTIFF layer:', error);

      // Return a placeholder layer in case of error
      const provider = new this.Cesium.SingleTileImageryProvider({
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        rectangle: this.Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
      });

      return new this.Cesium.ImageryLayer(provider, {
        alpha: 0,
        show: false,
      });
    }
  }

  private async createTile3DLayer(
    config: Extract<LayerConfig, { type: 'tile3d' }>,
  ): Promise<Cesium3DTileset> {
    if (!config.url) {
      throw new Error('Tile3D layer requires a URL');
    }

    const tileset = await this.Cesium.Cesium3DTileset.fromUrl(
      config.url,
      config.tilesetOptions ?? {},
    );

    if (config.cesiumStyle) {
      tileset.style = new this.Cesium.Cesium3DTileStyle(config.cesiumStyle);
    }

    return tileset;
  }

  async updateLayer(layerId: string, update: LayerUpdate): Promise<void> {
    return await this.layerManagerMutex.runExclusive(async () => {
      const oldLayer = this.layerManager.getLayer(layerId);
      switch (update.type) {
        case 'geojson':
          {
            const data = update.data;
            const options = oldLayer.getOptions();
            const dataSource: GeoJsonDataSource = await this.createGeoJSONLayer(
              {
                geojson: data.geojson,
                url: data.url,
                style: data.style,
                geostylerStyle: data.geostylerStyle,
              } as Extract<LayerConfig, { type: 'geojson' }>,
              options,
            );
            const layer = this.layerManager.replaceLayer(
              layerId,
              oldLayer,
              dataSource,
            );
            layer.setOptions(options);
          }
          break;
        case 'wfs':
          {
            const data = update.data;
            const options = oldLayer.getOptions();
            const dataSource: GeoJsonDataSource = await this.createWFSLayer(
              data as Extract<LayerConfig, { type: 'wfs' }>,
              options,
            );
            const layer = this.layerManager.replaceLayer(
              layerId,
              oldLayer,
              dataSource,
            );
            layer.setOptions(options);
          }
          break;
        case 'osm':
          {
            const osmOptions = oldLayer.getOptions();
            const osmLayer = new this.Cesium.ImageryLayer(
              new this.Cesium.OpenStreetMapImageryProvider({
                url: update.data.url || 'https://a.tile.openstreetmap.org',
              }),
            );
            const updatedOsmlayer = this.layerManager.replaceLayer(
              layerId,
              oldLayer,
              osmLayer,
            );
            updatedOsmlayer.setOptions(osmOptions);
          }
          break;
        case 'google':
          {
            const googleOptions = oldLayer.getOptions();
            const googleLayer = await this.createGoogleLayer(
              update.data as Extract<LayerConfig, { type: 'google' }>,
            );
            const updatedGoogleLayer = this.layerManager.replaceLayer(
              layerId,
              oldLayer,
              googleLayer,
            );
            updatedGoogleLayer.setOptions(googleOptions);
          }
          break;
        case 'terrain':
          {
            const previousOptions = oldLayer.getOptions();
            const visible = oldLayer.getVisible();
            const opacity = oldLayer.getOpacity();
            oldLayer.remove();

            const terrainLayer = await this.createTerrainLayer({
              type: 'terrain',
              ...previousOptions,
              ...(update.data ?? {}),
            } as Extract<LayerConfig, { type: 'terrain' }>);

            const wrapped = this.layerManager.addCustomLayer(
              layerId,
              terrainLayer,
            );
            wrapped.setVisible(visible);
            wrapped.setOpacity(opacity);
          }
          break;
        case 'xyz':
          {
            const xyzOptions = oldLayer.getOptions();
            const xyzLayer = await this.createXYZLayer(
              update.data as Extract<LayerConfig, { type: 'xyz' }>,
            );
            const updatedXyzLayer = this.layerManager.replaceLayer(
              layerId,
              oldLayer,
              xyzLayer,
            );
            updatedXyzLayer.setOptions(xyzOptions);
          }
          break;
        case 'wkt':
          {
            const data = update.data;
            const options = oldLayer.getOptions();
            const dataSource: GeoJsonDataSource = await this.createWKTLayer(
              {
                wkt: data.wkt,
                url: data.url,
                style: data.style,
                geostylerStyle: data.geostylerStyle,
              } as Extract<LayerConfig, { type: 'wkt' }>,
              options,
            );
            const layer = this.layerManager.replaceLayer(
              layerId,
              oldLayer,
              dataSource,
            );
            layer.setOptions(options);
          }
          break;
        case 'geotiff':
          {
            const data = update.data;
            const iLayer = await this.createGeoTIFFLayer({
              url: data.url,
            } as Extract<LayerConfig, { type: 'geotiff' }>);
            this.layerManager.replaceLayer(layerId, oldLayer, iLayer);
          }
          break;
        case 'tile3d':
          {
            const data = update.data ?? {};
            if (!data.url) {
              throw new Error('tile3d update requires a url');
            }

            const layer = await this.createTile3DLayer({
              type: 'tile3d',
              url: data.url,
              tilesetOptions: data.tilesetOptions,
              cesiumStyle: data.style,
            } as Extract<LayerConfig, { type: 'tile3d' }>);

            const updatedLayer = this.layerManager.replaceLayer(
              layerId,
              oldLayer,
              layer,
            );
            updatedLayer.setOptions(data.tilesetOptions ?? {});
            if (data.style && 'setStyle' in updatedLayer) {
              (updatedLayer as any).setStyle(data.style);
            }
          }
          break;
        case 'tile3d-style':
          {
            const data = update.data ?? {};
            if ('setStyle' in oldLayer) {
              const stylePayload = data.style ?? {};
              (oldLayer as any).setStyle(stylePayload);
            }
          }
          break;
      }
    });
  }

  async setView(center: LonLat, zoom: number) {
    if (!this.viewer) return;
    const [lon, lat] = center;
    this.viewer.camera.flyTo({
      destination: this.Cesium.Cartesian3.fromDegrees(lon, lat, 1000000 / zoom),
      duration: 2.0, // Sekunden, anpassbar
      orientation: {
        heading: this.Cesium.Math.toRadians(0.0), // Blickrichtung nach Norden
        pitch: this.Cesium.Math.toRadians(-30.0), // leicht nach unten schauen
        roll: 0.0,
      },
      // optional: onComplete / onCancel callbacks
      complete: () => log('v-map - provider - cesium - Fly‑to finished'),
      cancel: () => warn('v-map - provider - cesium - Fly‑to cancelled'),
    });
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
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      // Try to parse as JSON anyway
      const text = await response.text();
      return JSON.parse(text);
    }

    // Handle GML formats - parse XML to GeoJSON using @npm9912/s-gml
    if (
      outputFormat.includes('gml') ||
      outputFormat.includes('xml')
    ) {
      const xml = await response.text();
      const { GmlParser } = await import('@npm9912/s-gml');
      const parser = new GmlParser();
      return await parser.parse(xml);
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
}
