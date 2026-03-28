import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';

import '../../testing/fail-on-console-spec';

describe('<v-map-layer-xyz>', () => {
  it('renders', async () => {
    const { root } = await render(
      h('v-map-layer-xyz', { url: 'http://tiles/{z}/{x}/{y}.png' }),
    );
    expect(root).toBeTruthy();
  });
});
