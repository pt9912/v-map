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
      { text: 'Guide', link: '/getting-started' },
      {
        text: 'API',
        items: [
          { text: 'Komponenten', link: '/api/components/index' },
          { text: 'TypeScript', link: '/api/ts/index' },
        ],
      },
    ],
    sidebar: {
      '/api/components/': [
        {
          text: 'Komponenten',
          items: [{ text: 'Übersicht', link: '/api/components/index' }],
        },
      ],
      '/api/ts/': [
        {
          text: 'TypeScript',
          items: [{ text: 'Übersicht', link: '/api/ts/index' }],
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
