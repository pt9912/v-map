// vite.config.ts
import { defineConfig } from 'vite';
import {
  CESIUM_VERSION,
  OL_VERSION,
  LEAFLET_VERSION,
} from './src/lib/versions.gen';

console.log('[v-map demo versions]', {
  Cesium: CESIUM_VERSION,
  OL: OL_VERSION,
  Leaflet: LEAFLET_VERSION,
});

export default defineConfig({
  plugins: [
    {
      name: 'inject-versions',
      transformIndexHtml(html) {
        const banner = `
          <div id="version-banner" style="
            position:fixed;bottom:0;left:0;right:0;
            background:#eee;padding:4px 8px;
            font:12px/1.4 monospace;z-index:9999;
          ">
            Cesium ${CESIUM_VERSION} · OL ${OL_VERSION} · Leaflet ${LEAFLET_VERSION}
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
  },
});
