// VitePress custom theme entry. We extend the default theme and additionally
// register the v-map web components on the client so that markdown pages can
// embed live <v-map>...</v-map> demos via the <LiveMap /> Vue SFC.
//
// IMPORTANT: VitePress prerenders pages with SSR. The Stencil loader uses
// browser APIs (DOM, customElements, Blob, etc.), so the import must be guarded
// behind `typeof window !== 'undefined'`. The dynamic import + .then() shape
// also keeps the loader off the SSR module graph entirely.
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import LiveMap from './components/LiveMap.vue';

if (typeof window !== 'undefined') {
  // Path is relative to docs/.vitepress/theme/index.ts → repo root → loader/.
  // Using a relative path avoids the package-self-reference dance and works
  // both in `pnpm docs:dev` and `pnpm docs:build`.
  void import('../../../loader/index.js').then(m => {
    m.defineCustomElements();
  });
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register LiveMap globally so it's usable in markdown as <LiveMap />.
    app.component('LiveMap', LiveMap);
  },
} satisfies Theme;
