import { newE2EPage } from '@stencil/core/testing';

describe('<v-map-layer-wkt> e2e', () => {
  it('hydrates with a POINT', async () => {
    const page = await newE2EPage();
    await page.setContent(`<v-map-layer-wkt wkt="POINT(11.5761 48.1371)"></v-map-layer-wkt>`);
    const el = await page.find('v-map-layer-wkt');
    expect(el).toHaveClass('hydrated');
  });
});
