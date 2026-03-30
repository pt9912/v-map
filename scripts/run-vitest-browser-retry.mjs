import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const vitestBin = resolve(process.cwd(), 'node_modules/.bin/vitest');
const vitestArgs = process.argv.slice(2);
const vitestViteCacheDir =
  process.env.VITE_CACHE_DIR ||
  resolve(process.cwd(), 'node_modules/.vitest-cache', 'vite');
const vitestInactivityTimeoutMs = Number.parseInt(
  process.env.VITEST_BROWSER_INACTIVITY_TIMEOUT_MS ?? '180000',
  10,
);
const vitestKillGraceMs = 5_000;

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
    let inactivityTimedOut = false;
    let killTimer;

    let lastHeartbeatAt = 0;
    const heartbeat = setInterval(() => {
      const now = Date.now();
      if (now - lastHeartbeatAt < 30_000) return;
      lastHeartbeatAt = now;
      process.stderr.write(
        `\n[vitest-browser-retry] attempt ${attempt} still running (no output for ${Math.round((now - lastActivityAt) / 1000)}s)...\n`,
      );
    }, 30_000);

    const inactivityWatchdog = setInterval(() => {
      if (!Number.isFinite(vitestInactivityTimeoutMs)) return;
      if (vitestInactivityTimeoutMs <= 0) return;
      if (Date.now() - lastActivityAt < vitestInactivityTimeoutMs) return;

      inactivityTimedOut = true;
      process.stderr.write(
        `\n[vitest-browser-retry] attempt ${attempt} exceeded ${vitestInactivityTimeoutMs}ms without output; terminating and retrying.\n`,
      );

      clearInterval(inactivityWatchdog);
      child.kill('SIGTERM');
      killTimer = setTimeout(() => {
        if (child.exitCode === null && child.signalCode === null) {
          child.kill('SIGKILL');
        }
      }, vitestKillGraceMs);
    }, 1_000);

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
      clearInterval(inactivityWatchdog);
      clearTimeout(killTimer);
      rejectRun(error);
    });

    child.on('close', (status, signal) => {
      clearInterval(heartbeat);
      clearInterval(inactivityWatchdog);
      clearTimeout(killTimer);
      resolveRun({
        status,
        signal,
        stdout,
        stderr,
        inactivityTimedOut,
      });
    });
  });
}

function isRetryableFailure(result) {
  if (result.status === 0 && !result.inactivityTimedOut) return false;

  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;

  if (result.inactivityTimedOut) return true;

  return [
    'Vite unexpectedly reloaded a test',
    'optimized dependencies changed. reloading',
    'Failed to fetch dynamically imported module',
    "Cannot read properties of undefined (reading 'config')",
  ].some(marker => output.includes(marker));
}

async function main() {
  const firstResult = await runVitest({ attempt: 1, streamOutput: false });

  if (!isRetryableFailure(firstResult)) {
    replayOutput(firstResult);
    process.exit(firstResult.status ?? 1);
  }

  process.stderr.write(firstResult.stderr ?? '');
  if (firstResult.inactivityTimedOut) {
    process.stderr.write(
      '\n[vitest-browser-retry] retrying once after an inactivity timeout during browser test startup.\n',
    );
  } else {
    process.stderr.write(
      '\n[vitest-browser-retry] retrying once after cold browser dep optimization.\n',
    );
  }
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
