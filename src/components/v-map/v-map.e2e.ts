import { newE2EPage } from '@stencil/core/testing';

describe('<v-map> e2e', () => {
  it('renders & hydrates', async () => {
    const page = await newE2EPage();
    await page.setContent(`<v-map style="display:block;width:300px;height:200px"></v-map>`);
    const el = await page.find('v-map');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts center/zoom attributes', async () => {
    const page = await newE2EPage();
    await page.setContent(`<v-map center="[11.5761,48.1371]" zoom="12"></v-map>`);
    const el = await page.find('v-map');
    expect(el.getAttribute('center')).toBe('[11.5761,48.1371]');
    expect(el.getAttribute('zoom')).toBe('12');
  });

  it('exposes isMapProviderAvailable()', async () => {
    const page = await newE2EPage();
    await page.setContent(`<v-map></v-map>`);
    const el = await page.find('v-map');
    const available = await el.callMethod('isMapProviderAvailable', 'ol');
    expect(typeof available).toBe('boolean');
  });
});
