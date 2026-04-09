import { spawn } from 'node:child_process';
import { rmSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

// Smoke test for the SvelteKit demo. Spins up a real Vite dev server,
// drives a real Chromium via Playwright, and asserts the user-visible
// behaviour of the showcase page end-to-end:
//   1. Custom elements register and the deck provider becomes ready.
//   2. The local GeoTIFF sample is reachable and the layer toggles on.
//   3. Switching the provider to OL and dragging the zoom slider
//      actually moves the live OL view (regression test for the
//      @Watch('zoom') propagation fix in v0.4.1).
//   4. Switching the provider to Cesium succeeds.
//
// Playwright is used because v-map's other browser tests already
// depend on it (via @vitest/browser-playwright). Puppeteer would also
// work but pulling in a second headless Chromium driver isn't worth
// it.

const LOG_PREFIX = 'smoke - ';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const demoDir = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(demoDir, '..', '..');
const host = '127.0.0.1';
const requestedPort = Number(process.env.PORT ?? '4175');
const port = String(await findFreePort(requestedPort));
const baseUrl = `http://${host}:${port}/`;

function isPortFree(portToCheck) {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(portToCheck, host);
  });
}

async function findFreePort(startPort) {
  for (let currentPort = startPort; currentPort < startPort + 20; currentPort++) {
    if (await isPortFree(currentPort)) {
      return currentPort;
    }
  }

  throw new Error(`No free port found starting from ${startPort}`);
}

async function waitForHttp(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // server not ready yet
    }

    await delay(250);
  }

  throw new Error(`Timed out waiting for dev server: ${url}`);
}

