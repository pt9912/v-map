import {
  useMapStylePage,
  simpleSLD,
  polygonSLD,
  pointWKT,
  polygonWKT,
} from './v-map-style.e2e-utils';

describe('<v-map-style> E2E (WKT layers)', () => {
  it('applies SLD style to WKT point layer', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map zoom="10" center-lat="47.4" center-lon="8.5">
          <v-map-style
            format="sld"
            content='${simpleSLD}'
            layer-targets="wkt-points">
          </v-map-style>

          <v-map-layergroup>
            <v-map-layer-wkt
              id="wkt-points"
              wkt="${pointWKT}">
            </v-map-layer-wkt>
          </v-map-layergroup>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      const wktLayer = await page.find('v-map-layer-wkt');

      expect(styleComponent).toBeTruthy();
      expect(wktLayer).toBeTruthy();
      expect(await wktLayer.getProperty('wkt')).toBe(pointWKT);
      expect(await styleComponent.getProperty('format')).toBe('sld');
      expect(await styleComponent.getProperty('layerTargets')).toBe(
        'wkt-points',
      );
      expect(await styleComponent.getProperty('autoApply')).toBe(true);
    });
  });

  it('applies polygon SLD styling to WKT polygons', async () => {
    await useMapStylePage(async ({ page, render }) => {
      await render(`
        <v-map zoom="10" center-lat="47.45" center-lon="8.55">
          <v-map-style
            format="sld"
            content='${polygonSLD}'
            layer-targets="wkt-polygons">
          </v-map-style>

          <v-map-layergroup>
            <v-map-layer-wkt
              id="wkt-polygons"
              wkt="${polygonWKT}">
            </v-map-layer-wkt>
          </v-map-layergroup>
        </v-map>
      `);

      const styleComponent = await page.find('v-map-style');
      const wktLayer = await page.find('v-map-layer-wkt');

      expect(styleComponent).toBeTruthy();
      expect(wktLayer).toBeTruthy();
      expect(await wktLayer.getProperty('wkt')).toBe(polygonWKT);
      expect(await styleComponent.getProperty('layerTargets')).toBe(
        'wkt-polygons',
      );
      expect(await styleComponent.getProperty('autoApply')).toBe(true);
    });
  });
});
