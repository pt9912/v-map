# v-map mit Vue 3

Dieser Guide zeigt, wie du v-map in eine Vue 3 Single-Page-App
einbindest. Die Live-Demo unten ist die echte App aus
[`examples/vue/`](https://github.com/pt9912/v-map/tree/main/examples/vue)
des v-map-Repos, gebaut mit Vue 3 + Vite und in einem sandboxed Iframe
eingebettet.

## Live-Demo

@[example:vue]

Die Vue-Demo zeigt dieselben Features wie der
[SvelteKit-](./sveltekit) und [React-Showcase](./react), nur mit
Vue-3-Composition-API-Idiom:

- **Reactive Provider-Switch:** `ref<Provider>('ol')` ↔ `flavour`-Prop
  am `<v-map>`-Element via `:flavour="provider"`. Provider-Wechsel ohne
  Re-Mount.
- **Reactive Zoom-Slider:** `ref<number>(11)` mit `v-model.number`
  am Slider, direkt gebunden via `:zoom="zoom"`. Vue 3 setzt den
  Number-Wert als JS-Property auf das Custom Element, Stencil's
  `@Prop() zoom: number` empfängt das direkt.
- **Layer-Toggle:** `<v-map-layer-*>` mit `v-if` ein-/ausgeblendet,
  GeoTIFF-Buttons setzen `geotiffUrl.value`, GeoJSON-Buttons setzen
  `geojson.value`.
- **`<v-map-error>` Toast:** deklarativer Fehler-Stapel unten rechts,
  ohne JavaScript-Listener-Code.
- **Programmatischer `vmap-error`-Listener:** Vue 3 unterstützt
  Custom-Element-Events mit Bindestrich direkt über die `@vmap-error`
  Template-Syntax — kein `useRef`/`addEventListener` Boilerplate wie in
  React 18.
- **„Add broken WMS layer" Button:** triggert absichtlich einen
  Lade-Fehler, damit man die End-to-End Error-API live sieht.

## Setup für eigene Projekte

### 1. Vite-Vue-Projekt anlegen

```bash
pnpm create vite@latest my-vmap-app -- --template vue-ts
cd my-vmap-app
pnpm install
```

### 2. v-map einbinden

Die für Vite/Vue-Builds robusteste Methode ist, v-map **nicht** über
den npm-Loader zu bündeln, sondern direkt von jsDelivr mit einem
`<script type="module">` im `index.html` zu laden:

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
      src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.2/dist/v-map/v-map.esm.js"
    ></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

::: warning Warum nicht `defineCustomElements()` aus `@npm9912/v-map/loader`?
Stencils Lazy-Loader benutzt `import.meta.url` zur Laufzeit, um seine
`*.entry.js` Chunks zu finden. Wenn Vite den Loader bündelt, landet
dieser unter `/assets/...` und Stencil 404t auf jeden Layer-Chunk.

Mit dem `<script type="module">`-Tag von jsDelivr läuft v-map als
ungebündeltes ES-Modul direkt im Browser, `import.meta.url` zeigt auf
die jsDelivr-CDN-URL und Stencil findet seine Chunks da auch.

Siehe [CDN-Guide](../cdn-esm) für Hintergrund.
:::

### 3. Vue's Template-Compiler über die Custom Elements informieren

Wichtigster Vue-spezifischer Schritt: Vue's Template-Compiler muss
wissen, dass `<v-map>` und `<v-map-*>` Tags **native Custom Elements**
sind und keine Vue-Komponenten. Sonst meckert Vue zur Laufzeit mit
„Failed to resolve component v-map" für jedes einzelne Tag.

Das wird in `vite.config.ts` über die Compiler-Option
`isCustomElement` konfiguriert:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'v-map' || tag.startsWith('v-map-'),
        },
      },
    }),
  ],
});
```

### 4. Custom Elements vor dem Vue-Mount abwarten

```ts
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';

async function bootstrap() {
  // Warten bis v-map.esm.js geladen und alle Custom Elements registriert sind
  await customElements.whenDefined('v-map');
  createApp(App).mount('#app');
}

bootstrap();
```

### 5. Erste Karte deklarativ

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const zoom = ref(11);
</script>

<template>
  <main>
    <input type="range" min="2" max="18" v-model.number="zoom" />

    <v-map flavour="ol" center="11.576,48.137" :zoom="zoom">
      <v-map-error position="bottom-right" auto-dismiss="6000" />

      <v-map-layergroup group-title="Base" basemapid="osm">
        <v-map-layer-osm id="osm" label="OpenStreetMap" />
      </v-map-layergroup>
    </v-map>
  </main>
</template>

<style scoped>
v-map {
  display: block;
  width: 100%;
  height: 70vh;
}
</style>
```

