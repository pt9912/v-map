import { newE2EPage } from '@stencil/core/testing';

describe('<v-map-layer-xyz> e2e', () => {
  it('hydrates inside <v-map>', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layer-xyz url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" subdomains="a,b,c"></v-map-layer-xyz>
      </v-map>
    `);
    const el = await page.find('v-map-layer-xyz');
    expect(el).toHaveClass('hydrated');
  });

  it('reflects basic attributes', async () => {
    const page = await newE2EPage();
    await page.setContent(`<v-map-layer-xyz url="u"></v-map-layer-xyz>`);
    const el = await page.find('v-map-layer-xyz');
    await el.setAttribute('opacity', '0.7');
    await page.waitForChanges();
    expect(el.getAttribute('opacity')).toBe('0.7');
  });
});
