import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerWfs } from './v-map-layer-wfs';

jest.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: jest.fn().mockImplementation(() => ({
    initLayer: jest.fn(),
    removeLayer: jest.fn(),
    updateLayer: jest.fn(),
    setVisible: jest.fn(),
    setOpacity: jest.fn(),
    setZIndex: jest.fn(),
  })),
}));

describe('<v-map-layer-wfs>', () => {
  it('renders with required attributes', async () => {
    const page = await newSpecPage({
      components: [VMapLayerWfs],
      html: `<v-map-layer-wfs url="https://example.com/wfs" type-name="namespace:layer"></v-map-layer-wfs>`
    });

    expect(page.root).toEqualHtml(`
      <v-map-layer-wfs opacity="1" output-format="application/json" srs-name="EPSG:3857" type-name="namespace:layer" url="https://example.com/wfs" version="1.1.0" visible="" z-index="1000">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </v-map-layer-wfs>
    `);
  });
});
