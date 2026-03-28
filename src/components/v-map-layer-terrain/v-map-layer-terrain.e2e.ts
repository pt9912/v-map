import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

describe('<v-map-layer-terrain> e2e', () => {
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
      <v-map flavour="cesium" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-terrain elevationData="https://example.com/elevation.png"></v-map-layer-terrain>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-terrain');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts elevationData attribute', async () => {
    await render(`
      <v-map flavour="cesium" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-terrain elevationData="https://example.com/terrain.tif"></v-map-layer-terrain>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-terrain');
    expect(el.getAttribute('elevationData')).toBe(
      'https://example.com/terrain.tif',
    );
  });

  it('accepts optional terrain parameters', async () => {
    await render(`
      <v-map-layer-terrain
        elevationData="https://example.com/elevation.png"
        texture="https://example.com/texture.jpg"
        wireframe="true"
        color="#ff0000">
      </v-map-layer-terrain>
    `);
    const el = await page.find('v-map-layer-terrain');
    expect(el.getAttribute('texture')).toBe('https://example.com/texture.jpg');
    expect(el.getAttribute('wireframe')).not.toBeNull();
    expect(el.getAttribute('color')).toBe('#ff0000');
  });

  it('accepts common props', async () => {
    await render(`
      <v-map-layer-terrain elevationData="https://example.com/elevation.png"></v-map-layer-terrain>
    `);
    const el = await page.find('v-map-layer-terrain');
    el.setAttribute('opacity', '0.9');
    el.setAttribute('visible', 'true');
    el.setAttribute('zIndex', '300');
    await page.waitForChanges();
    expect(el.getAttribute('opacity')).toBe('0.9');
    expect(el.getAttribute('visible')).toBe('true');
    expect(el.getAttribute('zIndex')).toBe('300');
  });
});
