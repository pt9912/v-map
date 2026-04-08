import dumpMd from '../../scripts/vite-dump-plugin.mjs';

export default {
  title: 'v-map',
  description: 'Kartenkomponenten & API',
  lang: 'de-DE',
  base: '/v-map/',

  markdown: {
    html: false, // rohes HTML in .md ausschalten
  },

  themeConfig: {
    nav: [
      { text: 'Start', link: '/' },
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Übersicht', link: '/guides/' },
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
          isCustomElement: tag => tag.startsWith('v-map-'),
        },
      },
    },
  },
};
