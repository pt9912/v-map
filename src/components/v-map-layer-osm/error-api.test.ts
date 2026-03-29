/**
 * Browser integration tests for the Error-API.
 *
 * These tests use real hydrated Stencil components inside a live map
 * to verify the Error-API end-to-end:
 * - load-state attribute is reflected on real components
 * - getError() method works on hydrated components
 * - vmap-error event bubbles from layer to v-map element
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('Error-API browser integration', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map');
    await customElements.whenDefined('v-map-layer-osm');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('layer reflects load-state attribute after hydration and successful load', async () => {
    const map = createLiveMap();
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerOsmElement>('v-map-layer-osm');

    layer.id = 'osm-error-api-test';

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);

    // load-state should be present as an attribute
    await waitFor(() => layer.hasAttribute('load-state'));
    const state = layer.getAttribute('load-state');
    // After hydration, state should be one of the valid values
    expect(['idle', 'loading', 'ready', 'error']).toContain(state);
  });

  it('layer exposes getError() method that returns undefined on success', async () => {
    const map = createLiveMap();
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerOsmElement>('v-map-layer-osm');
    const readyEvent = onceEvent(layer, 'ready');

    layer.id = 'osm-geterror-test';

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await readyEvent;

    expect(typeof layer.getError).toBe('function');
    const error = await layer.getError();
    expect(error).toBeUndefined();
  });

  it('load-state transitions to ready after successful layer add', async () => {
    const map = createLiveMap();
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerOsmElement>('v-map-layer-osm');
    const readyEvent = onceEvent(layer, 'ready');

    layer.id = 'osm-loadstate-test';

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await readyEvent;

    await waitFor(() => layer.getAttribute('load-state') === 'ready');
    expect(layer.getAttribute('load-state')).toBe('ready');
  });

  it('vmap-error event from a layer bubbles to the parent v-map element', async () => {
    const map = createLiveMap();
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerOsmElement>('v-map-layer-osm');
    const readyEvent = onceEvent(layer, 'ready');

    layer.id = 'osm-bubble-test';

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await readyEvent;

    // Dispatch a synthetic vmap-error from the layer and verify it bubbles to map
    const receivedAtMap: CustomEvent[] = [];
    map.addEventListener('vmap-error', ((e: CustomEvent) => {
      receivedAtMap.push(e);
    }) as EventListener);

    layer.dispatchEvent(new CustomEvent('vmap-error', {
      detail: { type: 'provider', message: 'synthetic test error' },
      bubbles: true,
      composed: true,
    }));

    expect(receivedAtMap).toHaveLength(1);
    expect(receivedAtMap[0].detail.type).toBe('provider');
    expect(receivedAtMap[0].detail.message).toBe('synthetic test error');
  });

  it('CSS selector [load-state="ready"] matches successfully loaded layers', async () => {
    const map = createLiveMap();
    const group = createTaggedElement<HTMLVMapLayergroupElement>('v-map-layergroup');
    const layer = createTaggedElement<HTMLVMapLayerOsmElement>('v-map-layer-osm');
    const readyEvent = onceEvent(layer, 'ready');

    layer.id = 'osm-css-test';

    group.appendChild(layer);
    map.appendChild(group);
    document.body.appendChild(map);

    await waitForHydration(layer);
    await readyEvent;

    await waitFor(() => layer.getAttribute('load-state') === 'ready');

    // CSS selector should find the layer
    const readyLayers = document.querySelectorAll('[load-state="ready"]');
    expect(readyLayers.length).toBeGreaterThanOrEqual(1);

    const found = Array.from(readyLayers).some(el => el.id === 'osm-css-test');
    expect(found).toBe(true);
  });
});
