import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layer-osm browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layer-osm');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates inside a live map and reflects runtime property changes', async () => {
    const map = createLiveMap();
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerOsmElement>('v-map-layer-osm');
    const readyEvent = onceEvent(layer, 'ready');

    layer.id = 'osm-browser-layer';
    layer.setAttribute('url', 'https://tile.openstreetmap.de');
    layer.visible = false;

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await readyEvent;

    expect(layer.getAttribute('url')).toBe('https://tile.openstreetmap.de');
    expect(typeof layer.getLayerId).toBe('function');

    layer.opacity = 0.7;
    layer.visible = true;
    layer.zIndex = 20;

    await waitFor(() =>
      layer.getAttribute('opacity') === '0.7' &&
      layer.hasAttribute('visible') &&
      layer.getAttribute('z-index') === '20',
    );

    expect(layer.getAttribute('opacity')).toBe('0.7');
    expect(layer.hasAttribute('visible')).toBe(true);
    expect(layer.getAttribute('z-index')).toBe('20');
  });
});
