# v-map mit Nuxt 4

Dieser Guide zeigt, wie du v-map in eine Nuxt-4-App einbindest.
Die Live-Demo unten ist die echte App aus
[`examples/nuxt/`](https://github.com/pt9912/v-map/tree/main/examples/nuxt)
des v-map-Repos, gebaut mit `nuxt generate` (Nitro `static`-Preset)
und in einem sandboxed Iframe eingebettet.

## Live-Demo

@[example:nuxt]

Was die Demo zeigt:

- **Reactive Provider-Switch:** Dropdown ist `v-model`-gebunden an
  eine `ref<'ol' | 'leaflet' | 'deck' | 'cesium'>()`, die als
  `:flavour`-Prop ans `<v-map>`-Element fließt — die Karte schaltet
  zwischen den Providern um, ohne Re-Mount.
- **Reactive Zoom-Slider:** Slider mit `v-model.number` schreibt in
  eine `ref<number>()`, die als `:zoom` ans `<v-map>` gebunden ist.
  Der `@Watch('zoom')`-Handler in v-map propagiert die Änderung an
  den aktiven Provider und behält den aktuellen Center bei.
- **Layer-Toggle:** GeoTIFF- und GeoJSON-Buttons mutieren `ref()`s,
  Vue rendert die Layer-Komponenten per `v-if` ein und aus.
- **`<v-map-error>` Toast:** deklarativer Fehler-Stapel unten rechts,
  ohne JavaScript-Listener-Code.
- **Programmatischer `vmap-error`-Listener:** `@vmap-error` direkt
  am `<v-map>`-Element — typisches Vue-Custom-Event-Handling, weil
  Stencil-Events auch hier nativ bubbeln.
- **„Add broken WMS layer" Button:** triggert absichtlich einen
  Lade-Fehler, um die End-to-End Error-API live zu sehen.

## Setup für eigene Projekte

### 1. Projekt anlegen

```bash
pnpm create nuxt@latest my-vmap-app
cd my-vmap-app
pnpm install
```

Nuxt 4 nutzt das neue `app/`-Verzeichnis für Pages und Components,
und legt `nuxt.config.ts` ins Projekt-Root.

### 2. v-map installieren

```bash
pnpm add @npm9912/v-map
```

Die Provider (`ol`, `leaflet`, `cesium`, `@deck.gl/*`) brauchst du nur
als Dev-Dependencies für TypeScript-Typen, falls überhaupt — zur
Laufzeit lädt v-map seine Peer-Deps via Auto-Importmap nach.

### 3. Vue als Custom-Element-tolerant konfigurieren

Vue's Template-Compiler versucht standardmäßig, jeden Tag als
Vue-Komponente zu resolven. Damit `<v-map>` und seine Layer-Kinder als
native Custom Elements behandelt werden, braucht es eine Konfigurations-
Zeile in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'v-map' || tag.startsWith('v-map-'),
    },
  },
});
```

Ohne diesen Switch logged Nuxt bei jedem Render eine Warnung:
`[Vue warn]: Failed to resolve component: v-map`.

### 4. v-map-Loader im `<head>` einbinden

Wir empfehlen, v-map per `<script type="module">` aus jsDelivr zu laden,
**statt** den Stencil-Loader durch Nitros Vite-Build zu schleifen. Der
sauberste Weg in Nuxt ist `useHead`:

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
useHead({
  title: 'My v-map App',
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.1/dist/v-map/v-map.esm.js',
      type: 'module',
    },
  ],
});
</script>
```

::: warning Warum CDN statt Bundler
Stencils Lazy-Loader nutzt `import.meta.url`, um seine Sibling-`*.entry.js`-
Chunks zur Laufzeit zu finden. Wenn ein Bundler (Vite, Webpack, Nitro)
den Loader ingestet, landet die URL bei `/_nuxt/abc.js` und Stencil 404t
auf jedem einzelnen Layer-Chunk. Der jsDelivr-Pfad lässt
Stencils Chunk-Resolution unverändert. Siehe den
[CDN-Guide](../cdn-esm) für die Hintergründe.
:::

### 5. Erste Karte deklarativ

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
const zoom = ref(11);

useHead({
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.1/dist/v-map/v-map.esm.js',
      type: 'module',
    },
  ],
});
</script>

<template>
  <v-map flavour="ol" center="11.576,48.137" :zoom="zoom">
    <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>

    <v-map-layergroup group-title="Base" basemapid="osm">
      <v-map-layer-osm id="osm" label="OpenStreetMap"></v-map-layer-osm>
    </v-map-layergroup>
  </v-map>

  <input v-model.number="zoom" type="range" min="2" max="18" />
