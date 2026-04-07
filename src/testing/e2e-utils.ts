import type { E2EPage } from '@stencil/core/testing';

function anyToStringSafe(v: unknown): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (typeof o.stack === 'string') return o.stack;
    if (typeof o.message === 'string') return o.message;
  }
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export function failOnConsole(page: E2EPage, opts?: { ignore?: RegExp[] }) {
  const ignore = opts?.ignore ?? [];

  page.on('console', async msg => {
    // Hole Location, wenn verfügbar (Puppeteer hat location())
    const loc =
      typeof (msg as any).location === 'function'
        ? (msg as any).location()
        : undefined;

    // WICHTIG: JSHandles im Browser auswerten, um Error.stack zu bekommen
    const argVals = await Promise.all(
      msg.args().map(a =>
        a
          .evaluate((v: any) => {
            if (v instanceof Error) return v.stack || v.message || String(v);
            try {
              return JSON.stringify(v);
            } catch {
              return String(v);
            }
          })
          .catch(() => undefined as unknown),
      ),
    );

    const parts = [
      msg.text(), // oft schon "Error: …"
      ...argVals.map(anyToStringSafe), // sauber extrahiert
      loc ? `${loc.url}:${loc.lineNumber}:${loc.columnNumber}` : '',
    ].filter(Boolean);

    const text = parts.join('\n');

    const prefix = `[browser:${msg.type()}]`;
    const line = `${prefix} ${text}\n`;

    const shouldIgnore = ignore.some(rx => rx.test(text));

    if (!shouldIgnore) {
      if (msg.type() === 'error') {
        process.stderr.write(line);
      } else if (msg.type() === 'warn') {
        process.stdout.write(line);
      }
    }

    if (msg.type() === 'error') {
      if (shouldIgnore) return;
      throw new Error(`Console error in browser:\n${text}`);
    }
  });

  page.on('pageerror', err => {
    const text = anyToStringSafe(err);
    console.error(`[browser:pageerror] ${text}`);
    if (ignore.some(rx => rx.test(text))) return;
    throw new Error(`Unhandled page error:\n${text}`);
  });
}
