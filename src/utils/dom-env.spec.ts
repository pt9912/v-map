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
    const resizeObserver = vi.fn().mockImplementation((cb: () => void) => {
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
});
