# v-map mit Angular

Dieser Guide zeigt, wie du v-map in eine Angular-App einbindest. Die
Live-Demo unten ist die echte App aus
[`examples/angular/`](https://github.com/pt9912/v-map/tree/main/examples/angular)
des v-map-Repos, gebaut mit Angular 19 (standalone components, signals,
zoneless change detection) und in einem sandboxed Iframe eingebettet.

## Live-Demo

@[example:angular]

Die Angular-Demo zeigt dieselben Features wie die anderen Framework-Showcases,
nur mit Angular-19-Idiom:

- **Reactive Provider-Switch:** `signal<Provider>('ol')` ↔ `flavour`-Attribut
  am `<v-map>`-Element via `[attr.flavour]="provider()"`. Provider-Wechsel
  ohne Re-Mount.
- **Reactive Zoom-Slider:** `signal<number>(11)` mit `(input)` Event
  Handler, gebunden via `[attr.zoom]="zoom()"`. Angular wandelt
  Number-Werte für `[attr.X]`-Bindings automatisch in Strings um, also
  brauchst du kein explizites `.toString()`.
- **Layer-Toggle:** Angular's neuer `@if`-Control-Flow blendet
  `<v-map-layer-*>` Komponenten ein/aus.
- **`<v-map-error>` Toast:** deklarativer Fehler-Stapel unten rechts,
  ohne JavaScript-Listener-Code.
- **Programmatischer `vmap-error`-Listener:** Angular's Template-Binding
  unterstützt Custom-Element-Events mit Bindestrich direkt:
  `(vmap-error)="onMapError($event)"`. Wie in Vue 3 — kein
  `useRef`/`addEventListener` Boilerplate wie in React 18.
- **`CUSTOM_ELEMENTS_SCHEMA`:** Angular's Template-Compiler ist sehr
  strikt — ohne dieses Schema im Component verweigert er die
  v-map* Tags als „unknown elements".
- **Zoneless Change Detection:** der Demo nutzt
  `provideExperimentalZonelessChangeDetection()` (Angular 18+), so dass
  Signals die einzige Quelle der Wahrheit sind und kein zone.js
  Patching die Custom-Element-Events stört.

## Setup für eigene Projekte

### 1. Angular-Projekt anlegen

```bash
pnpm dlx @angular/cli@latest new my-vmap-app --standalone --style=css --routing=false
cd my-vmap-app
pnpm install
```

### 2. v-map einbinden

Wie bei den anderen Frameworks lädst du v-map am robustesten direkt von
jsDelivr per `<script type="module">` im `index.html`, statt den Loader
durch Angular's esbuild-Pipeline zu bündeln:

```html
<!-- src/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My v-map App</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.1/dist/v-map/v-map.esm.js"
    ></script>
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

::: warning Warum nicht `defineCustomElements()` aus `@npm9912/v-map/loader`?
Stencils Lazy-Loader benutzt `import.meta.url` zur Laufzeit, um seine
`*.entry.js` Chunks zu finden. Wenn Angulars esbuild-Build den Loader
mit-bündelt, landen diese Chunks unter `/main-XYZ.js` und Stencil 404t
auf jeden Layer-Chunk.

Mit dem `<script type="module">`-Tag von jsDelivr läuft v-map als
ungebündeltes ES-Modul direkt im Browser, `import.meta.url` zeigt auf
die jsDelivr-CDN-URL und Stencil findet seine Chunks da auch.
:::

### 3. Custom Elements vor dem Bootstrap abwarten

```ts
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

async function bootstrap() {
  // Warten bis v-map.esm.js geladen und alle Custom Elements registriert sind
  await customElements.whenDefined('v-map');
  await bootstrapApplication(AppComponent, appConfig);
}

bootstrap().catch(console.error);
```

### 4. `CUSTOM_ELEMENTS_SCHEMA` setzen

Wichtigster Angular-spezifischer Schritt: das Template eines Components,
das v-map-Tags verwendet, braucht `CUSTOM_ELEMENTS_SCHEMA` in
`schemas`. Ohne das schlägt der Angular Compiler mit:

```
'v-map' is not a known element:
1. If 'v-map' is an Angular component, then verify that it is part of this module.
2. To allow any element add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component.
```

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
})
export class AppComponent {
  zoom = signal(11);
}
```

### 5. Erste Karte deklarativ

```html
<!-- src/app/app.component.html -->
<input
  type="range"
  min="2"
  max="18"
  [value]="zoom()"
  (input)="zoom.set($any($event.target).valueAsNumber)"
/>

<v-map flavour="ol" center="11.576,48.137" [attr.zoom]="zoom()">
  <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>

  <v-map-layergroup group-title="Base" basemapid="osm">
    <v-map-layer-osm id="osm" label="OpenStreetMap"></v-map-layer-osm>
  </v-map-layergroup>
</v-map>
```

```css
/* src/app/app.component.css */
v-map {
  display: block;
  width: 100%;
  height: 70vh;
}
```

Drag den Slider — die Karte zoomt direkt mit. Angular's Signal-System
markiert die `zoom`-abhängigen Bindings als dirty und re-rendert die
betroffenen Attribute am Custom-Element.

::: tip `[attr.foo]` vs `[foo]`
Wir binden `[attr.zoom]="zoom()"`. Der `[attr.X]` Bind setzt das
HTML-**Attribut** und nicht die JS-Property. Angular ruft beim Setzen
von Attributen automatisch `.toString()` auf, also brauchst du keinen
expliziten Cast für Number-Werte. Stencils
`@Prop({ reflect: true })` propagiert die Änderung dann zurück in den
typed Number-Prop. Das funktioniert auch für `opacity`, `z-index` etc.
:::

### 6. Reactive Layer hinzufügen oder ausblenden

Mit Angular 17+'s neuem `@if` Control-Flow-Block:

```html
<v-map flavour="ol">
  <v-map-layergroup group-title="Base" basemapid="osm">
    <v-map-layer-osm id="osm"></v-map-layer-osm>
  </v-map-layergroup>

  @if (showOverlay()) {
    <v-map-layergroup group-title="Daten">
      <v-map-layer-geojson url="/data/points.geojson"></v-map-layer-geojson>
    </v-map-layergroup>
  }
</v-map>

<button (click)="showOverlay.set(!showOverlay())">
  Toggle GeoJSON Overlay
</button>
```

v-map registriert / disposed den Layer automatisch, sobald Angular das
Custom Element mountet bzw. unmountet.

### 7. Error-Events programmatisch konsumieren

`vmap-error` bubblet von jedem Layer zur `<v-map>` hoch. In Angular reicht
ein `(vmap-error)` direkt im Template:

```ts
interface VMapErrorDetail {
  type: 'network' | 'validation' | 'parse' | 'provider';
  message: string;
  attribute?: string;
  cause?: unknown;
}

@Component({
  /* ... */
})
export class AppComponent {
  onMapError(event: Event) {
    const detail = (event as CustomEvent<VMapErrorDetail>).detail;
    if (!detail) return;
    console.error('[vmap]', detail.type, detail.message);
    // hier z. B. in einen Service oder Store dispatchen
  }
}
```

```html
<v-map flavour="ol" (vmap-error)="onMapError($event)">
  ...
</v-map>
```

Für reines Toast-Display ohne JS-Listener reicht aber das deklarative
`<v-map-error>` (siehe oben).

::: tip Zoneless Change Detection
Angular 18+ unterstützt
`provideExperimentalZonelessChangeDetection()` als Provider in
`appConfig`. Damit verzichtest du auf zone.js' Monkey-Patching der
DOM-Events, was für die meisten Custom-Element-Events sauberer ist —
Signals sind dann die einzige Quelle der Reactivity. Die Demo nutzt
diese Strategie.
:::

## Vollständiger Code

Den kompletten Source der Live-Demo oben findest du im v-map-Repo unter
[`examples/angular/`](https://github.com/pt9912/v-map/tree/main/examples/angular).
Der relevante Teil ist
[`src/app/app.component.ts`](https://github.com/pt9912/v-map/blob/main/examples/angular/src/app/app.component.ts).

## Stolperfallen

1. **`CUSTOM_ELEMENTS_SCHEMA` vergessen.** Compile-time-Error „is not
   a known element". Pflicht-Schritt für jedes Component, das v-map-Tags
   verwendet.
2. **`[zoom]="zoom()"` statt `[attr.zoom]="zoom()"`.** Setzt die JS-
   Property statt des Attributs. Funktioniert in den meisten Fällen,
   aber das Attribut-basierte Pattern via `[attr.X]` ist robuster
   gegen Angular-Compiler-Strikt-Mode-Checks (schemaless properties)
   und reflected sich automatisch zurück ins HTML.
3. **`defineCustomElements()` aus dem Loader bündeln.** Funktioniert in
   Angular's esbuild-Build NICHT (gleicher Bug wie React/Vue/SvelteKit).
   Immer den `<script type="module">` aus jsDelivr im `index.html`
   verwenden.
4. **`zone.js` wickelt Custom-Element-Events.** Wenn du zone.js aktiviert
   lässt, führt jeder `vmap-error` Event Handler einen Change-Detection-
   Cycle aus. Mit `provideExperimentalZonelessChangeDetection()` und
   Signal-State entfällt das, was den Demo deutlich glatter macht.
5. **`moduleResolution` im tsconfig.** Angular 16+ braucht
   `"moduleResolution": "bundler"` (oder `"node16"`). Default
   `"classic"` führt zu „Cannot find module '@angular/core'" Errors.

## Vergleich mit den anderen Frameworks

| Aspekt | Angular | Vue 3 | React 19 | SvelteKit |
|---|---|---|---|---|
| Reactive State | `signal()` | `ref()` | `useState()` | `$state()` |
| Slider-Binding | `[value] (input)` | `v-model.number` | `value onChange` | `bind:value` |
| Conditional | `@if` | `v-if` | `{cond && ...}` | `{#if}` |
| Custom Element Event | `(vmap-error)="..."` | `@vmap-error="..."` | `useRef + addEventListener` | `onvmap-error={...}` |
| Custom Element Setup | `CUSTOM_ELEMENTS_SCHEMA` | `compilerOptions.isCustomElement` | (kein Setup) | (kein Setup) |
| Bundle (gzipped) | ~48 KB | ~27 KB | ~62 KB | ~30 KB |
| Boilerplate | hoch | niedrig | mittel | sehr niedrig |

Angular hat den höchsten initialen Setup-Aufwand (NgModule oder
standalone + schemas + tsconfig), aber für Teams mit Angular-Erfahrung
sind die Patterns gewohnt und Signals + zoneless DC machen den
Reactive-Pfad sehr ähnlich zu Vue 3.

## Siehe auch

- **[Getting Started](../../getting-started)** — generelles Setup
- **[SvelteKit-Guide](./sveltekit)** — gleicher Showcase mit Svelte 5
- **[React-Guide](./react)** — gleicher Showcase mit React 19
- **[Vue 3 Guide](./vue)** — gleicher Showcase mit Vue 3
- **[CDN ohne Bundler](../cdn-esm)** — wenn du gar keinen Build-Step willst
- **[Error Handling](../error-handling)** — die `<v-map-error>` Komponente und das `vmap-error` Event
- **[Komponenten-API](../../api/components/)** — alle 19 Web Components
