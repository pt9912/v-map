# v-map mit Solid

Dieser Guide zeigt, wie du v-map in eine Solid-App einbindest.
Die Live-Demo unten ist die echte App aus
[`examples/solid/`](https://github.com/pt9912/v-map/tree/main/examples/solid)
des v-map-Repos, gebaut mit Vite + vite-plugin-solid und in einem
sandboxed Iframe eingebettet.

## Live-Demo

@[example:solid]

## Warum Solid besonders gut zu v-map passt

Solid hat **keinen Virtual DOM**. Wenn sich ein Signal ändert, updated
Solid genau die eine DOM-Stelle, an der das Signal verwendet wird — und
sonst nichts. Das heißt: Wenn `zoom()` sich ändert, schreibt Solid
genau einmal `element.setAttribute('zoom', ...)` auf das `<v-map>`-
Element. Kein Reconciler, kein Diff, kein Wrapper.

Außerdem behandelt Solid unbekannte Tags als native HTML — kein
`isCustomElement`-Config (wie Vue) und keine
`IntrinsicElements`-Augmentation (wie React nötig). `<v-map>` steht
einfach im JSX und wird verbatim ans DOM geschrieben.

Was die Demo zeigt:

- **Reactive Provider-Switch:** Dropdown-Signal fließt via
  `flavour={provider()}` direkt ans Custom Element.
- **Reactive Zoom-Slider:** Signal-Getter `zoom()` wird als Attribut
  an `<v-map>` gebunden. Solid schreibt jede Änderung sofort.
- **Layer-Toggle:** `<Show when={...}>` rendert Layer-Gruppen bedingt.
  v-map disposed den Layer automatisch beim Entfernen.
- **`<v-map-error>` Toast:** deklarativer Fehler-Stapel.
- **Programmatischer `vmap-error`-Listener:** via `on:vmap-error` —
  Solid's `on:` Directive nutzt echte `addEventListener`, keine
  Synthetic Events.
- **„Add broken WMS layer" Button:** Error-Pipeline End-to-End.

## Setup für eigene Projekte

### 1. Projekt anlegen

```bash
pnpm create vite@latest my-vmap-app -- --template solid-ts
cd my-vmap-app
pnpm install
```

### 2. v-map installieren

```bash
pnpm add @npm9912/v-map
```

### 3. v-map-Loader im `<head>` einbinden

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My v-map App</title>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.4/dist/v-map/v-map.esm.js"
    ></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
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

### 4. Erste Karte deklarativ

```tsx
// src/App.tsx
import { createSignal } from 'solid-js';

export function App() {
  const [zoom, setZoom] = createSignal(11);

  return (
    <>
      <v-map flavour="ol" center="11.576,48.137" zoom={zoom()}>
        <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>

        <v-map-layergroup group-title="Base" basemapid="osm">
          <v-map-layer-osm id="osm" label="OpenStreetMap"></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>

      <input
        type="range"
        min="2"
        max="18"
        value={zoom()}
        onInput={e => setZoom(Number(e.currentTarget.value))}
      />
    </>
  );
}
```

Drag den Slider — Solid schreibt `zoom` direkt aufs DOM. Der
`@Watch('zoom')`-Handler in v-map (seit v0.4.0) propagiert die
Änderung an den aktiven Provider.

### 5. Reactive Layer hinzufügen oder ausblenden

Solid's `<Show>` rendert bedingt:

```tsx
import { createSignal, Show } from 'solid-js';

export function App() {
  const [showOverlay, setShowOverlay] = createSignal(false);

  return (
    <>
      <button onClick={() => setShowOverlay(prev => !prev)}>
        Toggle Overlay
      </button>

      <v-map flavour="ol">
        <v-map-layergroup group-title="Base" basemapid="osm">
          <v-map-layer-osm id="osm"></v-map-layer-osm>
        </v-map-layergroup>

        <Show when={showOverlay()}>
          <v-map-layergroup group-title="Daten">
            <v-map-layer-geojson url="/data/points.geojson"></v-map-layer-geojson>
          </v-map-layergroup>
        </Show>
      </v-map>
    </>
  );
}
```

### 6. Error-Events programmatisch konsumieren

Solid's `on:` Directive bindet auf echte DOM Custom Events:

```tsx
type VMapErrorDetail = {
  type: 'network' | 'validation' | 'parse' | 'provider';
  message: string;
  attribute?: string;
  cause?: unknown;
};

function onMapError(event: Event) {
  const detail = (event as CustomEvent<VMapErrorDetail>).detail;
  if (!detail) return;
  console.error('[vmap]', detail.type, detail.message);
}

// Im JSX:
<v-map flavour="ol" on:vmap-error={onMapError}>
  <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>
  ...
</v-map>
```

## Production-Build

`pnpm build` erzeugt mit Vite ein statisches `dist/`-Verzeichnis.
Wenn du unter einem Subpfad deployst:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/my-vmap-app/',
  plugins: [solid()],
});
```

## Stolperfallen

1. **`on:event-name` statt `onEventName`.** Solid's native
   `on<EventName>` (camelCase) nutzt Event Delegation, die keine
   Custom Events erreicht. Die `on:` Directive (`on:vmap-error`)
   ruft echtes `addEventListener` auf — das brauchen wir für Stencil
   Events.

2. **Signal-Getter im JSX aufrufen!** `zoom={zoom()}` mit `()` —
   ohne den Getter-Aufruf bindet Solid die Funktion statt den Wert
   und das Attribut wird `"function () { ... }"`.

3. **Keine `isCustomElement`-Konfiguration nötig.** Solid reicht
   unbekannte Tags direkt ans DOM durch. Kein vue.compilerOptions,
   kein JSX-Override.

## Vollständiger Code

Den kompletten Source der Live-Demo oben findest du im v-map-Repo unter
[`examples/solid/`](https://github.com/pt9912/v-map/tree/main/examples/solid).
Der relevante Teil ist
[`src/App.tsx`](https://github.com/pt9912/v-map/blob/main/examples/solid/src/App.tsx).

## Siehe auch

- **[Getting Started](../../getting-started)** — generelles Setup
- **[CDN ohne Bundler](../cdn-esm)** — die jsDelivr-Lade-Strategie im Detail
- **[Error Handling](../error-handling)** — die `<v-map-error>` Komponente
  und das `vmap-error` Event
- **[Komponenten-API](../../api/components/)** — alle 19 Web Components
