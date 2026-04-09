# v-map mit Lit

Dieser Guide zeigt, wie du v-map in eine Lit-App einbindest.
Die Live-Demo unten ist die echte App aus
[`examples/lit/`](https://github.com/pt9912/v-map/tree/main/examples/lit)
des v-map-Repos, gebaut mit Vite und in einem sandboxed Iframe
eingebettet.

## Live-Demo

@[example:lit]

## Warum Lit besonders interessant ist

Lit und v-map sind **beide Web-Components-Bibliotheken**. Lit wickelt
keine Komponenten zu Custom Elements — Lit *ist* Custom Elements,
genauso wie Stencil. Diese Demo ist also der ehrlichste Interop-Test:
zwei unabhängige WC-Libraries, die sich nichts voneinander wissen
müssen, kommunizieren ausschließlich über das DOM.

Was die Demo zeigt:

- **`<vmap-showcase>` ist ein Lit-Element** mit Shadow DOM und
  reactive State (`@state()`-Properties).
- **`<v-map>` lebt als Child *im* Shadow Root** der Lit-Komponente.
  Stencil hat überhaupt keine Sonderbehandlung für „in einem fremden
  Shadow Root mounten" — es funktioniert einfach, weil die einzige
  Schnittstelle das `customElements`-Registry und das DOM ist.
- **Lit's `@event`-Bindings funktionieren auf Stencil-Events**, weil
  v-map seine Custom Events mit `composed: true` dispatcht — sie
  steigen über Shadow-Boundaries hinaus.
- **Reactive Props per Lit-Template-Bindings.** Wenn `this.zoom`
  sich ändert, regeneriert Lit die `<v-map>`-Markup mit dem neuen
  `zoom`-Attribut. Der `@Watch('zoom')`-Handler in v-map (seit
  v0.4.0) ruft den Provider mit dem aktuellen Center neu auf.

## Setup für eigene Projekte

### 1. Projekt anlegen

```bash
pnpm create vite@latest my-vmap-app -- --template lit-ts
cd my-vmap-app
pnpm install
```

### 2. v-map installieren

```bash
pnpm add @npm9912/v-map
```

Die Provider (`ol`, `leaflet`, `cesium`, `@deck.gl/*`) brauchst du nur
als Dev-Dependencies für TypeScript-Typen, falls überhaupt — zur
Laufzeit lädt v-map seine Peer-Deps via Auto-Importmap nach.

### 3. v-map-Loader im `<head>` einbinden

`index.html` ist der Mount-Point für eine Vite-Lit-App. Wir empfehlen,
v-map per `<script type="module">` aus jsDelivr zu laden, **statt**
den Stencil-Loader durch Vite zu schleifen:

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My v-map App</title>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.0/dist/v-map/v-map.esm.js"
    ></script>
  </head>
  <body>
    <my-app></my-app>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

::: warning Warum CDN statt Bundler
Stencils Lazy-Loader nutzt `import.meta.url`, um seine Sibling-`*.entry.js`-
Chunks zur Laufzeit zu finden. Wenn ein Bundler (Vite, Rollup, Webpack)
den Loader ingestet, landet die URL bei `/assets/abc.js` und Stencil
404t auf jedem einzelnen Layer-Chunk. Der jsDelivr-Pfad lässt
Stencils Chunk-Resolution unverändert. Siehe den
[CDN-Guide](../cdn-esm) für die Hintergründe.
:::

### 4. Erste Lit-Komponente mit `<v-map>`

```ts
// src/my-app.ts
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('my-app')
export class MyApp extends LitElement {
  @state() private zoom = 11;

  static override styles = css`
    v-map {
      display: block;
      width: 100%;
      height: 70vh;
    }
  `;

  override render() {
    return html`
      <v-map flavour="ol" center="11.576,48.137" zoom=${String(this.zoom)}>
        <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>

        <v-map-layergroup group-title="Base" basemapid="osm">
          <v-map-layer-osm id="osm" label="OpenStreetMap"></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>

      <input
        type="range"
        min="2"
        max="18"
        .value=${String(this.zoom)}
        @input=${(e: Event) =>
          (this.zoom = Number((e.target as HTMLInputElement).value))}
      />
    `;
  }
}
```

### 5. Reactive Layer hinzufügen oder ausblenden

In Lit nutzt du Conditional-Expressions im `html`-Template:

```ts
@customElement('my-app')
export class MyApp extends LitElement {
  @state() private showOverlay = false;

  override render() {
    return html`
      <button @click=${() => (this.showOverlay = !this.showOverlay)}>
        Toggle Overlay
      </button>

      <v-map flavour="ol">
        <v-map-layergroup group-title="Base" basemapid="osm">
          <v-map-layer-osm id="osm"></v-map-layer-osm>
        </v-map-layergroup>

        ${this.showOverlay
          ? html`
              <v-map-layergroup group-title="Daten">
                <v-map-layer-geojson
                  url="/data/points.geojson"
                ></v-map-layer-geojson>
              </v-map-layergroup>
            `
          : ''}
      </v-map>
    `;
  }
}
```

v-map disposed den Layer beim Verbergen automatisch.

### 6. Error-Events programmatisch konsumieren

`vmap-error` bubblet von jedem Layer zu `<v-map>` hoch und steigt mit
`composed: true` über die Shadow-Boundary deines Lit-Elements hinaus.
Lit's `@event`-Syntax bindet darauf direkt:

```ts
type VMapErrorDetail = {
  type: 'network' | 'validation' | 'parse' | 'provider';
  message: string;
  attribute?: string;
  cause?: unknown;
};

@customElement('my-app')
export class MyApp extends LitElement {
  private onMapError(event: Event) {
    const detail = (event as CustomEvent<VMapErrorDetail>).detail;
    if (!detail) return;
    console.error('[vmap]', detail.type, detail.message);
  }

  override render() {
    return html`
      <v-map flavour="ol" @vmap-error=${this.onMapError}>
        <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>
        ...
      </v-map>
    `;
  }
}
```

Für reines Toast-Display ohne JS-Listener reicht aber das deklarative
`<v-map-error>`.

## Production-Build

`pnpm build` erzeugt mit Vite ein statisches `dist/`-Verzeichnis, das
du auf jedem File-Server hosten kannst. Wenn du unter einem Subpfad
deployst (z. B. GitHub Pages):

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/my-vmap-app/',
});
```

## Stolperfallen

1. **Lit-Decorators brauchen `experimentalDecorators: true`.** In
   `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "experimentalDecorators": true,
       "useDefineForClassFields": false
     }
   }
   ```
   Ohne den Switch werden `@customElement`, `@property`, `@state`
   nicht ausgeführt, und deine Komponente registriert sich nie.

2. **`composed: false` Custom-Events bleiben im Shadow Root.** Stencil
   dispatcht v-map's Events mit `composed: true`, also kein Problem.
   Aber wenn du eigene Custom-Events von einer Wrapper-Komponente
   weiterreichen willst, daran denken — sonst sieht dein Parent-Lit-
   Element sie nie.

3. **Boolean-Attributes als Strings setzen.** Lit hat das `?`-Prefix
   (`?visible=${true}`), das ein Attribut entweder setzt oder weglässt.
   v-map's `@Prop()`s erwarten aber meistens String-Werte (`"true"` /
   `"false"`), weil sie reflektiert sind. Im Zweifel den String
   explizit übergeben: `visible=${String(this.visible)}`.

4. **Lit's `.value` (Property-Binding) vs `value=` (Attribut-
   Binding).** Die Lit-Demo bindet `<input .value=${...}>` (Property),
   damit der Slider-Zustand korrekt synchronisiert. Für v-map-Props
   funktionieren beide Varianten — Property-Bindings sind
   typischerweise schneller, Attribute-Bindings sind besser
   debugbar via DevTools.

## Vollständiger Code

Den kompletten Source der Live-Demo oben findest du im v-map-Repo unter
[`examples/lit/`](https://github.com/pt9912/v-map/tree/main/examples/lit).
Der relevante Teil ist
[`src/vmap-showcase.ts`](https://github.com/pt9912/v-map/blob/main/examples/lit/src/vmap-showcase.ts).

## Siehe auch

- **[Getting Started](../../getting-started)** — generelles Setup
- **[CDN ohne Bundler](../cdn-esm)** — die jsDelivr-Lade-Strategie im Detail
- **[Error Handling](../error-handling)** — die `<v-map-error>` Komponente
  und das `vmap-error` Event
- **[Komponenten-API](../../api/components/)** — alle 19 Web Components
