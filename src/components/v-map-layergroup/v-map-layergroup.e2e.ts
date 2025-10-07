import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

describe('<v-map-layergroup> e2e', () => {
  let page: E2EPage;

  const render = async (html: string, opts?: { wait?: boolean }) => {
    await page.evaluate(content => {
      const root = document.getElementById('test-root');
      if (root) {
        root.innerHTML = content;
      }
    }, html);
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

  it('hydrates inside <v-map>', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layergroup');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts visible attribute', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup visible="false">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layergroup');
    expect(el.getAttribute('visible')).toBe('false');
  });

  it('accepts opacity attribute', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup opacity="0.5">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layergroup');
    expect(el.getAttribute('opacity')).toBe('0.5');
  });

  it('accepts basemapid attribute', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup basemapid="osm-layer">
          <v-map-layer-osm id="osm-layer"></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layergroup');
    expect(el.getAttribute('basemapid')).toBe('osm-layer');
  });

  it('renders child layers - ol', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
    `);
    const layerGroup = await page.find('v-map-layergroup');
    const childLayer = await page.find('v-map-layer-osm');
    expect(layerGroup).toBeTruthy();
    expect(childLayer).toBeTruthy();
  });

  it.skip('renders child layers - deck', async () => {
    await render(`
      <v-map flavour="deck" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
    `);
    const layerGroup = await page.find('v-map-layergroup');
    const childLayer = await page.find('v-map-layer-osm');
    expect(layerGroup).toBeTruthy();
    expect(childLayer).toBeTruthy();
  });

  it('renders child layers - leaflet', async () => {
    await render(`
      <v-map flavour="leaflet" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
    `);
    const layerGroup = await page.find('v-map-layergroup');
    const childLayer = await page.find('v-map-layer-osm');
    expect(layerGroup).toBeTruthy();
    expect(childLayer).toBeTruthy();
  });

  it('renders child layers - cesium', async () => {
    await render(`
      <v-map flavour="cesium" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
    `);
    const layerGroup = await page.find('v-map-layergroup');
    const childLayer = await page.find('v-map-layer-osm');
    expect(layerGroup).toBeTruthy();
    expect(childLayer).toBeTruthy();
  });
});
