import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  isBrowser,
  supportsAdoptedStyleSheets,
  watchElementResize,
} from './dom-env';

describe('dom-env unit', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns false when window and document are unavailable', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    expect(isBrowser()).toBe(false);
  });

  it('detects adoptedStyleSheets support from the relevant globals', () => {
    class FakeSheet {}
    Object.defineProperty(FakeSheet.prototype, 'replaceSync', {
      configurable: true,
      value: () => undefined,
    });

    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { adoptedStyleSheets: [] });
    vi.stubGlobal('CSSStyleSheet', FakeSheet);

    expect(supportsAdoptedStyleSheets()).toBe(true);
  });

  it('uses ResizeObserver when available and disconnects on unsubscribe', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    const callbacks: Array<() => void> = [];
    class MockResizeObserver {
      constructor(cb: () => void) {
        callbacks.push(cb);
      }
      observe = observe;
      disconnect = disconnect;
    }

    vi.stubGlobal('ResizeObserver', MockResizeObserver);

    const cb = vi.fn();
    const target = {} as HTMLElement;
    const unsubscribe = watchElementResize(target, cb);

    callbacks[0]();

    expect(observe).toHaveBeenCalledWith(target);
    expect(cb).toHaveBeenCalledTimes(1);

    unsubscribe();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
