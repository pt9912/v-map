# v-map mit SvelteKit

Dieser Guide zeigt, wie du v-map in eine SvelteKit-App einbindest.
Die Live-Demo unten ist die echte App aus
[`examples/sveltekit/`](https://github.com/pt9912/v-map/tree/main/examples/sveltekit)
des v-map-Repos, gebaut mit `@sveltejs/adapter-static` und in einem
sandboxed Iframe eingebettet.

## Live-Demo

@[example:sveltekit]

Was die Demo zeigt:

- **Reactive Provider-Switch:** Dropdown ändert die `flavour`-Prop, die
  Karte schaltet zwischen OpenLayers, Leaflet, Deck.gl und Cesium um —
  ohne `map.destroy()`, ohne Re-Mount.
- **Reactive Zoom-Slider:** Slider ist `bind:value`-gebunden an einen
  Svelte-Zustand, der direkt als `zoom`-Prop ans `<v-map>`-Element fließt.
- **Layer-Toggle:** GeoTIFF-Buttons setzen `visible` auf einer
  `<v-map-layer-geotiff>`-Komponente, GeoJSON-Buttons hängen einen
  Vector-Layer per Conditional-Rendering rein.
- **`<v-map-error>` Toast:** deklarativer Fehler-Stapel unten rechts,
  ohne JavaScript-Listener-Code.
- **Programmatischer `vmap-error`-Listener:** dasselbe Event landet
  zusätzlich im Logs-Panel rechts — typischer Pattern wenn du Fehler in
  einen App-State-Store pushen willst.
- **„Add broken WMS layer" Button:** triggert absichtlich einen Lade-Fehler,
  damit man die End-to-End Error-API in Aktion sieht.

## Setup für eigene Projekte

### 1. Projekt anlegen

```bash
pnpm create svelte@latest my-vmap-app
cd my-vmap-app
pnpm install
```

### 2. v-map und Provider installieren

```bash
pnpm add @npm9912/v-map
# plus die Provider die du benutzen willst
pnpm add ol           # für flavour="ol"
pnpm add leaflet      # für flavour="leaflet"
```

::: tip Auto-Importmap
v-map injiziert standardmäßig eine Browser-Importmap, die Peer-Deps wie
`ol`, `leaflet`, `@deck.gl/core` etc. zur Laufzeit von esm.sh nachlädt.
Du kannst diese also auch ungebundelt nutzen — dann brauchst du `pnpm add ol`
und Co. nur für TypeScript-Typen, nicht zur Laufzeit.
Siehe [CDN-Guide](../cdn-esm) für Details.
:::

### 3. Custom Elements registrieren

`<v-map>` und alle Layer-Komponenten sind Stencil-basierte Custom Elements.
Sie müssen einmal beim Mount der Seite registriert werden:

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  onMount(async () => {
    const { defineCustomElements } = await import('@npm9912/v-map/loader');
    defineCustomElements();
  });
</script>
```

Wichtig: das `await import(...)` muss im `onMount` stehen (nicht im
Modul-Top-Level), weil der Stencil-Loader Browser-APIs verwendet, die
unter SvelteKit-SSR nicht existieren.

### 4. SSR ausschalten für Routen mit `<v-map>`

In jeder Route, die v-map verwendet, in einer `+page.ts` oder `+layout.ts`:

```ts
// src/routes/+layout.ts
export const ssr = false;
```

Alternativ pro Route:
```ts
// src/routes/map/+page.ts
export const ssr = false;
```

Ohne diesen Switch versucht SvelteKit die Seite serverseitig vorzurendern,
und v-map crashes (kein DOM, kein customElements). Mit `ssr = false`
liefert SvelteKit eine leere Hülle aus, der Client mountet alles dann
nach der Hydration.

### 5. Erste Karte deklarativ

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let zoom = $state(11);

  onMount(async () => {
    const { defineCustomElements } = await import('@npm9912/v-map/loader');
    defineCustomElements();
  });
</script>

<v-map flavour="ol" center="11.576,48.137" zoom={String(zoom)}>
  <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>

  <v-map-layergroup group-title="Base" basemapid="osm">
    <v-map-layer-osm id="osm" label="OpenStreetMap"></v-map-layer-osm>
  </v-map-layergroup>
</v-map>

<input type="range" min="2" max="18" bind:value={zoom} />

<style>
  v-map {
    display: block;
    width: 100%;
    height: 70vh;
  }
</style>
```

Drag den Slider — die Karte zoomt direkt mit. Svelte erkennt die
geänderte `zoom`-Prop und propagiert sie an das Custom-Element.

### 6. Reactive Layer hinzufügen oder ausblenden

Layer können per Svelte-`{#if}` Block bedingt im DOM stehen:

```svelte
<script lang="ts">
  let showOverlay = $state(false);
</script>

<button onclick={() => (showOverlay = !showOverlay)}>
  Toggle GeoJSON Overlay
</button>

<v-map flavour="ol">
  <v-map-layergroup group-title="Base" basemapid="osm">
    <v-map-layer-osm id="osm"></v-map-layer-osm>
  </v-map-layergroup>

  {#if showOverlay}
    <v-map-layergroup group-title="Daten">
      <v-map-layer-geojson
        url="/data/points.geojson"
      ></v-map-layer-geojson>
    </v-map-layergroup>
  {/if}
</v-map>
```

v-map registriert / dispose-t den Layer automatisch, sobald Svelte das
Custom-Element ein- oder ausblendet. Kein imperativer
`map.removeLayer(...)`.

### 7. Error-Events programmatisch konsumieren

`vmap-error` bubblet von jedem Layer zu `<v-map>` hoch. Du kannst es
deklarativ via `onvmap-error` binden oder einen globalen Store-Listener
einhängen:

```svelte
<script lang="ts">
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
    // hier z. B. in einen Svelte-Store pushen
  }
</script>

<v-map flavour="ol" onvmap-error={onMapError}>
  ...
</v-map>
```

Für reines Toast-Display ohne JS-Listener reicht aber das deklarative
`<v-map-error>` (siehe oben).

## Production-Build mit `adapter-static`

Wenn du die App als statische Site deployst (z. B. auf GitHub Pages,
Netlify, Vercel-Static), brauchst du `@sveltejs/adapter-static`:

```bash
pnpm add -D @sveltejs/adapter-static
```

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true,
    }),
    paths: {
      // Wenn unter Subpath deployed: '/my-vmap-app'
      base: process.env.BASE_PATH ?? '',
    },
  },
};
```

`pnpm build` produziert dann ein vollständig statisches `build/`-Verzeichnis,
das du auf jedem File-Server hosten kannst.

## Stolperfallen

1. **`ssr = true` (Default) bricht v-map.** Immer `export const ssr = false`
   in der Layout- oder Page-`+page.ts` setzen.

2. **`defineCustomElements()` doppelt aufgerufen.** Wenn du den Loader
   in mehreren Routen aufrufst, ist das harmlos — `customElements.define()`
   ignoriert Doubletten. Aber sauberer ist es im Top-Level Layout.

3. **Vite optimizeDeps verschluckt v-map.** Wenn beim Dev-Server v-map
   Chunks fehlen, in `vite.config.ts`:
   ```ts
   optimizeDeps: {
     exclude: ['@npm9912/v-map'],
   }
   ```
   v-map ist ESM und braucht kein Pre-Bundling.

4. **Leaflet braucht einen Vite-Alias.** Im Repo-Demo machen wir das via:
   ```ts
   // vite.config.ts
   resolve: {
     alias: {
       leaflet: 'leaflet/dist/leaflet-src.esm.js',
     },
   }
   ```
   Sonst lädt Vite die UMD-Variante, die zur Laufzeit Probleme machen kann.

5. **Cesium braucht statische Assets.** Wenn du `flavour="cesium"`
   verwendest, kopiert Cesium beim Build seine Worker- und Asset-Dateien.
   Siehe das Vite-Cesium-Plugin für Details.

## Vollständiger Code

Den kompletten Source der Live-Demo oben findest du im v-map-Repo unter
[`examples/sveltekit/`](https://github.com/pt9912/v-map/tree/main/examples/sveltekit).
Der relevante Teil ist
[`src/routes/+page.svelte`](https://github.com/pt9912/v-map/blob/main/examples/sveltekit/src/routes/%2Bpage.svelte).

## Siehe auch

- **[Getting Started](../../getting-started)** — generelles Setup
- **[CDN ohne Bundler](../cdn-esm)** — wenn du gar keinen Build-Step willst
- **[Error Handling](../error-handling)** — die `<v-map-error>` Komponente und das `vmap-error` Event
- **[Komponenten-API](../../api/components/)** — alle 19 Web Components
