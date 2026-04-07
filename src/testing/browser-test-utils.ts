let bundlePromise: Promise<void> | undefined;

export function createTaggedElement<T extends HTMLElement>(tagName: string): T {
  return document.createElement(tagName) as T;
}

export async function loadVMapBundle(): Promise<void> {
  if (!bundlePromise) {
    // Browser tests intentionally load the built Stencil bundle at runtime.
    // `tsc --noEmit` runs before `dist` exists in CI, so this must stay a string import.
    bundlePromise = Function('return import("/dist/v-map/v-map.esm.js")')().then(
      () => undefined,
    );
  }

  await bundlePromise;
}

export async function waitFor(
  condition: () => boolean,
  timeoutMs = 3_000,
): Promise<void> {
  const deadline = performance.now() + timeoutMs;

  while (performance.now() < deadline) {
    if (condition()) return;
    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
  }

  throw new Error('Timed out while waiting for browser test condition');
}

export async function waitForHydration(element: Element): Promise<void> {
  await waitFor(() => element.classList.contains('hydrated'));
}

export function onceEvent<T extends Event>(
  target: EventTarget,
  type: string,
  timeoutMs = 3_000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      target.removeEventListener(type, onEvent as EventListener);
      reject(new Error(`Timed out while waiting for "${type}" event`));
    }, timeoutMs);

    const onEvent = (event: Event) => {
      window.clearTimeout(timer);
      resolve(event as T);
    };

    target.addEventListener(type, onEvent as EventListener, { once: true });
  });
}

export function createLiveMap(
  flavour: 'leaflet' | 'ol' | 'deck' | 'cesium' = 'leaflet',
): HTMLVMapElement {
  const map = createTaggedElement<HTMLVMapElement>('v-map');

  map.setAttribute('flavour', flavour);
  map.setAttribute('center', '11.5761,48.1371');
  map.setAttribute('zoom', '12');
  map.setAttribute('css-mode', 'none');
  map.style.display = 'block';
  map.style.width = '300px';
  map.style.height = '200px';
  map.useDefaultImportMap = false;

  return map;
}
