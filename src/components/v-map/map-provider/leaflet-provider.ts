// src/components/v-map/map-provider/leaflet-provider.ts
import type {
  MapProvider,
  MapInitOptions,
  LayerConfig,
  LonLat,
} from './map-provider';

import { LEAFLET_VERSION } from '../../../lib/versions.gen';

// Leaflet ESM
import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';

type AnyLayer = L.Layer | L.LayerGroup;

/** CSS in ShadowRoot injizieren – ohne '?inline', kompatibel zu Stencil/Rollup */
async function injectLeafletCss(shadowRoot?: ShadowRoot) {
  if (!shadowRoot) return;
  const id = 'leaflet-css-sheet';
  if (shadowRoot.querySelector(`style[data-id="${id}"]`)) return;

  const url = `https://cdn.jsdelivr.net/npm/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
  const css = await (await fetch(url)).text();

  if ('adoptedStyleSheets' in Document.prototype) {
    const sheet = new CSSStyleSheet();
    await sheet.replace(css);
    // @ts-ignore
    shadowRoot.adoptedStyleSheets = [
      ...(shadowRoot.adoptedStyleSheets ?? []),
      sheet,
    ];
  } else {
    const style = document.createElement('style');
    style.setAttribute('data-id', id);
    style.textContent = css;
    shadowRoot.appendChild(style);
  }
}

/** Lädt die Google Maps JS API dynamisch, falls noch nicht vorhanden */
async function loadGoogleMapsApi(
  apiKey: string,
  opts?: { language?: string; region?: string; libraries?: string[] },
) {
  if ((window as any).google?.maps) return;

  await new Promise<void>((resolve, reject) => {
    const cbName =
      '___leafletGoogleInit___' + Math.random().toString(36).slice(2);
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

/** Fügt ein Google-Logo als Leaflet-Control hinzu (Branding-Sicherheit) */
function ensureGoogleLogo(map: L.Map) {
  if ((map as any)._googleLogoAdded) return;
  const Logo = L.Control.extend({
    onAdd() {
      const img = L.DomUtil.create('img') as HTMLImageElement;
      img.src =
        'https://developers.google.com/static/maps/documentation/images/google_on_white.png';
      img.alt = 'Google';
      img.style.pointerEvents = 'none';
      img.style.height = '18px';
      img.style.margin = '0 0 6px 6px';
      return img;
    },
    onRemove() {},
  });
  new Logo({ position: 'bottomleft' as L.ControlPosition }).addTo(map);
  (map as any)._googleLogoAdded = true;
}

export class LeafletProvider implements MapProvider {
  private map?: L.Map;
  private layers: AnyLayer[] = [];

  async init(container: HTMLElement, options?: MapInitOptions) {
    const sr =
      container.getRootNode() instanceof ShadowRoot
        ? (container.getRootNode() as ShadowRoot)
        : undefined;
    await injectLeafletCss(sr);

    const [lon, lat] = (options?.center ?? [0, 0]) as LonLat;

    this.map = L.map(container, {
      zoomControl: true,
      attributionControl: true,
    }).setView([lat, lon], options?.zoom ?? 2);

    new ResizeObserver(() => this.map?.invalidateSize()).observe(container);
  }

  async addLayer(layerConfig: LayerConfig) {
    if (!this.map) return;

    if ('groupId' in layerConfig && layerConfig.groupId) {
      await this.addLayerToGroup(
        layerConfig as LayerConfig & { groupId: string },
      ).catch(console.error);
    } else {
      await this.addStandaloneLayer(layerConfig).catch(console.error);
    }
  }

  private async addStandaloneLayer(layerConfig: LayerConfig) {
    const layer = (await this.createLayer(layerConfig)) as AnyLayer;
    layer.addTo(this.map!);
    this.layers.push(layer);
  }

  private async addLayerToGroup(
    layerConfig: LayerConfig & { groupId: string },
  ) {
    let group = this.layers.find(
      l =>
        l instanceof L.LayerGroup &&
        (l as any)._groupId === layerConfig.groupId,
    ) as L.LayerGroup | undefined;

    if (!group) {
      group = L.layerGroup();
      (group as any)._groupId = layerConfig.groupId;
      group.addTo(this.map!);
      this.layers.push(group);
    }

    const child = (await this.createLayer(layerConfig)) as AnyLayer;
    group.addLayer(child);
  }

  private async createLayer(layerConfig: LayerConfig): Promise<AnyLayer> {
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
        return this.createOSMLayer();
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

  private async createGeoJSONLayer(
    config: Extract<LayerConfig, { type: 'geojson' }>,
  ): Promise<L.GeoJSON> {
    const res = await fetch(config.url);
    if (!res.ok)
      throw new Error(`GeoJSON fetch failed: ${res.status} ${res.statusText}`);
    const data = await res.json();

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

  private async createOSMLayer(): Promise<L.TileLayer> {
    return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    });
  }

  private async createWMSLayer(
    config: Extract<LayerConfig, { type: 'wms' }>,
  ): Promise<L.TileLayer.WMS> {
    return L.tileLayer.wms(config.url, {
      layers: config.layers,
      format: (config.params as any)?.FORMAT ?? 'image/png',
      transparent: (config.params as any)?.TRANSPARENT ?? true,
      ...(config.params ?? {}),
    } as L.WMSOptions);
  }

  private async createGoogleLayer(
    config: Extract<LayerConfig, { type: 'google' }>,
  ): Promise<L.GridLayer> {
    if (!this.map) throw new Error('Map not initialized');
    if (!config.apiKey)
      throw new Error("Google-Layer benötigt 'apiKey' (Google Maps Platform).");

    await loadGoogleMapsApi(config.apiKey, {
      language: (config as any).language,
      region: (config as any).region,
      libraries: (config as any).libraries,
    });

    const type = (config.mapType ?? 'roadmap') as
      | 'roadmap'
      | 'satellite'
      | 'terrain'
      | 'hybrid';

    const gLayer = (L.gridLayer as any).googleMutant({
      type,
      maxZoom: (config as any).maxZoom ?? 21,
      styles: (config as any).styles,
    }) as L.GridLayer;

    ensureGoogleLogo(this.map);
    return gLayer;
  }

  async destroy() {
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

  getMap() {
    return this.map;
  }
}
