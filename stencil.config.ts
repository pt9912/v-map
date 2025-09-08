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
            ],
          };
        },
      },
    ],
  },
};
