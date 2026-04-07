import { spawn } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const LOG_PREFIX = 'smoke - ';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const demoDir = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(demoDir, '..', '..');
const host = '127.0.0.1';
const chromeDebugPort = process.env.CHROME_DEBUG_PORT ?? '9222';
const requestedPort = Number(process.env.PORT ?? '4175');
const port = String(await findFreePort(requestedPort));
const baseUrl = `http://${host}:${port}/`;
const browserUrl = `http://${host}:${chromeDebugPort}`;

function pickChromiumExecutable() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/snap/bin/chromium',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
  ].filter(Boolean);

  return candidates.find(existsSync);
}

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

const chromiumExecutable = pickChromiumExecutable();

if (!chromiumExecutable) {
  throw new Error('No Chromium executable found for smoke test');
}

const browserProcess = spawn(
  chromiumExecutable,
  [
    '--headless',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--remote-debugging-address=127.0.0.1',
    `--remote-debugging-port=${chromeDebugPort}`,
    '--user-data-dir=/tmp/v-map-smoke-chromium',
    'about:blank',
  ],
  {
    cwd: repoRoot,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

browserProcess.stdout.on('data', captureOutput);
browserProcess.stderr.on('data', captureOutput);

const cleanup = () => {
  if (!devServer.killed) {
    devServer.kill('SIGTERM');
  }
  if (!browserProcess.killed) {
    browserProcess.kill('SIGTERM');
  }
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

let browser;

try {
  console.log(`${LOG_PREFIX}waiting for dev server at ${baseUrl}`);
  await waitForHttp(baseUrl);
  console.log(`${LOG_PREFIX}checking local GeoTIFF asset`);
  await waitForHttp(`${baseUrl}geotiff/cea.tif`);
  console.log(`${LOG_PREFIX}waiting for Chromium DevTools at ${browserUrl}`);
  await waitForHttp(`${browserUrl}/json/version`);

  browser = await puppeteer.connect({
    browserURL: browserUrl,
  });

  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('@pt9912/v-map:logLevel', 'debug');
  });

  console.log(`${LOG_PREFIX}opening demo page`);
  await page.goto(`${baseUrl}?vmapDebug`, { waitUntil: 'networkidle2' });
  console.log(`${LOG_PREFIX}waiting for custom elements registration`);
  await page.waitForFunction(
    () => document.body.innerText.includes('v-map custom elements registered'),
    { timeout: 30000 },
  );
  console.log(`${LOG_PREFIX}waiting for map-provider-ready`);
  await page.waitForFunction(
    () => document.body.innerText.includes('map-provider-ready (deck)'),
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

  console.log(`${LOG_PREFIX}waiting for page log entry`);
  await page.waitForFunction(
    () => document.body.innerText.includes('GeoTIFF: /geotiff/cea.tif'),
    { timeout: 30000 },
  );

  console.log(`${LOG_PREFIX}switching provider to cesium`);
  await page.select('select', 'cesium');
  await page.waitForFunction(
    () => document.body.innerText.includes('map-provider-ready (cesium)'),
    { timeout: 30000 },
  );

  console.log(`${LOG_PREFIX}ok ${baseUrl}`);
  console.log(`${LOG_PREFIX}provider initialized, local GeoTIFF requested, and cesium path confirmed`);
} catch (error) {
  console.error(`${LOG_PREFIX}failed`);
  console.error(serverOutput);
  throw error;
} finally {
  if (browser) {
    await browser.close();
  }
  cleanup();
}
