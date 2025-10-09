import { defaultFlavour, useGoogleMapPage } from './v-map-layer-google.e2e-utils';

jest.setTimeout(90_000);

describe('<v-map-layer-google> E2E (properties)', () => {
  const mockApiKey = 'test-e2e-api-key-12345';

  it('handles opacity changes', async () => {
    await useGoogleMapPage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px" flavour="${defaultFlavour}">
          <v-map-layergroup>
            <v-map-layer-google
              id="test-layer"
              api-key="${mockApiKey}"
              map-type="roadmap"
              opacity="0.5">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('#test-layer');
      expect(await googleLayer.getProperty('opacity')).toBe(0.5);

      await googleLayer.setProperty('opacity', 0.8);
      await page.waitForChanges();
      expect(await googleLayer.getProperty('opacity')).toBe(0.8);
    });
  });

  it('handles visibility toggle', async () => {
    await useGoogleMapPage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px" flavour="${defaultFlavour}">
          <v-map-layergroup>
            <v-map-layer-google
              id="test-layer"
              api-key="${mockApiKey}"
              map-type="roadmap"
              visible="true">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('#test-layer');
      expect(await googleLayer.getProperty('visible')).toBe(true);

      await googleLayer.setProperty('visible', false);
      await page.waitForChanges();
      expect(await googleLayer.getProperty('visible')).toBe(false);

      await googleLayer.setProperty('visible', true);
      await page.waitForChanges();
      expect(await googleLayer.getProperty('visible')).toBe(true);
    });
  });

  it('supports map type switching', async () => {
    await useGoogleMapPage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px" flavour="${defaultFlavour}">
          <v-map-layergroup>
            <v-map-layer-google
              id="test-layer"
              api-key="${mockApiKey}"
              map-type="roadmap">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('#test-layer');
      expect(await googleLayer.getProperty('mapType')).toBe('roadmap');

      await googleLayer.setProperty('mapType', 'satellite');
      await page.waitForChanges();
      expect(await googleLayer.getProperty('mapType')).toBe('satellite');

      await googleLayer.setProperty('mapType', 'terrain');
      await page.waitForChanges();
      expect(await googleLayer.getProperty('mapType')).toBe('terrain');

      await googleLayer.setProperty('mapType', 'hybrid');
      await page.waitForChanges();
      expect(await googleLayer.getProperty('mapType')).toBe('hybrid');
    });
  });

  it('handles language and region settings', async () => {
    await useGoogleMapPage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px" flavour="${defaultFlavour}">
          <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              language="de"
              region="DE">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      expect(await googleLayer.getProperty('language')).toBe('de');
      expect(await googleLayer.getProperty('region')).toBe('DE');
    });
  });

  it('handles scale factors', async () => {
    const scaleFactors = ['scaleFactor1x', 'scaleFactor2x', 'scaleFactor4x'];

    await useGoogleMapPage(async ({ page, render }) => {
      for (const scale of scaleFactors) {
        await render(`
          <v-map style="height: 600px; width: 600px" flavour="${defaultFlavour}">
            <v-map-layergroup>
              <v-map-layer-google
                api-key="${mockApiKey}"
                map-type="roadmap"
                scale="${scale}">
              </v-map-layer-google>
            </v-map-layergroup>
          </v-map>
        `);

        const googleLayer = await page.find('v-map-layer-google');
        expect(await googleLayer.getProperty('scale')).toBe(scale);
      }
    });
  });

  it('handles max-zoom setting', async () => {
    await useGoogleMapPage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px" flavour="${defaultFlavour}">
          <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              max-zoom="15">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      expect(await googleLayer.getProperty('maxZoom')).toBe(15);
    });
  });
});
