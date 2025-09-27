// src/components/v-map/v-map.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { VMap } from './v-map';
import '../../testing/fail-on-console-spec';

describe('<v-map>', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="leaflet" leaflet-css="none" center="8.5417,49.0069" zoom="10"></v-map>`,
    });

    expect(page.root).toBeTruthy();

    const shadow = page.root!.shadowRoot!;
    const map = shadow.querySelector('#map') as HTMLElement | null;

    expect(map).not.toBeNull();

    // Styles am #map (Target-Div) prüfen
    expect(map!.style.width).toBe('100%');
    expect(map!.style.height).toBe('100%');

    // optional: display block
    expect(map!.style.display).toBe('block');
  });
});
