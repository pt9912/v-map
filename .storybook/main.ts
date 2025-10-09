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
    // Configure Vite to handle external dependencies
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Add aliases to resolve external modules from node_modules
    config.resolve.alias['@loaders.gl/core'] =
      require.resolve('@loaders.gl/core');
    config.resolve.alias['@loaders.gl/gltf'] =
      require.resolve('@loaders.gl/gltf');

    // Optimize dependencies
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = config.optimizeDeps.include || [];
    config.optimizeDeps.include.push(
      // Deck.gl & Luma.gl
      '@deck.gl/core',
      '@deck.gl/layers',
      '@deck.gl/geo-layers',
      '@luma.gl/core',
      // Loaders.gl
      '@loaders.gl/core',
      '@loaders.gl/gltf',
      '@loaders.gl/images',
      '@loaders.gl/schema',
      '@loaders.gl/terrain',
      // Geo-related
      'georaster',
      'georaster-layer-for-leaflet',
      'tiff-imagery-provider',
      'geotiff',
      'snap-bbox',
      'uuid',
    );

    return config;
  },
};

export default config;
