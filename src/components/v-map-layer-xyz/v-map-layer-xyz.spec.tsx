import { vi, describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';

import '../../testing/fail-on-console-spec';

import { VMapLayerXyz } from './v-map-layer-xyz';

describe('<v-map-layer-xyz>', () => {
  it('renders', async () => {
    const { root } = await render(
      h('v-map-layer-xyz', { url: 'http://tiles/{z}/{x}/{y}.png' }),
    );
    expect(root).toBeTruthy();
  });

  describe('prototype-based source coverage', () => {
    it('componentDidLoad emits ready event', async () => {
      const component = {
        el: document.createElement('v-map-layer-xyz'),
        url: 'http://tiles/{z}/{x}/{y}.png',
        visible: true,
        opacity: 1,
        ready: { emit: vi.fn() },
      } as any;

      await VMapLayerXyz.prototype.componentDidLoad.call(component);

      expect(component.ready.emit).toHaveBeenCalledTimes(1);
    });

    it('connectedCallback runs without error', async () => {
      const component = {
        el: document.createElement('v-map-layer-xyz'),
      } as any;

      await expect(
        VMapLayerXyz.prototype.connectedCallback.call(component),
      ).resolves.toBeUndefined();
    });

    it('render returns undefined', () => {
      const component = {} as any;
      const result = VMapLayerXyz.prototype.render.call(component);
      expect(result).toBeUndefined();
    });

    it('has correct default property values', () => {
      const component = new (VMapLayerXyz as any)();
      expect(component.visible).toBe(true);
      expect(component.opacity).toBe(1.0);
    });
  });
});
