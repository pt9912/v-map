// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: '@stencil/core/testing',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/testing/setupTests.jest.ts'], // <-- hinzufügen
  moduleNameMapper: {
    '^leaflet\\.gridlayer\\.googlemutant$':
      '<rootDir>/src/testing/mocks/leaflet.gridlayer.googlemutant.ts',
  },
  transformIgnorePatterns: ['/node_modules/(?!(ol)/)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.js'],
};

export default config;