function waitForExit(child, label) {
  return new Promise((resolve, reject) => {
    child.once('exit', code => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${label} exited with code ${code}`));
    });
    child.once('error', reject);
  });
}

let serverOutput = '';

const captureOutput = chunk => {
  serverOutput += chunk.toString();
  if (serverOutput.length > 16000) {
    serverOutput = serverOutput.slice(-16000);
  }
};

const syncStep = spawn('pnpm', ['--dir', demoDir, 'run', 'sync:vmap'], {
  cwd: repoRoot,
  env: { ...process.env, CI: 'true' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

syncStep.stdout.on('data', captureOutput);
syncStep.stderr.on('data', captureOutput);

await waitForExit(syncStep, 'sync:vmap');

rmSync(path.resolve(demoDir, 'node_modules', '.vite'), {
  recursive: true,
  force: true,
});

const devServer = spawn(
  'pnpm',
  [
    '--dir',
    demoDir,
    'exec',
    'vite',
    'dev',
    '--host',
    host,
    '--port',
    port,
    '--strictPort',
  ],
  {
    cwd: repoRoot,
    env: { ...process.env, CI: 'true' },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

devServer.stdout.on('data', captureOutput);
devServer.stderr.on('data', captureOutput);

let browser;

const cleanup = async () => {
  if (browser) {
    try {
      await browser.close();
    } catch {
      /* swallow */
    }
    browser = undefined;
  }
  if (!devServer.killed) {
    devServer.kill('SIGTERM');
  }
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

try {
  console.log(`${LOG_PREFIX}waiting for dev server at ${baseUrl}`);
  await waitForHttp(baseUrl);
  console.log(`${LOG_PREFIX}checking local GeoTIFF asset`);
  await waitForHttp(`${baseUrl}geotiff/cea.tif`);

  console.log(`${LOG_PREFIX}launching Chromium via Playwright`);
  browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
    ],
  });

  const context = await browser.newContext();
  await context.addInitScript(() => {
    localStorage.setItem('@pt9912/v-map:logLevel', 'debug');
  });

  const page = await context.newPage();

  console.log(`${LOG_PREFIX}opening demo page`);
  // `networkidle` is too strict for Vite dev: HMR keeps a websocket
  // open. Wait for DOM ready instead and rely on the explicit
  // waitForFunction calls below for the v-map lifecycle gates.
  await page.goto(`${baseUrl}?vmapDebug`, { waitUntil: 'domcontentloaded' });

  console.log(`${LOG_PREFIX}waiting for custom elements registration`);
  await page.waitForFunction(
    () => document.body.innerText.includes('v-map custom elements registered'),
    null,
    { timeout: 30000 },
  );

  console.log(`${LOG_PREFIX}waiting for map-provider-ready (ol)`);
  await page.waitForFunction(
    () => document.body.innerText.includes('map-provider-ready (ol)'),
    null,
    { timeout: 30000 },
  );

  console.log(`${LOG_PREFIX}clicking local GeoTIFF sample`);
  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll('button')).find(
      el => el.textContent?.includes('Local CEA Grayscale'),
    );
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('GeoTIFF sample button not found');
    }
    button.click();
  });

  console.log(`${LOG_PREFIX}waiting for GeoTIFF log entry`);
  await page.waitForFunction(
    () => document.body.innerText.includes('GeoTIFF: /geotiff/cea.tif'),
    null,
    { timeout: 30000 },
  );

  console.log(`${LOG_PREFIX}driving the zoom slider and asserting the OL view follows`);
  // Regression test for the @Watch('zoom') propagation bug fixed in
  // v0.4.1. The default OL provider is already active.
  const initialOlZoom = await page.evaluate(() => {
    const map = document.querySelector('v-map');
    return map?.__vMapProvider?.getView?.()?.zoom ?? null;
  });
  console.log(`${LOG_PREFIX}initial OL view zoom = ${initialOlZoom}`);
  if (initialOlZoom == null) {
    throw new Error(
      'OL provider has no getView() — was v-map loaded from the local dist?',
    );
  }

  // Mutate the slider state directly: dispatch an `input` event so
  // Svelte's bind:value picks up the new value, which then flows
  // through `zoom` → `<v-map zoom={zoom}>` → @Watch('zoom') →
  // OpenLayers view.setZoom(). This is the same code path the user's
  // mouse drag triggers.
  await page.evaluate(() => {
    const slider = document.querySelector(
      'input[type="range"][min="2"][max="18"]',
    );
    if (!(slider instanceof HTMLInputElement)) {
      throw new Error('Zoom slider not found');
    }
    slider.value = '6';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await page.waitForFunction(
    () => {
      const map = document.querySelector('v-map');
      const view = map?.__vMapProvider?.getView?.();
      return view && Math.round(view.zoom) === 6;
    },
    null,
    { timeout: 10000 },
  );

  const updatedOlZoom = await page.evaluate(() => {
    const map = document.querySelector('v-map');
    return map?.__vMapProvider?.getView?.()?.zoom ?? null;
  });
  console.log(`${LOG_PREFIX}OL view zoom after slider drag = ${updatedOlZoom}`);
  if (Math.round(updatedOlZoom) !== 6) {
    throw new Error(
      `Expected OL view zoom 6 after slider drag, got ${updatedOlZoom}`,
    );
  }

  console.log(`${LOG_PREFIX}switching provider to deck`);
  await page.selectOption('select', 'deck');
  await page.waitForFunction(
    () => document.body.innerText.includes('map-provider-ready (deck)'),
    null,
    { timeout: 30000 },
  );

  console.log(`${LOG_PREFIX}switching provider to cesium`);
  await page.selectOption('select', 'cesium');
  await page.waitForFunction(
    () => document.body.innerText.includes('map-provider-ready (cesium)'),
    null,
    { timeout: 30000 },
  );

  console.log(`${LOG_PREFIX}ok ${baseUrl}`);
  console.log(
    `${LOG_PREFIX}provider initialized, local GeoTIFF requested, zoom slider verified, and cesium path confirmed`,
  );
} catch (error) {
  console.error(`${LOG_PREFIX}failed`);
  console.error(serverOutput);
  throw error;
} finally {
  await cleanup();
}
