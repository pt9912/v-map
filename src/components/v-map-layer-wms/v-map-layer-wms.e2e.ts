import { newE2EPage } from '@stencil/core/testing';

describe('<v-map-layer-wms> e2e', () => {
  it('hydrates inside <v-map>', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <v-map flavour="ol" style="display:block;width:300px;height:200px">
        <v-map-layer-wms url="https://ahocevar.com/geoserver/wms" layers="topp:states"></v-map-layer-wms>
      </v-map>
    `);
    const el = await page.find('v-map-layer-wms');
    expect(el).toHaveClass('hydrated');
  });

  it('accepts common props', async () => {
    const page = await newE2EPage();
    await page.setContent(`<v-map-layer-wms url="u" layers="l"></v-map-layer-wms>`);
    const el = await page.find('v-map-layer-wms');
    await el.setAttribute('transparent', 'true');
    await el.setAttribute('opacity', '0.5');
    await page.waitForChanges();
    expect(el.getAttribute('transparent')).toBe('true');
    expect(el.getAttribute('opacity')).toBe('0.5');
  });
});
