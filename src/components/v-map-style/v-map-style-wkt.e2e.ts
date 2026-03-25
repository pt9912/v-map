import {
  useMapStylePage,
  simpleSLD,
  simpleSLDStyleName,
  polygonSLD,
  pointWKT,
  polygonWKT,
} from './v-map-style.e2e-utils';

describe('<v-map-style> E2E (WKT layers) — integration', () => {
  it('emits styleReady event with style payload and WKT layer target', async () => {
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

      const detail = await page.evaluate(
        () => (window as any).__styleReadyDetail,
      );
      expect(detail).toBeTruthy();
      expect(detail.style).toBeTruthy();
      expect(detail.style.name).toBe(simpleSLDStyleName);
      expect(detail.layerIds).toContain('wkt-points');
    });
  });

  it('getStyle() returns the parsed style after loading', async () => {
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
      const style = await styleComponent.callMethod('getStyle');

      expect(style).toBeTruthy();
      expect(style.name).toBe(simpleSLDStyleName);
    });
  });

  it('shows success state in shadow DOM after style is parsed', async () => {
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

      const successDiv = await page.find('v-map-style >>> .success');
      expect(successDiv).toBeTruthy();
    });
  });
});

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
