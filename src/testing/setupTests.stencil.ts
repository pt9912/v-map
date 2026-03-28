import { vi } from 'vitest';

// Provide stub decorators so Stencil component source files can be imported.
// The decorators are compile-time constructs; at runtime they are no-ops.
const noop = () => (_target: any, _key?: string) => {};
const noopClass = (_opts: any) => (_target: any) => {};

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
