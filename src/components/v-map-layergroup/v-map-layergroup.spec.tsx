// src/components/v-map-layergroup/v-map-layergroup.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerGroup } from './v-map-layergroup';

describe('v-map-layergroup', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGroup],
      html: `<v-map-layergroup title="Test Group"></v-map-layergroup>`,
    });
    expect(page.root).toEqualHtml(`
      <v-map-layergroup title="Test Group">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </v-map-layergroup>
    `);
  });
});
