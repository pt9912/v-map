// src/components/v-map-layer-group/v-map-layer-group.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerGroup } from './v-map-layer-group';

describe('v-map-layer-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGroup],
      html: `<v-map-layer-group title="Test Group"></v-map-layer-group>`,
    });
    expect(page.root).toEqualHtml(`
      <v-map-layer-group title="Test Group">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </v-map-layer-group>
    `);
  });
});
