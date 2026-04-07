// src/lib/cesium-loader.ts
import type { CesiumNS } from '../../types/namespaces';
import { CESIUM_VERSION } from './versions.gen';
import { AsyncMutex } from '../utils/async-mutex';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const sameMM = (exp: string, act: string) =>
  exp.match(/^\d+\.\d+/)?.[0] === act.match(/^\d+\.\d+/)?.[0];
const loadCesiumMutex = new AsyncMutex();

export async function loadCesium(version = CESIUM_VERSION): Promise<CesiumNS> {
  const v = version.replace(/^[^\d]*/, '');
  const base = `https://cdn.jsdelivr.net/npm/cesium@${v}/Build/Cesium`;
  const url = `${base}/Cesium.js`;

  await loadCesiumMutex.runExclusive(async () => {
    if (!globalThis.Cesium) {
      await new Promise<void>((resolve, reject) => {
        const id = 'cesium-cdn-script';
        if (document.getElementById(id)) return resolve();
        const s = document.createElement('script');
        s.id = id;
        s.async = true;
        s.src = url;
        s.addEventListener('load', () => resolve(), { once: true });
        s.addEventListener(
          'error',
          () => reject(new Error(`Laden fehlgeschlagen: ${url}`)),
          { once: true },
        );
        document.head.appendChild(s);
      });
    }
  });

  const Cesium = globalThis.Cesium as CesiumNS | undefined;
  assert(Cesium, 'globalThis.Cesium nicht verfügbar.');

  const actual = Cesium.VERSION; // z.B. "1.133"
  assert(
    sameMM(String(version), actual), // Major.Minor muss passen
    `Cesium-Version abweichend: erwartet ~${version}, geladen ${actual}`,
  );

  (globalThis as Record<string, unknown>).CESIUM_BASE_URL = base;
  return Cesium;
}

export async function injectWidgetsCss(shadowRoot?: ShadowRoot) {
  const v = CESIUM_VERSION.replace(/^[^\d]*/, '');
  const base = `https://cdn.jsdelivr.net/npm/cesium@${v}/Build/Cesium`;
  const cssUrl = `${base}/Widgets/widgets.css`;
  const cssText = await (await fetch(cssUrl)).text();
  const absolutized = cssText.replace(
    /url\((?!['"]?data:)(['"]?)([^'")]+)\1\)/g,
    (_m, _q, rel) => `url(${base}/Widgets/${rel.replace(/^\.?\//, '')})`,
  );
  if (!shadowRoot) return;
  if ('adoptedStyleSheets' in Document.prototype) {
    const sheet = new CSSStyleSheet();
    await sheet.replace(absolutized);
    shadowRoot.adoptedStyleSheets = [
      ...(shadowRoot.adoptedStyleSheets ?? []),
      sheet,
    ];
  } else {
    const style = document.createElement('style');
    style.textContent = absolutized;
    shadowRoot.appendChild(style);
  }
}
