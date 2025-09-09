import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerXyz } from './v-map-layer-xyz';
describe('<v-map-layer-xyz>', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMapLayerXyz],
      html: `<v-map-layer-xyz url="http://tiles/{z}/{x}/{y}.png"></v-map-layer-xyz>`,
    });
    expect(page.root).toBeTruthy();
  });
});