import { vi, describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';

import '../../testing/fail-on-console-spec';

import { VMapLayerScatterplot } from './v-map-layer-scatterplot';

describe('<v-map-layer-scatterplot>', () => {
  it('renders', async () => {
    const { root } = await render(
      h('v-map-layer-scatterplot', { data: '[]' }),
    );
    expect(root).toBeTruthy();
  });

  describe('prototype-based source coverage', () => {
    it('componentDidLoad emits ready event', async () => {
      const component = {
        el: document.createElement('v-map-layer-scatterplot'),
        data: '[]',
        url: undefined,
        getFillColor: '#3388ff',
        getRadius: 1000,
        opacity: 1,
        visible: true,
        ready: { emit: vi.fn() },
      } as any;

      await VMapLayerScatterplot.prototype.componentDidLoad.call(component);

      expect(component.ready.emit).toHaveBeenCalledTimes(1);
    });

    it('connectedCallback runs without error', async () => {
      const component = {
        el: document.createElement('v-map-layer-scatterplot'),
      } as any;

      await expect(
        VMapLayerScatterplot.prototype.connectedCallback.call(component),
      ).resolves.toBeUndefined();
    });

    it('render returns undefined', () => {
      const component = {} as any;
      const result = VMapLayerScatterplot.prototype.render.call(component);
      expect(result).toBeUndefined();
    });

    it('has correct default property values', () => {
      const component = new (VMapLayerScatterplot as any)();
      expect(component.visible).toBe(true);
      expect(component.opacity).toBe(1.0);
      expect(component.getFillColor).toBe('#3388ff');
      expect(component.getRadius).toBe(1000);
    });
  });
});