</template>

<style>
v-map {
  display: block;
  width: 100%;
  height: 70vh;
}
</style>
```

Drag den Slider — die Karte zoomt direkt mit. Vue erkennt die geänderte
`zoom`-Prop, der `@Watch('zoom')`-Handler in v-map (seit v0.4.0) ruft
den Provider mit dem aktuellen Center neu auf.

### 6. Reactive Layer hinzufügen oder ausblenden

Layer können per `v-if` bedingt im DOM stehen. v-map disposed den
jeweiligen Layer beim Verbergen automatisch:

```vue
<script setup lang="ts">
const showOverlay = ref(false);
</script>

<template>
  <button @click="showOverlay = !showOverlay">Toggle Overlay</button>

  <v-map flavour="ol">
    <v-map-layergroup group-title="Base" basemapid="osm">
      <v-map-layer-osm id="osm"></v-map-layer-osm>
    </v-map-layergroup>

    <v-map-layergroup v-if="showOverlay" group-title="Daten">
      <v-map-layer-geojson url="/data/points.geojson"></v-map-layer-geojson>
    </v-map-layergroup>
  </v-map>
</template>
```

### 7. Error-Events programmatisch konsumieren

`vmap-error` bubblet von jedem Layer zu `<v-map>` hoch. Vue's `@`-
Syntax bindet auf Custom-Events direkt — kein
`addEventListener`-Boilerplate nötig:

```vue
<script setup lang="ts">
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
  // hier z. B. in einen Pinia-Store pushen
}
</script>

<template>
  <v-map flavour="ol" @vmap-error="onMapError">
    <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>
    ...
  </v-map>
</template>
```

Für reines Toast-Display ohne JS-Listener reicht aber das deklarative
`<v-map-error>`.

## Statisches Generieren

Nuxt 4 produziert mit `nuxt generate` ein vollständig statisches
`.output/public/`-Verzeichnis (Nitro `static`-Preset), das du auf jedem
File-Server hosten kannst:

```bash
pnpm generate
```

Wenn du unter einem Subpfad deployst (z. B. GitHub Pages):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    baseURL: process.env.BASE_PATH ?? '/my-vmap-app/',
  },
});
```

## Stolperfallen

1. **`isCustomElement` vergessen.** Ohne den Compiler-Switch logged
   Vue bei jedem Render Warnungen und kann (je nach Vue-Version) sogar
   versuchen, `<v-map>` als Komponente zu mounten. Immer in
   `nuxt.config.ts` setzen, nicht erst per Plugin.

2. **`process.client`-Guards überflüssig.** Du brauchst keine
   `<ClientOnly>`-Wrapper um `<v-map>`. Nuxt prerendert die Page-Shell
   inklusive `<v-map>`-Markup, weil das ja nur statisches HTML ist —
   die Custom-Element-Upgrade-Logik startet erst, wenn der jsDelivr-
   Loader im Browser ausgeführt wird. Zur SSR-Zeit ist `<v-map>` ein
   einfacher unbekannter Tag.

3. **`nuxt build` vs `nuxt generate`.** `build` produziert einen
   Server-Bundle (Node/edge), `generate` einen statischen Export. Für
   eine v-map-only Single-Page-App willst du fast immer `generate`,
   weil die ganze Logik client-side ist und kein Backend gebraucht
   wird.

4. **Vite optimizeDeps verschluckt v-map.** Wenn beim Dev-Server v-map
   Chunks fehlen, in `nuxt.config.ts`:
   ```ts
   vite: {
     optimizeDeps: {
       exclude: ['@npm9912/v-map'],
     },
   }
   ```
   v-map ist ESM und braucht kein Pre-Bundling.

## Vollständiger Code

Den kompletten Source der Live-Demo oben findest du im v-map-Repo unter
[`examples/nuxt/`](https://github.com/pt9912/v-map/tree/main/examples/nuxt).
Der relevante Teil ist
[`app/pages/index.vue`](https://github.com/pt9912/v-map/blob/main/examples/nuxt/app/pages/index.vue).

## Siehe auch

- **[Vue 3](./vue)** — die Standalone-Vue-Variante (ohne Nuxt)
- **[Getting Started](../../getting-started)** — generelles Setup
- **[CDN ohne Bundler](../cdn-esm)** — die jsDelivr-Lade-Strategie im Detail
- **[Error Handling](../error-handling)** — die `<v-map-error>` Komponente
  und das `vmap-error` Event
- **[Komponenten-API](../../api/components/)** — alle 19 Web Components
