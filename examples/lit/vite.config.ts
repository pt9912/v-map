import { defineConfig } from 'vite';

// Base path for the deployed iframe inside the docs site
// (/v-map/demos/lit/). Empty by default so `pnpm dev` and standalone
// `pnpm build` still work without any env var. Set VMAP_DOCS_BASE
// when building for docs embedding, e.g. via the orchestration script
// in the repo root.
//
// Vite expects a trailing slash on the base path, otherwise asset
// URLs end up missing the separator.
const rawBase = process.env.VMAP_DOCS_BASE ?? '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export default defineConfig({
  base,
  // No framework plugin needed — Lit components are just classes that
  // extend LitElement, and Vite handles them as plain TypeScript.
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
});
