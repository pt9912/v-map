# v-map mit React

Dieser Guide zeigt, wie du v-map in eine React-App einbindest. Die
Live-Demo unten ist die echte App aus
[`examples/react/`](https://github.com/pt9912/v-map/tree/main/examples/react)
des v-map-Repos, gebaut mit React 19 + Vite und in einem sandboxed
Iframe eingebettet.

## Live-Demo

@[example:react]

Die React-Demo zeigt dieselben Features wie der
[SvelteKit-Showcase](./sveltekit), nur mit React-19-Idiom:

- **Reactive Provider-Switch:** `useState<Provider>` ↔ `flavour`-Prop
  am `<v-map>`-Element. Provider-Wechsel ohne Re-Mount.
- **Reactive Zoom-Slider:** `useState<number>` ↔ `zoom`-Prop, direkt
  als Number-String an das Custom-Element gegeben.
- **Layer-Toggle:** GeoTIFF/GeoJSON-Buttons setzen State, JSX-`{cond
  && <element>}` blendet die `<v-map-layer-*>` Komponenten ein/aus.
- **`<v-map-error>` Toast:** deklarativer Fehler-Stapel unten rechts,
  ohne JavaScript-Listener-Code.
- **Programmatischer `vmap-error`-Listener:** klassisches `useEffect`
  + `addEventListener` Pattern auf einer `useRef<HTMLElement>` Referenz,
  weil React vor v19 Custom-Element-Events mit Bindestrich nicht über
  `on{Camelcase}` JSX-Props erreicht.
- **„Add broken WMS layer" Button:** triggert absichtlich einen
  Lade-Fehler, damit man die End-to-End Error-API live sieht.

## Setup für eigene Projekte

### 1. Vite-React-Projekt anlegen

```bash
pnpm create vite@latest my-vmap-app -- --template react-ts
cd my-vmap-app
pnpm install
```

### 2. v-map einbinden

Die einfachste und für Vite/React-Builds robusteste Methode ist, v-map
**nicht** über den npm-Loader zu bündeln, sondern direkt von jsDelivr
mit einem `<script type="module">` im `index.html` zu laden:

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My v-map App</title>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.3.0/dist/v-map/v-map.esm.js"
    ></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

::: warning Warum nicht `defineCustomElements()` aus `@npm9912/v-map/loader`?
Stencils Lazy-Loader benutzt `import.meta.url` zur Laufzeit, um seine
`*.entry.js` Chunks zu finden. Wenn Vite den Loader bündelt, landet
dieser unter `/_app/...` und Stencil 404t auf jeden Layer-Chunk.

Mit dem `<script type="module">`-Tag von jsDelivr läuft v-map als
ungebündeltes ES-Modul direkt im Browser, `import.meta.url` zeigt auf
die jsDelivr-CDN-URL und Stencil findet seine Chunks da auch.

Optional könnte man v-map auch lokal kopieren statt jsDelivr — siehe
[CDN-Guide](../cdn-esm) für Hintergrund.
:::

### 3. Custom Elements vor dem React-Mount abwarten

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

async function bootstrap() {
  // Warten bis v-map.esm.js geladen und alle Custom Elements registriert sind
  await customElements.whenDefined('v-map');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
```

### 4. JSX-Typen für die v-map Custom Elements

Damit TypeScript `<v-map>` und `<v-map-layer-osm>` akzeptiert, brauchst
du eine kleine Typaugmentation. Lege `src/v-map.d.ts` an:

```ts
import type { HTMLAttributes, DetailedHTMLProps } from 'react';

type CustomElementProps<T extends HTMLElement = HTMLElement> =
  DetailedHTMLProps<HTMLAttributes<T>, T> & {
    [key: string]: unknown;
  };

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'v-map': CustomElementProps;
      'v-map-builder': CustomElementProps;
      'v-map-layergroup': CustomElementProps;
      'v-map-layercontrol': CustomElementProps;
      'v-map-style': CustomElementProps;
      'v-map-error': CustomElementProps;
      'v-map-layer-osm': CustomElementProps;
      'v-map-layer-xyz': CustomElementProps;
      'v-map-layer-google': CustomElementProps;
      'v-map-layer-wms': CustomElementProps;
      'v-map-layer-wcs': CustomElementProps;
      'v-map-layer-wfs': CustomElementProps;
      'v-map-layer-geojson': CustomElementProps;
      'v-map-layer-geotiff': CustomElementProps;
      'v-map-layer-wkt': CustomElementProps;
      'v-map-layer-scatterplot': CustomElementProps;
      'v-map-layer-tile3d': CustomElementProps;
      'v-map-layer-terrain': CustomElementProps;
      'v-map-layer-terrain-geotiff': CustomElementProps;
    }
  }
}
```

Der Prop-Bag ist absichtlich offen — die Stencil-Komponenten validieren
ihre Props selbst. Wenn du strikte Typen pro Element willst, kannst du
sie aus `@npm9912/v-map/dist/types/components` importieren.

### 5. Erste Karte deklarativ

```tsx
// src/App.tsx
import { useState } from 'react';

