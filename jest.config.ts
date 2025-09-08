// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: '@stencil/core/testing',

  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^leaflet\\.gridlayer\\.googlemutant$':
      '<rootDir>/src/testing/mocks/leaflet.gridlayer.googlemutant.ts',
  },

  // WICHTIG: ESM-Pakete aus node_modules transformieren (hier: 'ol')
  transformIgnorePatterns: ['/node_modules/(?!(ol)/)'],

  // Optional – hilft Jest bei ESM-Resolution
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.js'],
};

export default config;
