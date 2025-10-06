import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

describe('<v-map-layer-xyz> e2e', () => {
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
        <v-map-layer-xyz url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" subdomains="a,b,c"></v-map-layer-xyz>
      </v-map>
    `);
    const el = await page.find('v-map-layer-xyz');
    expect(el).toHaveClass('hydrated');
  });

  it('reflects basic attributes', async () => {
    await render(`<v-map-layer-xyz url="u"></v-map-layer-xyz>`);
    const el = await page.find('v-map-layer-xyz');
    await el.setAttribute('opacity', '0.7');
    await page.waitForChanges();
    expect(el.getAttribute('opacity')).toBe('0.7');
  });
});
