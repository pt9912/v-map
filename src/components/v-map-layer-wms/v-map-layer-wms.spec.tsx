import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerWms } from './v-map-layer-wms';
describe('<v-map-layer-wms>', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMapLayerWms],
      html: `<v-map-layer-wms url="http://example.com" layers="foo"></v-map-layer-wms>`,
    });
    expect(page.root).toBeTruthy();
  });
});