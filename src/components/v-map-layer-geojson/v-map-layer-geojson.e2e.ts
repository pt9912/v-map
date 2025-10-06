import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

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

  let page: E2EPage;

  const render = async (html: string, opts?: { wait?: boolean }) => {
    await page.evaluate(
      content => {
        const root = document.getElementById('test-root');
        if (root) {
          root.innerHTML = content;
        }
      },
      html,
    );
    if (opts?.wait === false) return;
    await page.waitForChanges();
  };

  beforeAll(async () => {
    page = await newE2EPage();
    await page.setContent('<div id="test-root"></div>');
  });

  afterEach(async () => {
    await render('', { wait: false });
  });

  afterAll(async () => {
    await page.close();
  });

  it('hydrates inside <v-map> with inline geojson', async () => {
    await render(`
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
