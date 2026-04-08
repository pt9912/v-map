import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VMAP_DOCS_BASE is set by scripts/build-examples.mjs to /v-map/demos/react
// when building for embedding in the docs site. Empty during local dev.
// Vite expects the base to end with a slash for sub-path deployments.
const baseEnv = process.env.VMAP_DOCS_BASE ?? '';
const base = baseEnv ? baseEnv.replace(/\/?$/, '/') : '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react({
      // Vue/Stencil custom elements need to be allowed through React's
      // JSX transformer. React 19 handles them natively, no special
      // config required.
    }),
  ],
});
