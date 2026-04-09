# v-map mit Next.js

Dieser Guide zeigt, wie du v-map in eine Next.js-App (App Router)
einbindest und als statische Site deployst. Die Live-Demo unten ist
die echte App aus
[`examples/nextjs/`](https://github.com/pt9912/v-map/tree/main/examples/nextjs)
des v-map-Repos, gebaut mit Next.js 15 + App Router + `output: 'export'`
und in einem sandboxed Iframe eingebettet.

## Live-Demo

@[example:nextjs]

Die Next.js-Demo zeigt dieselben Features wie die anderen
Framework-Showcases, plus ein paar Next.js-spezifische Pflichtteile:

- **`'use client'` Direktive** als allererste Zeile der Page-Datei,
  damit Next.js die Component nicht serverseitig prerendern will.
  Custom Elements brauchen das Browser-DOM und `customElements`-Registry,
  was im Node-SSR-Pass nicht existiert.
- **`<script type="module">` im Root-Layout** lädt v-map von jsDelivr.
- **`output: 'export'` in `next.config.ts`** macht aus der App eine
  fully static SPA — kein Next.js Server, keine SSR/ISR zur Laufzeit,
  alles wird beim Build prerendered.
- **`basePath` + `assetPrefix`** in der Next-Config sorgen dafür, dass
  alle internen Links und Asset-URLs den Sub-Path-Prefix (z. B.
  `/v-map/demos/nextjs`) bekommen, wenn die App unter einem Pfad
  deployed wird.
- **`{ready && <v-map>...}` Conditional Mount** bis der jsDelivr-Loader
  bereit ist — verhindert die kurze Phase nach Hydration, in der die
  Custom-Element-Klasse noch fehlt.

Sonst ist der Reactive-Pfad identisch zum [React-Guide](./react):
`useState` für State, `useEffect + useRef` für den Programmatic
`vmap-error` Listener, JSX Conditional Rendering für die Layer-Toggles.

## Setup für eigene Projekte

### 1. Next.js-Projekt anlegen

```bash
pnpm dlx create-next-app@latest my-vmap-app
cd my-vmap-app
```

In den Wizard-Fragen wählst du: TypeScript ✅, App Router ✅,
ESLint optional, Tailwind optional, `src/` directory deine Wahl.

### 2. Static Export aktivieren

```ts
// next.config.ts
import type { NextConfig } from 'next';

const baseEnv = process.env.VMAP_DOCS_BASE ?? '';
const basePath = baseEnv.replace(/\/$/, '');

const nextConfig: NextConfig = {
  // Generates a fully static SPA. No Next.js server, no SSR at runtime.
  output: 'export',

  // No image optimization in static export mode (no server to do it).
  images: { unoptimized: true },

  // For sub-path deployments only - leave undefined for root.
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
```

`pnpm build` schreibt die statische Site dann nach `out/` statt nach
`.next/`. Dieses Verzeichnis kannst du auf jeden statischen File-Server
hosten (GitHub Pages, Cloudflare Pages, Netlify, S3+CloudFront …).

::: warning Output-Modi
`output: 'export'` schließt `<Image>`-Optimierung, API-Routes,
Middleware und alle Server-Funktionen aus. Wenn dein Projekt diese
Features braucht, deploye Next.js stattdessen mit `output: 'standalone'`
auf einem Node-Server (Vercel, Cloudflare Workers, …) — der v-map-Teil
funktioniert genauso.
:::

### 3. v-map einbinden via `<script>` im Layout

Wie bei den anderen Frameworks: v-map nicht durch Next.js' Build
bündeln, sondern direkt von jsDelivr per `<script type="module">` im
Root-`layout.tsx` laden.

```tsx
// app/layout.tsx
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.1/dist/v-map/v-map.esm.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

::: warning Warum nicht `defineCustomElements()` aus `@npm9912/v-map/loader`?
Stencils Lazy-Loader benutzt `import.meta.url` zur Laufzeit, um seine
`*.entry.js` Chunks zu finden. Wenn Next.js' webpack/turbo-Build den
Loader bündelt, landet dieser unter `/_next/static/chunks/...` und
Stencil 404t auf jeden Layer-Chunk.

Mit dem `<script type="module">`-Tag von jsDelivr läuft v-map als
ungebündeltes ES-Modul direkt im Browser, `import.meta.url` zeigt auf
die jsDelivr-CDN-URL und Stencil findet seine Chunks da auch.
:::

### 4. Page als `'use client'` markieren und Custom Elements abwarten

```tsx
// app/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [zoom, setZoom] = useState(11);
  const [ready, setReady] = useState(false);

  // Wait for v-map to be loaded from jsDelivr before mounting the
  // <v-map> tree. Without the gate React would render <v-map> on
  // first paint, before customElements.define() has run, and the
  // element would just stay an empty unupgraded HTMLElement.
  useEffect(() => {
    customElements.whenDefined('v-map').then(() => setReady(true));
  }, []);

  return (
    <main>
      <input
        type="range"
        min={2}
        max={18}
        value={zoom}
        onChange={e => setZoom(Number(e.target.value))}
      />

      {ready && (
        <v-map flavour="ol" center="11.576,48.137" zoom={zoom}>
          <v-map-error position="bottom-right" auto-dismiss="6000" />
          <v-map-layergroup group-title="Base" basemapid="osm">
            <v-map-layer-osm id="osm" label="OpenStreetMap" />
          </v-map-layergroup>
        </v-map>
      )}
    </main>
  );
}
```

::: tip `'use client'` ist Pflicht
Im Next.js App Router ist **jede Component standardmäßig ein Server
Component**. Server Components können kein DOM, keine Browser-APIs,
kein `useState`, kein `useEffect` und schon gar keine Custom Elements
benutzen. Du musst die Direktive `'use client'` als allererste Zeile
der Datei setzen, sonst schlägt der Build mit einem React-Server-
Component-Error fehl.
:::

### 5. JSX-Typen für die v-map Custom Elements

Damit TypeScript `<v-map>` und `<v-map-layer-osm>` akzeptiert, brauchst
du eine kleine Typaugmentation. Lege `types/v-map.d.ts` an und
referenziere sie in `tsconfig.json` (Next.js zieht alles aus
`include` automatisch ein):

```ts
// types/v-map.d.ts
import type { HTMLAttributes, DetailedHTMLProps } from 'react';

