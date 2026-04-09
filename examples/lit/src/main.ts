// Single entry point — importing the showcase module triggers its
// `@customElement('vmap-showcase')` decorator, which calls
// `customElements.define()` and upgrades the <vmap-showcase> tag in
// index.html into a real Lit component.
import './vmap-showcase';
