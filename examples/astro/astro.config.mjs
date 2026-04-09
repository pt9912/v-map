// @ts-check
import { defineConfig } from 'astro/config';

// Base path for the deployed iframe inside the docs site
// (/v-map/demos/astro/). Empty by default so `pnpm dev` and standalone
// `pnpm build` still work without any env var. Set VMAP_DOCS_BASE when
// building for docs embedding, e.g. via the orchestration script in the
// repo root.
const base = process.env.VMAP_DOCS_BASE ?? '/';

export default defineConfig({
  base,
  // Astro produces fully static HTML by default, which is exactly what we
  // need: the demo is a single page that boots up entirely client-side.
  output: 'static',
});
