import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function prewarmVitestBrowserCache() {
  const projectName = 'browser';
  const projectHash = createHash('sha1').update(projectName).digest('hex');
  const cacheDir = resolve(
    process.cwd(),
    'node_modules/.vitest-cache',
    'vitest',
    projectHash,
  );

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
