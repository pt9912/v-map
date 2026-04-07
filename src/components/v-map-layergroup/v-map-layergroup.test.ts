import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layergroup browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layergroup');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates with child base layers and keeps a live group id', async () => {
    const map = createLiveMap();
    const mapReady = onceEvent<CustomEvent>(map, 'map-provider-ready');
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const primaryLayer = createTaggedElement<HTMLVMapLayerOsmElement>('v-map-layer-osm');
    const secondaryLayer = createTaggedElement<HTMLVMapLayerOsmElement>('v-map-layer-osm');

    group.setAttribute('basemapid', 'osm-primary');

    primaryLayer.id = 'osm-primary';
    secondaryLayer.id = 'osm-secondary';
    primaryLayer.visible = false;
    secondaryLayer.visible = false;

    group.append(primaryLayer, secondaryLayer);
    map.appendChild(group);
    document.body.appendChild(map);

    await mapReady;
    await waitForHydration(group);
    await waitForHydration(primaryLayer);
    await waitForHydration(secondaryLayer);

    const groupId = await group.getGroupId();
    expect(typeof groupId).toBe('string');
    expect(groupId.length).toBeGreaterThan(0);

    group.visible = false;
    group.setAttribute('basemapid', 'osm-secondary');

    await waitFor(() =>
      !group.hasAttribute('visible') &&
      group.getAttribute('basemapid') === 'osm-secondary',
    );

    expect(group.hasAttribute('visible')).toBe(false);
    expect(group.getAttribute('basemapid')).toBe('osm-secondary');
  });
});
