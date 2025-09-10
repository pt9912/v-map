// src/app.ts
import { loadCesium, injectWidgetsCss } from '../../lib/cesium-loader';

import type { MapProvider } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';

type CesiumModule = typeof import('cesium');
import { Viewer } from 'cesium';

export class CesiumProvider implements MapProvider {
  private viewer: Viewer;
  private Cesium: CesiumModule;

  async init(options: ProviderOptions) {
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
  }

  async destroy() {
    this.viewer?.destroy();
    this.viewer = undefined;
  }

  async addLayer(layerConfig: LayerConfig) {
    switch (layerConfig.type) {
      case 'geojson':
        await this.addGeoJSONLayer(layerConfig);
        break;
      case 'osm':
        this.addOSMLayer();
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
  }

  private async addGeoJSONLayer(
    config: Extract<LayerConfig, { type: 'geojson' }>,
  ) {
    const dataSource = await this.Cesium.GeoJsonDataSource.load(config.url, {
      clampToGround: true, // ✅ Option hier setzen
    });
    this.viewer.dataSources.add(dataSource);
  }

  private addOSMLayer() {
    this.viewer.imageryLayers.addImageryProvider(
      new this.Cesium.OpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/',
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
      complete: () => console.log('Fly‑to finished'),
      cancel: () => console.warn('Fly‑to cancelled'),
    });
  }

  // (optional) async ensureGroup?(...) { ... }

  getMap(): Viewer {
    return this.viewer;
  }
}
