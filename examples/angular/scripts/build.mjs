#!/usr/bin/env node
// Wraps `ng build` so we can pass --base-href from the VMAP_DOCS_BASE
// env var. Angular's CLI doesn't read env vars directly for baseHref,
// and a cross-platform inline shell expression in package.json gets
// awkward fast.
//
// VMAP_DOCS_BASE is set by scripts/build-examples.mjs at the repo root
// to /v-map/demos/angular when building for embedding in the docs site.
// Empty string means standalone development build.

import { execSync } from 'node:child_process';

const base = process.env.VMAP_DOCS_BASE ?? '';
const baseHref = base ? base.replace(/\/?$/, '/') : '/';

const args = ['build', '--base-href', baseHref, '--configuration=production'];

console.log(`[angular] ng ${args.join(' ')}`);
execSync(`ng ${args.join(' ')}`, { stdio: 'inherit' });
