import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates and exposes a live map provider', async () => {
    const map = createLiveMap();
    const readyEvent = onceEvent<CustomEvent>(map, 'map-provider-ready');

    document.body.appendChild(map);

    await waitForHydration(map);
    await readyEvent;
    await waitFor(() => !!map.shadowRoot?.querySelector('#map'));

    expect(map.getAttribute('center')).toBe('11.5761,48.1371');
    expect(map.getAttribute('zoom')).toBe('12');
    expect(await map.getMapProvider()).toBeTruthy();
  });

  it('emits shutdown when the live map is removed from the DOM', async () => {
    const map = createLiveMap();
    const readyEvent = onceEvent<CustomEvent>(map, 'map-provider-ready');

    document.body.appendChild(map);

    await waitForHydration(map);
    await readyEvent;

    const shutdownEvent = onceEvent<CustomEvent>(map, 'map-provider-will-shutdown');
    map.remove();

    const event = await shutdownEvent;
    expect(event.type).toBe('map-provider-will-shutdown');
  });
});
