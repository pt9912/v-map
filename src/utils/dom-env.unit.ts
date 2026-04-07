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

  it('falls back to window resize, MutationObserver and polling when ResizeObserver is unavailable', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    let resizeHandler: (() => void) | undefined;
    addEventListener.mockImplementation((type: string, handler: () => void) => {
      if (type === 'resize') resizeHandler = handler;
    });

    const rafCallbacks: Array<() => void> = [];
    const requestAnimationFrame = vi.fn((cb: () => void) => {
      rafCallbacks.push(cb);
      return 1;
    });
    const setIntervalSpy = vi.fn(() => 123 as unknown as ReturnType<typeof setInterval>);
    const clearIntervalSpy = vi.fn();
    const observe = vi.fn();
    const disconnect = vi.fn();
    const mutationCallbacks: Array<() => void> = [];
    class MockMutationObserver {
      constructor(cb: () => void) {
        mutationCallbacks.push(cb);
      }
      observe = observe;
      disconnect = disconnect;
    }

    vi.stubGlobal('ResizeObserver', undefined);
    vi.stubGlobal('window', { addEventListener, removeEventListener });
    vi.stubGlobal('requestAnimationFrame', requestAnimationFrame);
    vi.stubGlobal('setInterval', setIntervalSpy);
    vi.stubGlobal('clearInterval', clearIntervalSpy);
    vi.stubGlobal('MutationObserver', MockMutationObserver);

    const cb = vi.fn();
    const target = {} as HTMLElement;
    const mutationObserverInit = { attributes: true };
    const unsubscribe = watchElementResize(target, cb, mutationObserverInit);

    resizeHandler?.();
    mutationCallbacks[0]();
    rafCallbacks.forEach((fn) => fn());

    expect(observe).toHaveBeenCalledWith(target, mutationObserverInit);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 250);
    expect(cb).toHaveBeenCalledTimes(2);

    unsubscribe();

    expect(removeEventListener).toHaveBeenCalledWith('resize', resizeHandler);
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(clearIntervalSpy).toHaveBeenCalledWith(123);
  });
});
