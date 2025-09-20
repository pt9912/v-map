const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../dist/esm-es5'],
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
  // // Wichtig: Webpack-Konfiguration für .md-Dateien
  // webpackFinal: async config => {
  //   config.module.rules.push({
  //     test: /\.md$/,
  //     use: 'raw-loader',
  //   });
  //   return config;
  // },
};

export default config;
