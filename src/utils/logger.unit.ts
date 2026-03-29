import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type LoggerLoadOptions = {
  isDev?: boolean;
  localStorage?: Storage;
  locationSearch?: string;
};

function createStorage(seed: Record<string, string> = {}): Storage {
  const state = new Map(Object.entries(seed));

  return {
    getItem: vi.fn((key: string) => state.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      state.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      state.delete(key);
    }),
    clear: vi.fn(() => {
      state.clear();
    }),
    key: vi.fn((index: number) => Array.from(state.keys())[index] ?? null),
    get length() {
      return state.size;
    },
  } as unknown as Storage;
}

async function loadLogger(options: LoggerLoadOptions = {}) {
  vi.resetModules();
  vi.doMock('@stencil/core', () => ({
    Build: { isDev: options.isDev ?? true },
  }));

  if (options.localStorage) {
    vi.stubGlobal('window', { localStorage: options.localStorage });
    vi.stubGlobal('localStorage', options.localStorage);
  } else {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('localStorage', undefined);
  }

  vi.stubGlobal('location', {
    search: options.locationSearch ?? '',
  });

  return import('./logger');
}

describe('logger unit', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('updates and returns the active log level', async () => {
    const logger = await loadLogger();

    logger.setLogLevel('warn');

    expect(logger.getLogLevel()).toBe('warn');
  });

  it('filters messages below the configured level', async () => {
    const logger = await loadLogger();

    logger.setLogLevel('error');
    logger.log('debug');
    logger.info('info');
    logger.warn('warn');
    logger.error('error');

    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('routes namespaced logs through a custom transport', async () => {
    const logger = await loadLogger();
    const transportLog = vi.fn();

    logger.setTransport({ log: transportLog });
    logger.setLogLevel('debug');

    logger.createLogger('unit').warn('hello', 123);

    expect(transportLog).toHaveBeenCalledWith(
      'warn',
      ['hello', 123],
      'unit',
    );
  });

  it('reads a persisted log level during module initialization', async () => {
    const storage = createStorage({ '@pt9912/v-map:logLevel': 'warn' });

    const logger = await loadLogger({ localStorage: storage });

    expect(logger.getLogLevel()).toBe('warn');
  });

  it('ignores invalid persisted log levels and falls back to the default', async () => {
    const storage = createStorage({ '@pt9912/v-map:logLevel': 'verbose' });

    const logger = await loadLogger({ localStorage: storage });

    expect(logger.getLogLevel()).toBe('debug');
  });

  it('persists log level changes to localStorage when available', async () => {
    const storage = createStorage();
    const logger = await loadLogger({ localStorage: storage });

    logger.setLogLevel('info');

    expect(storage.setItem).toHaveBeenCalledWith(
      '@pt9912/v-map:logLevel',
      'info',
    );
  });

  it('exposes logger helpers on the global object when devtools exposure is enabled', async () => {
    const logger = await loadLogger({ isDev: false, locationSearch: '?vmapDebug' });

    expect(globalThis.getLogLevel).toBeTypeOf('function');
    expect(globalThis.setLogLevel).toBeTypeOf('function');
    expect(globalThis.warn).toBeTypeOf('function');

    globalThis.setLogLevel?.('warn');

    expect(logger.getLogLevel()).toBe('warn');
    expect(globalThis.getLogLevel?.()).toBe('warn');
  });
});
