export const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

export const supportsAdoptedStyleSheets = (): boolean =>
  isBrowser() &&
  'adoptedStyleSheets' in (document as any) &&
  typeof (CSSStyleSheet as any)?.prototype?.replaceSync === 'function';

function onNextTick(fn: () => void) {
  if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(fn);
  else setTimeout(fn, 0);
}

export type Unsubscribe = () => void;

/** Beobachtet Größenänderungen des Targets. Nutzt ResizeObserver wenn vorhanden, sonst Fallback. */
export function watchElementResize(
  target: HTMLElement,
  cb: () => void,
  mutationObserverInit?: MutationObserverInit,
): Unsubscribe {
  // Native ResizeObserver vorhanden?
  if (typeof (globalThis as any).ResizeObserver !== 'undefined') {
    const ro = new (globalThis as any).ResizeObserver(() => cb());
    ro.observe(target);
    return () => ro.disconnect();
  }

  // Fallback: Fenster-Resize + Mutations (Attribute-Änderungen, z.B. style.width/height)
  const onWinResize = () => onNextTick(cb);
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onWinResize);
  }

  let mo: MutationObserver | undefined;
  if (typeof MutationObserver !== 'undefined') {
    mo = new MutationObserver(() => onNextTick(cb));
    if (mutationObserverInit) {
      mo.observe(target, mutationObserverInit);
    } else {
      mo.observe(target);
    }
  }

  // Letzter Fallback: leichtes Polling (nur im Test sinnvoll)
  const pollId =
    typeof window === 'undefined' ? undefined : setInterval(() => cb(), 250);

  return () => {
    if (typeof window !== 'undefined')
      window.removeEventListener('resize', onWinResize);
    mo?.disconnect();
    if (pollId) clearInterval(pollId as any);
  };
}
