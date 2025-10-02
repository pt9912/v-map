import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerWcs } from './v-map-layer-wcs';

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

describe('<v-map-layer-wcs>', () => {
  it('renders with defaults', async () => {
    const page = await newSpecPage({
      components: [VMapLayerWcs],
      html: `<v-map-layer-wcs url="https://example.com/wcs" coverage-name="DEM"></v-map-layer-wcs>`
    });

    expect(page.root).toEqualHtml(`
      <v-map-layer-wcs coverage-name="DEM" format="image/tiff" opacity="1" url="https://example.com/wcs" version="1.1.0" visible="" z-index="1000">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </v-map-layer-wcs>
    `);
  });
});
