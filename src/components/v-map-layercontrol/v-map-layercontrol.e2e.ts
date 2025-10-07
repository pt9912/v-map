import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

describe('<v-map-layercontrol> e2e', () => {
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

  it('hydrates', async () => {
    await render(`
      <v-map id="test-map" flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
      <v-map-layercontrol for="test-map"></v-map-layercontrol>
    `);
    const el = await page.find('v-map-layercontrol');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts for attribute', async () => {
    await render(`
      <v-map id="my-map" flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
      <v-map-layercontrol for="my-map"></v-map-layercontrol>
    `);
    const el = await page.find('v-map-layercontrol');
    expect(el.getAttribute('for')).toBe('my-map');
  });

  it('renders when connected to a map with layers', async () => {
    await render(`
      <v-map id="test-map" flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup group-title="Base Maps">
          <v-map-layer-osm label="OpenStreetMap"></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
      <v-map-layercontrol for="test-map"></v-map-layercontrol>
    `);
    const el = await page.find('v-map-layercontrol');
    expect(el).toBeTruthy();
  });

  it('detects layergroups in the map', async () => {
    await render(`
      <v-map id="test-map" flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup group-title="Base Maps">
          <v-map-layer-osm label="OSM"></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
      <v-map-layercontrol for="test-map"></v-map-layercontrol>
    `);

    await page.waitForChanges();
    const control = await page.find('v-map-layercontrol');
    expect(control).toBeTruthy();
  });
});
