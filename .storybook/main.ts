import path from 'node:path';

const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    //'@storybook/addon-controls',
  ],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: '@stencil/storybook-plugin',
  },
  async viteFinal(config) {
    config.server = {
      proxy: {
        '/gcp-public-data-landsat': {
          target: 'https://storage.googleapis.com',
          secure: true,
          changeOrigin: true,
        },
        '/sentinel-s2-l2a-cogs': {
          target: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/',
          secure: true,
          changeOrigin: true,
        },

        '/echo': {
          target: 'https://echo.free.beeceptor.com/',
          secure: true,
          changeOrigin: true,
        },
      },
    };
    config.cacheDir = '.storybook/.vite-cache';

    const fastXmlParserEsm = path.resolve(
      process.cwd(),
      'node_modules/fast-xml-parser/src/fxp.js',
    );

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'fast-xml-parser/src/fxp.js': fastXmlParserEsm,
      'fast-xml-parser': fastXmlParserEsm,
      'geotiff': path.resolve(
        process.cwd(),
        'node_modules/.pnpm/geotiff@3.0.5/node_modules/geotiff/dist-browser/geotiff.js',
      ),
      'jszip': path.resolve(
        process.cwd(),
        'node_modules/.pnpm/jszip@3.10.1/node_modules/jszip/dist/jszip.js',
      ),
      'pako': path.resolve(
        process.cwd(),
        'node_modules/.pnpm/pako@1.0.11/node_modules/pako/dist/pako.js',
      ),
    };

    // Configure conditions to prefer browser builds
    config.resolve.conditions = ['browser', 'import', 'module', 'default'];

    config.optimizeDeps = config.optimizeDeps ?? {};

    // Tell Vite to scan these files for dynamic imports BEFORE starting
    config.optimizeDeps.entries = [
      '../src/**/*.tsx',
      '../src/**/*.ts',
      '../src/**/*.stories.tsx',
      '../.storybook/**/*.ts',
      '../.storybook/**/*.tsx',
    ];

    // Wait until all entry points are scanned before starting server
    config.optimizeDeps.holdUntilCrawlEnd = true;

    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      '@stencil/core',
      '@stencil/core/internal/client',
      'geotiff',
      'proj4',
      'ol',
      'geotiff-geokeys-to-proj4',
      'jszip',
      'pako',
      'snappyjs',
      'pbf',
      'lie',
      'setimmediate',
      'readable-stream',
      '@loaders.gl/core',
      '@loaders.gl/loader-utils',
      '@loaders.gl/compression',
      '@loaders.gl/zip',
      '@loaders.gl/3d-tiles',
      '@loaders.gl/mvt',
      '@loaders.gl/gis',
      // Storybook dependencies
      '@mdx-js/react',
      // OpenLayers sub-paths
      // 'ol/Map',
      // 'ol/View',
      // 'ol/proj',
      // 'ol/layer/Group',
      // 'ol/layer/Tile',
      // 'ol/layer/Vector',
      // 'ol/layer/WebGLTile',
      // 'ol/layer/Image',
      // 'ol/source/OSM',
      // 'ol/source/TileWMS',
      // 'ol/source/Vector',
      // 'ol/source/XYZ',
      // 'ol/source/Google',
      // 'ol/source/TileArcGISRest',
      // 'ol/source/GeoTIFF',
      // 'ol/source/ImageWMS',
      // 'ol/format/GeoJSON',
      // 'ol/format/GML2',
      // 'ol/format/GML3',
      // 'ol/format/GML32',
      // 'ol/format/WKT',
      // 'ol/style/Style',
      // 'ol/style/Fill',
      // 'ol/style/Stroke',
      // 'ol/style/Circle',
      // 'ol/style/Icon',
      // 'ol/style/Text',
      // 'ol/control/Control',
      // 'ol/loadingstrategy',
    ];
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude ?? []),
      '@loaders.gl/wms',
      '@loaders.gl/tiles',
      '@loaders.gl/gltf',
      '@loaders.gl/schema',
      '@loaders.gl/terrain',
      '@loaders.gl/images',
      '@loaders.gl/geojson',
      '@deck.gl/core',
      '@deck.gl/layers',
      '@deck.gl/geo-layers',
    ];

    // Rolldown (Vite 8) treats MISSING_EXPORT as error by default.
    // Shim missing exports for Stencil class re-exports and OL internals.
    config.build = config.build ?? {};
    config.build.chunkSizeWarningLimit = 1600;
    config.build.rolldownOptions = config.build.rolldownOptions ?? {};
    config.build.rolldownOptions.moduleTypes = {
      '.tsx': 'tsx',
      '.ts': 'ts',
    };
    config.build.rolldownOptions.shimMissingExports = true;

    return config;
  },
};

export default config;
