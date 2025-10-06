import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

describe('<v-map-layer-wms> e2e', () => {
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
          <v-map-layer-wms url="https://ahocevar.com/geoserver/wms" layers="topp:states"></v-map-layer-wms>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-wms');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts common props', async () => {
    await render(
      `<v-map><v-map-layergroup><v-map-layer-wms url="u" layers="l"></v-map-layer-wms></v-map-layergroup></v-map>`,
    );
    const el = await page.find('v-map-layer-wms');
    await el.setAttribute('transparent', 'true');
    await el.setAttribute('opacity', '0.5');
    await page.waitForChanges();
    expect(el.getAttribute('transparent')).toBe('true');
    expect(el.getAttribute('opacity')).toBe('0.5');
  });
});
