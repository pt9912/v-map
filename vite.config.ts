// vite.config.ts
import { defineConfig } from 'vite';
import {
  CESIUM_VERSION,
  OL_VERSION,
  LEAFLET_VERSION,
  DECK_VERSION,
} from './src/lib/versions.gen';

const leafletEsmPath = new URL(
  './node_modules/.pnpm/leaflet@1.9.4/node_modules/leaflet/dist/leaflet-src.esm.js',
  import.meta.url,
).pathname;

console.log('[v-map demo versions]', {
  Cesium: CESIUM_VERSION,
  OL: OL_VERSION,
  Leaflet: LEAFLET_VERSION,
  Deck: DECK_VERSION,
});

export default defineConfig({
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
    rollupOptions: {
      output: {
        manualChunks: {
          'chunk-ol': [
            // 'ol',
            // 'ol/Map',
            // 'ol/View',
            // 'ol/proj',
            // 'ol/layer/Tile',
            // 'ol/source/OSM',
          ],
          'chunk-leaflet': ['leaflet'],
        },
      },
    },
    commonjsOptions: {
      ignore: ['path'],
      transformMixedEsModules: true, // Handle ESM/CJS interop
    },
  },
  define: {
    global: 'window', // Polyfill global for browser
  },
  optimizeDeps: {
    exclude: [
      'cesium',
      '@loaders.gl/wms',
      '@loaders.gl/tiles',
      '@loaders.gl/gltf',
      '@loaders.gl/schema',
      '@loaders.gl/terrain',
      '@loaders.gl/images',
      '@loaders.gl/geojson',
      '@deck.gl/core',
      '@deck.gl/layers',
      '@deck.gl/geo-layers',
    ],
    include: [
      'geostyler-sld-parser > memfs', // Force bundle memfs
      'ol', // Pre-bundle the entire OpenLayers package
      '@stencil/core',
      '@stencil/core/internal/client',
      'leaflet',
      'ol',
      'geotiff',
      'proj4',
      'geotiff-geokeys-to-proj4',
      'jszip',
      'pako',
      'snappyjs',
      'pbf',
      'lie',
      'setimmediate',
      'readable-stream',
      '@loaders.gl/core',
      '@loaders.gl/images',
      '@loaders.gl/wms',
      '@loaders.gl/loader-utils',
      '@loaders.gl/schema',
      '@loaders.gl/textures',
      '@loaders.gl/gltf',
      '@loaders.gl/tiles',
      '@loaders.gl/compression',
      '@loaders.gl/zip',
      '@loaders.gl/3d-tiles',
      '@loaders.gl/terrain',
      '@loaders.gl/mvt',
      '@loaders.gl/gis',
    ],
  },
  resolve: {
    alias: [
      { find: /^leaflet$/, replacement: leafletEsmPath },
      {
        find: /^jszip$/,
        replacement: new URL(
          './node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/dist/jszip.js',
          import.meta.url,
        ).pathname,
      },
      {
        find: /^pako$/,
        replacement: new URL(
          './node_modules/.pnpm/pako@1.0.11/node_modules/pako/dist/pako.js',
          import.meta.url,
        ).pathname,
      },
    ],
  },
});
