import { newE2EPage } from '@stencil/core/testing';
import { googleMapType } from '../../types/layerconfig';

describe('<v-map-layer-google> E2E', () => {
  const mockApiKey = 'test-e2e-api-key-12345';

  beforeEach(async () => {
    // Mock Google Maps API for E2E tests
    const page = await newE2EPage();
    await page.evaluateOnNewDocument(() => {
      // Mock the Google Maps API
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
              // Simulate immediate loading
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

      // Mock the loadGoogleMapsApi function
      (window as any).loadGoogleMapsApi = () => Promise.resolve();
    });
  });

  it('renders and initializes with roadmap', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <v-map>
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

  it('supports all map types', async () => {
    const mapTypes: googleMapType[] = [
      'roadmap',
      'satellite',
      'terrain',
      'hybrid',
    ];

    for (const mapType of mapTypes) {
      const page = await newE2EPage();
      await page.setContent(`
        <v-map>
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

      // Verify the layer appears in DOM
      expect(googleLayer).toHaveAttribute('map-type'); //, mapType);
    }
  });

  it('handles opacity changes', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <v-map>
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

    // Change opacity dynamically
    await googleLayer.setProperty('opacity', 0.8);
    await page.waitForChanges();

    expect(await googleLayer.getProperty('opacity')).toBe(0.8);
  });

  it('handles visibility toggle', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <v-map>
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

    // Toggle visibility
    await googleLayer.setProperty('visible', false);
    await page.waitForChanges();

    expect(await googleLayer.getProperty('visible')).toBe(false);

    // Toggle back
    await googleLayer.setProperty('visible', true);
    await page.waitForChanges();

    expect(await googleLayer.getProperty('visible')).toBe(true);
  });

  it('supports map type switching', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <v-map>
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

    // Switch to satellite
    await googleLayer.setProperty('mapType', 'satellite');
    await page.waitForChanges();
    expect(await googleLayer.getProperty('mapType')).toBe('satellite');

    // Switch to terrain
    await googleLayer.setProperty('mapType', 'terrain');
    await page.waitForChanges();
    expect(await googleLayer.getProperty('mapType')).toBe('terrain');

    // Switch to hybrid
    await googleLayer.setProperty('mapType', 'hybrid');
    await page.waitForChanges();
    expect(await googleLayer.getProperty('mapType')).toBe('hybrid');
  });

  it('handles language and region settings', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <v-map>
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

  // it('handles scale factors', async () => {
  //   const scaleFactors = ['scaleFactor1x', 'scaleFactor2x', 'scaleFactor4x'];

  //   for (const scale of scaleFactors) {
  //     const page = await newE2EPage();
  //     await page.setContent(`
  //       <v-map>
  //         <v-map-layergroup>
  //           <v-map-layer-google
  //             api-key="${mockApiKey}"
  //             map-type="roadmap"
  //             scale="${scale}">
  //           </v-map-layer-google>
  //         </v-map-layergroup>
  //       </v-map>
  //     `);

  //     const googleLayer = await page.find('v-map-layer-google');
  //     expect(await googleLayer.getProperty('scale')).toBe(scale);
  //   }
  // });

  // it('handles max-zoom setting', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent(`
  //     <v-map>
  //       <v-map-layergroup>
  //         <v-map-layer-google
  //           api-key="${mockApiKey}"
  //           map-type="roadmap"
  //           max-zoom="15">
  //         </v-map-layer-google>
  //       </v-map-layergroup>
  //     </v-map>
  //   `);

  //   const googleLayer = await page.find('v-map-layer-google');
  //   expect(await googleLayer.getProperty('maxZoom')).toBe(15);
  // });

  // it('handles styles attribute', async () => {
  //   const styles = [
  //     {
  //       featureType: 'water',
  //       stylers: [{ color: '#0099cc' }],
  //     },
  //     {
  //       featureType: 'landscape',
  //       stylers: [{ color: '#f2f2f2' }],
  //     },
  //   ];

  //   const page = await newE2EPage();
  //   await page.setContent(`
  //     <v-map>
  //       <v-map-layergroup>
  //         <v-map-layer-google
  //           api-key="${mockApiKey}"
  //           map-type="roadmap"
  //           styles='${JSON.stringify(styles)}'>
  //         </v-map-layer-google>
  //       </v-map-layergroup>
  //     </v-map>
  //   `);

  //   const googleLayer = await page.find('v-map-layer-google');
  //   const layerStyles = await googleLayer.getProperty('styles');
  //   expect(Array.isArray(layerStyles)).toBe(true);
  //   expect(layerStyles).toHaveLength(2);
  // });

  // it('handles libraries attribute', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent(`
  //     <v-map>
  //       <v-map-layergroup>
  //         <v-map-layer-google
  //           api-key="${mockApiKey}"
  //           map-type="roadmap"
  //           libraries="geometry,places,drawing">
  //         </v-map-layer-google>
  //       </v-map-layergroup>
  //     </v-map>
  //   `);

  //   const googleLayer = await page.find('v-map-layer-google');
  //   const libraries = await googleLayer.getProperty('libraries');
  //   expect(libraries).toBe('geometry,places,drawing');
  // });

  it('gracefully handles missing API key', async () => {
    const page = await newE2EPage();

    // Capture console warnings/errors
    const messages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'warn' || msg.type() === 'error') {
        messages.push(msg.text());
      }
    });

    await page.setContent(`
      <v-map>
        <v-map-layergroup>
          <v-map-layer-google map-type="roadmap">
          </v-map-layer-google>
        </v-map-layergroup>
      </v-map>
    `);

    const googleLayer = await page.find('v-map-layer-google');
    expect(googleLayer).not.toBeNull();

    // Component should render but may log warnings about missing API key
    expect(await googleLayer.getProperty('apiKey')).toBeUndefined();
  });

  it('works with different map providers', async () => {
    const providers = ['leaflet', 'openlayers', 'deck', 'cesium'];

    for (const provider of providers) {
      const page = await newE2EPage();
      await page.setContent(`
        <v-map flavour="${provider}">
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
