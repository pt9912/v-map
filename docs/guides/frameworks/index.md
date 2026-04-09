# Framework-Vergleich

v-map ist ein Web-Component-Library und funktioniert grundsätzlich in
**jedem** Framework. Die Integration ist aber nicht überall gleich
aufwändig. Diese Seite vergleicht alle 10 Framework-Demos aus dem
[`examples/`](https://github.com/pt9912/v-map/tree/main/examples)-
Verzeichnis des v-map-Repos.

## Vergleichstabelle

### Architektur

| Framework | Typ | Server-Runtime | Build-Tool | Demo-JS (kB) |
|-----------|-----|----------------|------------|-------------:|
| [Astro](./astro) | Static-Site-Generator | nein | Astro/Vite | ~3 (inline) |
| [Solid](./solid) | SPA (Client-only) | nein | Vite | 16 |
| [Lit](./lit) | SPA (Client-only) | nein | Vite | 29 |
| [Vue 3](./vue) | SPA (Client-only) | nein | Vite | 67 |
| [SvelteKit](./sveltekit) | Full-Stack (SSR/SSG) | Node/Edge | Vite | 86 |
| [SolidStart](./solid-start) | Full-Stack (SSR/SSG) | Node/Edge | Vinxi | 109 |
| [Angular](./angular) | SPA (Client-only) | nein | esbuild | 155 |
| [Nuxt 4](./nuxt) | Full-Stack (SSR/SSG) | Node/Nitro | Vite | 188 |
| [React](./react) | SPA (Client-only) | nein | Vite | 196 |
| [Next.js](./nextjs) | Full-Stack (SSR/SSG) | Node/Edge | Webpack/Turbo | 790 |

::: tip Demo-JS = nur der Framework-Overhead
Die Größen oben enthalten **nicht** v-map selbst (das wird per
jsDelivr-CDN geladen), sondern nur das Framework-Runtime + die
Showcase-App-Logik. Astro ist quasi 0, weil es keinen Framework-
Runtime ins Bundle schreibt — der Showcase ist reines Inline-JS.
:::

### v-map Integration

| Framework | Custom-Element-Support | SSR-Workaround | Event-Binding | Config-Aufwand |
|-----------|----------------------|----------------|---------------|----------------|
| [Astro](./astro) | nativ | keiner nötig | `addEventListener` | 0 Zeilen |
| [Solid](./solid) | nativ | keiner (kein SSR) | `on:event-name` | 0 Zeilen |
| [Lit](./lit) | nativ (WC selbst) | keiner (kein SSR) | `@event-name` | 0 Zeilen |
| [SvelteKit](./sveltekit) | nativ | `ssr = false` | `onevent-name` | 1 Zeile |
| [SolidStart](./solid-start) | nativ | `clientOnly()` | `on:event-name` | 3 Zeilen |
| [Vue 3](./vue) | `isCustomElement` Config | keiner (kein SSR) | `@event-name` | 3 Zeilen |
| [Nuxt 4](./nuxt) | `isCustomElement` Config | optional* | `@event-name` | 3 Zeilen |
| [React](./react) | JSX `IntrinsicElements` | keiner (kein SSR) | `addEventListener` via ref | 5+ Zeilen |
| [Angular](./angular) | `CUSTOM_ELEMENTS_SCHEMA` | keiner (kein SSR) | `(event-name)` | 2 Zeilen |
| [Next.js](./nextjs) | JSX `IntrinsicElements` | `'use client'` | `addEventListener` via ref | 6+ Zeilen |

\* Nuxt prerendert die v-map-Markup als statisches HTML — das ist
harmlos, weil `<v-map>` zur SSR-Zeit nur ein unbekannter Tag ist.
Erst im Browser upgradet der Stencil-Loader das Element.

### Zoom-Slider Bidirektional (ab v0.5.0)

| Framework | Slider → Map | Map → Slider (`vmap-view-change`) |
|-----------|-------------|-----------------------------------|
| Astro | `setAttribute('zoom', z)` | `addEventListener('vmap-view-change', ...)` |
| SvelteKit | `{zoom}` (Shorthand-Bind) | `onvmap-view-change={handler}` |
| React | `zoom={zoom}` + ref | `addEventListener` in `useEffect` |
| Vue 3 | `:zoom="zoom"` | `@vmap-view-change="handler"` |
| Angular | `[attr.zoom]="zoom()"` (Signal) | `(vmap-view-change)="handler($event)"` |
| Next.js | `zoom={zoom}` + ref | `addEventListener` in `useEffect` |
| Nuxt 4 | `:zoom="zoom"` | `@vmap-view-change="handler"` |
| Lit | `zoom=${this.zoom}` | `@vmap-view-change=${this.handler}` |
| Solid | `zoom={zoom()}` (Signal-Getter) | `on:vmap-view-change={handler}` |
| SolidStart | `zoom={zoom()}` | `on:vmap-view-change={handler}` |

## Empfehlungen

### Wann welches Framework?

**"Ich brauche nur eine Karte auf einer statischen Seite"**
::: tip Astro oder CDN
Kein Framework-Overhead, kein Build nötig (CDN), oder minimaler Build
(Astro). Siehe [CDN ohne Bundler](../cdn-esm) oder [Astro-Guide](./astro).
:::

**"Ich habe ein bestehendes React/Vue/Svelte/Angular-Projekt"**
::: tip Das Framework, das du schon nutzt
v-map ist ein Web Component — es funktioniert in jedem Framework.
Nimm das, was dein Team kennt. Der Integrationsaufwand unterscheidet
sich um maximal 5 Zeilen Config.
:::

**"Ich brauche SSR / SEO / Server-Side Data Loading"**
::: tip SvelteKit, Nuxt 4 oder Next.js
Alle drei unterstützen v-map mit einem einzigen SSR-Opt-out pro Route.
SvelteKit hat den kleinsten Bundle, Next.js das größte Ökosystem,
Nuxt die engste Vue-Integration.
:::

**"Ich will maximale Performance bei minimaler Bundle-Größe"**
::: tip Solid oder Lit
Solid (16 kB) hat fine-grained Reactivity ohne Virtual DOM.
Lit (29 kB) ist Web Components pur — ideal als WC-zu-WC-Interop.
Beide brauchen null Custom-Element-Config.
:::

**"Ich will zwei Web-Component-Libraries zusammen verwenden"**
::: tip Lit
Lit und v-map sind beide Custom-Element-basiert. `<vmap-showcase>`
hostet `<v-map>` in seinem Shadow Root, ohne Wrapper oder Brücke.
Stencil-Events mit `composed: true` steigen über die Shadow-Boundary.
:::

## Gemeinsame Muster

Unabhängig vom Framework gelten für alle v-map-Integrationen dieselben
Grundregeln:

1. **v-map per CDN laden, nicht bundlen.** Stencil's Lazy-Loader nutzt
   `import.meta.url` zur Chunk-Auflösung. Wenn ein Bundler den Loader
   ingestet, brechen die URLs. Siehe [CDN-Guide](../cdn-esm).

2. **`v-map { display: block; width: 100%; height: ... }` setzen.**
   Custom Elements sind inline by default. Ohne Block-Display ist die
   Karte 0px hoch.

3. **Zoom/Center als Props binden, nicht per `map.setView()`.** Die
   `@Watch`-Handler in v-map (ab v0.4.0) propagieren Prop-Änderungen
   automatisch an den aktiven Provider.

4. **`vmap-view-change` für den Rückkanal nutzen.** Wenn der User
   direkt in der Karte zoomt/pant (Mausrad, Pinch), feuert dieses
   Event mit dem neuen `{ center, zoom }`. Den Slider damit syncen
   (ab v0.5.0).

5. **`<v-map-error>` für deklaratives Error-Handling.** Einfach als
   Kind von `<v-map>` einfügen — keine JavaScript-Listener nötig
   für die Toast-Anzeige.

## Siehe auch

- **[Getting Started](../../getting-started)** — generelles Setup
- **[CDN ohne Bundler](../cdn-esm)** — die jsDelivr-Lade-Strategie
- **[Error Handling](../error-handling)** — `<v-map-error>` und das `vmap-error` Event
- **[Komponenten-API](../../api/components/)** — alle Web Components
- **[Layer-Matrix](../../layers/matrix)** — Provider ↔ Layer Kompatibilität
