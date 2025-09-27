// CesiumProvider.ts – relevante Ergänzungen
import { CesiumLayerGroups, AnyLayer } from './CesiumLayerGroups';
import { LayerManager } from './layer-manager';

import { log, warn } from '../../utils/logger';
import { loadCesium, injectWidgetsCss } from '../../lib/cesium-loader';

import type { MapProvider, LayerUpdate } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';

import { AsyncMutex } from '../../utils/async-mutex';

type CesiumModule = typeof import('cesium');
import type { Viewer, ImageryLayer, GeoJsonDataSource } from 'cesium';

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

  private async createLayer(
    layerConfig: LayerConfig,
    layerId: string,
  ): Promise<AnyLayer> {
    let wrapper = null;

    switch (layerConfig.type) {
      case 'geojson': {
        const options = { clampToGround: true };
        const ds = await this.createGeoJSONLayer(
          layerConfig.geojson,
          layerConfig.url,
          options,
        );
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
    await this.layerManager.setZIndex(layerId, zIndex);
    // Z-Order ist unabhängig von Basemap/Group-Visible, aber apply() schadet nicht
    this.layerGroups.apply();
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

  private async createOSMLayer(
    cfg: Extract<LayerConfig, { type: 'osm' }>,
  ): Promise<ImageryLayer> {
    return new this.Cesium.ImageryLayer(
      new this.Cesium.OpenStreetMapImageryProvider({
        url: cfg.url || 'https://a.tile.openstreetmap.org',
      }),
    );
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

  async updateLayer(layerId: string, update: LayerUpdate): Promise<void> {
    return await this.layerManagerMutex.runExclusive(async () => {
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
    });
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
      complete: () => log('v-map - provider - cesium - Fly‑to finished'),
      cancel: () => warn('v-map - provider - cesium - Fly‑to cancelled'),
    });
  }
}
