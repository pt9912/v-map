import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

describe('<v-map-layer-geotiff> e2e', () => {
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

  it('hydrates inside <v-map>', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-geotiff url="https://example.com/test.tif"></v-map-layer-geotiff>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-geotiff');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts url attribute', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-geotiff url="https://example.com/terrain.tif"></v-map-layer-geotiff>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-geotiff');
    expect(el.getAttribute('url')).toBe('https://example.com/terrain.tif');
  });

  it('accepts common props', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-geotiff url="https://example.com/test.tif"></v-map-layer-geotiff>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-geotiff');
    await el.setAttribute('opacity', '0.8');
    await el.setAttribute('visible', 'true');
    await el.setAttribute('zIndex', '50');
    await page.waitForChanges();
    expect(el.getAttribute('opacity')).toBe('0.8');
    expect(el.getAttribute('visible')).toBe('true');
    expect(el.getAttribute('zIndex')).toBe('50');
  });
});
