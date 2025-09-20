// src/app.ts
import { loadCesium, injectWidgetsCss } from '../../lib/cesium-loader';

import type { MapProvider, LayerUpdate } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';

type CesiumModule = typeof import('cesium');
import { Viewer, ImageryLayer, GeoJsonDataSource } from 'cesium';

import { LayerManager } from './layer-manager';

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
      console.log('v-map - provider - cesium - Cesium‑Widget‑CSS entfernt');
      break; // wir haben das gesuchte Style‑Tag gefunden
    }
  }
}

export class CesiumProvider implements MapProvider {
  private viewer: Viewer;
  private Cesium: CesiumModule;
  private layerManager: LayerManager;
  private shadowRoot: ShadowRoot;

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
    this.viewer.scene.backgroundColor = Cesium.Color.WHITE;
    this.viewer.scene.globe.baseColor = this.Cesium.Color.WHITE;
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

  async updateLayer(layerId: string, update: LayerUpdate): Promise<void> {
    const oldLayer = this.layerManager.getLayer(layerId);
    switch (update.type) {
      case 'geojson':
        {
          const data = update.data;
          const options = oldLayer.getOptions();
          const dataSource: GeoJsonDataSource = await this.createGeoJSONLayer(
            data.geojson,
            data.url,
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
    }
  }

  async addLayer(layerConfig: LayerConfig): Promise<string> {
    const layerId = crypto.randomUUID();
    let layer = null;
    switch (layerConfig.type) {
      case 'geojson':
        const options = { clampToGround: true };
        const dataSource: GeoJsonDataSource = await this.createGeoJSONLayer(
          layerConfig.geojson,
          layerConfig.url,
          options,
        );
        layer = this.layerManager.addLayer(layerId, dataSource);
        layer.setOptions(options);
        break;
      case 'osm':
        const iLayer = this.createOSMLayer(
          layerConfig as Extract<LayerConfig, { type: 'osm' }>,
        );
        layer = this.layerManager.addLayer(layerId, iLayer);
        break;
      case 'wms':
        await this.addWMSLayer(layerConfig);
        break;
      case 'arcgis':
        await this.addArcGISLayer(layerConfig);
        break;
      default:
        throw new Error(`Unsupported layer type: ${(layerConfig as any).type}`);
    }
    if (layer == null) {
      return null;
    }
    if ((layerConfig as any).zIndex !== undefined) {
      layer.setZIndex((layerConfig as any).zIndex);
      //await this.setZIndex(layerId, (layerConfig as any).zIndex);
    }
    if ((layerConfig as any).opacity !== undefined) {
      layer.setOpacity((layerConfig as any).opacity);
      //      await this.setOpacity(layerId, (layerConfig as any).opacity);
    }
    if ((layerConfig as any).visible !== undefined) {
      layer.setVisible((layerConfig as any).visible);
      //      await this.setVisible(layerId, (layerConfig as any).visible);
    }
    /*
     */
    return layerId;
  }

  private async createGeoJSONLayer(
    geojson: string,
    url: string,
    options: any,
  ): Promise<GeoJsonDataSource> {
    let geojson_or_url = null;
    if (geojson) {
      geojson_or_url = JSON.parse(geojson);
    } else {
      geojson_or_url = url;
    }

    //https://cesium.com/learn/ion-sdk/ref-doc/GeoJsonDataSource.html
    const dataSource: GeoJsonDataSource =
      await this.Cesium.GeoJsonDataSource.load(geojson_or_url, options);
    return dataSource;
  }

  private createOSMLayer(
    cfg: Extract<LayerConfig, { type: 'osm' }>,
  ): ImageryLayer {
    return new this.Cesium.ImageryLayer(
      new this.Cesium.OpenStreetMapImageryProvider({
        url: cfg.url || 'https://a.tile.openstreetmap.org',
      }),
    );
  }

  private async addWMSLayer(config: Extract<LayerConfig, { type: 'wms' }>) {
    const provider = new this.Cesium.WebMapServiceImageryProvider({
      url: config.url,
      layers: config.layers,
      parameters: config.params,
    });
    this.viewer.imageryLayers.addImageryProvider(provider);
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

  async setView(center: LonLat, zoom: number) {
    if (!this.viewer) return;
    const [lon, lat] = center;
    await this.viewer.camera.flyTo({
      destination: this.Cesium.Cartesian3.fromDegrees(lon, lat, 1000000 / zoom),
      duration: 2.0, // Sekunden, anpassbar
      orientation: {
        heading: Cesium.Math.toRadians(0.0), // Blickrichtung nach Norden
        pitch: Cesium.Math.toRadians(-30.0), // leicht nach unten schauen
        roll: 0.0,
      },
      // optional: onComplete / onCancel callbacks
      complete: () =>
        console.log('v-map - provider - cesium - Fly‑to finished'),
      cancel: () =>
        console.warn('v-map - provider - cesium - Fly‑to cancelled'),
    });
  }

  async removeLayer(layerId: string): Promise<void> {
    if (!layerId) {
      return;
    }
    this.layerManager.removeLayer(layerId);
  }

  async setOpacity(layerId: string, opacity: number): Promise<void> {
    this.layerManager.setOpacity(layerId, opacity);
  }

  async setVisible(layerId: string, visible: boolean): Promise<void> {
    this.layerManager.setVisible(layerId, visible);
  }

  async setZIndex(layerId: string, zindex: number): Promise<void> {
    this.layerManager.setZIndex(layerId, zindex);
  }

  // (optional) async ensureGroup?(...) { ... }

  getMap(): Viewer {
    return this.viewer;
  }
}
