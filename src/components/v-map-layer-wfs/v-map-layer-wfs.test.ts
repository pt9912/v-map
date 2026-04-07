import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layer-wfs browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layer-wfs');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates inside a live ol map with a static WFS fixture', async () => {
    const map = createLiveMap('ol');
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerWfsElement>('v-map-layer-wfs');

    layer.url = '/wfs/test-layer.json';
    layer.typeName = 'test:states';
    layer.version = '2.0.0';
    layer.outputFormat = 'application/json';
    layer.srsName = 'EPSG:4326';

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);

    expect(await layer.isReady()).toBe(true);
    expect(layer.getAttribute('url')).toBe('/wfs/test-layer.json');
    expect(layer.getAttribute('type-name')).toBe('test:states');
    expect(layer.getAttribute('version')).toBe('2.0.0');
    expect(layer.getAttribute('output-format')).toBe('application/json');
    expect(layer.getAttribute('srs-name')).toBe('EPSG:4326');

    layer.opacity = 0.5;
    layer.visible = false;
    layer.zIndex = 100;
    layer.params = '{"maxFeatures":1}';

    await waitFor(() =>
      layer.getAttribute('opacity') === '0.5' &&
      !layer.hasAttribute('visible') &&
      layer.getAttribute('z-index') === '100' &&
      layer.getAttribute('params') === '{"maxFeatures":1}',
    );

    expect(layer.getAttribute('opacity')).toBe('0.5');
    expect(layer.hasAttribute('visible')).toBe(false);
    expect(layer.getAttribute('z-index')).toBe('100');
    expect(layer.params).toBe('{"maxFeatures":1}');
  });
});
