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
  buildEs5: false, // Deaktiviert ES5-Builds komplett (nur ES2022)
  testing: {
    browserHeadless: 'shell',
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--single-process',
    ],
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

              // Node.js-spezifische Module (NEU)
              'path',
              'fs',
              'util',
              'child_process',
              'crypto',
              'stream',
              'http',
              'https',
              'url',
              'zlib',
              'os',
              'net',
              'tls',
              'dns',
              'assert',
              'events',
              'buffer',
              'querystring',
              'punycode',
              'string_decoder',
              'path-browserify', // Falls irgendwo als Fallback verwendet
            ],
          };
        },
      },
    ],
  },
  nodeResolve: {
    browser: true, // Erzwingt Browser-kompatible Module
    preferBuiltins: false, // Verhindert, dass Node.js-Built-ins eingebunden werden
  },
};
