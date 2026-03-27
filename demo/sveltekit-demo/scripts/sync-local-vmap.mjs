import { cpSync, existsSync, mkdirSync, realpathSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const demoDir = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(demoDir, '..', '..');
const packageLink = path.resolve(demoDir, 'node_modules', '@npm9912', 'v-map');
const lockDir = path.resolve(demoDir, 'node_modules', '.sync-local-vmap.lock');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function acquireLock() {
  const timeoutMs = 30000;
  const retryDelayMs = 100;
  const startedAt = Date.now();

  while (true) {
    try {
      mkdirSync(lockDir);
      return;
    } catch (error) {
      if (error?.code !== 'EEXIST') {
        throw error;
      }

      if (Date.now() - startedAt > timeoutMs) {
        throw new Error(`[sync-local-vmap] Timed out waiting for lock: ${lockDir}`);
      }

      await sleep(retryDelayMs);
    }
  }
}

function releaseLock() {
  rmSync(lockDir, { recursive: true, force: true });
}

if (!existsSync(packageLink)) {
  console.error(`[sync-local-vmap] Missing package link: ${packageLink}`);
  process.exit(1);
}

const packageRoot = realpathSync(packageLink);

if (packageRoot === repoRoot) {
  console.log('[sync-local-vmap] Package already points to repo root, nothing to sync.');
  process.exit(0);
}

const syncDir = relativeDir => {
  const sourceDir = path.resolve(repoRoot, relativeDir);
  const targetDir = path.resolve(packageRoot, relativeDir);

  rmSync(targetDir, { recursive: true, force: true });
  mkdirSync(path.dirname(targetDir), { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true, force: true });
};

await acquireLock();

try {
  syncDir('dist');
  syncDir('loader');

  console.log(
    `[sync-local-vmap] Synced dist/ and loader/ from ${repoRoot} into ${packageRoot}`,
  );
} finally {
  releaseLock();
}
