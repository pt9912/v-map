import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

describe('<v-map-layer-wcs> e2e', () => {
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
          <v-map-layer-wcs url="https://example.com/wcs" coverageName="test:coverage"></v-map-layer-wcs>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-wcs');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts required attributes', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-wcs url="https://example.com/wcs" coverageName="test:elevation"></v-map-layer-wcs>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-wcs');
    expect(el.getAttribute('url')).toBe('https://example.com/wcs');
    expect(el.getAttribute('coverageName')).toBe('test:elevation');
  });

  it('accepts optional WCS parameters', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-wcs
            url="https://example.com/wcs"
            coverageName="test:coverage"
            format="image/png"
            version="2.0.0">
          </v-map-layer-wcs>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-wcs');
    expect(el.getAttribute('format')).toBe('image/png');
    expect(el.getAttribute('version')).toBe('2.0.0');
  });

  it('accepts common props', async () => {
    await render(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-wcs url="https://example.com/wcs" coverageName="test:coverage"></v-map-layer-wcs>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-wcs');
    await el.setAttribute('opacity', '0.6');
    await el.setAttribute('visible', 'false');
    await el.setAttribute('zIndex', '200');
    await page.waitForChanges();
    expect(el.getAttribute('opacity')).toBe('0.6');
    expect(el.getAttribute('visible')).toBe('false');
    expect(el.getAttribute('zIndex')).toBe('200');
  });
});
