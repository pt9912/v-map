import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layer-wcs browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layer-wcs');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates inside a live map and exposes isReady for the browser runtime', async () => {
    const map = createLiveMap();
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerWcsElement>('v-map-layer-wcs');

    layer.setAttribute('url', 'https://example.com/wcs');
    layer.setAttribute('coverage-name', 'test:elevation');
    layer.setAttribute('format', 'image/png');
    layer.setAttribute('version', '2.0.0');
    layer.visible = false;

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await waitFor(() => typeof layer.isReady === 'function');

    expect(await layer.isReady()).toBe(true);
    expect(layer.getAttribute('coverage-name')).toBe('test:elevation');
    expect(layer.getAttribute('format')).toBe('image/png');
    expect(layer.getAttribute('version')).toBe('2.0.0');

    layer.opacity = 0.6;
    layer.visible = true;
    layer.zIndex = 200;

    await waitFor(() =>
      layer.getAttribute('opacity') === '0.6' &&
      layer.hasAttribute('visible') &&
      layer.getAttribute('z-index') === '200',
    );

    expect(layer.getAttribute('opacity')).toBe('0.6');
    expect(layer.hasAttribute('visible')).toBe(true);
    expect(layer.getAttribute('z-index')).toBe('200');
  });
});
