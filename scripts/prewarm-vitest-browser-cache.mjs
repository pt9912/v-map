import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const vitestCacheRoot = resolve(process.cwd(), 'node_modules/.vitest-cache', 'vitest');

function getProjectCacheDir(projectName) {
  const projectHash = createHash('sha1').update(projectName).digest('hex');
  return resolve(vitestCacheRoot, projectHash);
}

function optimizeCacheDir(cacheDir) {
  const viteBin = resolve(process.cwd(), 'node_modules/.bin/vite');
  const result = spawnSync(viteBin, ['optimize', '--force'], {
    env: {
      ...process.env,
      VITE_CACHE_DIR: cacheDir,
    },
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`vite optimize failed with exit code ${result.status ?? 1}`);
  }
}

export function prewarmVitestBrowserCache() {
  // Vitest's browser runner can address two cache namespaces depending on how
  // the browser project is resolved internally. Warm both to avoid late
  // dependency re-optimization during the actual test run.
  for (const projectName of ['', 'browser']) {
    optimizeCacheDir(getProjectCacheDir(projectName));
  }
}

export default async function setup() {
  prewarmVitestBrowserCache();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    prewarmVitestBrowserCache();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
