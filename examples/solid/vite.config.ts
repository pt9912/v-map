import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

// Base path for the deployed iframe inside the docs site
// (/v-map/demos/solid/). Empty by default so `pnpm dev` and standalone
// `pnpm build` still work without any env var. Set VMAP_DOCS_BASE
// when building for docs embedding, e.g. via the orchestration script
// in the repo root.
const rawBase = process.env.VMAP_DOCS_BASE ?? '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export default defineConfig({
  base,
  plugins: [solid()],
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});