type CustomElementProps<T extends HTMLElement = HTMLElement> =
  DetailedHTMLProps<HTMLAttributes<T>, T> & {
    [key: string]: unknown;
  };

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'v-map': CustomElementProps;
      'v-map-error': CustomElementProps;
      'v-map-layergroup': CustomElementProps;
      'v-map-layer-osm': CustomElementProps;
      // … die restlichen 15 v-map-Komponenten gleichermaßen
    }
  }
}
```

Identisch zum [React (Vite) Setup](./react#_4-jsx-typen-für-die-v-map-custom-elements).

### 6. Reactive Layer hinzufügen oder ausblenden

Mit React's klassischem Conditional-JSX-Rendering, identisch zum
React-Vite-Beispiel:

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    customElements.whenDefined('v-map').then(() => setReady(true));
  }, []);

  if (!ready) return null;

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
}
```

### 7. Error-Events programmatisch konsumieren

Identisch zum [React-Guide](./react#_7-error-events-programmatisch-konsumieren) —
`useRef` + `useEffect` + `addEventListener`. Die hier hinzugekommene
Wrinkle: das ganze passiert in einer `'use client'` Component, sonst
gibt's keinen React-Hook-Lebenszyklus.

## Vollständiger Code

Den kompletten Source der Live-Demo oben findest du im v-map-Repo unter
[`examples/nextjs/`](https://github.com/pt9912/v-map/tree/main/examples/nextjs).
Der relevante Teil ist
[`app/page.tsx`](https://github.com/pt9912/v-map/blob/main/examples/nextjs/app/page.tsx).

## Stolperfallen

1. **`'use client'` vergessen.** Ohne die Direktive versucht Next.js,
   die Page als Server Component zu prerendern. Du bekommst beim Build
   einen React-Server-Component-Error mit einem riesigen Stacktrace,
   der eigentlich nur „Browser API in Server Component" bedeutet.
   Pflichtschritt für jede Page, die v-map verwendet.
2. **`defineCustomElements()` aus dem Loader bündeln.** Funktioniert in
   Next.js nicht (gleicher Bug wie React/Vue/SvelteKit/Angular). Immer
   den `<script type="module">` aus jsDelivr im `app/layout.tsx`
   verwenden.
3. **`<v-map>` zu früh mounten.** Wenn du das `{ready && ...}` Gate
   weglässt, rendert React den Tag bevor die Custom-Element-Klasse
   registriert ist. Das Element bleibt ein unupgraded `HTMLElement`
   und nichts passiert. Symptom: leere Box, keine Fehlermeldung.
4. **Sub-Path-Deploy ohne `basePath`/`assetPrefix`.** Beide Configs
   müssen gesetzt werden, sonst landen die `_next/static/...` Assets
   beim falschen Pfad und du bekommst lauter 404er für JavaScript.
5. **`output: 'export'` Restriktionen.** Image-Optimization, API-Routes,
   Middleware, dynamic routes mit `dynamicParams: true` — alles
   verboten. Wenn du das brauchst, nimm den default `output: 'standalone'`
   und deploy auf einen Node-Server.
6. **`next.config.js` statt `next.config.ts`.** Beide funktionieren,
   aber `.ts` ist seit Next 15 die empfohlene Variante.

## Vergleich mit den anderen Frameworks

| Aspekt | Next.js | React (Vite) | SvelteKit | Vue 3 | Angular |
|---|---|---|---|---|---|
| Reactive State | `useState()` | `useState()` | `$state()` | `ref()` | `signal()` |
| Slider-Binding | `value onChange` | `value onChange` | `bind:value` | `v-model` | `[value] (input)` |
| Conditional Layer | `{cond && ...}` | `{cond && ...}` | `{#if}` | `v-if` | `@if` |
| Custom Element Event | `useRef + addEventListener` | `useRef + addEventListener` | `onvmap-error={...}` | `@vmap-error="..."` | `(vmap-error)="..."` |
| Custom Element Setup | `'use client'` + JSX types | JSX types | (kein Setup) | `isCustomElement` | `CUSTOM_ELEMENTS_SCHEMA` |
| Bundle First-Load (gzipped) | ~104 KB | ~62 KB | ~30 KB | ~27 KB | ~48 KB |
| Build-Mode für statische Site | `output: 'export'` | (Default) | `adapter-static` | (Default) | (Default) |
| Boilerplate | mittel | mittel | sehr niedrig | niedrig | hoch |

Next.js hat den größten First-Load-Bundle wegen des React Server Components
Runtime-Frameworks, das auch im static export mit-shipped wird. Wenn dir
das zu groß ist und du eigentlich nur eine SPA willst, ist das
Vite-React-Beispiel der direkte Vergleich (~62 KB statt 104 KB) bei
identischer User-Erfahrung.

## Siehe auch

- **[Getting Started](../../getting-started)** — generelles Setup
- **[React-Guide](./react)** — Vite-basierte React-Variante (kleinerer Bundle)
- **[SvelteKit-Guide](./sveltekit)** — gleicher Showcase mit Svelte 5
- **[Vue 3 Guide](./vue)** — gleicher Showcase mit Vue 3
- **[Angular Guide](./angular)** — gleicher Showcase mit Angular 19
- **[CDN ohne Bundler](../cdn-esm)** — wenn du gar keinen Build-Step willst
- **[Error Handling](../error-handling)** — die `<v-map-error>` Komponente und das `vmap-error` Event
- **[Komponenten-API](../../api/components/)** — alle 19 Web Components
