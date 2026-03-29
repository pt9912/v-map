import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@stencil/core', () => ({
  Build: { isDev: true },
}));

async function loadLogger() {
  vi.resetModules();
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
});
