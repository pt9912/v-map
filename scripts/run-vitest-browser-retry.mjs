import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const vitestBin = resolve(process.cwd(), 'node_modules/.bin/vitest');
const vitestArgs = process.argv.slice(2);
const vitestViteCacheDir =
  process.env.VITE_CACHE_DIR ||
  resolve(process.cwd(), 'node_modules/.vitest-cache', 'vite');

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function runVitest() {
  return spawnSync(vitestBin, vitestArgs, {
    encoding: 'utf8',
    env: {
      ...process.env,
      VITE_CACHE_DIR: vitestViteCacheDir,
    },
    maxBuffer: 10 * 1024 * 1024,
    stdio: 'pipe',
  });
}

function replayOutput(result) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

function isColdBrowserCacheFailure(result) {
  if (result.status === 0) return false;

  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;

  return [
    'Vite unexpectedly reloaded a test',
    'optimized dependencies changed. reloading',
    'Failed to fetch dynamically imported module',
    "Cannot read properties of undefined (reading 'config')",
  ].some(marker => output.includes(marker));
}

const firstResult = runVitest();

if (!isColdBrowserCacheFailure(firstResult)) {
  replayOutput(firstResult);
  process.exit(firstResult.status ?? 1);
}

process.stderr.write(
  '\n[vitest-browser-retry] retrying once after cold browser dep optimization.\n',
);
sleep(750);

const secondResult = runVitest();

if (secondResult.status === 0) {
  replayOutput(secondResult);
  process.exit(0);
}

replayOutput(firstResult);
process.stderr.write(
  '\n[vitest-browser-retry] retry did not recover the browser cache cold-start failure.\n',
);
replayOutput(secondResult);
process.exit(secondResult.status ?? 1);
