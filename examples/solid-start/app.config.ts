import { defineConfig } from '@solidjs/start/config';

// Base path for the deployed iframe inside the docs site
// (/v-map/demos/solid-start/). Empty by default so `vinxi dev` and
// standalone `vinxi build` still work without any env var. Set
// VMAP_DOCS_BASE when building for docs embedding, e.g. via the
// orchestration script in the repo root.
const rawBase = process.env.VMAP_DOCS_BASE ?? '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export default defineConfig({
  server: {
    // Prerender all routes at build time so we get a static export
    // that docs CI can copy into docs/public/demos/solid-start/.
    preset: 'static',
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
    baseURL: base,
  },
  vite: {
    base,
  },
});
