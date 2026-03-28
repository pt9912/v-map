import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';

import '../../testing/fail-on-console-spec';

describe('<v-map-layer-scatterplot>', () => {
  it('renders', async () => {
    const { root } = await render(
      h('v-map-layer-scatterplot', { data: '[]' }),
    );
    expect(root).toBeTruthy();
  });
});
