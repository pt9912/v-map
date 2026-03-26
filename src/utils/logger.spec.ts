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
    transport = { log: transportSpy };
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
});
