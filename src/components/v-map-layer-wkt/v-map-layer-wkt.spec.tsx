import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerWkt } from './v-map-layer-wkt';
describe('<v-map-layer-wkt>', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMapLayerWkt],
      html: `<v-map-layer-wkt wkt="POINT (8 49)"></v-map-layer-wkt>`,
    });
    expect(page.root).toBeTruthy();
  });
});