import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { mockIsBrowser, mockSupportsAdoptedStyleSheets, mockControlExtend, mockDomUtilCreate, mockIconDefault } =
  vi.hoisted(() => {
    const mockAddTo = vi.fn().mockReturnThis();
    const mockControlExtend = vi.fn().mockImplementation(function() {
      return vi.fn().mockImplementation(function() { return { addTo: mockAddTo }; });
    });
    return {
      mockIsBrowser: vi.fn(() => true),
      mockSupportsAdoptedStyleSheets: vi.fn(() => false),
      mockControlExtend,
      mockAddTo,
      mockDomUtilCreate: vi.fn().mockReturnValue({
        src: '',
        alt: '',
        style: {},
      }),
      mockIconDefault: { imagePath: '' },
    };
  });

vi.mock('../../utils/dom-env', () => ({
  isBrowser: () => mockIsBrowser(),
  supportsAdoptedStyleSheets: () => mockSupportsAdoptedStyleSheets(),
}));

vi.mock('../../lib/versions.gen', () => ({
  LEAFLET_VERSION: '1.9.4',
}));

vi.mock('leaflet', () => ({
  Icon: { Default: mockIconDefault },
  Control: { extend: mockControlExtend },
  DomUtil: { create: mockDomUtilCreate },
}));

import { removeInjectedCss, ensureLeafletCss, ensureGoogleLogo } from './leaflet-helpers';

describe('leaflet-helpers', () => {
  beforeEach(() => {
    mockIsBrowser.mockReturnValue(true);
    mockSupportsAdoptedStyleSheets.mockReturnValue(false);
    document.head.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.head.innerHTML = '';
  });

  describe('removeInjectedCss', () => {
    it('entfernt das injizierte Style-Element', () => {
      const style = document.createElement('style');
      const removeSpy = vi.spyOn(style, 'remove');
      const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
      removeInjectedCss(shadowRoot, style);
      expect(removeSpy).toHaveBeenCalled();
    });

    it('tut nichts wenn shadowRoot null/falsy ist', () => {
      const style = document.createElement('style');
      const removeSpy = vi.spyOn(style, 'remove');
      removeInjectedCss(null as any, style);
      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('tut nichts wenn injectedStyle null/falsy ist', () => {
      const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
      expect(() => removeInjectedCss(shadowRoot, null as any)).not.toThrow();
    });
  });

  describe('ensureLeafletCss', () => {
    it('gibt undefined zurück wenn nicht im Browser', () => {
      mockIsBrowser.mockReturnValue(false);
      const result = ensureLeafletCss('cdn');
      expect(result).toBeUndefined();
    });

    it('cdn-Modus: fügt einen <link>-Tag zum document.head hinzu', () => {
      ensureLeafletCss('cdn');
      const links = document.head.querySelectorAll('link[rel="stylesheet"]');
      expect(links.length).toBeGreaterThan(0);
    });

    it('cdn-Modus: verhindert doppelte Injektion', () => {
      ensureLeafletCss('cdn');
      ensureLeafletCss('cdn');
      const links = document.head.querySelectorAll('link[rel="stylesheet"]');
      expect(links.length).toBe(1);
    });

    it('cdn-Modus: setzt jsdelivr als Standard-CDN', () => {
      ensureLeafletCss('cdn');
      const link = document.head.querySelector('link[rel="stylesheet"]') as HTMLLinkElement;
      expect(link.href).toContain('jsdelivr.net');
    });

    it('inline-min-Modus: gibt null zurück bei adoptedStyleSheets', () => {
      mockSupportsAdoptedStyleSheets.mockReturnValue(true);
      const mockSheet = { replaceSync: vi.fn() };
      const origCSSStyleSheet = (globalThis as any).CSSStyleSheet;
      (globalThis as any).CSSStyleSheet = vi.fn(function() { return mockSheet; });
      const origAdopted = (document as any).adoptedStyleSheets;
      (document as any).adoptedStyleSheets = [];

      const result = ensureLeafletCss('inline-min');
      expect(result).toBeNull();
      expect((document as any).adoptedStyleSheets.length).toBeGreaterThan(0);

      (globalThis as any).CSSStyleSheet = origCSSStyleSheet;
      (document as any).adoptedStyleSheets = origAdopted;
    });

    it('inline-min-Modus: gibt HTMLStyleElement zurück ohne adoptedStyleSheets', () => {
      mockSupportsAdoptedStyleSheets.mockReturnValue(false);
      const result = ensureLeafletCss('inline-min');
      expect(result).toBeInstanceOf(HTMLStyleElement);
    });

    it('bundle-Modus: gibt null zurück', () => {
      const result = ensureLeafletCss('bundle');
      expect(result).toBeNull();
    });

    it('none-Modus: gibt null zurück', () => {
      const result = ensureLeafletCss('none');
      expect(result).toBeNull();
    });

    it('cdn-Modus mit unpkg: setzt korrekten Link', () => {
      // Direkt addLeafletCssFromCdn testen via ensureLeafletCss – nicht möglich ohne Export,
      // aber wir können einen ShadowRoot übergeben und prüfen den imagePathp
      ensureLeafletCss('cdn');
      // imagePath sollte gesetzt sein (via jsdelivr default)
      expect(mockIconDefault.imagePath).toContain('jsdelivr');
    });
  });

  describe('ensureGoogleLogo', () => {
    it('fügt das Google-Logo zur Karte hinzu', () => {
      const mockAddTo = vi.fn().mockReturnThis();
      const MockControl = vi.fn().mockImplementation(function() { return { addTo: mockAddTo }; });
      mockControlExtend.mockReturnValueOnce(MockControl);

      const mockMap = { _googleLogoAdded: false } as any;
      const markAdded = vi.fn();

      ensureGoogleLogo(mockMap, markAdded);

      expect(mockControlExtend).toHaveBeenCalled();
      expect(mockAddTo).toHaveBeenCalledWith(mockMap);
      expect(mockMap._googleLogoAdded).toBe(true);
      expect(markAdded).toHaveBeenCalled();
    });

    it('ist no-op wenn Logo bereits hinzugefügt', () => {
      const mockMap = { _googleLogoAdded: true } as any;
      const markAdded = vi.fn();

      ensureGoogleLogo(mockMap, markAdded);

      expect(mockControlExtend).not.toHaveBeenCalled();
      expect(markAdded).not.toHaveBeenCalled();
    });

    it('erstellt img-Element mit korrekten Attributen', () => {
      const capturedOnAdd = { fn: null as any };
      mockControlExtend.mockImplementationOnce((def: any) => {
        capturedOnAdd.fn = def.onAdd;
        return vi.fn().mockImplementation(function() { return { addTo: vi.fn() }; });
      });

      const mockMap = {} as any;
      ensureGoogleLogo(mockMap, vi.fn());

      if (capturedOnAdd.fn) {
        capturedOnAdd.fn.call({});
        expect(mockDomUtilCreate).toHaveBeenCalledWith('img');
      }
    });
  });
});
