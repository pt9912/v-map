// stencil.config.ts
import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'v-map',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: true,
    },
    {
      type: 'www',
      serviceWorker: null,
    },
    {
      type: 'docs-readme', // generiert README pro Komponente (src/components/**/readme.md)
      strict: true,
    },
    {
      type: 'docs-json',
      file: 'docs/api/stencil-docs.json', // Machine-readable API
      strict: true,
    },
  ],
  buildEs5: 'prod',
  testing: {
    browserHeadless: 'shell',
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  },
  rollupPlugins: {
    after: [
      {
        name: 'externalize-map-libs',
        options(input) {
          return {
            ...input,
            external: [
              'leaflet',
              /^leaflet\//,
              'ol',
              /^ol\//,
              'leaflet.gridlayer.googlemutant',

              'child_process', // Node.js-spezifische APIs
            ],
          };
        },
      },
    ],
  },
};
