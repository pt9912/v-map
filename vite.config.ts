// vite.config.ts
import { defineConfig } from 'vite';
import {
  CESIUM_VERSION,
  OL_VERSION,
  LEAFLET_VERSION,
  DECK_VERSION,
} from './src/lib/versions.gen';
import { optimizeDepsExclude, optimizeDepsInclude } from './config/optimize-deps';

const leafletEsmPath = new URL(
  './node_modules/.pnpm/leaflet@1.9.4/node_modules/leaflet/dist/leaflet-src.esm.js',
  import.meta.url,
).pathname;
const vitestViteCacheDir =
  process.env.VITE_CACHE_DIR ||
  (process.env.VITEST ? 'node_modules/.vitest-cache/vite' : undefined);

console.log('[v-map demo versions]', {
  Cesium: CESIUM_VERSION,
  OL: OL_VERSION,
  Leaflet: LEAFLET_VERSION,
  Deck: DECK_VERSION,
});

export default defineConfig({
  cacheDir: vitestViteCacheDir,
  plugins: [
    {
      name: 'node-polyfills',
      transform(code, id) {
        if (id.includes('geostyler-sld-parser')) {
          return code.replace(/require\('fs'\)/, 'require("memfs")');
        }
        return code;
      },
    },
    {
      name: 'inject-versions',
      transformIndexHtml(html) {
        const banner = `
          <div id="version-banner" style="
            position:fixed;bottom:0;left:0;right:0;
            background:#eee;padding:4px 8px;
            font:12px/1.4 monospace;z-index:9999;
          ">
            Cesium ${CESIUM_VERSION} · OL ${OL_VERSION} · Leaflet ${LEAFLET_VERSION} · Deck.gl ${DECK_VERSION}
          </div>`;
        return html.replace('</body>', `${banner}\n</body>`);
      },
    },
  ],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('leaflet')) return 'chunk-leaflet';
        },
      },
    },
  },
  define: {
    global: 'window', // Polyfill global for browser
  },
  optimizeDeps: {
    exclude: [...optimizeDepsExclude],
    include: [...optimizeDepsInclude],
    noDiscovery: true,
  },
  resolve: {
    alias: {
      leaflet: leafletEsmPath,
      jszip: new URL(
        './node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/dist/jszip.js',
        import.meta.url,
      ).pathname,
      pako: new URL(
        './node_modules/.pnpm/pako@1.0.11/node_modules/pako/dist/pako.js',
        import.meta.url,
      ).pathname,
    },
  },
});
