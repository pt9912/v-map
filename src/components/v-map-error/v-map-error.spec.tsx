import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VMapError } from './v-map-error';
import { VMapEvents, type VMapErrorDetail } from '../../utils/events';

function makeErrorDetail(
  overrides: Partial<VMapErrorDetail> = {},
): VMapErrorDetail {
  return {
    type: 'network',
    message: 'something failed',
    ...overrides,
  };
}

function dispatchError(target: HTMLElement, detail: VMapErrorDetail) {
  target.dispatchEvent(
    new CustomEvent(VMapEvents.Error, { detail, bubbles: true }),
  );
}

describe('v-map-error', () => {
  let mapEl: HTMLElement;
  let component: VMapError;

  beforeEach(() => {
    document.body.innerHTML = '';
    mapEl = document.createElement('v-map');
    mapEl.id = 'map-1';
    document.body.appendChild(mapEl);

    component = new VMapError();
    // Stencil normally injects @Element; in unit tests we set it manually.
    component.host = document.createElement('v-map-error');
    mapEl.appendChild(component.host);
  });

  afterEach(() => {
    component.disconnectedCallback?.();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('attaches to the closest parent v-map when no "for" is set', () => {
    component.connectedCallback();
    dispatchError(mapEl, makeErrorDetail({ message: 'boom' }));
    expect(component.toasts).toHaveLength(1);
    expect(component.toasts[0].detail.message).toBe('boom');
  });

  it('attaches to the v-map referenced via the "for" attribute', () => {
    const other = document.createElement('v-map');
    other.id = 'other-map';
    document.body.appendChild(other);

    component.for = 'other-map';
    component.connectedCallback();

    // dispatching on the implicit parent must NOT be picked up
    dispatchError(mapEl, makeErrorDetail({ message: 'wrong' }));
    expect(component.toasts).toHaveLength(0);

    // dispatching on the targeted v-map must be picked up
    dispatchError(other, makeErrorDetail({ message: 'right' }));
    expect(component.toasts).toHaveLength(1);
    expect(component.toasts[0].detail.message).toBe('right');
  });

  it('caps the toast stack at "max" entries, dropping the oldest', () => {
    component.max = 2;
    component.autoDismiss = 0;
    component.connectedCallback();

    dispatchError(mapEl, makeErrorDetail({ message: 'first' }));
    dispatchError(mapEl, makeErrorDetail({ message: 'second' }));
    dispatchError(mapEl, makeErrorDetail({ message: 'third' }));

    expect(component.toasts).toHaveLength(2);
    expect(component.toasts.map(t => t.detail.message)).toEqual([
      'second',
      'third',
    ]);
  });

  it('auto-dismisses toasts after the configured timeout', () => {
    vi.useFakeTimers();
    component.autoDismiss = 1000;
    component.connectedCallback();

    dispatchError(mapEl, makeErrorDetail({ message: 'goodbye' }));
    expect(component.toasts).toHaveLength(1);

    vi.advanceTimersByTime(999);
    expect(component.toasts).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(component.toasts).toHaveLength(0);
  });

  it('keeps toasts when autoDismiss is 0', () => {
    vi.useFakeTimers();
    component.autoDismiss = 0;
    component.connectedCallback();

    dispatchError(mapEl, makeErrorDetail({ message: 'sticky' }));
    vi.advanceTimersByTime(60_000);
    expect(component.toasts).toHaveLength(1);
  });

  it('logs to console when log="console"', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    component.log = 'console';
    component.autoDismiss = 0;
    component.connectedCallback();

    dispatchError(mapEl, makeErrorDetail({ message: 'logged' }));
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0]).toEqual(
      expect.arrayContaining(['[v-map-error]', 'network', 'logged']),
    );
    errorSpy.mockRestore();
  });

  it('does not log to console when log="none"', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    component.log = 'none';
    component.autoDismiss = 0;
    component.connectedCallback();

    dispatchError(mapEl, makeErrorDetail({ message: 'silent' }));
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('removes the event listener on disconnect', () => {
    component.autoDismiss = 0;
    component.connectedCallback();

    dispatchError(mapEl, makeErrorDetail({ message: 'before' }));
    expect(component.toasts).toHaveLength(1);

    component.disconnectedCallback();
    dispatchError(mapEl, makeErrorDetail({ message: 'after' }));
    // toasts cleared on disconnect, and no more should be added
    expect(component.toasts).toHaveLength(0);
  });

  it('ignores events with no detail payload', () => {
    component.autoDismiss = 0;
    component.connectedCallback();
    mapEl.dispatchEvent(new CustomEvent(VMapEvents.Error));
    expect(component.toasts).toHaveLength(0);
  });

  it('renders one toast element per active error', () => {
    component.autoDismiss = 0;
    component.connectedCallback();

    dispatchError(mapEl, makeErrorDetail({ message: 'a' }));
    dispatchError(mapEl, makeErrorDetail({ message: 'b' }));

    const vnode: any = component.render();
    const json = JSON.stringify(vnode);
    expect(json).toContain('a');
    expect(json).toContain('b');
  });

  it('retries attach when the target element is not yet in the DOM', () => {
    vi.useFakeTimers();
    // Detach the freshly-built component from the test harness so its own
    // attach() runs against a missing target.
    component.disconnectedCallback();
    component = new VMapError();
    component.host = document.createElement('v-map-error');
    // No parent v-map exists yet — attach() must schedule a retry timer.
    document.body.appendChild(component.host);

    component.for = 'late-map';
    component.connectedCallback();

    // Create the target only AFTER attach() has already queued its retry.
    const late = document.createElement('v-map');
    late.id = 'late-map';
    document.body.appendChild(late);

    // One retry tick is enough — attach() re-runs and picks up the target.
    vi.advanceTimersByTime(100);

    component.autoDismiss = 0;
    dispatchError(late, makeErrorDetail({ message: 'eventual' }));
    expect(component.toasts).toHaveLength(1);
  });

  it('clears the pending retry timer on disconnect', () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(window, 'clearTimeout');

    component.disconnectedCallback();
    component = new VMapError();
    component.host = document.createElement('v-map-error');
    document.body.appendChild(component.host);

    // Target never exists — attach() schedules retries until disconnect.
    component.for = 'never-there';
    component.connectedCallback();

    component.disconnectedCallback();
    // clearTimeout must have been called at least once for the retryTimer.
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('dismisses a toast when the close button onClick fires', () => {
    component.autoDismiss = 0;
    component.connectedCallback();
    dispatchError(mapEl, makeErrorDetail({ message: 'clicked' }));
    expect(component.toasts).toHaveLength(1);

    // Walk the rendered vnode tree to find the close-button onClick handler
    // and invoke it directly. This exercises the inline arrow function at
    // the render site, which would otherwise stay uncovered.
    const vnode: any = component.render();
    const closeHandlers: Array<() => void> = [];
    const walk = (n: any) => {
      if (!n || typeof n !== 'object') return;
      const attrs = n.$attrs$ ?? n.vattrs ?? n.attrs;
      if (attrs && typeof attrs.onClick === 'function') {
        closeHandlers.push(attrs.onClick);
      }
      const children = n.$children$ ?? n.vchildren ?? n.children;
      if (Array.isArray(children)) children.forEach(walk);
    };
    walk(vnode);

    expect(closeHandlers.length).toBeGreaterThanOrEqual(1);
    closeHandlers[0]();
    expect(component.toasts).toHaveLength(0);
  });
});
