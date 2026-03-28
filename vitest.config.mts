import { defineVitestConfig } from '@stencil/vitest/config';

export default defineVitestConfig({
  stencilConfig: './stencil.config.ts',
  resolve: {
    alias: [
      { find: 'leaflet/dist/leaflet-src.esm.js', replacement: 'leaflet' },
    ],
  },
  test: {
    globals: true,
    testTimeout: 15_000,
    teardownTimeout: 30_000,
    onConsoleLog(log) {
      // Suppress verbose Stencil component lifecycle logs from compiled dist bundle
      // to prevent EnvironmentTeardownError from pending console.log RPC calls
      if (/component(Will|Did)(Load|Render)|connectedCallback|disconnectedCallback|map provider|Running in development mode|Map already in creating|Map provider not yet ready|is not inside a v-map/.test(log)) return false;
      return undefined;
    },
    environment: 'jsdom',
    environmentMatchGlobs: [
      ['src/components/**/*.spec.tsx', 'stencil'],
    ],
    include: ['src/**/*.spec.{ts,tsx}'],
    exclude: [
      'src/**/*.e2e.ts',
      'src/**/*.stories.ts',
      'src/**/*.stories.tsx',
      'src/testing/**',
      'src/components/v-map-layer-google/google-maps-integration.spec.ts',
    ],
    setupFiles: [
      'src/testing/setupTests.vitest.ts',
      'src/testing/setupTests.stencil.ts',
    ],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/index.ts',
        'src/lib/**',
        'src/types/**',
        'src/**/*.d.ts',
        'src/**/*.spec.ts',
        'src/**/*.spec.tsx',
        'src/**/*.e2e.ts',
        'src/**/*.e2e-utils.ts',
        'src/**/*.stories.ts',
        'src/**/*.stories.tsx',
        'src/testing/**',
        'src/components.d.ts',
        'src/map-provider/cesium/i-layer.ts',
        'src/map-provider/deck/LayerModel.ts',
        'src/map-provider/deck/RenderableGroup.ts',
        'src/map-provider/geotiff/utils/Triangle.ts',
      ],
      reporter: ['text', 'lcov'],
      thresholds: {
        branches: 80,
        functions: 85,
        lines: 85,
        statements: 85,
      },
    },
  },
});
