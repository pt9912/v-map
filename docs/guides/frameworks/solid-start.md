# v-map mit SolidStart

Dieser Guide zeigt, wie du v-map in eine SolidStart-App einbindest.
Die Live-Demo unten ist die echte App aus
[`examples/solid-start/`](https://github.com/pt9912/v-map/tree/main/examples/solid-start)
des v-map-Repos, gebaut mit `vinxi build` (preset: `static`) und in
einem sandboxed Iframe eingebettet.

## Live-Demo

@[example:solid-start]

SolidStart ist das SSR/SSG-Meta-Framework für Solid — vergleichbar mit
Next.js (React) oder Nuxt (Vue).

## Setup für eigene Projekte

### 1. Projekt anlegen

```bash
pnpm create solid@latest my-vmap-app
cd my-vmap-app
pnpm install
```

Wähle im Wizard **SolidStart** als Template.

### 2. v-map installieren

```bash
pnpm add @npm9912/v-map
```

### 3. v-map-Loader im Server-Entry einbinden

SolidStart rendert das `<html>`-Dokument serverseitig in
`src/entry-server.tsx`. Der jsDelivr `<script>`-Tag gehört dort in
den `<head>`:

```tsx
// src/entry-server.tsx
import { createHandler, StartServer } from '@solidjs/start/server';

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="de">
        <head>
          <meta charset="utf-8" />
          <title>My v-map App</title>
          <script
            type="module"
            src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.5.0/dist/v-map/v-map.esm.js"
          />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
```

### 4. v-map per `clientOnly` aus dem SSR ausschließen

v-map braucht `customElements`, `document` und `window`. Mit
SolidStart's `clientOnly()` renderst du die Karten-Komponente nur
im Browser:

```tsx
// src/routes/index.tsx
import { clientOnly } from '@solidjs/start';

const MapShowcase = clientOnly(() => import('~/components/MapShowcase'));

export default function Home() {
  return <MapShowcase />;
}
```

Die `MapShowcase`-Komponente nutzt dann `createSignal`, `<Show>`,
`on:event-name` etc. genau wie im
[Solid-Guide (ohne SSR)](./solid) beschrieben.

### 5. Statisches Generieren

Setze in `app.config.ts` das `static`-Preset:

```ts
// app.config.ts
import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  server: {
    preset: 'static',
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },
});
```

`vinxi build` erzeugt dann `.output/public/` — ein statisches
Verzeichnis, das du auf jedem File-Server hosten kannst.

## Stolperfallen

1. **`clientOnly` ist Pflicht.** Ohne den Wrapper crasht der
   Prerender-Pass, weil `customElements` und `document` im SSR-
   Kontext nicht existieren. `clientOnly()` rendert serverseitig ein
   leeres Placeholder-`<div>` und hydriert erst im Browser.

2. **`on:event-name` für Custom Events.** Solid's camelCase
   `onEventName` nutzt Event Delegation und erreicht keine Custom
   Events. Die `on:` Directive (`on:vmap-error`) ruft echtes
   `addEventListener` auf.

3. **Signal-Getter im JSX aufrufen.** `zoom={zoom()}` mit `()` —
   ohne den Getter-Aufruf bindet Solid die Funktion statt den Wert.

4. **Vinxi vs Vite.** SolidStart baut mit Vinxi, nicht direkt mit
   Vite. `app.config.ts` ist der richtige Ort für Build-Config, nicht
   `vite.config.ts`.

## Vollständiger Code

Den kompletten Source der Live-Demo oben findest du im v-map-Repo unter
[`examples/solid-start/`](https://github.com/pt9912/v-map/tree/main/examples/solid-start).
Die relevanten Teile sind
[`src/routes/index.tsx`](https://github.com/pt9912/v-map/blob/main/examples/solid-start/src/routes/index.tsx)
und
[`src/components/Showcase.tsx`](https://github.com/pt9912/v-map/blob/main/examples/solid-start/src/components/Showcase.tsx).

## Siehe auch

- **[Solid (ohne SSR)](./solid)** — die Standalone-Vite-Variante
- **[Getting Started](../../getting-started)** — generelles Setup
- **[CDN ohne Bundler](../cdn-esm)** — die jsDelivr-Lade-Strategie im Detail
- **[Komponenten-API](../../api/components/)** — alle 19 Web Components
