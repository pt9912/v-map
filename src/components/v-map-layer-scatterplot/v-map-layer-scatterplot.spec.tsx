import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerScatterplot } from './v-map-layer-scatterplot';
describe('<v-map-layer-scatterplot>', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMapLayerScatterplot],
      html: `<v-map-layer-scatterplot data='[]'></v-map-layer-scatterplot>`,
    });
    expect(page.root).toBeTruthy();
  });
});