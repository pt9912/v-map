#!/usr/bin/env node
// Build every workspace under examples/<name>/ as a static site and copy
// the resulting build/ output into docs/public/demos/<name>/. This wires
// the framework showcases (currently sveltekit, soon react/vue/angular)
// into the VitePress docs build so they end up as live iframes.
//
// Each example workspace is expected to:
//   1. Have its own package.json with a "build" script.
//   2. Produce its static output under build/ (or a directory named via
//      the optional `vmap.output` field in package.json — see below).
//   3. Honour a `VMAP_DOCS_BASE` env var as its base path (so assets
//      resolve correctly when served from /v-map/demos/<name>/).
//
// Optional opt-out: add `"vmap": { "skip": true }` to an example's
// package.json to exclude it from the docs build (useful for examples
// that are devsandbox-only).
//
// Optional output dir override: `"vmap": { "output": "dist" }` if the
// framework writes somewhere other than build/.

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, cpSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(import.meta.dirname, '..');
const EXAMPLES_DIR = path.join(ROOT, 'examples');
const PUBLIC_DEMOS_DIR = path.join(ROOT, 'docs', 'public', 'demos');
const DOCS_BASE_PREFIX = '/v-map/demos';

function listExampleWorkspaces() {
  if (!existsSync(EXAMPLES_DIR)) return [];
  return readdirSync(EXAMPLES_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => existsSync(path.join(EXAMPLES_DIR, name, 'package.json')));
}

function readPkg(name) {
  const pkgPath = path.join(EXAMPLES_DIR, name, 'package.json');
  return JSON.parse(readFileSync(pkgPath, 'utf8'));
}

function buildExample(name) {
  const exampleDir = path.join(EXAMPLES_DIR, name);
  const pkg = readPkg(name);

  if (pkg.vmap?.skip) {
    console.log(`[examples] Skipping ${name} (vmap.skip in package.json)`);
    return;
  }

  if (!pkg.scripts?.build) {
    console.log(`[examples] Skipping ${name} (no build script)`);
    return;
  }

  const outputDir = path.join(exampleDir, pkg.vmap?.output ?? 'build');
  const baseUrl = `${DOCS_BASE_PREFIX}/${name}`;
  const targetDir = path.join(PUBLIC_DEMOS_DIR, name);

  console.log(`\n[examples] Building ${name} → ${baseUrl}`);

  // Each example may need its own dependencies installed first. We use
  // --frozen-lockfile in CI for reproducibility; locally pnpm just
  // checks the lockfile and is fast on no-op runs.
  execSync('pnpm install --frozen-lockfile', {
    cwd: exampleDir,
    stdio: 'inherit',
  });

  execSync('pnpm build', {
    cwd: exampleDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      VMAP_DOCS_BASE: baseUrl,
    },
  });

  if (!existsSync(outputDir)) {
    throw new Error(
      `[examples] ${name}: expected build output at ${outputDir} but it doesn't exist. Set "vmap.output" in package.json if your framework writes elsewhere.`,
    );
  }

  rmSync(targetDir, { recursive: true, force: true });
  cpSync(outputDir, targetDir, { recursive: true });

  console.log(`[examples] ✔ ${name} → docs/public/demos/${name}/`);
}

function main() {
  const filter = process.argv[2];
  let workspaces = listExampleWorkspaces();

  if (filter) {
    if (!workspaces.includes(filter)) {
      console.error(
        `[examples] Unknown example "${filter}". Available: ${workspaces.join(', ')}`,
      );
      process.exit(1);
    }
    workspaces = [filter];
  }

  if (workspaces.length === 0) {
    console.log('[examples] No example workspaces found, nothing to do.');
    return;
  }

  console.log(
    `[examples] Building ${workspaces.length} example workspace(s): ${workspaces.join(', ')}`,
  );

  for (const name of workspaces) {
    buildExample(name);
  }

  console.log('\n[examples] All done.');
}

main();
