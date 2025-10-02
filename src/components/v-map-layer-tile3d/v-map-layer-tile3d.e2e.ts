import { newE2EPage } from '../../testing/e2e-testing';

describe('<v-map-layer-tile3d> E2E', () => {
  it('rendert zusammen mit v-map-style und reagiert auf Style-Events', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <div>
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
      </div>
    `);

    await page.waitForChanges();

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

    // Wire up readiness helper
    const ready = await tileLayer.callMethod('isReady');
    expect(ready).toBe(true);

    // opacity reflection
    expect(await tileLayer.getProperty('opacity')).toBe(0.8);
    expect(await tileLayer.getProperty('visible')).toBe(true);
  });
});
