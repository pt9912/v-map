import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(10_000);

describe('<v-map-layer-scatterplot> e2e', () => {
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

  it('hydrates in isolation (no provider required)', async () => {
    await render(`<v-map-layer-scatterplot></v-map-layer-scatterplot>`);
    const el = await page.find('v-map-layer-scatterplot');
    expect(el).toHaveClass('hydrated');
  });
});
