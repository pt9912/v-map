// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: '@stencil/core/testing',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/testing/setupTests.jest.ts'],
  moduleNameMapper: {
    '^leaflet/dist/leaflet-src\\.esm\\.js$': 'leaflet',
    '^geostyler-sld-parser$':
      '<rootDir>/src/testing/mocks/geostyler-sld-parser.ts',
    '^geostyler-mapbox-parser$':
      '<rootDir>/src/testing/mocks/geostyler-mapbox-parser.ts',
    '^geostyler-qgis-parser$':
      '<rootDir>/src/testing/mocks/geostyler-qgis-parser.ts',
    '^geostyler-lyrx-parser$':
      '<rootDir>/src/testing/mocks/geostyler-lyrx-parser.ts',
    '^geostyler-style$': '<rootDir>/src/testing/mocks/geostyler-style.ts',
    '^@mapbox/tiny-sdf$': '<rootDir>/src/testing/mocks/mapbox-tiny-sdf.ts',
    '^@npm9912/s-gml$': '<rootDir>/src/testing/mocks/s-gml.ts',
  },
  transformIgnorePatterns: [
    // Transpile ol, leaflet, @loaders.gl, @mapbox, @deck.gl packages (works with pnpm structure)
    'node_modules/(?!(.pnpm|ol|leaflet|@loaders\\.gl|@mapbox|@deck\\.gl))',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.js'],

  // Add this to filter Puppeteer console logs
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: true, // Critical for ESM modules like geostyler
    },
  },
  testEnvironmentOptions: {
    // Stencil uses Puppeteer under the hood for E2E tests
    puppeteerConfig: {
      // Debug Puppeteer if needed
      headless: process.env.CI ? true : false,
      slowMo: 50,
    },
  },
};

export default config;
