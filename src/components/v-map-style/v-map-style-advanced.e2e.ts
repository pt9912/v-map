import {
  useMapStylePage,
  simpleSLD,
  polygonSLD,
  pointWKT,
  polygonGeoJSON,
  pointGeoJSON,
} from './v-map-style.e2e-utils';
import { newE2EPage } from '../../testing/e2e-testing';

// Parse errors are expected in the error-state integration test
newE2EPage.setIgnoreError('Style parsing failed');

describe('<v-map-style> E2E (advanced scenarios) — integration', () => {
  it('emits styleError event and shows error state in shadow DOM on parse failure', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await page.evaluate(() => {
        (window as any).__styleErrorMessage = null;
        document.addEventListener(
          'styleError',
          (e: Event) => {
            const ce = e as CustomEvent;
            (window as any).__styleErrorMessage =
              ce.detail?.message ?? 'error';
          },
          { once: true },
        );
      });

      await render(`
        <v-map zoom="10" center-lat="47.4" center-lon="8.5">
          <v-map-style
            format="mapbox-gl"
            content="this is not valid json"
            layer-targets="test-layer">
          </v-map-style>

          <v-map-layergroup>
            <v-map-layer-wkt id="test-layer" wkt="${pointWKT}">
            </v-map-layer-wkt>
          </v-map-layergroup>
        </v-map>
      `);

      const errorMessage = await page.evaluate(
        () => (window as any).__styleErrorMessage,
      );
      expect(errorMessage).toBeTruthy();

      const errorDiv = await page.find('v-map-style >>> .error');
      expect(errorDiv).toBeTruthy();
    });
  });

  it('getStyle() returns undefined before style is loaded', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map zoom="10" center-lat="47.4" center-lon="8.5">
          <v-map-style
            format="sld"
            auto-apply="false">
          </v-map-style>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      const style = await styleComponent.callMethod('getStyle');

      expect(style).toBeUndefined();
    });
  });
});

describe('<v-map-style> E2E (advanced scenarios)', () => {
  it('handles multiple styles for different layer types', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map zoom="8" center-lat="47.4" center-lon="8.5">
          <v-map-style
            format="sld"
            content='${simpleSLD}'
            layer-targets="wkt-layer">
          </v-map-style>

          <v-map-style
            format="sld"
            content='${polygonSLD}'
            layer-targets="geojson-layer">
          </v-map-style>

          <v-map-layergroup>
            <v-map-layer-wkt
              id="wkt-layer"
              wkt="${pointWKT}">
            </v-map-layer-wkt>

            <v-map-layer-geojson
              id="geojson-layer"
              geojson='${JSON.stringify(polygonGeoJSON)}'>
            </v-map-layer-geojson>
          </v-map-layergroup>
        </v-map>
      `);

      const styleComponents = await page.findAll('v-map-style');
      expect(styleComponents).toHaveLength(2);

      const wktLayer = await page.find('v-map-layer-wkt');
      const geojsonLayer = await page.find('v-map-layer-geojson');

      expect(wktLayer).toBeTruthy();
      expect(geojsonLayer).toBeTruthy();

      for (const styleComponent of styleComponents) {
        expect(await styleComponent.getProperty('autoApply')).toBe(true);
      }
    });
  });

  it('handles error scenarios gracefully', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map zoom="10" center-lat="47.4" center-lon="8.5">
          <v-map-style
            format="sld"
            content="<invalid>xml content</invalid>"
            layer-targets="test-layer">
          </v-map-style>

          <v-map-layergroup>
            <v-map-layer-wkt
              id="test-layer"
              wkt="${pointWKT}">
            </v-map-layer-wkt>
          </v-map-layergroup>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      expect(styleComponent).toBeTruthy();
      expect(await styleComponent.getProperty('format')).toBe('sld');
    });
  });

  it('handles missing layer targets', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map zoom="10" center-lat="47.4" center-lon="8.5">
          <v-map-style
            format="sld"
            content='${simpleSLD}'
            layer-targets="non-existent-layer">
          </v-map-style>

          <v-map-layergroup>
            <v-map-layer-wkt
              id="actual-layer"
              wkt="${pointWKT}">
            </v-map-layer-wkt>
          </v-map-layergroup>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      expect(styleComponent).toBeTruthy();
      expect(await styleComponent.getProperty('layerTargets')).toBe(
        'non-existent-layer',
      );
    });
  });

  it('handles Mapbox GL style format', async () => {
    const mapboxStyle = JSON.stringify({
      version: 8,
      name: 'Test Mapbox Style',
      sources: {
        'test-source': {
          type: 'geojson',
          data: pointGeoJSON,
        },
      },
      layers: [
        {
          id: 'test-layer',
          type: 'circle',
          source: 'test-source',
          paint: {
            'circle-radius': 8,
            'circle-color': '#ff0000',
          },
        },
      ],
    });

    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map zoom="10" center-lat="47.4" center-lon="8.5">
          <v-map-style
            format="mapbox-gl"
            content='${mapboxStyle}'
            layer-targets="test-layer"
            auto-apply="true">
          </v-map-style>

          <v-map-layergroup>
            <v-map-layer-geojson
              id="test-layer"
              geojson='${JSON.stringify(pointGeoJSON)}'>
            </v-map-layer-geojson>
          </v-map-layergroup>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      expect(styleComponent).toBeTruthy();
      expect(await styleComponent.getProperty('format')).toBe('mapbox-gl');
      expect(await styleComponent.getProperty('layerTargets')).toBe('test-layer');
      expect(await styleComponent.getProperty('autoApply')).toBe(true);
    });
  });

  it('parses layer targets correctly', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map>
          <v-map-style
            format="sld"
            content='${simpleSLD}'
            layer-targets="layer1,layer2,layer3"
            auto-apply="false">
          </v-map-style>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      expect(await styleComponent.getProperty('layerTargets')).toBe(
        'layer1,layer2,layer3',
      );
    });
  });

  it('reports loading state metadata', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map>
          <v-map-style
            format="sld"
            content='${simpleSLD}'
            auto-apply="false">
          </v-map-style>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      expect(await styleComponent.getProperty('format')).toBe('sld');
      expect(await styleComponent.getProperty('autoApply')).toBe(false);
    });
  });
});
