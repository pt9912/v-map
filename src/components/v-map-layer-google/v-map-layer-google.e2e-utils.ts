import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

type RenderFn = (html: string, opts?: { wait?: boolean }) => Promise<void>;

export interface GoogleE2ECtx {
  page: E2EPage;
  render: RenderFn;
}

export const defaultFlavour = 'leaflet' as const;

export async function useGoogleMapPage(
  run: (ctx: GoogleE2ECtx) => Promise<void>,
): Promise<void> {
  const page = await newE2EPage();

  await page.evaluateOnNewDocument(() => {
    (window as any).google = {
      maps: {
        Map: class MockMap {
          element: HTMLElement;
          options: any;
          constructor(element: any, options: any) {
            this.element = element;
            this.options = options;
          }
          setCenter() {}
          setZoom() {}
          setMapTypeId() {}
        },
        event: {
          addListenerOnce: (
            _map: any,
            _event: string,
            callback: Function,
          ) => {
            setTimeout(callback, 100);
          },
        },
        MapTypeId: {
          ROADMAP: 'roadmap',
          SATELLITE: 'satellite',
          TERRAIN: 'terrain',
          HYBRID: 'hybrid',
        },
      },
    };

    (window as any).loadGoogleMapsApi = () => Promise.resolve();
    (window as any).__mockGoogleMapsApi = () => Promise.resolve();

    const originalFetch = window.fetch.bind(window);
    (window as any).__originalGoogleFetch = originalFetch;

    const mockJsonResponse = (body: any) =>
      Promise.resolve(
        new Response(JSON.stringify(body), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input?.toString() ?? '';

      if (url.includes('tile.googleapis.com/v1/createSession')) {
        const nowSeconds = Math.floor(Date.now() / 1000);
        return mockJsonResponse({
          session: 'mock-session-token',
          expiry: String(nowSeconds + 60 * 60),
          tileWidth: 512,
          tileHeight: 512,
          imageFormat: 'png',
        });
      }

      if (url.includes('tile.googleapis.com/tile/v1/viewport')) {
        return mockJsonResponse({
          copyright: '© Google',
        });
      }

      if (url.includes('tile.googleapis.com/v1/2dtiles')) {
        return mockJsonResponse({});
      }

      return originalFetch(input as any, init);
    };

    const descriptor = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'src',
    );
    (window as any).__originalImageSrcDescriptor = descriptor;

    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: true,
      enumerable: true,
      get() {
        if (descriptor?.get) {
          return descriptor.get.call(this);
        }
        return this.getAttribute('src');
      },
      set(value: string) {
        if (descriptor?.set) {
          descriptor.set.call(this, value);
        } else {
          this.setAttribute('src', value);
        }
        setTimeout(() => {
          this.dispatchEvent(new Event('load'));
        }, 0);
      },
    });
  });

  await page.setContent('<div id="test-root"></div>');

  const render: RenderFn = async (html, opts) => {
    await page.evaluate(content => {
      const root = document.getElementById('test-root');
      if (root) {
        root.innerHTML = content;
      }
    }, html);
    if (opts?.wait === false) return;
    await page.waitForChanges();
  };

  try {
    await run({ page, render });
  } finally {
    try {
      await render('', { wait: false });
    } catch {
      // ignore cleanup issue
    }
    try {
      await page.evaluate(() => {
        if ((window as any).__originalGoogleFetch) {
          window.fetch = (window as any).__originalGoogleFetch;
          delete (window as any).__originalGoogleFetch;
        }
        const descriptor = (window as any).__originalImageSrcDescriptor;
        if (descriptor) {
          Object.defineProperty(HTMLImageElement.prototype, 'src', descriptor);
          delete (window as any).__originalImageSrcDescriptor;
        }
      });
    } catch {
      // ignore restore errors
    }
    await page.close();
  }
}
