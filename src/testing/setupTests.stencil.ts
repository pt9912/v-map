import { vi, beforeAll } from 'vitest';

// Provide stub decorators so Stencil component source files can be imported.
// The decorators are compile-time constructs; at runtime they are no-ops.
const noop = () => (target: any, key?: string) => {};
const noopClass = (opts: any) => (target: any) => {};

vi.mock('@stencil/core', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    Component: noopClass,
    Prop: noop,
    State: noop,
    Element: noop,
    Event: noop,
    Watch: () => noop,
    Method: noop,
    Listen: () => noop,
    Build: { isDev: true, isBrowser: false, isTesting: true },
  };
});

// Suppress unhandled rejections from compiled components that try to load
// map providers (OpenLayers, Leaflet, Cesium, Deck) during render() tests.
// The providers are not available in the test environment because the dist
// bundle inlines dynamic imports that resolve to non-constructable stubs.
const providerErrors = /Provider is not a constructor|Cannot read properties of (null|undefined)/;
process.on('unhandledRejection', (reason: unknown) => {
  const msg = reason instanceof Error ? reason.message : String(reason);
  if (providerErrors.test(msg)) return; // swallow known provider errors
  // Re-throw unexpected rejections so vitest reports them
  throw reason;
});

beforeAll(async () => {
  // Load compiled Stencil components so custom elements are registered for render() tests
  try {
    await import('../../dist/v-map/v-map.esm.js');
  } catch {
    // dist may not exist in all CI environments; prototype-only tests still work
  }
});
