import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  loadVMapBundle,
  onceEvent,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';
import type { MapProvider } from '../../types/mapprovider';

// The host element exposes the resolved provider via a non-enumerable
// property so tests (and integrators) can read the live view state
// without going through the public method API.
type VMapHost = HTMLVMapElement & { __vMapProvider?: MapProvider | null };

/**
 * Regression tests for the @Watch('zoom') / @Watch('center') propagation
 * on <v-map>. The bug we're guarding against was: setting `zoom` from
 * outside (e.g. a slider in the consuming app) updated the prop and
 * fired the watcher, but the underlying provider's view never visibly
 * changed because OpenLayers' `view.animate({ duration: 0 })` is
 * unreliable. The fix is to use `view.setZoom()` / `view.setCenter()`
 * directly. These tests assert the *observable* outcome — i.e. the
 * provider's getView() reports the new zoom after the prop change —
 * so they catch any future regression in the same code path
 * regardless of which OL API is used internally.
 */
describe('v-map zoom propagation (browser)', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // -------- OpenLayers ---------------------------------------------------
  it('OL: propagates a programmatic zoom change to the provider view', async () => {
    const map = createLiveMap('ol') as VMapHost;
    // Bumped timeout: the OL provider chunk is lazy-loaded on first
    // use, and a cold start can exceed the default 3s in CI even
    // though warm runs finish in under a second.
    const readyEvent = onceEvent(map, 'map-provider-ready', 10_000);
    document.body.appendChild(map);

    await waitForHydration(map);
    await readyEvent;
    await waitFor(() => !!map.shadowRoot?.querySelector('#map'));

    // Sanity-check the initial state via the same API the @Watch
    // handler relies on. If this is null the rest of the test is
    // meaningless, so fail loud here.
    const initialView = map.__vMapProvider?.getView?.();
    expect(initialView, 'OL provider must implement getView()').not.toBeNull();
    expect(initialView!.zoom).toBeCloseTo(12, 0);

    // Drive zoom from "outside" the same way a slider would: write to
    // the prop. Stencil routes this through the @Prop setter, which
    // triggers @Watch('zoom') in v-map.tsx.
    map.zoom = 7;

    // The @Watch handler is async, so we have to wait for the
    // provider's view to actually catch up. We poll getView() until
    // it reports the new zoom (or the timeout fires).
    await waitFor(() => map.__vMapProvider?.getView?.()?.zoom === 7);

    const updatedView = map.__vMapProvider!.getView!();
    expect(updatedView!.zoom).toBe(7);
  });

  it('OL: propagates a follow-up zoom change without losing the live center', async () => {
    const map = createLiveMap('ol') as VMapHost;
    // Bumped timeout: the OL provider chunk is lazy-loaded on first
    // use, and a cold start can exceed the default 3s in CI even
    // though warm runs finish in under a second.
    const readyEvent = onceEvent(map, 'map-provider-ready', 10_000);
    document.body.appendChild(map);

    await waitForHydration(map);
    await readyEvent;
    await waitFor(() => !!map.shadowRoot?.querySelector('#map'));

    // Bump zoom twice in a row. The bug under test was specifically
    // that the *second* call would silently no-op because OL's
    // animate queue was already busy with the first one. Doing two
    // setView calls back-to-back exercises that path directly.
    map.zoom = 5;
    await waitFor(() => map.__vMapProvider?.getView?.()?.zoom === 5);

    map.zoom = 9;
    await waitFor(() => map.__vMapProvider?.getView?.()?.zoom === 9);

    const view = map.__vMapProvider!.getView!();
    expect(view!.zoom).toBe(9);
    // Center must still be the seed value, give or take a few decimal
    // places (LonLat ↔ Mercator round-trip can introduce ε noise).
    expect(view!.center[0]).toBeCloseTo(11.5761, 3);
    expect(view!.center[1]).toBeCloseTo(48.1371, 3);
  });

  // -------- Leaflet ------------------------------------------------------
  it('Leaflet: propagates a programmatic zoom change to the provider view', async () => {
    const map = createLiveMap('leaflet') as VMapHost;
    // Bumped timeout: the OL provider chunk is lazy-loaded on first
    // use, and a cold start can exceed the default 3s in CI even
    // though warm runs finish in under a second.
    const readyEvent = onceEvent(map, 'map-provider-ready', 10_000);
    document.body.appendChild(map);

    await waitForHydration(map);
    await readyEvent;
    await waitFor(() => !!map.shadowRoot?.querySelector('#map'));

    expect(map.__vMapProvider?.getView?.()?.zoom).toBeCloseTo(12, 0);

    map.zoom = 7;
    await waitFor(() => map.__vMapProvider?.getView?.()?.zoom === 7);

    expect(map.__vMapProvider!.getView!()!.zoom).toBe(7);
  });

  // -------- Deck.gl ------------------------------------------------------
  it('Deck: propagates a programmatic zoom change to the provider view', async () => {
    const map = createLiveMap('deck') as VMapHost;
    // Bumped timeout: the OL provider chunk is lazy-loaded on first
    // use, and a cold start can exceed the default 3s in CI even
    // though warm runs finish in under a second.
    const readyEvent = onceEvent(map, 'map-provider-ready', 10_000);
    document.body.appendChild(map);

    await waitForHydration(map);
    await readyEvent;
    await waitFor(() => !!map.shadowRoot?.querySelector('#map'));

    expect(map.__vMapProvider?.getView?.()?.zoom).toBeCloseTo(12, 0);

    map.zoom = 7;
    await waitFor(() => map.__vMapProvider?.getView?.()?.zoom === 7);

    expect(map.__vMapProvider!.getView!()!.zoom).toBe(7);
  });

  // -------- Center watcher (cross-provider sanity) -----------------------
  it('OL: propagates a programmatic center change to the provider view', async () => {
    const map = createLiveMap('ol') as VMapHost;
    // Bumped timeout: the OL provider chunk is lazy-loaded on first
    // use, and a cold start can exceed the default 3s in CI even
    // though warm runs finish in under a second.
    const readyEvent = onceEvent(map, 'map-provider-ready', 10_000);
    document.body.appendChild(map);

    await waitForHydration(map);
    await readyEvent;
    await waitFor(() => !!map.shadowRoot?.querySelector('#map'));

    map.center = '13.405,52.52'; // Berlin

    await waitFor(() => {
      const view = map.__vMapProvider?.getView?.();
      return !!view && Math.abs(view.center[0] - 13.405) < 0.001;
    });

    const view = map.__vMapProvider!.getView!();
    expect(view!.center[0]).toBeCloseTo(13.405, 3);
    expect(view!.center[1]).toBeCloseTo(52.52, 3);
    // Zoom must NOT have changed — the @Watch('center') handler
    // queries the live zoom from getView() so the existing user
    // interaction state is preserved.
    expect(view!.zoom).toBeCloseTo(12, 0);
  });
});
