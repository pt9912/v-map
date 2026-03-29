import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

const featureCollection = JSON.stringify({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Point' },
      geometry: { type: 'Point', coordinates: [11.5761, 48.1371] },
    },
  ],
});

describe('v-map-layer-geojson browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layer-geojson');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates inside a live map with inline geojson data', async () => {
    const map = createLiveMap('ol');
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerGeojsonElement>('v-map-layer-geojson');

    layer.setAttribute('geojson', featureCollection);
    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await waitFor(() => typeof layer.geojson === 'string');

    layer.opacity = 0.6;
    layer.visible = false;
    layer.zIndex = 1200;

    await waitFor(() =>
      layer.getAttribute('opacity') === '0.6' &&
      !layer.hasAttribute('visible') &&
      layer.getAttribute('z-index') === '1200',
    );

    expect(layer.geojson).toContain('FeatureCollection');
    expect(layer.getAttribute('opacity')).toBe('0.6');
    expect(layer.hasAttribute('visible')).toBe(false);
    expect(layer.getAttribute('z-index')).toBe('1200');
  });
});
