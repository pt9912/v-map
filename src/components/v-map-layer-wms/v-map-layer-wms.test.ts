import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layer-wms browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layer-wms');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates inside a live map and updates reflected WMS properties', async () => {
    const map = createLiveMap();
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerWmsElement>('v-map-layer-wms');
    const readyEvent = onceEvent(layer, 'ready');

    layer.setAttribute('url', 'https://ahocevar.com/geoserver/wms');
    layer.setAttribute('layers', 'topp:states');
    layer.visible = false;

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await readyEvent;

    expect(layer.getAttribute('url')).toBe('https://ahocevar.com/geoserver/wms');
    expect(layer.getAttribute('layers')).toBe('topp:states');

    layer.styles = 'population';
    layer.transparent = false;
    layer.opacity = 0.5;

    await waitFor(() =>
      layer.getAttribute('styles') === 'population' &&
      !layer.hasAttribute('transparent') &&
      layer.getAttribute('opacity') === '0.5',
    );

    expect(layer.getAttribute('styles')).toBe('population');
    expect(layer.hasAttribute('transparent')).toBe(false);
    expect(layer.getAttribute('opacity')).toBe('0.5');
  });
});
