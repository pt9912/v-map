import { newE2EPage } from '@stencil/core/testing';

describe('<v-map-layer-scatterplot> e2e', () => {
  it('hydrates in isolation (no provider required)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<v-map-layer-scatterplot></v-map-layer-scatterplot>`);
    const el = await page.find('v-map-layer-scatterplot');
    expect(el).toHaveClass('hydrated');
  });
});
