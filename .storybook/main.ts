const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  //staticDirs: ['../dist/esm-es5'],
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
    // Configure Vite to handle external dependencies
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Add aliases to resolve external modules from node_modules
    config.resolve.alias['@loaders.gl/core'] = require.resolve('@loaders.gl/core');
    config.resolve.alias['@loaders.gl/gltf'] = require.resolve('@loaders.gl/gltf');

    // Optimize dependencies
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = config.optimizeDeps.include || [];
    config.optimizeDeps.include.push(
      '@loaders.gl/core',
      '@loaders.gl/gltf',
      '@deck.gl/core',
      '@deck.gl/layers',
      '@deck.gl/geo-layers',
    );

    // Exclude problematic dependencies from optimization
    config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
    config.optimizeDeps.exclude.push(
      'georaster',
      'georaster-layer-for-leaflet',
      'tiff-imagery-provider',
    );

    return config;
  },
};

export default config;
