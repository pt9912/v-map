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
