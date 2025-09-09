import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerGoogle } from './v-map-layer-google';
describe('<v-map-layer-google>', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGoogle],
      html: `<v-map-layer-google></v-map-layer-google>`,
    });
    expect(page.root).toBeTruthy();
  });
});