import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const vitestBin = resolve(process.cwd(), 'node_modules/.bin/vitest');
const vitestArgs = process.argv.slice(2);

function runVitest() {
  return spawnSync(vitestBin, vitestArgs, {
    encoding: 'utf8',
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

let result = runVitest();
replayOutput(result);

if (isColdBrowserCacheFailure(result)) {
  process.stderr.write(
    '\n[vitest-browser-retry] retrying once after cold browser dep optimization.\n',
  );
  result = runVitest();
  replayOutput(result);
}

process.exit(result.status ?? 1);
