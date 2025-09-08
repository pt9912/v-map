// src/components/v-map/v-map.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { VMap } from './v-map';

describe('v-map', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="ol" center="8.5417,49.0069" zoom="10"></v-map>`,
    });
    expect(page.root).toEqualHtml(`
      <v-map flavour="ol" center="8.5417,49.0069" zoom="10">
        <mock:shadow-root>
          <div id="map-container" style="width: 100%; height: 100%;"></div>
        </mock:shadow-root>
      </v-map>
    `);
  });
});
