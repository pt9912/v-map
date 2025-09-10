import type { MapProvider } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';
import type { CssMode } from '../../types/cssmode';

import { watchElementResize, Unsubscribe } from '../../utils/dom-env';

import { LEAFLET_VERSION } from '../../lib/versions.gen';

// Leaflet ESM
import * as L from 'leaflet';
//import 'leaflet.gridlayer.googlemutant';

import { isBrowser, supportsAdoptedStyleSheets } from '../../utils/dom-env';

function injectInlineMin(root?: ShadowRoot): void {
  if (!isBrowser()) return;
  const css = `
    :host { display:block; }
    #map { width:100%; height:100%; display:block; }
  `;
  if (supportsAdoptedStyleSheets()) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    const target: any = root ?? document;
    const current = target.adoptedStyleSheets ?? [];
    target.adoptedStyleSheets = [...current, sheet];
  } else {
    const style = document.createElement('style');
    style.textContent = css;
    (root ?? document.head).appendChild(style);
  }
}

function addLeafletCssFromCdn(
  root?: ShadowRoot,
  version = LEAFLET_VERSION,
  cdn: 'jsdelivr' | 'unpkg' = 'jsdelivr',
) {
  if (!isBrowser()) return;

  const href =
    cdn === 'unpkg'
      ? `https://unpkg.com/leaflet@${version}/dist/leaflet.css`
      : `https://cdn.jsdelivr.net/npm/leaflet@${version}/dist/leaflet.css`;

  // doppelte Injektion vermeiden (prüfe ShadowRoot **und** globales head)
  const scope = (root as unknown as Document | ShadowRoot) ?? document;
  const already =
    scope.querySelector?.(`link[rel="stylesheet"][href="${href}"]`) ||
    document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`);

  if (already) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  // Optional: link.integrity = '<SRI-Hash>'; link.crossOrigin = '';
  (root ?? document.head).appendChild(link);
}

function ensureLeafletCss(mode: CssMode, root?: ShadowRoot) {
  if (!isBrowser()) return; // Tests/SSR: no-op
  switch (mode) {
    case 'cdn':
      addLeafletCssFromCdn(root);
      break;
    case 'inline-min':
      injectInlineMin(root);
      break;
    case 'bundle':
      // CSS wird vom Host/App-Bundle geliefert (z.B. via import 'leaflet/dist/leaflet.css')
      break;
    case 'none':
    default:
      // Host kümmert sich selbst; nichts tun
      break;
  }
}

async function ensureGoogleMutantLoaded(): Promise<void> {
  if (!isBrowser()) return; // im SSR/Tests: noop
  try {
    await import('leaflet.gridlayer.googlemutant');
  } catch {
    // im Test (gemockt) oder wenn das Plugin nicht verfügbar ist → still
  }
}

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

/** Fügt ein kleines Google-Logo als Leaflet-Control hinzu (Branding-Sicherheit) */
function ensureGoogleLogo(map: L.Map, markAdded: () => void) {
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
  markAdded();
}

type AnyLayer = L.Layer | L.LayerGroup;

export class LeafletProvider implements MapProvider {
  private map?: L.Map;
  private layers: AnyLayer[] = [];
  private googleLogoAdded: boolean = false;
  private unsubscribeResize: Unsubscribe;

  async init(options: ProviderOptions) {
    if (!isBrowser()) return;

    ensureLeafletCss(options.cssMode, options.shadowRoot);

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
      console.log('googleLogoAdded: ', this.googleLogoAdded);
    });
    return gLayer;
  }

  async destroy() {
    this.unsubscribeResize?.();
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
