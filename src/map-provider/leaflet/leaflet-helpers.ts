import type { CssMode } from '../../types/cssmode';
import { LEAFLET_VERSION } from '../../lib/versions.gen';
import { isBrowser, supportsAdoptedStyleSheets } from '../../utils/dom-env';

import * as L from 'leaflet';

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

export function removeInjectedCss(
  shadowRoot: ShadowRoot,
  injectedStyle: HTMLStyleElement,
) {
  if (!shadowRoot || !injectedStyle) return;
  // Das <style>-Element aus dem Shadow‑DOM entfernen
  injectedStyle.remove(); // moderne API
}

export function ensureLeafletCss(
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

export async function ensureGoogleMutantLoaded(): Promise<void> {
  if (!isBrowser()) return; // im SSR/Tests: noop
  try {
    await import('leaflet.gridlayer.googlemutant');
  } catch {
    // im Test (gemockt) oder wenn das Plugin nicht verfügbar ist → still
  }
}

export async function loadGoogleMapsApi(
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
export function ensureGoogleLogo(map: L.Map, markAdded: () => void) {
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
