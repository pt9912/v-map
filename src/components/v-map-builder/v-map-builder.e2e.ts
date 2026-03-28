import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(20_000);

describe('<v-map-builder> e2e', () => {
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

  it('hydrates', async () => {
    await render(`
      <v-map-builder>
        <script type="application/json" slot="mapconfig">
        {
          "map": {
            "flavour": "ol",
            "zoom": 5,
            "center": "10,50"
          }
        }
        </script>
      </v-map-builder>
    `);
    const el = await page.find('v-map-builder');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts JSON configuration', async () => {
    await render(`
      <v-map-builder>
        <script type="application/json" slot="mapconfig">
        {
          "map": {
            "flavour": "ol",
            "zoom": 8,
            "center": "11.5761,48.1371"
          }
        }
        </script>
      </v-map-builder>
    `);
    await page.waitForChanges();
    const builder = await page.find('v-map-builder');
    expect(builder).toBeTruthy();
  });

  it('creates v-map from configuration', async () => {
    await render(`
      <v-map-builder>
        <script type="application/json" slot="mapconfig">
        {
          "map": {
            "flavour": "ol",
            "zoom": 5,
            "center": "0,0",
            "layerGroups": [
              {
                "groupTitle": "Base",
                "layers": [
                  { "id": "osm", "type": "osm" }
                ]
              }
            ]
          }
        }
        </script>
      </v-map-builder>
    `);
    await page.waitForChanges();
    const vmap = await page.find('v-map-builder > v-map');
    expect(vmap).toBeTruthy();
  });

  it('emits configReady event on successful parse', async () => {
    await render(`<v-map-builder></v-map-builder>`);
    const builder = await page.find('v-map-builder');
    const configReadySpy = await builder.spyOnEvent('configReady');

    await page.evaluate(() => {
      const el = document.querySelector('v-map-builder');
      const script = document.createElement('script');
      script.type = 'application/json';
      script.slot = 'mapconfig';
      script.textContent = JSON.stringify({
        map: { flavour: 'ol', zoom: 2, center: '0,0' },
      });
      el!.appendChild(script);
    });
    await page.waitForChanges();

    expect(configReadySpy).toHaveReceivedEvent();
  });
});
