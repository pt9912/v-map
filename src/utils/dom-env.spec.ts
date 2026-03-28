import { vi } from 'vitest';
import {
  isBrowser,
  supportsAdoptedStyleSheets,
  watchElementResize,
} from './dom-env';

describe('dom-env', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('detects the browser environment in jsdom', () => {
    expect(isBrowser()).toBe(true);
  });

  it('detects adoptedStyleSheets support when the APIs exist', () => {
    Object.defineProperty(document, 'adoptedStyleSheets', {
      configurable: true,
      value: [],
    });
    Object.defineProperty(CSSStyleSheet.prototype, 'replaceSync', {
      configurable: true,
      value: vi.fn(),
    });

    expect(supportsAdoptedStyleSheets()).toBe(true);
  });

  it('observes resize events with ResizeObserver when available', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    const callbackHolder: Array<() => void> = [];
    const resizeObserver = vi.fn().mockImplementation(function(cb: () => void) {
      callbackHolder.push(cb);
      return { observe, disconnect };
    });
    vi.stubGlobal('ResizeObserver', resizeObserver);

    const element = document.createElement('div');
    const cb = vi.fn();
    const unsubscribe = watchElementResize(element, cb);

    expect(resizeObserver).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledWith(element);

    callbackHolder[0]();
    expect(cb).toHaveBeenCalledTimes(1);

    unsubscribe();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('falls back to window resize and mutation observer when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined);

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const disconnect = vi.fn();
    const observe = vi.fn();
    const mutationCallbacks: Array<() => void> = [];
    class MockMutationObserver {
      constructor(cb: () => void) {
        mutationCallbacks.push(cb);
      }
      observe = observe;
      disconnect = disconnect;
    }
    vi.stubGlobal('MutationObserver', MockMutationObserver);

    const requestAnimationFrameSpy = vi
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((fn: FrameRequestCallback) => {
        fn(0);
        return 1;
      });

    const element = document.createElement('div');
    const cb = vi.fn();
    const unsubscribe = watchElementResize(element, cb, {
      attributes: true,
    });

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
    expect(observe).toHaveBeenCalledWith(element, { attributes: true });
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 250);

    mutationCallbacks[0]();
    expect(requestAnimationFrameSpy).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledTimes(1);

    unsubscribe();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('uses setTimeout fallback when requestAnimationFrame is unavailable (line 11)', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    vi.stubGlobal('requestAnimationFrame', undefined);

    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    const disconnect = vi.fn();
    const observe = vi.fn();
    const mutationCallbacks: Array<() => void> = [];
    class MockMutationObserver {
      constructor(cb: () => void) {
        mutationCallbacks.push(cb);
      }
      observe = observe;
      disconnect = disconnect;
    }
    vi.stubGlobal('MutationObserver', MockMutationObserver);

    const element = document.createElement('div');
    const cb = vi.fn();
    const unsubscribe = watchElementResize(element, cb);

    // Trigger the mutation callback; since rAF is undefined, it should use setTimeout
    mutationCallbacks[0]();
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 0);

    unsubscribe();
  });

  it('handles fallback path when window is undefined (lines 31, 47, 50)', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    vi.stubGlobal('MutationObserver', undefined);
    vi.stubGlobal('window', undefined);

    const element = document.createElement('div');
    const cb = vi.fn();

    // Should not throw even when window is undefined
    const unsubscribe = watchElementResize(element, cb);

    // unsubscribe should also not throw
    unsubscribe();
  });

  it('handles fallback path when MutationObserver is undefined (line 36 false branch)', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    vi.stubGlobal('MutationObserver', undefined);

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');

    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((fn: FrameRequestCallback) => {
      fn(0);
      return 1;
    });

    const element = document.createElement('div');
    const cb = vi.fn();
    const unsubscribe = watchElementResize(element, cb);

    // Should still add resize listener and setInterval
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 250);

    unsubscribe();
  });

  it('calls mo.observe(target) without init when mutationObserverInit is not provided (line 41)', () => {
    vi.stubGlobal('ResizeObserver', undefined);

    const disconnect = vi.fn();
    const observe = vi.fn();
    class MockMutationObserver {
      constructor(_cb: () => void) {}
      observe = observe;
      disconnect = disconnect;
    }
    vi.stubGlobal('MutationObserver', MockMutationObserver);

    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((fn: FrameRequestCallback) => {
      fn(0);
      return 1;
    });

    const element = document.createElement('div');
    const cb = vi.fn();
    // Call without mutationObserverInit (no 3rd arg) to hit line 41
    const unsubscribe = watchElementResize(element, cb);

    // observe should have been called with just the element (no options)
    expect(observe).toHaveBeenCalledWith(element);
    expect(observe).toHaveBeenCalledTimes(1);
    // Verify it was NOT called with a second argument
    expect(observe.mock.calls[0]).toHaveLength(1);

    unsubscribe();
  });
});
