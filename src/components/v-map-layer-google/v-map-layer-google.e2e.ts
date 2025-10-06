import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';
import { googleMapType } from '../../types/layerconfig';

jest.setTimeout(90_000);

describe('<v-map-layer-google> E2E', () => {
const mockApiKey = 'test-e2e-api-key-12345';
const usePage = async (
  run: (ctx: {
    page: E2EPage;
    render: (html: string, opts?: { wait?: boolean }) => Promise<void>;
  }) => Promise<void>,
) => {
  const page = await newE2EPage();
  await page.evaluateOnNewDocument(() => {
    (window as any).google = {
      maps: {
        Map: class MockMap {
          element: HTMLElement;
          options: any;
          constructor(element: any, options: any) {
            this.element = element;
            this.options = options;
          }
          setCenter() {}
          setZoom() {}
          setMapTypeId() {}
        },
        event: {
          addListenerOnce: (
            _map: any,
            _event: string,
            callback: Function,
          ) => {
            setTimeout(callback, 100);
          },
        },
        MapTypeId: {
          ROADMAP: 'roadmap',
          SATELLITE: 'satellite',
          TERRAIN: 'terrain',
          HYBRID: 'hybrid',
        },
      },
    };
    (window as any).loadGoogleMapsApi = () => Promise.resolve();
  });
  await page.setContent('<div id="test-root"></div>');

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

  try {
    await run({ page, render });
  } finally {
    try {
      await render('', { wait: false });
    } catch {
      /* ignore */
    }
    await page.close();
  }
};

  it('renders and initializes with roadmap', async () => {
    await usePage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px">
          <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              opacity="1.0"
              visible="true">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      expect(googleLayer).not.toBeNull();
      expect(await googleLayer.getProperty('apiKey')).toBe(mockApiKey);
      expect(await googleLayer.getProperty('mapType')).toBe('roadmap');
      expect(await googleLayer.getProperty('opacity')).toBe(1.0);
      expect(await googleLayer.getProperty('visible')).toBe(true);
    });
  });

  it('supports all map types', async () => {
    const mapTypes: googleMapType[] = [
      'roadmap',
      'satellite',
      'terrain',
      'hybrid',
    ];

    await usePage(async ({ page, render }) => {
      for (const mapType of mapTypes) {
        await render(`
          <v-map style="height: 600px; width: 600px">
            <v-map-layergroup>
              <v-map-layer-google
                api-key="${mockApiKey}"
                map-type="${mapType}">
              </v-map-layer-google>
            </v-map-layergroup>
          </v-map>
        `);

        const googleLayer = await page.find('v-map-layer-google');
        expect(googleLayer).not.toBeNull();
        expect(await googleLayer.getProperty('mapType')).toBe(mapType);
        expect(googleLayer).toHaveAttribute('map-type');
      }
    });
  });

  it('handles opacity changes', async () => {
    await usePage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px">
          <v-map-layergroup>
            <v-map-layer-google
              id="test-layer"
              api-key="${mockApiKey}"
              map-type="roadmap"
              opacity="0.5">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('#test-layer');
      expect(await googleLayer.getProperty('opacity')).toBe(0.5);

      await googleLayer.setProperty('opacity', 0.8);
      await page.waitForChanges();
      expect(await googleLayer.getProperty('opacity')).toBe(0.8);
    });
  });

  it('handles visibility toggle', async () => {
    await usePage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px">
          <v-map-layergroup>
            <v-map-layer-google
              id="test-layer"
              api-key="${mockApiKey}"
              map-type="roadmap"
              visible="true">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('#test-layer');
      expect(await googleLayer.getProperty('visible')).toBe(true);

      await googleLayer.setProperty('visible', false);
      await page.waitForChanges();
      expect(await googleLayer.getProperty('visible')).toBe(false);

      await googleLayer.setProperty('visible', true);
      await page.waitForChanges();
      expect(await googleLayer.getProperty('visible')).toBe(true);
    });
  });

  it('supports map type switching', async () => {
    await usePage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px">
          <v-map-layergroup>
            <v-map-layer-google
              id="test-layer"
              api-key="${mockApiKey}"
              map-type="roadmap">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('#test-layer');
      expect(await googleLayer.getProperty('mapType')).toBe('roadmap');

      await googleLayer.setProperty('mapType', 'satellite');
      await page.waitForChanges();
      expect(await googleLayer.getProperty('mapType')).toBe('satellite');

      await googleLayer.setProperty('mapType', 'terrain');
      await page.waitForChanges();
      expect(await googleLayer.getProperty('mapType')).toBe('terrain');

      await googleLayer.setProperty('mapType', 'hybrid');
      await page.waitForChanges();
      expect(await googleLayer.getProperty('mapType')).toBe('hybrid');
    });
  });

  it('handles language and region settings', async () => {
    await usePage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px">
          <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              language="de"
              region="DE">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      expect(await googleLayer.getProperty('language')).toBe('de');
      expect(await googleLayer.getProperty('region')).toBe('DE');
    });
  });

  it('handles scale factors', async () => {
    const scaleFactors = ['scaleFactor1x', 'scaleFactor2x', 'scaleFactor4x'];

    await usePage(async ({ page, render }) => {
      for (const scale of scaleFactors) {
        await render(`
          <v-map style="height: 600px; width: 600px">
            <v-map-layergroup>
              <v-map-layer-google
                api-key="${mockApiKey}"
                map-type="roadmap"
                scale="${scale}">
              </v-map-layer-google>
            </v-map-layergroup>
          </v-map>
        `);

        const googleLayer = await page.find('v-map-layer-google');
        expect(await googleLayer.getProperty('scale')).toBe(scale);
      }
    });
  });

  it('handles max-zoom setting', async () => {
    await usePage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px">
          <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              max-zoom="15">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      expect(await googleLayer.getProperty('maxZoom')).toBe(15);
    });
  });

  it('handles styles attribute', async () => {
    const styles = [
      {
        featureType: 'water',
        stylers: [{ color: '#0099cc' }],
      },
      {
        featureType: 'landscape',
        stylers: [{ color: '#f2f2f2' }],
      },
    ];

    await usePage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px">
          <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              styles='${JSON.stringify(styles)}'>
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      const layerStyles = await googleLayer.getProperty('styles');
      expect(Array.isArray(layerStyles)).toBe(true);
      expect(layerStyles).toHaveLength(2);
    });
  });

  it('handles libraries attribute', async () => {
    await usePage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px">
          <v-map-layergroup>
            <v-map-layer-google
              api-key="${mockApiKey}"
              map-type="roadmap"
              libraries="geometry,places,drawing">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      const libraries = await googleLayer.getProperty('libraries');
      expect(libraries).toBe('geometry,places,drawing');
    });
  });

  it('gracefully handles missing API key', async () => {
    await usePage(async ({ page, render }) => {
      await render(`
        <v-map style="height: 600px; width: 600px">
          <v-map-layergroup>
            <v-map-layer-google map-type="roadmap">
            </v-map-layer-google>
          </v-map-layergroup>
        </v-map>
      `);

      const googleLayer = await page.find('v-map-layer-google');
      expect(googleLayer).not.toBeNull();
      expect(await googleLayer.getProperty('apiKey')).toBeUndefined();
    });
  });

  it('works with different map providers', async () => {
    const providers = ['leaflet', 'ol'];

    await usePage(async ({ page, render }) => {
      for (const provider of providers) {
        await render(`
          <v-map style="height: 600px; width: 600px" flavour="${provider}">
            <v-map-layergroup>
              <v-map-layer-google
                api-key="${mockApiKey}"
                map-type="roadmap">
              </v-map-layer-google>
            </v-map-layergroup>
          </v-map>
        `);

        const vMap = await page.find('v-map');
        const googleLayer = await page.find('v-map-layer-google');

        expect(vMap).not.toBeNull();
        expect(googleLayer).not.toBeNull();
        expect(await vMap.getProperty('flavour')).toBe(provider);
      }
    });
  });
});