export default function App() {
  const [zoom, setZoom] = useState(11);

  return (
    <main>
      <input
        type="range"
        min={2}
        max={18}
        value={zoom}
        onChange={e => setZoom(Number(e.target.value))}
      />

      <v-map flavour="ol" center="11.576,48.137" zoom={String(zoom)}>
        <v-map-error position="bottom-right" auto-dismiss="6000" />

        <v-map-layergroup group-title="Base" basemapid="osm">
          <v-map-layer-osm id="osm" label="OpenStreetMap" />
        </v-map-layergroup>
      </v-map>

      <style>{`v-map { display: block; width: 100%; height: 70vh; }`}</style>
    </main>
  );
}
```

Drag den Slider — die Karte zoomt direkt mit. React's normaler
Re-Render-Cycle propagiert die geänderte `zoom`-Prop ans Custom Element.

### 6. Reactive Layer hinzufügen oder ausblenden

Mit React's klassischem Conditional-JSX-Rendering:

```tsx
const [showOverlay, setShowOverlay] = useState(false);

return (
  <>
    <button onClick={() => setShowOverlay(v => !v)}>
      Toggle GeoJSON Overlay
    </button>

    <v-map flavour="ol">
      <v-map-layergroup group-title="Base" basemapid="osm">
        <v-map-layer-osm id="osm" />
      </v-map-layergroup>

      {showOverlay && (
        <v-map-layergroup group-title="Daten">
          <v-map-layer-geojson url="/data/points.geojson" />
        </v-map-layergroup>
      )}
    </v-map>
  </>
);
```

v-map registriert / disposed den Layer automatisch, sobald React das
Custom Element mountet bzw. unmountet. Kein imperativer
`map.removeLayer(...)`.

### 7. Error-Events programmatisch konsumieren

`vmap-error` bubblet von jedem Layer zur `<v-map>` hoch. In React 18
und auch in React 19 ist der robusteste Weg ein `useEffect` +
`addEventListener` über eine `useRef`:

```tsx
import { useEffect, useRef } from 'react';

type VMapErrorDetail = {
  type: 'network' | 'validation' | 'parse' | 'provider';
  message: string;
  attribute?: string;
  cause?: unknown;
};

export default function App() {
  const mapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    function onError(event: Event) {
      const detail = (event as CustomEvent<VMapErrorDetail>).detail;
      if (!detail) return;
      console.error('[vmap]', detail.type, detail.message);
      // hier z. B. in einen Zustand-Store dispatchen
    }

    map.addEventListener('vmap-error', onError);
    return () => map.removeEventListener('vmap-error', onError);
  }, []);

  return (
    <v-map ref={mapRef} flavour="ol">
      ...
    </v-map>
  );
}
```

Für reines Toast-Display ohne JS-Listener reicht aber das deklarative
`<v-map-error>` (siehe oben).

::: tip React 19 Custom-Element-Events
Ab React 19 kannst du theoretisch auch `onVmapError={...}` direkt am
JSX schreiben (React mappt dann auf `addEventListener`). Bei Events
mit Bindestrichen wie `vmap-error` funktioniert das aber nicht überall
verlässlich — der `useRef` + `useEffect` Pattern oben funktioniert in
allen React-Versionen.
:::

## Vollständiger Code

Den kompletten Source der Live-Demo oben findest du im v-map-Repo unter
[`examples/react/`](https://github.com/pt9912/v-map/tree/main/examples/react).
Der relevante Teil ist
[`src/App.tsx`](https://github.com/pt9912/v-map/blob/main/examples/react/src/App.tsx).

## Stolperfallen

1. **`defineCustomElements()` aus dem Loader bündeln.** Funktioniert in
   Vite-Builds NICHT, weil Stencils `import.meta.url` nach dem Bundling
   auf den falschen Pfad zeigt und die Layer-Chunks 404en. Immer den
   `<script type="module">` aus jsDelivr im `index.html` verwenden.
2. **JSX-Typen vergessen.** Ohne die Typaugmentation aus Schritt 4
   meckert TypeScript bei jedem `<v-map>` Element.
3. **React's Strict Mode + Map-Init.** v-map's Stencil-Komponenten sind
   robust gegen den doppelten Mount-Cycle von StrictMode, du brauchst
   nichts zu konfigurieren.
4. **Tailwind / CSS-Reset.** v-map's Stencil-Shadow-DOM ist isoliert,
   aber das Host-Element selbst hat keine eigenen Maße. Setze
   `display: block; width: ...; height: ...;` immer auf `<v-map>` selbst.

## Siehe auch

- **[Getting Started](../../getting-started)** — generelles Setup
- **[SvelteKit-Guide](./sveltekit)** — gleicher Showcase mit Svelte 5
- **[CDN ohne Bundler](../cdn-esm)** — wenn du gar keinen Build-Step willst
- **[Error Handling](../error-handling)** — die `<v-map-error>` Komponente und das `vmap-error` Event
- **[Komponenten-API](../../api/components/)** — alle 19 Web Components
