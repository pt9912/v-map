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

    // Tiny block-level plugin: turn `@[component:Name]` and `@[demo:name]`
    // markers (each on their own line) in markdown into raw `<Name />` /
    // `<DemoFrame name="name" />` HTML, emitted as `html_block` tokens.
    //
    // We deliberately use the BLOCK ruler instead of the INLINE ruler.
    // markdown-it wraps every inline token in a `<p>` paragraph, so an
    // inline rule that emits `<DemoFrame />` would produce `<p><DemoFrame
    // /></p>`. Vue then expands DemoFrame into a `<div>...<p
    // class="demo-frame__caption">...</p></div>`, which gives the browser
    // a forbidden nested `<p>` and triggers auto-correction + Vue
    // hydration mismatches that visibly duplicate parts of the rendered
    // tree (the caption was showing twice).
    //
    // A block-level rule emits a self-standing `html_block` token that
    // sits between paragraphs without any wrapping `<p>`, which is what
    // we actually want for component embeds.
    //
    // markdown-it's `html: false` option only disables the *parsing* of
    // raw HTML from input, but `html_block` tokens emitted by plugins are
    // still rendered as-is, so we can keep the typedoc generic-type
    // signatures (`<T>` etc.) safely escaped while letting our explicit
    // markers through.
    //
    // Component names are PascalCase, demo names are kebab-case, and the
    // marker must be the only content on its line.
    config: md => {
      md.block.ruler.before(
        'paragraph',
        'vue_component_block',
        (state, startLine, _endLine, silent) => {
          const start = state.bMarks[startLine] + state.tShift[startLine];
          const max = state.eMarks[startLine];
          const line = state.src.slice(start, max).trim();

          const componentMatch = /^@\[component:([A-Z][A-Za-z0-9]*)\]$/.exec(
            line,
          );
          const demoMatch = /^@\[demo:([a-z0-9][a-z0-9-]*)\]$/.exec(line);
          const exampleMatch = /^@\[example:([a-z0-9][a-z0-9-]*)\]$/.exec(
            line,
          );

          if (!componentMatch && !demoMatch && !exampleMatch) return false;
          if (silent) return true;

          const token = state.push('html_block', '', 0);
          token.map = [startLine, startLine + 1];
          if (componentMatch) {
            token.content = `<${componentMatch[1]} />\n`;
          } else if (demoMatch) {
            token.content = `<DemoFrame name="${demoMatch[1]}" />\n`;
          } else if (exampleMatch) {
            // Examples live as full SPAs under /demos/<name>/ (note the
            // trailing slash). DemoFrame strips/normalises that internally.
            token.content = `<DemoFrame name="${exampleMatch[1]}" kind="example" />\n`;
          }

          state.line = startLine + 1;
          return true;
        },
      );
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
        text: 'Frameworks',
        items: [
          { text: 'SvelteKit', link: '/guides/frameworks/sveltekit' },
          { text: 'React', link: '/guides/frameworks/react' },
          { text: 'Vue 3', link: '/guides/frameworks/vue' },
          { text: 'Angular', link: '/guides/frameworks/angular' },
          { text: 'Next.js', link: '/guides/frameworks/nextjs' },
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
      '/guides/frameworks/': [
        {
          text: 'Frameworks',
          items: [
            { text: 'SvelteKit', link: '/guides/frameworks/sveltekit' },
            { text: 'React', link: '/guides/frameworks/react' },
            { text: 'Vue 3', link: '/guides/frameworks/vue' },
            { text: 'Angular', link: '/guides/frameworks/angular' },
            { text: 'Next.js', link: '/guides/frameworks/nextjs' },
          ],
        },
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
        {
          text: 'Frameworks',
          items: [
            { text: 'SvelteKit', link: '/guides/frameworks/sveltekit' },
            { text: 'React', link: '/guides/frameworks/react' },
            { text: 'Vue 3', link: '/guides/frameworks/vue' },
            { text: 'Angular', link: '/guides/frameworks/angular' },
            { text: 'Next.js', link: '/guides/frameworks/nextjs' },
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
