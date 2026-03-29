import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layer-geotiff browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layer-geotiff');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates inside a live deck map with a local GeoTIFF fixture', async () => {
    const map = createLiveMap('deck');
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerGeotiffElement>('v-map-layer-geotiff');
    const readyEvent = onceEvent(layer, 'ready', 10_000);

    layer.setAttribute('url', '/geotiff/cea.tif');
    layer.setAttribute('color-map', 'viridis');
    layer.setAttribute('nodata', '-9999');
    layer.visible = false;

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await readyEvent;

    expect(layer.getAttribute('url')).toBe('/geotiff/cea.tif');
    expect(layer.getAttribute('color-map')).toBe('viridis');
    expect(layer.getAttribute('nodata')).toBe('-9999');

    layer.opacity = 0.8;
    layer.visible = true;
    layer.zIndex = 50;

    await waitFor(() =>
      layer.opacity === 0.8 &&
      layer.visible === true &&
      layer.zIndex === 50,
    );

    expect(layer.opacity).toBe(0.8);
    expect(layer.visible).toBe(true);
    expect(layer.zIndex).toBe(50);
  });
});
