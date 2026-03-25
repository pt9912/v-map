import {
  useMapStylePage,
  simpleSLD,
  simpleSLDStyleName,
  polygonSLD,
  pointGeoJSON,
  polygonGeoJSON,
} from './v-map-style.e2e-utils';

describe('<v-map-style> E2E (GeoJSON layers) — integration', () => {
  it('emits styleReady event with style payload and GeoJSON layer target', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await page.evaluate(() => {
        (window as any).__styleReadyDetail = null;
        document.addEventListener(
          'styleReady',
          (e: Event) => {
            const ce = e as CustomEvent;
            try {
              (window as any).__styleReadyDetail = JSON.parse(
                JSON.stringify(ce.detail),
              );
            } catch {
              /* ignore serialization errors */
            }
          },
          { once: true },
        );
      });

      await render(`
        <v-map zoom="10" center-lat="47.4" center-lon="8.5">
          <v-map-style
            format="sld"
            content='${simpleSLD}'
            layer-targets="geojson-points">
          </v-map-style>

          <v-map-layergroup>
            <v-map-layer-geojson
              id="geojson-points"
              geojson='${JSON.stringify(pointGeoJSON)}'>
            </v-map-layer-geojson>
          </v-map-layergroup>
        </v-map>
      `);

      const detail = await page.evaluate(
        () => (window as any).__styleReadyDetail,
      );
      expect(detail).toBeTruthy();
      expect(detail.style).toBeTruthy();
      expect(detail.style.name).toBe(simpleSLDStyleName);
      expect(detail.layerIds).toContain('geojson-points');
    });
  });

  it('getLayerTargetIds() returns correct array of targets', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map zoom="10" center-lat="47.4" center-lon="8.5">
          <v-map-style
            format="sld"
            content='${simpleSLD}'
            layer-targets="geojson-points,geojson-polygons">
          </v-map-style>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      const layerTargetIds =
        await styleComponent.callMethod('getLayerTargetIds');

      expect(layerTargetIds).toEqual(['geojson-points', 'geojson-polygons']);
    });
  });
});

describe('<v-map-style> E2E (GeoJSON layers)', () => {
  it('applies SLD style to GeoJSON point layer', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map zoom="10" center-lat="47.4" center-lon="8.5">
          <v-map-style
            format="sld"
            content='${simpleSLD}'
            layer-targets="geojson-points">
          </v-map-style>

          <v-map-layergroup>
            <v-map-layer-geojson
              id="geojson-points"
              geojson='${JSON.stringify(pointGeoJSON)}'>
            </v-map-layer-geojson>
          </v-map-layergroup>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      const geojsonLayer = await page.find('v-map-layer-geojson');

      expect(styleComponent).toBeTruthy();
      expect(geojsonLayer).toBeTruthy();
      expect(await geojsonLayer.getProperty('geojson')).toBeTruthy();
      expect(await styleComponent.getProperty('autoApply')).toBe(true);
    });
  });

  it('applies polygon SLD styling to GeoJSON polygons', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map zoom="9" center-lat="47.45" center-lon="8.55">
          <v-map-style
            format="sld"
            content='${polygonSLD}'
            layer-targets="geojson-polygons">
          </v-map-style>

          <v-map-layergroup>
            <v-map-layer-geojson
              id="geojson-polygons"
              geojson='${JSON.stringify(polygonGeoJSON)}'>
            </v-map-layer-geojson>
          </v-map-layergroup>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      const geojsonLayer = await page.find('v-map-layer-geojson');

      expect(styleComponent).toBeTruthy();
      expect(geojsonLayer).toBeTruthy();
      expect(await geojsonLayer.getProperty('id')).toBe('geojson-polygons');
      expect(await styleComponent.getProperty('layerTargets')).toBe(
        'geojson-polygons',
      );
      expect(await styleComponent.getProperty('autoApply')).toBe(true);
    });
  });
});
