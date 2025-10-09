//import '@stencil/core/testing';

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

// src/testing/setupTests.jest.ts
// Automatische Mocks für alle geostyler-Parser
jest.mock('geostyler-sld-parser', () =>
  require('./mocks/geostyler-sld-parser'),
);
jest.mock('geostyler-mapbox-parser', () =>
  require('./mocks/geostyler-mapbox-parser'),
);
jest.mock('geostyler-qgis-parser', () =>
  require('./mocks/geostyler-qgis-parser'),
);
jest.mock('geostyler-lyrx-parser', () =>
  require('./mocks/geostyler-lyrx-parser'),
);
jest.mock('geostyler-style', () => require('./mocks/geostyler-style'));

// Polyfill für Node.js-Module im Browser
globalThis.global = globalThis;
