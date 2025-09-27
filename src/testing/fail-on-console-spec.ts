// src/testing/fail-on-console-spec.ts
const origError = console.error;
const origWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const text = args.map(safeToString).join('\n');
    // Optional: Whitelist eigener Dev-Logs:
    if (/useDefaultImportMap/i.test(text)) return;
    throw new Error('console.error in test:\n' + text);
  };
  // Optional:
  // console.warn = (...args) => { throw new Error('console.warn: ' + args.join(' ')); };
});

afterAll(() => {
  console.error = origError;
  console.warn = origWarn;
});

function safeToString(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v instanceof Error) return v.stack || v.message;
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
