import { newE2EPage } from '../../testing/e2e-testing';

describe('<v-map-layer-geojson> e2e', () => {
  const fc = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Point' },
        geometry: { type: 'Point', coordinates: [11.5761, 48.1371] },
      },
    ],
  };

  it('hydrates inside <v-map> with inline geojson', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-geojson geojson='${JSON.stringify(
            fc,
          )}'></v-map-layer-geojson>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-geojson');
    expect(el).toHaveClass('hydrated');
  });
});
