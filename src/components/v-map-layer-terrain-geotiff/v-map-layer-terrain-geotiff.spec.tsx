import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerTerrainGeotiff } from './v-map-layer-terrain-geotiff';

jest.mock('../../layer/v-map-layer-helper', () => {
  return {
    VMapLayerHelper: jest.fn().mockImplementation(() => ({
      initLayer: jest.fn(),
      removeLayer: jest.fn(),
      updateLayer: jest.fn(),
      setVisible: jest.fn(),
      setOpacity: jest.fn(),
      setZIndex: jest.fn(),
      getLayerId: jest.fn(),
    })),
  };
});

describe('v-map-layer-terrain-geotiff', () => {
  it('renders default markup', async () => {
    const page = await newSpecPage({
      components: [VMapLayerTerrainGeotiff],
      html: `<v-map-layer-terrain-geotiff url="https://example.com/elevation.tif"></v-map-layer-terrain-geotiff>`,
    });
    expect(page.root).toEqualHtml(`
      <v-map-layer-terrain-geotiff url="https://example.com/elevation.tif">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </v-map-layer-terrain-geotiff>
    `);
  });

  it('accepts url property', async () => {
    const page = await newSpecPage({
      components: [VMapLayerTerrainGeotiff],
      html: `<v-map-layer-terrain-geotiff url="https://example.com/test.tif"></v-map-layer-terrain-geotiff>`,
    });
    expect(page.rootInstance.url).toBe('https://example.com/test.tif');
  });

  it('accepts optional terrain properties', async () => {
    const page = await newSpecPage({
      components: [VMapLayerTerrainGeotiff],
      html: `<v-map-layer-terrain-geotiff
        url="https://example.com/elevation.tif"
        mesh-max-error="2.0"
        wireframe="true"
        elevation-scale="2.5"
      ></v-map-layer-terrain-geotiff>`,
    });
    expect(page.rootInstance.url).toBe('https://example.com/elevation.tif');
    expect(page.rootInstance.meshMaxError).toBe(2.0);
    expect(page.rootInstance.wireframe).toBe(true);
    expect(page.rootInstance.elevationScale).toBe(2.5);
  });
});
