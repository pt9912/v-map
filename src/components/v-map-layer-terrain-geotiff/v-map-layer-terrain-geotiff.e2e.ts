import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';
import type { GeoTiffTestServer } from '../../testing/geotiff-test-server';
import { startGeoTiffTestServer } from '../../testing/geotiff-test-server';

jest.setTimeout(20_000);

describe('<v-map-layer-terrain-geotiff> e2e', () => {
  let page: E2EPage;
  let demServer: GeoTiffTestServer;
  let localGeoTiffUrl: string;

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
    demServer = await startGeoTiffTestServer();
    localGeoTiffUrl = demServer.url;
    page = await newE2EPage();
    await page.setContent('<div id="test-root"></div>');
  });

  afterEach(async () => {
    await render('', { wait: false });
  });

  afterAll(async () => {
    await page.close();
    await demServer.close();
  });

  it('hydrates inside <v-map>', async () => {
    await render(`
      <v-map provider="deck" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-terrain-geotiff url="${localGeoTiffUrl}"></v-map-layer-terrain-geotiff>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-terrain-geotiff');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts url attribute', async () => {
    await render(`
      <v-map provider="deck" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-terrain-geotiff url="${localGeoTiffUrl}"></v-map-layer-terrain-geotiff>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-terrain-geotiff');
    expect(el.getAttribute('url')).toBe(localGeoTiffUrl);
  });

  it.skip('accepts optional terrain parameters', async () => {
    // Skipped: need real url for GeoTIFF
    await render(`
      <v-map provider="deck" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-terrain-geotiff
            url="${localGeoTiffUrl}"
            texture="https://example.com/texture.jpg"
            wireframe="true"
            mesh-max-error="2.0"
            elevation-scale="2.0">
          </v-map-layer-terrain-geotiff>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-terrain-geotiff');
    expect(el.getAttribute('texture')).toBe('https://example.com/texture.jpg');
    expect(el.getAttribute('wireframe')).toBe('true');
    expect(el.getAttribute('mesh-max-error')).toBe('2.0');
    expect(el.getAttribute('elevation-scale')).toBe('2.0');
  });

  it.skip('accepts projection parameters', async () => {
    // Skipped: need real url for GeoTIFF
    await render(`
      <v-map provider="deck" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-terrain-geotiff
            url="${localGeoTiffUrl}"
            projection="EPSG:32632"
            force-projection="true">
          </v-map-layer-terrain-geotiff>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-terrain-geotiff');
    expect(el.getAttribute('projection')).toBe('EPSG:32632');
    expect(el.getAttribute('force-projection')).toBe('true');
  });

  it.skip('accepts common props', async () => {
    // Skipped: need real url for GeoTIFF
    await render(`
      <v-map provider="deck" style="display:block;width:300px;height:200px">
        <v-map-layergroup>
          <v-map-layer-terrain-geotiff url="${localGeoTiffUrl}"></v-map-layer-terrain-geotiff>
        </v-map-layergroup>
      </v-map>
    `);
    const el = await page.find('v-map-layer-terrain-geotiff');
    el.setAttribute('opacity', '0.9');
    el.setAttribute('visible', 'true');
    el.setAttribute('zIndex', '300');
    await page.waitForChanges();
    expect(el.getAttribute('opacity')).toBe('0.9');
    expect(el.getAttribute('visible')).toBe('true');
    expect(el.getAttribute('zIndex')).toBe('300');
  });
});
