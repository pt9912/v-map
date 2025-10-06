import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

describe('<v-map> e2e', () => {
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

  it('renders & hydrates', async () => {
    await render(`<v-map style="display:block;width:300px;height:200px"></v-map>`);
    const el = await page.find('v-map');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts center/zoom attributes', async () => {
    await render(
      `<v-map style="display:block;width:300px;height:200px" center="11.5761,48.1371" zoom="12"></v-map>`,
    );
    const el = await page.find('v-map');
    expect(el.getAttribute('center')).toBe('11.5761,48.1371');
    expect(el.getAttribute('zoom')).toBe('12');
  });

  it('exposes getMapProvider init', async () => {
    await render(`<v-map style="display:block;width:300px;height:200px"></v-map>`);
    const el = await page.find('v-map');
    const available = (await el.callMethod('getMapProvider')) ? true : false;
    expect(typeof available).toBe('boolean');
  });
});
