import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

function buildConfigScript(config: unknown): HTMLScriptElement {
  const script = document.createElement('script');

  script.type = 'application/json';
  script.slot = 'mapconfig';
  script.textContent = JSON.stringify(config);

  return script;
}

describe('v-map-builder browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-builder');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates, parses JSON config, and creates a live v-map tree', async () => {
    const builder = document.createElement('v-map-builder');
    const readyEvent = onceEvent<CustomEvent>(builder, 'configReady');

    builder.appendChild(
      buildConfigScript({
        map: {
          flavour: 'ol',
          zoom: 5,
          center: '0,0',
          layerGroups: [
            {
              groupTitle: 'Base',
              layers: [{ id: 'osm', type: 'osm' }],
            },
          ],
        },
      }),
    );

    document.body.appendChild(builder);

    await waitForHydration(builder);
    const event = await readyEvent;
    await waitFor(() => !!builder.querySelector('v-map'));

    expect(event.detail.map.flavour).toBe('ol');
    expect(builder.querySelector('v-map')).toBeTruthy();
    expect(builder.querySelector('v-map-layergroup')).toBeTruthy();
    expect(builder.querySelector('#osm')).toBeTruthy();
  });

  it('emits configReady when configuration is attached after hydration', async () => {
    const builder = document.createElement('v-map-builder');

    document.body.appendChild(builder);
    await waitForHydration(builder);

    const readyEvent = onceEvent<CustomEvent>(builder, 'configReady');
    builder.appendChild(
      buildConfigScript({
        map: { flavour: 'ol', zoom: 2, center: '0,0' },
      }),
    );

    const event = await readyEvent;
    await waitFor(() => builder.querySelector('v-map')?.getAttribute('zoom') === '2');

    expect(event.detail.map.zoom).toBe(2);
    expect(builder.querySelector('v-map')?.getAttribute('zoom')).toBe('2');
  });
});
