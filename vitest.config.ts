import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // oder 'happy-dom'
    globals: true,
    // Vitest soll diese Dateien als Testdateien ausführen.
    include: ['src/**/*.spec.ts'],
    exclude: [
      'src/components/**',
      'src/**/*.e2e.ts',
      'src/**/*.stories.ts',
      'src/**/*.stories.tsx',
      'src/testing/**',
    ],
    setupFiles: ['src/testing/setupTests.vitest.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        // Testdateien werden ausgeführt, zählen aber nicht als zu messender Source-Code.
        'src/index.ts',
        'src/components/**',
        'src/layer/**',
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
        'src/map-provider/provider-factory.ts',
        'src/map-provider/deck/LayerModel.ts',
        'src/map-provider/deck/RenderableGroup.ts',
        'src/map-provider/geotiff/geotiff-source.ts',
        'src/map-provider/geotiff/utils/Triangle.ts',
        'src/map-provider/leaflet/WMTSGridLayer.ts',
        'src/map-provider/leaflet/GeoTIFFGridLayer.ts',
        'src/map-provider/leaflet/google-map-tiles-layer.ts',
        'src/map-provider/ol/CustomGeoTiff.ts',
        'src/map-provider/ol/openlayers-helper.ts',
        'src/map-provider/ol/openlayers-provider.ts',
        'src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts',
        'src/map-provider/cesium/GeoTIFFImageryProvider.ts',
        'src/map-provider/cesium/i-layer.ts',
        'src/map-provider/cesium/layer-manager.ts',
      ],
      reporter: ['text', 'lcov'],
      thresholds: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    },
  },
});
