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
  type LogTransport,
} from './logger';

describe('logger', () => {
  let transport: LogTransport;
  let transportSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    transportSpy = vi.fn();
    transport = { log: transportSpy as any };
    setTransport(transport);
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

  it('logs namespaced messages through createLogger', () => {
    const logger = createLogger('layer');

    logger.info('ready', { ok: true });

    expect(transportSpy).toHaveBeenCalledWith(
      'info',
      ['ready', { ok: true }],
      'layer',
    );
  });

  it('filters messages below the configured log level', () => {
    setLogLevel('warn');

    log('debug');
    info('info');
    warn('warn');
    error('error');

    expect(transportSpy).toHaveBeenNthCalledWith(1, 'warn', ['warn'], undefined);
    expect(transportSpy).toHaveBeenNthCalledWith(2, 'error', ['error'], undefined);
    expect(transportSpy).toHaveBeenCalledTimes(2);
  });

  it('can disable all logging', () => {
    setLogLevel('none');

    error('boom');
    warn('warn');

    expect(transportSpy).not.toHaveBeenCalled();
  });

  it('logs debug messages at debug level', () => {
    setLogLevel('debug');

    log('test-debug');

    expect(transportSpy).toHaveBeenCalledWith('debug', ['test-debug'], undefined);
  });

  it('logs info messages at info level', () => {
    setLogLevel('info');

    info('test-info');

    expect(transportSpy).toHaveBeenCalledWith('info', ['test-info'], undefined);
  });

  it('filters debug at info level', () => {
    setLogLevel('info');

    log('should-not-appear');

    expect(transportSpy).not.toHaveBeenCalled();
  });

  it('filters info/debug at error level', () => {
    setLogLevel('error');

    log('debug');
    info('info');
    warn('warn');
    error('error');

    expect(transportSpy).toHaveBeenCalledTimes(1);
    expect(transportSpy).toHaveBeenCalledWith('error', ['error'], undefined);
  });

  it('createLogger exposes all four methods', () => {
    const logger = createLogger('ns');

    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e');

    expect(transportSpy).toHaveBeenCalledWith('debug', ['d'], 'ns');
    expect(transportSpy).toHaveBeenCalledWith('info', ['i'], 'ns');
    expect(transportSpy).toHaveBeenCalledWith('warn', ['w'], 'ns');
    expect(transportSpy).toHaveBeenCalledWith('error', ['e'], 'ns');
    expect(transportSpy).toHaveBeenCalledTimes(4);
  });

  it('allows multiple arguments', () => {
    log('a', 'b', 3);

    expect(transportSpy).toHaveBeenCalledWith('debug', ['a', 'b', 3], undefined);
  });

  it('setLogLevel cycles through all levels', () => {
    const levels = ['none', 'error', 'warn', 'info', 'debug'] as const;
    for (const level of levels) {
      setLogLevel(level);
      expect(getLogLevel()).toBe(level);
    }
  });
});
