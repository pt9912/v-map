import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const vitestBin = resolve(process.cwd(), 'node_modules/.bin/vitest');
const vitestArgs = process.argv.slice(2);
const vitestViteCacheDir =
  process.env.VITE_CACHE_DIR ||
  resolve(process.cwd(), 'node_modules/.vitest-cache', 'vite');

function sleep(ms) {
  return new Promise(resolveSleep => setTimeout(resolveSleep, ms));
}

function replayOutput(result) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

function runVitest({ attempt, streamOutput }) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(vitestBin, vitestArgs, {
      env: {
        ...process.env,
        VITE_CACHE_DIR: vitestViteCacheDir,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let lastActivityAt = Date.now();

    const heartbeat = setInterval(() => {
      if (Date.now() - lastActivityAt < 30_000) return;
      process.stderr.write(
        `\n[vitest-browser-retry] attempt ${attempt} still running...\n`,
      );
      lastActivityAt = Date.now();
    }, 30_000);

    child.stdout.on('data', chunk => {
      const text = String(chunk);
      stdout += text;
      lastActivityAt = Date.now();
      if (streamOutput) process.stdout.write(text);
    });

    child.stderr.on('data', chunk => {
      const text = String(chunk);
      stderr += text;
      lastActivityAt = Date.now();
      if (streamOutput) process.stderr.write(text);
    });

    child.on('error', error => {
      clearInterval(heartbeat);
      rejectRun(error);
    });

    child.on('close', status => {
      clearInterval(heartbeat);
      resolveRun({ status, stdout, stderr });
    });
  });
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

async function main() {
  const firstResult = await runVitest({ attempt: 1, streamOutput: false });

  if (!isColdBrowserCacheFailure(firstResult)) {
    replayOutput(firstResult);
    process.exit(firstResult.status ?? 1);
  }

  process.stderr.write(
    '\n[vitest-browser-retry] retrying once after cold browser dep optimization.\n',
  );
  await sleep(750);

  const secondResult = await runVitest({ attempt: 2, streamOutput: true });

  if (secondResult.status === 0) {
    process.exit(0);
  }

  replayOutput(firstResult);
  process.stderr.write(
    '\n[vitest-browser-retry] retry did not recover the browser cache cold-start failure.\n',
  );
  process.exit(secondResult.status ?? 1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
