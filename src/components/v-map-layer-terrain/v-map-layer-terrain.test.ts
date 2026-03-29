import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createTaggedElement,
  loadVMapBundle,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layer-terrain browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layer-terrain');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates and reflects terrain props without the legacy e2e harness', async () => {
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerTerrainElement>('v-map-layer-terrain');

    layer.elevationData = 'https://example.com/terrain';
    layer.texture = 'https://example.com/texture.jpg';
    layer.wireframe = true;
    layer.color = '#ff0000';

    group.appendChild(layer);
    document.body.appendChild(group);

    await waitForHydration(layer);

    expect(await layer.isReady()).toBe(true);
    expect(layer.elevationData).toBe('https://example.com/terrain');
    expect(layer.getAttribute('texture')).toBe('https://example.com/texture.jpg');
    expect(layer.hasAttribute('wireframe')).toBe(true);
    expect(layer.getAttribute('color')).toBe('#ff0000');

    layer.opacity = 0.9;
    layer.visible = false;
    layer.zIndex = 300;

    await waitFor(() =>
      layer.getAttribute('opacity') === '0.9' &&
      !layer.hasAttribute('visible') &&
      layer.getAttribute('z-index') === '300',
    );

    expect(layer.getAttribute('opacity')).toBe('0.9');
    expect(layer.hasAttribute('visible')).toBe(false);
    expect(layer.getAttribute('z-index')).toBe('300');
  });
});
