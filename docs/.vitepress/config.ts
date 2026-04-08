import dumpMd from '../../scripts/vite-dump-plugin.mjs';

export default {
  title: 'v-map',
  description: 'Kartenkomponenten & API',
  lang: 'de-DE',
  base: '/v-map/',

  markdown: {
    // Stay false - the typedoc-generated TS reference pages contain
    // generic-type signatures like `<T>` that the Vue template compiler
    // would otherwise try to parse as HTML and choke on.
    html: false,

    // Tiny inline plugin: turn `@[component:Name]` markers in markdown into
    // raw `<Name />` HTML by emitting an `html_inline` token directly.
    // markdown-it's `html: false` option only disables the *parsing* of
    // raw HTML from input, but `html_inline` tokens emitted by plugins are
    // still rendered as-is. This lets us reference globally registered Vue
    // SFCs (like <LiveMap />) from inside any .md file without enabling
    // raw HTML across the board. The token name is restricted to PascalCase
    // identifiers so the syntax can't accidentally collide with prose.
    config: md => {
      md.inline.ruler.before('emphasis', 'vue_component', (state, silent) => {
        const start = state.pos;
        const marker = '@[component:';
        if (state.src.slice(start, start + marker.length) !== marker) {
          return false;
        }
        const end = state.src.indexOf(']', start + marker.length);
        if (end === -1) return false;
        const name = state.src.slice(start + marker.length, end).trim();
        if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) return false;
        if (!silent) {
          const token = state.push('html_inline', '', 0);
          token.content = `<${name} />`;
        }
        state.pos = end + 1;
        return true;
      });
    },
  },

  themeConfig: {
    nav: [
      { text: 'Start', link: '/' },
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Übersicht', link: '/guides/' },
          { text: 'CDN ohne Bundler', link: '/guides/cdn-esm' },
          { text: 'Error Handling', link: '/guides/error-handling' },
          { text: 'Styling', link: '/guides/styling' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Komponenten', link: '/api/components/' },
          { text: 'TypeScript', link: '/api/ts/' },
        ],
      },
      { text: 'Layer-Matrix', link: '/layers/matrix' }, // optional im Top-Navi
    ],

    sidebar: {
      '/guides/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/getting-started' },
            { text: 'Übersicht', link: '/guides/' },
            { text: 'CDN ohne Bundler', link: '/guides/cdn-esm' },
            { text: 'Error Handling', link: '/guides/error-handling' },
            { text: 'Styling', link: '/guides/styling' },
          ],
        },
      ],
      '/getting-started': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/getting-started' },
            { text: 'Übersicht', link: '/guides/' },
            { text: 'CDN ohne Bundler', link: '/guides/cdn-esm' },
            { text: 'Error Handling', link: '/guides/error-handling' },
            { text: 'Styling', link: '/guides/styling' },
          ],
        },
      ],
      '/layers/': [
        {
          text: 'Layer-Matrix',
          items: [{ text: 'Übersicht', link: '/layers/matrix' }],
        },
      ],
      '/api/components/': [
        {
          text: 'Komponenten',
          items: [{ text: 'Übersicht', link: '/api/components/' }],
        },
      ],
      '/api/ts/': [
        {
          text: 'TypeScript',
          items: [{ text: 'Übersicht', link: '/api/ts/' }],
        },
      ],
    },
  },

  vite: {
    vue: {
      template: {
        compilerOptions: {
          // Match the bare <v-map> tag and every <v-map-*> child element so
          // Vue's template compiler treats them as native custom elements
          // instead of trying to resolve them as Vue components.
          isCustomElement: tag => tag === 'v-map' || tag.startsWith('v-map-'),
        },
      },
    },
  },
};
