import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerWkt } from './v-map-layer-wkt';
import '../../testing/fail-on-console-spec';
describe('<v-map-layer-wkt>', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMapLayerWkt],
      html: `<v-map flavour="ol" style="display:block;width:300px;height:200px">
              <v-map-layergroup>
                <v-map-layer-wkt wkt="POINT (8 49)"></v-map-layer-wkt>
              </v-map-layergroup>
            </v-map>
       `,
    });
    expect(page.root).toBeTruthy();
  });
});
