import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';
import type { WfsTestServer } from '../../testing/wfs-test-server';
import { startWfsTestServer } from '../../testing/wfs-test-server';

jest.setTimeout(20_000);

describe('<v-map-layer-wfs> e2e', () => {
  let page: E2EPage;
  let wfsServer: WfsTestServer;
  let localWfsUrl: string;

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
    wfsServer = await startWfsTestServer();
    localWfsUrl = wfsServer.url;
    page = await newE2EPage();
    await page.setContent('<div id="test-root"></div>');
  });

  afterEach(async () => {
    await render('', { wait: false });
  });

  afterAll(async () => {
    await page.close();
    await wfsServer.close();
  });

  it('hydrates inside <v-map>', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-wfs url="${localWfsUrl}" typeName="test:layer"></v-map-layer-wfs>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-wfs');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts required attributes', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-wfs url="${localWfsUrl}" typeName="test:states"></v-map-layer-wfs>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-wfs');
    expect(el.getAttribute('url')).toBe(localWfsUrl);
    expect(el.getAttribute('typeName')).toBe('test:states');
  });

  it('accepts optional WFS parameters', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-wfs
            url="${localWfsUrl}"
            typeName="test:layer"
            version="2.0.0"
            outputFormat="application/json"
            srsName="EPSG:4326">
          </v-map-layer-wfs>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-wfs');
    expect(el.getAttribute('version')).toBe('2.0.0');
    expect(el.getAttribute('outputFormat')).toBe('application/json');
    expect(el.getAttribute('srsName')).toBe('EPSG:4326');
  });

  it('accepts common props', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-wfs url="${localWfsUrl}" typeName="test:layer"></v-map-layer-wfs>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-wfs');
    await el.setAttribute('opacity', '0.5');
    await el.setAttribute('visible', 'true');
    await el.setAttribute('zIndex', '100');
    await page.waitForChanges();
    expect(el.getAttribute('opacity')).toBe('0.5');
    expect(el.getAttribute('visible')).toBe('true');
    expect(el.getAttribute('zIndex')).toBe('100');
  });
});
