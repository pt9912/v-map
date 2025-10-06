export * from '@stencil/core/testing';
import { newE2EPage as _newE2EPage } from '@stencil/core/testing';

// Global list of additional errors to ignore
const additionalIgnoredErrors: string[] = [];

async function patchConsoleOnNewDocument(page: any) {
  await page.evaluateOnNewDocument(() => {
    const origError = console.error;
    const origWarn = console.warn;
    const origInfo = console.info;
    const origLog = console.log;

    const stringifyArg = (arg: any) => {
      if (arg instanceof Error) {
        return arg.stack || arg.message;
      }
      try {
        if (typeof arg === 'string') {
          return arg;
        }
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    };

    console.error = (...args: any[]) => {
      origError('[browser:error]', ...args.map(stringifyArg));
    };
    console.warn = (...args: any[]) => {
      origWarn('[browser:warn]', ...args.map(stringifyArg));
    };
    console.info = (...args: any[]) => {
      origInfo('[browser:info]', ...args.map(stringifyArg));
    };
    console.log = (...args: any[]) => {
      origLog('[browser:log]', ...args.map(stringifyArg));
    };

    window.addEventListener('error', e => {
      const err = (e as ErrorEvent).error;
      console.error('window.error:', err?.stack || e.message);
    });
    window.addEventListener('unhandledrejection', (e: any) => {
      const r = e?.reason;
      console.error(
        'unhandledrejection:',
        (r && (r.stack || r.message)) || String(r),
      );
    });

    try {
      const seenDefines = new Set<string>();
      const seenMissing = new Set<string>();
      const origDefine = customElements.define.bind(customElements);
      const origGet = customElements.get.bind(customElements);

      customElements.define = (name, constructor, options) => {
        seenDefines.add(name);
        console.info(`[custom-elements#define] ${name}`);
        return origDefine(name, constructor, options);
      };

      customElements.get = name => {
        const ctor = origGet(name);
        if (!ctor && !seenMissing.has(name)) {
          seenMissing.add(name);
          console.warn(`[custom-elements#get-miss] ${name}`);
        } else if (ctor && !seenDefines.has(name)) {
          console.info(`[custom-elements#get-hit] ${name}`);
        }
        return ctor;
      };
    } catch (err) {
      console.warn('Failed to patch customElements logging', err);
    }

    document.addEventListener('readystatechange', () => {
      console.info(`[document.readyState] ${document.readyState}`);
    });
    window.addEventListener('DOMContentLoaded', () => {
      console.info('[lifecycle] DOMContentLoaded');
    });
    window.addEventListener('load', () => {
      console.info('[lifecycle] load');
    });
  });
}

export const newE2EPage: typeof _newE2EPage & {
  setIgnoreError: (errorPattern: string) => void;
} = (async (...args: any[]) => {
  const page = await _newE2EPage(...args);
  await patchConsoleOnNewDocument(page);

  // Seitenbasierte Fehlerfalle
  const { failOnConsole } = await import('./e2e-utils');

  // Build the full ignore list by combining default and additional errors
  const defaultIgnore = [
    /useDefaultImportMap/i,
    /Failed to resolve module specifier "child_process"/i,
    /Failed to resolve module specifier "@loaders\.gl\//i,
    /Blocked script execution in 'about:blank'/i,
    /GPU stall due to ReadPixels/i,
    /No map visible because the map container's width or height are 0/i,
    /\[custom-elements#get-miss]/i,
  ];

  const additionalIgnore = additionalIgnoredErrors.map(pattern => new RegExp(pattern, 'i'));

  failOnConsole(page as any, {
    ignore: [...defaultIgnore, ...additionalIgnore],
  });

  // Netzwerkzugriffe für Debug-Zwecke protokollieren, um auffällige Requests (z. B. Google Maps) zu erkennen.
  page.on('request', req => {
    const url = req.url();
    if (/^https:\/\/maps\.(googleapis|gstatic)\.com\//.test(url)) {
      console.info(`[e2e] request ${url}`);
    }
  });
  page.on('requestfailed', req => {
    console.warn(`[e2e] request failed ${req.url()} :: ${req.failure()?.errorText}`);
  });

  return page;
}) as any;

/**
 * Add an error pattern to the global ignore list for all E2E tests.
 * This should be called before creating a new E2E page.
 *
 * @param errorPattern - String pattern to match against error messages (case-insensitive)
 */
newE2EPage.setIgnoreError = (errorPattern: string) => {
  if (!additionalIgnoredErrors.includes(errorPattern)) {
    additionalIgnoredErrors.push(errorPattern);
  }
};
