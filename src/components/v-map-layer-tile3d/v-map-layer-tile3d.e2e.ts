import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

describe('<v-map-layer-tile3d> E2E', () => {
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

  it('rendert zusammen mit v-map-style und reagiert auf Style-Events', async () => {
    await render(`
      <v-map flavour="cesium">
        <v-map-layergroup>
          <v-map-style
            id="style"
            format="cesium-3d-tiles"
            layer-targets="test-tileset"
          ></v-map-style>
          <v-map-layer-tile3d
            id="test-tileset"
            url="https://example.com/tileset.json"
            opacity="0.8"
            visible="true"
            z-index="1200"
          ></v-map-layer-tile3d>
        </v-map-layergroup>
      </v-map>
    `);

    const styleComponent = await page.find('v-map-style');
    expect(styleComponent).toBeTruthy();
    expect(await styleComponent.getProperty('format')).toBe('cesium-3d-tiles');

    const cesiumStyle = {
      color: "color('white', 0.5)",
      show: true,
    };
    await styleComponent.setProperty('content', JSON.stringify(cesiumStyle));
    await page.waitForChanges();

    const tileLayer = await page.find('v-map-layer-tile3d');
    expect(tileLayer).toBeTruthy();
    expect(await tileLayer.getProperty('url')).toBe(
      'https://example.com/tileset.json',
    );

    const ready = await tileLayer.callMethod('isReady');
    expect(ready).toBe(true);

    expect(await tileLayer.getProperty('opacity')).toBe(0.8);
    expect(await tileLayer.getProperty('visible')).toBe(true);
  });
});
