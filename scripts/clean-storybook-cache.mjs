#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname;
const pathsToRemove = [
  '.storybook/.vite-cache',
  'node_modules/.cache/storybook',
];

for (const relPath of pathsToRemove) {
  const absPath = path.join(ROOT, relPath);
  try {
    fs.rmSync(absPath, { recursive: true, force: true });
    console.log(`[storybook-cache] removed ${relPath}`);
  } catch (error) {
    console.warn(`[storybook-cache] failed to remove ${relPath}:`, error);
  }
}
