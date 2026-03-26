import { OL_VERSION } from '../../lib/versions.gen';

/** CSS in ShadowRoot injizieren – ohne '?inline', kompatibel zu Stencil/Rollup */
export async function injectOlCss(shadowRoot?: ShadowRoot) {
  if (!shadowRoot) return;
  const id = 'ol-css-sheet';
  // Doppeltes Einfügen vermeiden
  if (shadowRoot.querySelector(`style[data-id="${id}"]`)) return;

  const url = `https://cdn.jsdelivr.net/npm/ol@${OL_VERSION}/ol.css`;
  const css = await (await fetch(url)).text();

  if ('adoptedStyleSheets' in Document.prototype) {
    const sheet = new CSSStyleSheet();
    await sheet.replace(css);
    shadowRoot.adoptedStyleSheets = [
      ...(shadowRoot.adoptedStyleSheets ?? []),
      sheet,
    ];
  } else {
    const style = document.createElement('style');
    style.setAttribute('data-id', id);
    style.textContent = css;
    shadowRoot.appendChild(style);
  }
}