Drag den Slider — die Karte zoomt direkt mit. Vue's Reactivity-System
propagiert die geänderte `zoom`-ref ans Custom-Element-Attribut.

::: tip Number-Props direkt binden
Stencil's `@Prop() zoom: number` empfängt entweder einen JS-Property-
Set oder ein HTML-Attribut. Vue 3 erkennt bei `:zoom="zoom"`, dass das
Custom Element eine `zoom`-Property hat und setzt sie als Number direkt
— kein `String(...)` Cast nötig. Genauso für `opacity`, `z-index` und
andere Number-Props.
:::

### 6. Reactive Layer hinzufügen oder ausblenden

Mit Vue's klassischem `v-if` Conditional-Rendering:

```vue
<script setup lang="ts">
import { ref } from 'vue';

const showOverlay = ref(false);
</script>

<template>
  <button @click="showOverlay = !showOverlay">
    Toggle GeoJSON Overlay
  </button>

  <v-map flavour="ol">
    <v-map-layergroup group-title="Base" basemapid="osm">
      <v-map-layer-osm id="osm" />
    </v-map-layergroup>

    <v-map-layergroup v-if="showOverlay" group-title="Daten">
      <v-map-layer-geojson url="/data/points.geojson" />
    </v-map-layergroup>
  </v-map>
</template>
```

v-map registriert / disposed den Layer automatisch, sobald Vue das
Custom Element mountet bzw. unmountet. Kein imperativer
`map.removeLayer(...)`.

### 7. Error-Events programmatisch konsumieren

`vmap-error` bubblet von jedem Layer zu `<v-map>` hoch. In Vue 3 reicht
ein `@vmap-error` direkt im Template — Vue mappt das auf einen
`addEventListener` für das Custom Event:

```vue
<script setup lang="ts">
interface VMapErrorDetail {
  type: 'network' | 'validation' | 'parse' | 'provider';
  message: string;
  attribute?: string;
  cause?: unknown;
}

function onMapError(event: Event) {
  const detail = (event as CustomEvent<VMapErrorDetail>).detail;
  if (!detail) return;
  console.error('[vmap]', detail.type, detail.message);
  // hier z. B. in einen Pinia-Store dispatchen
}
</script>

<template>
  <v-map flavour="ol" @vmap-error="onMapError">
    ...
  </v-map>
</template>
```

Für reines Toast-Display ohne JS-Listener reicht aber das deklarative
`<v-map-error>` (siehe oben).

::: tip Vue 3 Custom-Element-Events
Vue 3 versteht alle DOM-Events nativ — auch CustomEvents mit
Bindestrichen wie `vmap-error`, `map-provider-ready` etc. Im Template
wird daraus `@vmap-error` und `@map-provider-ready`. Kein Mapping,
kein Casting, kein `useRef`-Boilerplate wie in React 18.
:::

## Vollständiger Code

Den kompletten Source der Live-Demo oben findest du im v-map-Repo unter
[`examples/vue/`](https://github.com/pt9912/v-map/tree/main/examples/vue).
Der relevante Teil ist
[`src/App.vue`](https://github.com/pt9912/v-map/blob/main/examples/vue/src/App.vue).

## Stolperfallen

1. **`isCustomElement` vergessen.** Ohne die `compilerOptions` in
   `vite.config.ts` meckert Vue zur Laufzeit „Failed to resolve
   component v-map" und rendert die Tags als reguläre Elemente ohne
   Stencil-Logic. Pflicht-Schritt.
2. **`defineCustomElements()` aus dem Loader bündeln.** Funktioniert
   in Vite-Builds NICHT (gleicher Bug wie bei React/SvelteKit). Immer
   den `<script type="module">` aus jsDelivr im `index.html` verwenden.
3. **Number-Props per `String(...)` casten.** *Nicht nötig* — Vue 3
   setzt Number-Props automatisch als JS-Property auf Custom Elements,
   und Stencils typed `@Prop() zoom: number` empfängt das direkt. Der
   Cast war ein Workaround aus React-18-Zeiten und gehört nicht in
   Vue-Code.
4. **Vue's Strict Mode (Dev) doppeltes Mounten.** v-maps Stencil-
   Komponenten sind robust gegen den doppelten Mount-Cycle, du
   brauchst nichts zu konfigurieren.

## Siehe auch

- **[Getting Started](../../getting-started)** — generelles Setup
- **[SvelteKit-Guide](./sveltekit)** — gleicher Showcase mit Svelte 5
- **[React-Guide](./react)** — gleicher Showcase mit React 19
- **[CDN ohne Bundler](../cdn-esm)** — wenn du gar keinen Build-Step willst
- **[Error Handling](../error-handling)** — die `<v-map-error>` Komponente und das `vmap-error` Event
- **[Komponenten-API](../../api/components/)** — alle 19 Web Components
