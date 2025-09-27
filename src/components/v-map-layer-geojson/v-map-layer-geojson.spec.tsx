import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerGeoJSON } from './v-map-layer-geojson';
import '../../testing/fail-on-console-spec';

describe('<v-map-layer-wms>', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGeoJSON],
      html: `<v-map><v-map-layergroup><v-map-layer-geojson url="http://example.com" ></v-map-layer-geojson></v-map-layergroup></v-map>`,
    });
    expect(page.root).toBeTruthy();
  });
});
