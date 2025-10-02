import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerTerrain } from './v-map-layer-terrain';

jest.mock('../../layer/v-map-layer-helper', () => {
  return {
    VMapLayerHelper: jest.fn().mockImplementation(() => ({
      initLayer: jest.fn(),
      removeLayer: jest.fn(),
      updateLayer: jest.fn(),
      setVisible: jest.fn(),
      setOpacity: jest.fn(),
      setZIndex: jest.fn(),
    })),
  };
});

describe('<v-map-layer-terrain>', () => {
  it('renders default markup', async () => {
    const page = await newSpecPage({
      components: [VMapLayerTerrain],
      html: `<v-map-layer-terrain elevation-data="https://example.com/height.png"></v-map-layer-terrain>`
    });

    expect(page.root).toEqualHtml(`
      <v-map-layer-terrain elevation-data="https://example.com/height.png" opacity="1" visible="" z-index="1000">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </v-map-layer-terrain>
    `);
  });

  it('parses color hex into rgb array', async () => {
    const component = new VMapLayerTerrain();
    (component as any).color = '#336699';

    const result = (component as any).getColorArray();
    expect(result).toEqual([51, 102, 153]);
  });
});
