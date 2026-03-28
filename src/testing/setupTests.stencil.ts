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

beforeAll(async () => {
  // Load compiled Stencil components so custom elements are registered for render() tests
  try {
    await import('../../dist/v-map/v-map.esm.js');
  } catch {
    // dist may not exist in all CI environments; prototype-only tests still work
  }
});
