import { vi } from 'vitest';

// Alias jest → vi so existing jest.fn()/jest.spyOn() calls work under Vitest
(globalThis as any).jest = vi;

Object.defineProperty(document, 'createRange', {
  value: () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: document.body,
    createContextualFragment: (html: string) => {
      const t = document.createElement('template');
      t.innerHTML = html;
      return t.content;
    },
  }),
});

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = RO;

class MockMutationObserver {
  observe(): void {}
  disconnect(): void {}
  takeRecords(): unknown[] {
    return [];
  }
}
if (typeof (globalThis as any).MutationObserver === 'undefined') {
  (globalThis as any).MutationObserver = MockMutationObserver as any;
}

vi.mock('geostyler-sld-parser', () =>
  import('./mocks/geostyler-sld-parser'),
);
vi.mock('geostyler-mapbox-parser', () =>
  import('./mocks/geostyler-mapbox-parser'),
);
vi.mock('geostyler-qgis-parser', () =>
  import('./mocks/geostyler-qgis-parser'),
);
vi.mock('geostyler-lyrx-parser', () =>
  import('./mocks/geostyler-lyrx-parser'),
);
vi.mock('geostyler-style', () => import('./mocks/geostyler-style'));

globalThis.global = globalThis;

if (typeof window !== 'undefined') {
  globalThis.Event = window.Event as typeof globalThis.Event;
  globalThis.CustomEvent = window.CustomEvent as typeof globalThis.CustomEvent;
}

if (typeof HTMLCanvasElement !== 'undefined') {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    writable: true,
    value: function getContext(_contextId: string) {
      // jsdom logs noisy "Not implemented" errors for canvas. In spec tests we
      // default to "no 2d context available" and let targeted tests override
      // this when they need a working canvas mock.
      return null;
    },
  });
}

// Catch known async leaks from test constructors that start fetch/timers
const knownLeaks = /Google Maps session request failed|getBounds is not a function/;
process.on('unhandledRejection', (reason: unknown) => {
  const msg = reason instanceof Error ? reason.message : String(reason);
  if (knownLeaks.test(msg)) return;
  throw reason;
});
