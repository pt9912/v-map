import { describe, it, expect } from 'vitest';
import { AsyncMutex } from './async-mutex';

describe('AsyncMutex', () => {
  it('runs a single task exclusively', async () => {
    const mutex = new AsyncMutex();
    const result = await mutex.runExclusive(() => 42);
    expect(result).toBe(42);
  });

  it('queues concurrent tasks and resolves them in order', async () => {
    const mutex = new AsyncMutex();
    const order: number[] = [];

    const p1 = mutex.runExclusive(async () => {
      await new Promise(r => setTimeout(r, 10));
      order.push(1);
      return 'first';
    });

    const p2 = mutex.runExclusive(async () => {
      order.push(2);
      return 'second';
    });

    const p3 = mutex.runExclusive(async () => {
      order.push(3);
      return 'third';
    });

    const results = await Promise.all([p1, p2, p3]);
    expect(results).toEqual(['first', 'second', 'third']);
    expect(order).toEqual([1, 2, 3]);
  });

  it('queues when locked (covers line 20 - enqueue branch)', async () => {
    const mutex = new AsyncMutex();
    let resolveFirst!: () => void;
    const firstBlocking = new Promise<void>(r => { resolveFirst = r; });

    // Start first task that blocks
    const p1 = mutex.runExclusive(() => firstBlocking);

    // This second call will hit line 20: the mutex is locked, so it enqueues
    const p2 = mutex.runExclusive(() => 'queued-result');

    // Release the first task
    resolveFirst();
    await p1;
    const result = await p2;
    expect(result).toBe('queued-result');
  });

  it('releases lock even when task throws', async () => {
    const mutex = new AsyncMutex();

    await expect(
      mutex.runExclusive(() => { throw new Error('boom'); }),
    ).rejects.toThrow('boom');

    // Mutex should be unlocked now; next task should run fine
    const result = await mutex.runExclusive(() => 'after-error');
    expect(result).toBe('after-error');
  });
});
