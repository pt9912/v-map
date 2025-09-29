export * from '@stencil/core/testing';
import { newE2EPage as _newE2EPage } from '@stencil/core/testing';

async function patchConsoleOnNewDocument(page: any) {
  await page.evaluateOnNewDocument(() => {
    const origError = console.error;
    console.error = (...args: any[]) => {
      const mapped = args.map(a => {
        if (a instanceof Error) return a.stack || a.message;
        try {
          return JSON.stringify(a);
        } catch {
          return String(a);
        }
      });
      origError(...mapped);
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
  });
}

export const newE2EPage: typeof _newE2EPage = (async (...args: any[]) => {
  const page = await _newE2EPage(...args);
  await patchConsoleOnNewDocument(page);

  // Seitenbasierte Fehlerfalle
  const { failOnConsole } = await import('./e2e-utils');
  failOnConsole(page as any, {
    ignore: [
      /useDefaultImportMap/i,
      /Failed to resolve module specifier "child_process"/i,
      /Failed to resolve module specifier "@loaders\.gl\//i,
      /Blocked script execution in 'about:blank'/i,
      /GPU stall due to ReadPixels/i,
      /No map visible because the map container's width or height are 0/i,
    ],
  });

  return page;
}) as any;
