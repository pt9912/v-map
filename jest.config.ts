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
    puppeteerConfig: {
      // Silence specific warnings
      onConsole: (message: { type: () => string; text: () => string }) => {
        const excludedMessages = [
          'No map visible because the map container', // OpenLayers warning
          'v-map-layer-geojson ist nicht in einer v-map-layer-group enthalten', // Your custom warning
        ];

        // Only log messages that aren't in the excluded list
        if (!excludedMessages.some(text => message.text().includes(text))) {
          console.log(`[BROWSER ${message.type()}]: ${message.text()}`);
        }
      },
    },
  },
};

export default config;
