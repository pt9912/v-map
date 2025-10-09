import { defaultFlavour, useGoogleMapPage } from './v-map-layer-google.e2e-utils';

jest.setTimeout(90_000);

describe('<v-map-layer-google> E2E (advanced)', () => {
  const mockApiKey = 'test-e2e-api-key-12345';

  it('handles styles attribute', async () => {
    const styles = [
      {
        featureType: 'water',
        stylers: [{ color: '#0099cc' }],
      },
      {
        featureType: 'landscape',
        stylers: [{ color: '#f2f2f2' }],
      },
    ];

    await useGoogleMapPage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px" flavour="${defaultFlavour}">
          <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              styles='${JSON.stringify(styles)}'>
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      const layerStyles = await googleLayer.getProperty('styles');
      expect(Array.isArray(layerStyles)).toBe(true);
      expect(layerStyles).toHaveLength(2);
    });
  });

  it('handles libraries attribute', async () => {
    await useGoogleMapPage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px" flavour="${defaultFlavour}">
          <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              libraries="geometry,places,drawing">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      const libraries = await googleLayer.getProperty('libraries');
      expect(libraries).toBe('geometry,places,drawing');
    });
  });

  it('gracefully handles missing API key', async () => {
    await useGoogleMapPage(async ({ page }) => {
      await page.evaluate(() => {
        const root = document.getElementById('test-root');
        if (!root) return;
        root.innerHTML = `
          <v-map style="height: 600px; width: 600px" flavour="leaflet">
            <v-map-layergroup>
              <v-map-layer-google map-type="roadmap"></v-map-layer-google>
            </v-map-layergroup>
          </v-map>
        `;
      });
      await page.waitForChanges();

      const googleLayer = await page.find('v-map-layer-google');
      expect(googleLayer).not.toBeNull();
      expect(await googleLayer.getProperty('apiKey')).toBeUndefined();
    });
  });
});
