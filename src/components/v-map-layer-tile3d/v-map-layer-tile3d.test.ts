import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createTaggedElement,
  loadVMapBundle,
  onceEvent,
  waitForHydration,
} from '../../testing/browser-test-utils';

describe('v-map-layer-tile3d browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map-style');
    await customElements.whenDefined('v-map-layer-tile3d');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates and reacts to live style events without the legacy e2e harness', async () => {
    const style = createTaggedElement<HTMLVMapStyleElement>('v-map-style');
    const initialStyle = {
      color: "color('white', 0.5)",
      show: true,
    };

    style.format = 'cesium-3d-tiles';
    style.layerTargets = 'test-tileset';
    style.content = JSON.stringify(initialStyle);

    const initialStyleReady = onceEvent(style, 'styleReady');
    document.body.appendChild(style);

    await waitForHydration(style);
    await initialStyleReady;

    const layer = createTaggedElement<HTMLVMapLayerTile3dElement>('v-map-layer-tile3d');
    const readyEvent = onceEvent(layer, 'ready');

    layer.id = 'test-tileset';
    layer.url = 'https://example.com/tileset.json';
    layer.opacity = 0.8;
    layer.visible = true;
    layer.zIndex = 1200;

    document.body.appendChild(layer);

    await waitForHydration(layer);
    await readyEvent;

    expect(await layer.isReady()).toBe(true);
    expect(await style.getStyle()).toEqual(initialStyle);
    expect(layer.url).toBe('https://example.com/tileset.json');
    expect(layer.opacity).toBe(0.8);
    expect(layer.visible).toBe(true);

    const nextStyle = {
      color: "color('red')",
      show: false,
    };
    const updatedStyleReady = onceEvent(style, 'styleReady');

    style.content = JSON.stringify(nextStyle);

    await updatedStyleReady;

    expect(await style.getStyle()).toEqual(nextStyle);
    expect(await layer.isReady()).toBe(true);
  });
});
