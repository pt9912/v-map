// VitePress custom theme entry. We extend the default theme and additionally
// register the v-map web components on the client so that markdown pages can
// embed live <v-map>...</v-map> demos via the <LiveMap /> Vue SFC.
//
// IMPORTANT: We do NOT bundle Stencil's loader through Vite. Stencil's lazy
// loader uses `import.meta.url` to find its sibling `*.entry.js` chunks at
// runtime. Bundling the loader into the docs JS would relocate it to
// `/assets/chunks/theme.*.js` and Stencil would then look for v-map chunks
// at that same path — where they don't exist (they live in the published
// v-map package, not in the docs site). The first attempt did exactly this
// and produced 404s in the browser console.
//
// Instead we inject a runtime `<script type="module">` that loads
// `v-map.esm.js` straight from jsDelivr — the same mechanism the CDN guide
// documents. The browser then resolves all sibling chunks against the
// jsDelivr URL and Stencil's customElements register cleanly.
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import LiveMap from './components/LiveMap.vue';
import DemoFrame from './components/DemoFrame.vue';

// Pin to the exact released v-map version that matches what the live
// demos in this docs build target. Bump on every release together with
// the standalone HTML demos under docs/public/demos/.
const VMAP_VERSION = '0.2.1';

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const VMAP_BUNDLE = `https://cdn.jsdelivr.net/npm/@npm9912/v-map@${VMAP_VERSION}/dist/v-map/v-map.esm.js`;
  // Avoid double-injection if the theme module is evaluated more than once.
  if (!document.querySelector(`script[data-vmap-loader="${VMAP_VERSION}"]`)) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = VMAP_BUNDLE;
    script.dataset.vmapLoader = VMAP_VERSION;
    document.head.appendChild(script);
  }
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // LiveMap renders an in-page <v-map> via Vue/customElements.
    app.component('LiveMap', LiveMap);
    // DemoFrame renders a sandboxed iframe loading a standalone HTML demo
    // from /demos/<name>.html. Used via the markdown shortcut @[demo:name].
    app.component('DemoFrame', DemoFrame);
  },
} satisfies Theme;
