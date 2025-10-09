import { defaultFlavour, useGoogleMapPage } from './v-map-layer-google.e2e-utils';
import { googleMapType } from '../../types/layerconfig';

jest.setTimeout(90_000);

describe('<v-map-layer-google> E2E (basics)', () => {
  const mockApiKey = 'test-e2e-api-key-12345';

  it('works with different map providers', async () => {
    const providers: Array<'leaflet'> = ['leaflet'];

    await useGoogleMapPage(async ({ page, render }) => {
      for (const provider of providers) {
        await render(`
          <v-map style="height: 600px; width: 600px" flavour="${provider}">
            <v-map-layergroup>
              <v-map-layer-google
                api-key="${mockApiKey}"
                map-type="roadmap">
              </v-map-layer-google>
            </v-map-layergroup>
          </v-map>
        `);

        const vMap = await page.find('v-map');
        const googleLayer = await page.find('v-map-layer-google');

        expect(vMap).not.toBeNull();
        expect(googleLayer).not.toBeNull();
        expect(await vMap.getProperty('flavour')).toBe(provider);
      }
    });
  });

  it('renders and initializes with roadmap', async () => {
    await useGoogleMapPage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px" flavour="${defaultFlavour}">
          <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              opacity="1.0"
              visible="true">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      expect(googleLayer).not.toBeNull();
      expect(await googleLayer.getProperty('apiKey')).toBe(mockApiKey);
      expect(await googleLayer.getProperty('mapType')).toBe('roadmap');
      expect(await googleLayer.getProperty('opacity')).toBe(1.0);
      expect(await googleLayer.getProperty('visible')).toBe(true);
    });
  });

  it('supports all map types', async () => {
    const mapTypes: googleMapType[] = [
      'roadmap',
      'satellite',
      'terrain',
      'hybrid',
    ];

    await useGoogleMapPage(async ({ page, render }) => {
      for (const mapType of mapTypes) {
        await render(`
          <v-map style="height: 600px; width: 600px" flavour="${defaultFlavour}">
            <v-map-layergroup>
              <v-map-layer-google
                api-key="${mockApiKey}"
                map-type="${mapType}">
              </v-map-layer-google>
            </v-map-layergroup>
          </v-map>
        `);

        const googleLayer = await page.find('v-map-layer-google');
        expect(googleLayer).not.toBeNull();
        expect(await googleLayer.getProperty('mapType')).toBe(mapType);
        expect(googleLayer).toHaveAttribute('map-type');
      }
    });
  });
});
