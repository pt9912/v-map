import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layer-wkt browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layer-wkt');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates inside a live map with WKT data and emits ready', async () => {
    const map = createLiveMap('ol');
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerWktElement>('v-map-layer-wkt');
    const readyEvent = onceEvent(layer, 'ready');

    layer.setAttribute('wkt', 'POINT(11.5761 48.1371)');
    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await readyEvent;

    layer.opacity = 0.5;
    layer.visible = false;
    layer.zIndex = 1500;

    await waitFor(() =>
      layer.getAttribute('opacity') === '0.5' &&
      !layer.hasAttribute('visible') &&
      layer.getAttribute('z-index') === '1500',
    );

    expect(layer.getAttribute('wkt')).toBe('POINT(11.5761 48.1371)');
    expect(typeof layer.getLayerId).toBe('function');
    expect(layer.getAttribute('opacity')).toBe('0.5');
    expect(layer.hasAttribute('visible')).toBe(false);
    expect(layer.getAttribute('z-index')).toBe('1500');
  });
});
