// Base path for the deployed iframe inside the docs site
// (/v-map/demos/nuxt/). Empty by default so `pnpm dev` and standalone
// `pnpm generate` still work without any env var. Set VMAP_DOCS_BASE
// when building for docs embedding, e.g. via the orchestration script
// in the repo root.
//
// Nuxt requires a trailing slash for app.baseURL when it's not the
// root, otherwise asset URLs end up missing the separator.
const rawBase = process.env.VMAP_DOCS_BASE ?? '/';
const baseURL = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-04-09',
  devtools: { enabled: false },

  app: {
    baseURL,
  },

  // We use SSR for prerendering during `nuxt generate` so the static
  // site has real HTML on first paint, but every page that touches
  // <v-map> declares its own `definePageMeta({ ssr: false })` to opt
  // out — see app/pages/index.vue. v-map cannot run on the server
  // because it's a Stencil-built custom element bundle that needs the
  // browser DOM and customElements registry.
  ssr: true,

  vue: {
    compilerOptions: {
      // Match the bare <v-map> tag and every <v-map-*> child so Vue's
      // template compiler treats them as native custom elements
      // instead of trying to resolve them as Vue components. Without
      // this Nuxt logs "Failed to resolve component: v-map" warnings.
      isCustomElement: tag => tag === 'v-map' || tag.startsWith('v-map-'),
    },
  },

  // Nitro preset: static export. `nuxt generate` already implies this,
  // but spelling it out makes the build script behaviour explicit.
  nitro: {
    preset: 'static',
  },
});
