import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../lib/versions.gen', () => ({
  OL_VERSION: '10.8.0',
}));

import { injectOlCss } from './openlayers-helper';

describe('openlayers-helper', () => {
  describe('injectOlCss', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.restoreAllMocks();
    });

    it('should return immediately when shadowRoot is undefined', async () => {
      await injectOlCss(undefined);
      // No error thrown; nothing to verify further
    });

    it('should not inject CSS twice if style already present', async () => {
      const mockShadowRoot = {
        querySelector: vi.fn().mockReturnValue(document.createElement('style')),
      } as unknown as ShadowRoot;

      await injectOlCss(mockShadowRoot);

      expect(mockShadowRoot.querySelector).toHaveBeenCalledWith('style[data-id="ol-css-sheet"]');
    });

    it('should fetch the CSS from the CDN with the correct version', async () => {
      const mockFetchResponse = {
        text: vi.fn().mockResolvedValue('body { margin: 0; }'),
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockFetchResponse as any);

      vi.spyOn(globalThis, 'CSSStyleSheet' as any).mockReturnValue(undefined);

      const mockShadowRoot = {
        querySelector: vi.fn().mockReturnValue(null),
        adoptedStyleSheets: [],
        appendChild: vi.fn(),
      } as unknown as ShadowRoot;

      // Simulate environment without adoptedStyleSheets support
      const originalPrototype = Object.getOwnPropertyDescriptor(Document.prototype, 'adoptedStyleSheets');
      if ('adoptedStyleSheets' in Document.prototype) {
        // If supported, the adoptedStyleSheets path runs
        // Use a CSSStyleSheet mock
        const mockSheetInstance = { replace: vi.fn().mockResolvedValue(undefined) };
        vi.spyOn(globalThis, 'CSSStyleSheet' as any).mockImplementation(function () {
          return mockSheetInstance;
        } as any);

        await injectOlCss(mockShadowRoot);

        expect(fetch).toHaveBeenCalledWith('https://cdn.jsdelivr.net/npm/ol@10.8.0/ol.css');
        expect(mockFetchResponse.text).toHaveBeenCalled();
      } else {
        // Fallback path
        await injectOlCss(mockShadowRoot);

        expect(fetch).toHaveBeenCalledWith('https://cdn.jsdelivr.net/npm/ol@10.8.0/ol.css');
        expect(mockShadowRoot.appendChild).toHaveBeenCalled();
      }

      // Restore
      if (originalPrototype) {
        Object.defineProperty(Document.prototype, 'adoptedStyleSheets', originalPrototype);
      }
    });

    it('should use adoptedStyleSheets when supported (lines 14-16)', async () => {
      const mockFetchResponse = {
        text: vi.fn().mockResolvedValue('.ol-map { width: 100%; }'),
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockFetchResponse as any);

      // Ensure adoptedStyleSheets is in Document.prototype
      const savedDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'adoptedStyleSheets');
      if (!savedDescriptor) {
        Object.defineProperty(Document.prototype, 'adoptedStyleSheets', {
          configurable: true,
          value: [],
          writable: true,
        });
      }

      const replaceFn = vi.fn().mockResolvedValue(undefined);
      const origCSS = globalThis.CSSStyleSheet;
      globalThis.CSSStyleSheet = function () {
        return { replace: replaceFn, replaceSync: vi.fn() };
      } as any;

      const mockShadowRoot = {
        querySelector: vi.fn().mockReturnValue(null),
        adoptedStyleSheets: [] as any[],
        appendChild: vi.fn(),
      } as unknown as ShadowRoot;

      await injectOlCss(mockShadowRoot);

      expect(fetch).toHaveBeenCalledWith('https://cdn.jsdelivr.net/npm/ol@10.8.0/ol.css');
      expect(replaceFn).toHaveBeenCalledWith('.ol-map { width: 100%; }');
      expect(mockShadowRoot.adoptedStyleSheets.length).toBe(1);
      // appendChild should NOT have been called in the adoptedStyleSheets path
      expect(mockShadowRoot.appendChild).not.toHaveBeenCalled();

      // Restore
      globalThis.CSSStyleSheet = origCSS;
      if (!savedDescriptor) {
        delete (Document.prototype as any).adoptedStyleSheets;
      } else {
        Object.defineProperty(Document.prototype, 'adoptedStyleSheets', savedDescriptor);
      }
    });

    it('should use fallback style element when adoptedStyleSheets not supported', async () => {
      const mockFetchResponse = {
        text: vi.fn().mockResolvedValue('.ol-map { width: 100%; }'),
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockFetchResponse as any);

      // Temporarily remove adoptedStyleSheets from Document.prototype
      const savedDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'adoptedStyleSheets');
      if (savedDescriptor) {
        delete (Document.prototype as any).adoptedStyleSheets;
      }

      const appendedElements: HTMLElement[] = [];
      const mockShadowRoot = {
        querySelector: vi.fn().mockReturnValue(null),
        appendChild: vi.fn().mockImplementation((el: HTMLElement) => {
          appendedElements.push(el);
        }),
      } as unknown as ShadowRoot;

      await injectOlCss(mockShadowRoot);

      expect(mockShadowRoot.appendChild).toHaveBeenCalled();
      expect(appendedElements.length).toBe(1);
      const style = appendedElements[0] as HTMLStyleElement;
      expect(style.tagName).toBe('STYLE');
      expect(style.getAttribute('data-id')).toBe('ol-css-sheet');
      expect(style.textContent).toBe('.ol-map { width: 100%; }');

      // Restore adoptedStyleSheets
      if (savedDescriptor) {
        Object.defineProperty(Document.prototype, 'adoptedStyleSheets', savedDescriptor);
      }
    });
  });
});
