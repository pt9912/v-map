// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: '@stencil/core/testing',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/testing/setupTests.jest.ts'],
  moduleNameMapper: {
    '^leaflet\\.gridlayer\\.googlemutant$':
      '<rootDir>/src/testing/mocks/leaflet.gridlayer.googlemutant.ts',
  },
  transformIgnorePatterns: ['/node_modules/(?!(ol)/)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.js'],

  // Add this to filter Puppeteer console logs
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testEnvironmentOptions: {
    // Stencil uses Puppeteer under the hood for E2E tests
    puppeteerConfig: {},
  },
};

export default config;
