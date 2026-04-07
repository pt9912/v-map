import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layer-terrain-geotiff browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layer-terrain-geotiff');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates inside a live deck map with a local terrain GeoTIFF fixture', async () => {
    const map = createLiveMap('deck');
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerTerrainGeotiffElement>('v-map-layer-terrain-geotiff');
    const readyEvent = onceEvent(layer, 'ready', 10_000);

    layer.setAttribute('url', '/geotiff/cea.tif');
    layer.setAttribute('mesh-max-error', '2');
    layer.setAttribute('elevation-scale', '1.5');
    layer.setAttribute('projection', 'EPSG:32632');
    layer.setAttribute('force-projection', 'true');
    layer.visible = false;

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await readyEvent;

    expect(layer.getAttribute('url')).toBe('/geotiff/cea.tif');
    expect(layer.getAttribute('mesh-max-error')).toBe('2');
    expect(layer.getAttribute('elevation-scale')).toBe('1.5');
    expect(layer.getAttribute('projection')).toBe('EPSG:32632');
    expect(layer.getAttribute('force-projection')).toBe('true');

    layer.opacity = 0.9;
    layer.visible = true;
    layer.zIndex = 300;

    await waitFor(() =>
      layer.opacity === 0.9 &&
      layer.visible === true &&
      layer.zIndex === 300,
    );

    expect(layer.opacity).toBe(0.9);
    expect(layer.visible).toBe(true);
    expect(layer.zIndex).toBe(300);
  });
});
