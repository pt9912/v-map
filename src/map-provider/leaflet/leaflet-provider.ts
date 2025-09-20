import type { MapProvider, LayerUpdate } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';
import type { CssMode } from '../../types/cssmode';

import { watchElementResize, Unsubscribe } from '../../utils/dom-env';

import { LEAFLET_VERSION } from '../../lib/versions.gen';

// Leaflet ESM
import * as L from 'leaflet';

import { isBrowser, supportsAdoptedStyleSheets } from '../../utils/dom-env';

interface OpacityOptions {
  opacity?: number;
  fillOpacity?: number;
}

function injectInlineMin(root?: ShadowRoot): HTMLStyleElement | null {
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
    return null;
  } else {
    const style = document.createElement('style');
    style.textContent = css;
    (root ?? document.head).appendChild(style);
    return style;
  }
}

function addLeafletCssFromCdn(
  root?: ShadowRoot,
  version = LEAFLET_VERSION,
  cdn: 'jsdelivr' | 'unpkg' = 'jsdelivr',
): HTMLStyleElement | null {
  if (!isBrowser()) return;

  const href =
    cdn === 'unpkg'
      ? `https://unpkg.com/leaflet@${version}/dist/leaflet.css`
      : `https://cdn.jsdelivr.net/npm/leaflet@${version}/dist/leaflet.css`;

  if (cdn === 'unpkg')
    L.Icon.Default.imagePath = `https://unpkg.com/npm/leaflet@${version}/dist/images/`;
  else
    L.Icon.Default.imagePath = `https://cdn.jsdelivr.net/npm/leaflet@${version}/dist/images/`;

  // doppelte Injektion vermeiden (prüfe ShadowRoot **und** globales head)
  const scope = (root as unknown as Document | ShadowRoot) ?? document;
  const already =
    scope.querySelector?.(`link[rel="stylesheet"][href="${href}"]`) ||
    document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`);

  if (already) return null;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  // Optional: link.integrity = '<SRI-Hash>'; link.crossOrigin = '';
  (root ?? document.head).appendChild(link);
  return link;
}

function removeInjectedCss(
  shadowRoot: ShadowRoot,
  injectedStyle: HTMLStyleElement,
) {
  if (!shadowRoot || !injectedStyle) return;
  // Das <style>-Element aus dem Shadow‑DOM entfernen
  injectedStyle.remove(); // moderne API
}

function ensureLeafletCss(
  mode: CssMode,
  root?: ShadowRoot,
): HTMLStyleElement | null {
  if (!isBrowser()) return; // Tests/SSR: no-op
  switch (mode) {
    case 'cdn':
      return addLeafletCssFromCdn(root);
    case 'inline-min':
      return injectInlineMin(root);
    case 'bundle':
      // CSS wird vom Host/App-Bundle geliefert (z.B. via import 'leaflet/dist/leaflet.css')
      break;
    case 'none':
    default:
      // Host kümmert sich selbst; nichts tun
      break;
  }
  return null;
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
    }
  }

  async addLayer(config: LayerConfig): Promise<string> {
    if (!this.map) return;
    let layer: L.Layer = null;
    if ('groupId' in config && config.groupId) {
      try {
        layer = await this.addLayerToGroup(
          config as LayerConfig & { groupId: string },
        );
      } catch (ex) {
        console.error('addLayer - Unerwarteter Fehler:', ex);
        return null;
      }
    } else {
      try {
        layer = await this.addStandaloneLayer(config);
      } catch (ex) {
        console.error('addLayer - Unerwarteter Fehler:', ex);
        return null;
      }
    }
    if (layer == null) {
      return null;
    }
    layer.vmapVisible = true;
    layer.vmapOpacity = 1.0;

    if ((config as any).opacity !== undefined) {
      this.setOpacityByLayer(layer, (config as any).opacity);
    }
    if ((config as any).zIndex !== undefined) {
      layer.setZIndex((config as any).zIndex);
    }
    if ((config as any).visible) {
      this.setVisibleByLayer(layer, true);
    } else if ((config as any).visible === false) {
      this.setVisibleByLayer(layer, false);
    }

    return layer._leaflet_id;
  }

  private async addStandaloneLayer(layerConfig: LayerConfig): Promise<L.Layer> {
    const layer = await this.createLayer(layerConfig);
    layer.addTo(this.map!);
    this.layers.push(layer);
  }

  private async addLayerToGroup(
    layerConfig: LayerConfig & { groupId: string },
  ): Promise<L.Layer> {
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

    const child = await this.createLayer(layerConfig);
    group.addLayer(child);
    return child;
  }

  private async _getLayerById(layerId): Promise<L.Layer> {
    let layerFound = null;
    this.map.eachLayer(layer => {
      if (L.stamp(layer) === layerId) {
        layerFound = layer;
      }
    });
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
      case 'google':
        return this.createGoogleLayer(
          layerConfig as Extract<LayerConfig, { type: 'google' }>,
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
      console.log(
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
    if (!layer || typeof layer.setOpacity !== 'function') return;
    // 1. Aktualisiere den Sichtbarkeitszustand
    layer.vmapVisible = visible;
    if (layer.vmapOpacity === undefined) {
      layer.vmapOpacity = 1.0;
    }

    // 2. Setze die Opazität basierend auf dem neuen Zustand:
    const targetOpacity = visible ? layer.vmapOpacity : 0.0;
    layer.setOpacity(targetOpacity);
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

  getMap() {
    return this.map;
  }
}
