// vite.config.ts
import { defineConfig } from 'vite';
import {
  CESIUM_VERSION,
  OL_VERSION,
  LEAFLET_VERSION,
  DECK_VERSION,
} from './src/lib/versions.gen';

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
            'ol',
            'ol/Map',
            'ol/View',
            'ol/proj',
            'ol/layer/Tile',
            'ol/source/OSM',
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
    exclude: ['cesium'],
    include: [
      'geostyler-sld-parser > memfs', // Force bundle memfs
      // '@loaders.gl/core',
      // '@loaders.gl/gltf',
      // '@deck.gl/core',
      // '@deck.gl/layers',
      // '@deck.gl/geo-layers',
    ],
  },
  resolve: {
    alias: {
      // Ensure @loaders.gl modules resolve correctly
      '@loaders.gl/core': '@loaders.gl/core',
    },
  },
});
