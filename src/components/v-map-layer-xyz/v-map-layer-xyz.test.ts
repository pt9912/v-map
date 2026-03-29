import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createTaggedElement,
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layer-xyz browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-layer-xyz');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates and emits ready with reflected XYZ attributes', async () => {
    const layer = createTaggedElement<HTMLVMapLayerXyzElement>('v-map-layer-xyz');
    const readyEvent = onceEvent(layer, 'ready');

    layer.setAttribute('url', 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    layer.setAttribute('subdomains', 'a,b,c');
    document.body.appendChild(layer);

    await waitForHydration(layer);
    await readyEvent;

    layer.opacity = 0.7;
    layer.maxZoom = 19;

    await waitFor(() =>
      layer.getAttribute('opacity') === '0.7' &&
      layer.getAttribute('max-zoom') === '19',
    );

    expect(layer.getAttribute('url')).toBe(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    );
    expect(layer.getAttribute('subdomains')).toBe('a,b,c');
    expect(layer.getAttribute('opacity')).toBe('0.7');
    expect(layer.getAttribute('max-zoom')).toBe('19');
  });
});
