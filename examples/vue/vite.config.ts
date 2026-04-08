import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// VMAP_DOCS_BASE is set by scripts/build-examples.mjs to /v-map/demos/vue
// when building for embedding in the docs site. Empty during local dev.
// Vite expects the base to end with a slash for sub-path deployments.
const baseEnv = process.env.VMAP_DOCS_BASE ?? '';
const base = baseEnv ? baseEnv.replace(/\/?$/, '/') : '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Tell Vue's template compiler that any tag matching v-map or
          // v-map-* is a native custom element, NOT a Vue component.
          // Without this Vue logs a runtime warning ("Failed to resolve
          // component") on every <v-map> in the template.
          isCustomElement: tag => tag === 'v-map' || tag.startsWith('v-map-'),
        },
      },
    }),
  ],
});
