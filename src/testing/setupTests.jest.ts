jest.mock('leaflet.gridlayer.googlemutant', () => ({}));

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
