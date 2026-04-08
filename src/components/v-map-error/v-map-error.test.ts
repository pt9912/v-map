import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  createLiveMap,
  createTaggedElement,
  loadVMapBundle,
  waitFor,
  waitForHydration,
} from '../../testing/browser-test-utils';
import { VMapEvents, type VMapErrorDetail } from '../../utils/events';

function dispatchError(target: HTMLElement, detail: VMapErrorDetail) {
  target.dispatchEvent(
    new CustomEvent(VMapEvents.Error, {
      detail,
      bubbles: true,
      composed: true,
    }),
  );
}

async function mountMapWithErrorComponent(
  attributes: Record<string, string> = {},
): Promise<{
  map: HTMLElement;
  errorEl: HTMLElement;
}> {
  const map = createLiveMap();
  const errorEl = createTaggedElement('v-map-error');
  for (const [name, value] of Object.entries(attributes)) {
    errorEl.setAttribute(name, value);
  }
  map.appendChild(errorEl);
  document.body.appendChild(map);

  await waitForHydration(map);
  await waitForHydration(errorEl);

  return { map, errorEl };
}

describe('v-map-error browser', () => {
  beforeAll(async () => {
    await loadVMapBundle();
    await customElements.whenDefined('v-map');
    await customElements.whenDefined('v-map-error');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates and renders an empty stack initially', async () => {
    const { errorEl } = await mountMapWithErrorComponent({
      position: 'top-right',
      'auto-dismiss': '0',
    });

    const stack = errorEl.shadowRoot?.querySelector('.stack');
    expect(stack).toBeTruthy();
    expect(stack?.querySelectorAll('.toast').length).toBe(0);
  });

  it('renders a toast when its parent v-map dispatches vmap-error', async () => {
    const { map, errorEl } = await mountMapWithErrorComponent({
      'auto-dismiss': '0',
    });

    dispatchError(map, {
      type: 'network',
      message: 'WMS request failed',
    });

    await waitFor(
      () => (errorEl.shadowRoot?.querySelectorAll('.toast').length ?? 0) === 1,
    );

    const toast = errorEl.shadowRoot!.querySelector('.toast') as HTMLElement;
    expect(toast.textContent).toContain('WMS request failed');
    expect(toast.textContent).toContain('network');
    expect(toast.getAttribute('role')).toBe('alert');
  });

  it('positions the stack via the position attribute', async () => {
    const { map, errorEl } = await mountMapWithErrorComponent({
      position: 'bottom-left',
      'auto-dismiss': '0',
    });

    dispatchError(map, { type: 'parse', message: 'positioned' });
    await waitFor(
      () => (errorEl.shadowRoot?.querySelectorAll('.toast').length ?? 0) === 1,
    );

    const stack = errorEl.shadowRoot!.querySelector('.stack') as HTMLElement;
    const stackRect = stack.getBoundingClientRect();
    const mapRect = map.getBoundingClientRect();

    // bottom-left: stack should sit near map's bottom-left corner
    expect(Math.abs(stackRect.left - mapRect.left)).toBeLessThan(40);
    expect(Math.abs(stackRect.bottom - mapRect.bottom)).toBeLessThan(40);
  });

  it('overlays the map container with a high z-index host', async () => {
    const { errorEl } = await mountMapWithErrorComponent({
      'auto-dismiss': '0',
    });

    const computed = window.getComputedStyle(errorEl);
    expect(computed.position).toBe('absolute');
    expect(parseInt(computed.zIndex, 10)).toBeGreaterThanOrEqual(1000);
    expect(computed.pointerEvents).toBe('none');
  });

  it('caps the toast stack at the configured max', async () => {
    const { map, errorEl } = await mountMapWithErrorComponent({
      'auto-dismiss': '0',
      max: '2',
    });

    dispatchError(map, { type: 'network', message: 'first' });
    dispatchError(map, { type: 'network', message: 'second' });
    dispatchError(map, { type: 'network', message: 'third' });

    await waitFor(
      () => (errorEl.shadowRoot?.querySelectorAll('.toast').length ?? 0) === 2,
    );

    const messages = Array.from(
      errorEl.shadowRoot!.querySelectorAll('.message'),
    ).map(node => node.textContent?.trim());

    expect(messages).toEqual(['second', 'third']);
  });

  it('removes a toast when the close button is clicked', async () => {
    const { map, errorEl } = await mountMapWithErrorComponent({
      'auto-dismiss': '0',
    });

    dispatchError(map, { type: 'parse', message: 'click me away' });
    await waitFor(
      () => (errorEl.shadowRoot?.querySelectorAll('.toast').length ?? 0) === 1,
    );

    const closeBtn = errorEl.shadowRoot!.querySelector(
      '.close',
    ) as HTMLButtonElement;
    closeBtn.click();

    await waitFor(
      () => (errorEl.shadowRoot?.querySelectorAll('.toast').length ?? 0) === 0,
    );
  });

  it('auto-dismisses a toast after the configured timeout', async () => {
    const { map, errorEl } = await mountMapWithErrorComponent({
      'auto-dismiss': '200',
    });

    dispatchError(map, { type: 'network', message: 'fades' });
    await waitFor(
      () => (errorEl.shadowRoot?.querySelectorAll('.toast').length ?? 0) === 1,
    );

    await waitFor(
      () => (errorEl.shadowRoot?.querySelectorAll('.toast').length ?? 0) === 0,
      2_000,
    );
  });

  it('targets a v-map by id via the for attribute', async () => {
    const left = createLiveMap();
    left.id = 'left';
    const right = createLiveMap();
    right.id = 'right';

    const errorEl = createTaggedElement('v-map-error');
    errorEl.setAttribute('for', 'right');
    errorEl.setAttribute('auto-dismiss', '0');

    document.body.appendChild(left);
    document.body.appendChild(right);
    document.body.appendChild(errorEl);

    await waitForHydration(left);
    await waitForHydration(right);
    await waitForHydration(errorEl);

    // dispatch on the wrong map - must NOT show
    dispatchError(left, { type: 'network', message: 'wrong' });
    await new Promise(resolve =>
      requestAnimationFrame(() => resolve(undefined)),
    );
    expect(errorEl.shadowRoot?.querySelectorAll('.toast').length).toBe(0);

    // dispatch on the right map - must show
    dispatchError(right, { type: 'network', message: 'right' });
    await waitFor(
      () => (errorEl.shadowRoot?.querySelectorAll('.toast').length ?? 0) === 1,
    );

    expect(
      errorEl.shadowRoot?.querySelector('.message')?.textContent,
    ).toBe('right');
  });
});
