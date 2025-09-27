// src/components/v-map-layergroup/v-map-layergroup.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerGroup } from './v-map-layergroup';
import '../../testing/fail-on-console-spec';

describe('v-map-layergroup', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGroup],
      html: `<v-map-layergroup title="Test Group"></v-map-layergroup>`,
    });
    expect(page.root).toEqualHtml(`
      <v-map-layergroup opacity="1" title="Test Group" visible="">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </v-map-layergroup>
    `);
  });
});
