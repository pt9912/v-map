import { vi } from 'vitest';
import {
  createLogger,
  error,
  getLogLevel,
  info,
  log,
  setLogLevel,
  setTransport,
  warn,
} from './logger';

describe('logger', () => {
  // Use the real ConsoleTransport throughout - spy on console to verify.
  // This covers ConsoleTransport source lines (96-127).

  beforeEach(() => {
    // Suppress console output but keep spies for assertions
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    setLogLevel('debug');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setLogLevel('debug');
  });

  it('persists and returns the current log level', () => {
    setLogLevel('warn');
    expect(getLogLevel()).toBe('warn');
  });

  it('logs debug messages through console.log', () => {
    setLogLevel('debug');
    log('test-debug');
    expect(console.log).toHaveBeenCalled();
  });

  it('logs info messages through console.log', () => {
    setLogLevel('info');
    info('test-info');
    expect(console.log).toHaveBeenCalled();
  });

  it('logs warn messages through console.warn (line 118)', () => {
    setLogLevel('debug');
    warn('test-warn');
    expect(console.warn).toHaveBeenCalled();
  });

  it('logs error messages through console.error (line 122)', () => {
    setLogLevel('debug');
    error('test-error');
    expect(console.error).toHaveBeenCalled();
  });

  it('logs namespaced warn through console.warn with prefix (line 117)', () => {
    setLogLevel('debug');
    const logger = createLogger('ns');
    logger.warn('w');
    expect(console.warn).toHaveBeenCalledWith('[ns]', expect.anything(), expect.anything());
  });

  it('logs namespaced error through console.error with prefix (line 121)', () => {
    setLogLevel('debug');
    const logger = createLogger('ns');
    logger.error('e');
    expect(console.error).toHaveBeenCalledWith('[ns]', expect.anything(), expect.anything());
  });

  it('logs namespaced debug through console.log with prefix (line 113)', () => {
    setLogLevel('debug');
    const logger = createLogger('ns');
    logger.debug('d');
    expect(console.log).toHaveBeenCalledWith('[ns]', expect.anything(), expect.anything());
  });

  it('logs namespaced info through console.log with prefix (line 113)', () => {
    setLogLevel('debug');
    const logger = createLogger('ns');
    logger.info('i');
    expect(console.log).toHaveBeenCalledWith('[ns]', expect.anything());
  });

  it('filters messages below the configured log level', () => {
    setLogLevel('warn');
    log('debug');
    info('info');
    expect(console.log).not.toHaveBeenCalled();

    warn('warn');
    expect(console.warn).toHaveBeenCalled();

    error('error');
    expect(console.error).toHaveBeenCalled();
  });

  it('can disable all logging', () => {
    setLogLevel('none');
    error('boom');
    warn('warn');
    log('debug');
    info('info');
    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('filters debug at info level', () => {
    setLogLevel('info');
    log('should-not-appear');
    expect(console.log).not.toHaveBeenCalled();
  });

  it('filters info/debug at error level', () => {
    setLogLevel('error');
    log('debug');
    info('info');
    warn('warn');
    error('error');
    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('createLogger exposes all four methods', () => {
    const logger = createLogger('ns');
    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e');
    expect(console.log).toHaveBeenCalledTimes(2); // debug + info
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('allows multiple arguments', () => {
    log('a', 'b', 3);
    expect(console.log).toHaveBeenCalled();
  });

  it('setLogLevel cycles through all levels', () => {
    const levels = ['none', 'error', 'warn', 'info', 'debug'] as const;
    for (const level of levels) {
      setLogLevel(level);
      expect(getLogLevel()).toBe(level);
    }
  });

  it('getLocalStorage returns null when localStorage is inaccessible (line 56)', () => {
    const desc = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() { throw new Error('blocked'); },
    });
    expect(() => setLogLevel('warn')).not.toThrow();
    expect(getLogLevel()).toBe('warn');
    if (desc) {
      Object.defineProperty(window, 'localStorage', desc);
    }
  });

  it('readPersistedLevel returns null for invalid stored level (lines 64-73)', () => {
    const LS_KEY = '@pt9912/v-map:logLevel';
    window.localStorage.setItem(LS_KEY, 'invalid-level');
    setLogLevel('info');
    expect(getLogLevel()).toBe('info');
    expect(window.localStorage.getItem(LS_KEY)).toBe('info');
    window.localStorage.removeItem(LS_KEY);
  });

  it('handles missing stack trace (line 105 false branch)', () => {
    const origStack = Object.getOwnPropertyDescriptor(Error.prototype, 'stack');
    Object.defineProperty(Error.prototype, 'stack', {
      configurable: true,
      get() { return 'Error\n  at line1'; },
    });

    warn('test-no-deep-stack');
    expect(console.warn).toHaveBeenCalled();

    if (origStack) {
      Object.defineProperty(Error.prototype, 'stack', origStack);
    }
  });

  it('info level skips trace logic (line 99 false branch)', () => {
    info('info-no-trace');
    expect(console.log).toHaveBeenCalled();
  });

  it('setTransport replaces the active transport', () => {
    const mockTransportSpy = vi.fn();
    setTransport({ log: mockTransportSpy as any });

    log('through-mock');
    expect(mockTransportSpy).toHaveBeenCalledWith('debug', ['through-mock'], undefined);
    expect(console.log).not.toHaveBeenCalledWith('through-mock');
  });
});

// Test module-level initialization branches via dynamic re-import
describe('logger module-level branches', () => {
  const LS_KEY = '@pt9912/v-map:logLevel';

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.removeItem(LS_KEY);
  });

  it('readPersistedLevel returns persisted "warn" level at module init (lines 64-73)', async () => {
    window.localStorage.setItem(LS_KEY, 'warn');
    vi.resetModules();
    const mod = await import('./logger');
    expect(mod.getLogLevel()).toBe('warn');
  });

  it('readPersistedLevel returns persisted "error" level at module init', async () => {
    window.localStorage.setItem(LS_KEY, 'error');
    vi.resetModules();
    const mod = await import('./logger');
    expect(mod.getLogLevel()).toBe('error');
  });

  it('readPersistedLevel returns persisted "none" level at module init', async () => {
    window.localStorage.setItem(LS_KEY, 'none');
    vi.resetModules();
    const mod = await import('./logger');
    expect(mod.getLogLevel()).toBe('none');
  });

  it('readPersistedLevel returns persisted "debug" level at module init', async () => {
    window.localStorage.setItem(LS_KEY, 'debug');
    vi.resetModules();
    const mod = await import('./logger');
    expect(mod.getLogLevel()).toBe('debug');
  });

  it('readPersistedLevel returns null for invalid stored level at module init', async () => {
    window.localStorage.setItem(LS_KEY, 'bogus');
    vi.resetModules();
    const mod = await import('./logger');
    // Falls back to default level, not 'bogus'
    expect(mod.getLogLevel()).not.toBe('bogus');
  });

  it('urlHasDebugFlag catch branch (line 35) when location.search throws', async () => {
    const origLocation = window.location;
    // @ts-ignore
    delete (window as any).location;
    (window as any).location = {
      get search() { throw new Error('no search'); },
    };

    vi.resetModules();
    const mod = await import('./logger');
    // Module should load without error
    expect(mod.getLogLevel).toBeDefined();

    (window as any).location = origLocation;
  });
});
