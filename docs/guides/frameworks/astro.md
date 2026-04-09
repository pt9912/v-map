# v-map mit Astro

Dieser Guide zeigt, wie du v-map in eine Astro-Site einbindest.
Die Live-Demo unten ist die echte App aus
[`examples/astro/`](https://github.com/pt9912/v-map/tree/main/examples/astro)
des v-map-Repos, gebaut mit `astro build` (output: `static`) und in
einem sandboxed Iframe eingebettet.

## Live-Demo

@[example:astro]

Was die Demo zeigt:

- **Reactive Provider-Switch:** Dropdown setzt das `flavour`-Attribut
  auf `<v-map>`, die Karte schaltet zwischen OpenLayers, Leaflet,
  Deck.gl und Cesium um — ohne Re-Mount.
- **Reactive Zoom-Slider:** Der Slider schreibt direkt aufs `zoom`-
  Attribut, der `@Watch('zoom')`-Handler in `<v-map>` propagiert das
  an den aktiven Provider und behält den aktuellen Center bei.
- **Layer-Toggle:** GeoTIFF- und GeoJSON-Buttons setzen Attribute auf
  bestehenden Layer-Komponenten oder de-/aktivieren ganze
  Layer-Gruppen über das `hidden`-Attribut.
- **`<v-map-error>` Toast:** deklarativer Fehler-Stapel unten rechts,
  ohne JavaScript-Listener-Code.
- **Programmatischer `vmap-error`-Listener:** dasselbe Event landet
  zusätzlich im Logs-Panel rechts.
- **„Add broken WMS layer" Button:** triggert absichtlich einen
  Lade-Fehler, um die End-to-End Error-API live zu sehen.

## Warum Astro besonders gut zu v-map passt

Astro behandelt jeden unbekannten HTML-Tag als echtes Custom-Element.
Im Gegensatz zu Vue (`isCustomElement`) oder React (JSX
`IntrinsicElements`-Augmentation) musst du **gar nichts konfigurieren**
— Astro emittiert `<v-map>` einfach unverändert ins statische HTML, der
Browser upgradet es zur Laufzeit.

Außerdem ist Astros Default-Output statisches HTML. Eine `.astro`-Datei
mit `<v-map>` und einem Inline-`<script>`-Block ergibt nach `astro build`
genau eine `index.html` plus einen winzigen Bundle für die
DOM-Wiring-Logik. Kein Hydration-Cost, kein Framework im Output.

## Setup für eigene Projekte

### 1. Projekt anlegen

```bash
pnpm create astro@latest my-vmap-app
cd my-vmap-app
pnpm install
```

Astro fragt im Wizard nach Templates. Für die Demo reicht das **Minimal**-
Template — keine Integration nötig.

### 2. v-map installieren

```bash
pnpm add @npm9912/v-map
```

Die Provider (`ol`, `leaflet`, `cesium`, `@deck.gl/*`) brauchst du nur
als Dev-Dependencies für TypeScript-Typen, falls überhaupt — zur
Laufzeit lädt v-map seine Peer-Deps via Auto-Importmap nach.

### 3. v-map-Loader im `<head>` einbinden

Wir empfehlen, v-map per `<script type="module">` aus jsDelivr zu laden,
**statt** den Stencil-Loader durch Astros Vite-Build zu schleifen:

```astro
---
// src/pages/index.astro
---

<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My v-map App</title>

    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.4/dist/v-map/v-map.esm.js"
    ></script>
  </head>
  <body>
    <v-map flavour="ol" center="11.576,48.137" zoom="11">
      <v-map-layergroup group-title="Base" basemapid="osm">
        <v-map-layer-osm id="osm" label="OpenStreetMap"></v-map-layer-osm>
      </v-map-layergroup>
    </v-map>

    <style>
      v-map {
        display: block;
        width: 100%;
        height: 70vh;
      }
    </style>
  </body>
</html>
```

::: warning Warum CDN statt Bundler
Stencils Lazy-Loader nutzt `import.meta.url`, um seine Sibling-`*.entry.js`-
Chunks zur Laufzeit zu finden. Wenn ein Bundler (Vite, Rollup, Webpack)
den Loader ingestet, landet die URL bei `/_astro/abc.js` und Stencil
404t auf jedem einzelnen Layer-Chunk. Der jsDelivr-Pfad lässt
Stencils Chunk-Resolution unverändert. Siehe den
[CDN-Guide](../cdn-esm) für die Hintergründe.
:::

### 4. Reaktive Controls per Inline-`<script>`

Astro processt jeden `<script>`-Block durch Vite, also kannst du
TypeScript schreiben. Da Astro keine Reactivity hat, manipulierst du
das DOM direkt — was bei v-map sauber funktioniert, weil alle Props
als HTML-Attribute lesbar/schreibbar sind:

```astro
<v-map id="map1" flavour="ol" zoom="11" center="11.576,48.137">
  <v-map-layergroup group-title="Base" basemapid="osm">
    <v-map-layer-osm id="osm" label="OpenStreetMap"></v-map-layer-osm>
  </v-map-layergroup>
</v-map>

<input id="zoom" type="range" min="2" max="18" step="1" value="11" />

<script>
  const map = document.getElementById('map1')!;
  const zoomInput = document.getElementById('zoom') as HTMLInputElement;

  zoomInput.addEventListener('input', () => {
    map.setAttribute('zoom', zoomInput.value);
  });
</script>
```

Der `@Watch('zoom')`-Handler in v-map (seit v0.4.0) registriert die
Attribut-Änderung und ruft den Provider mit dem aktuellen Center neu
auf — keine Karte-Reset-Logik nötig.

### 5. Layer dynamisch ein-/ausblenden

Layer-Gruppen können per `hidden`-Attribut zur Laufzeit ein- und
ausgeblendet werden. v-map disposed den jeweiligen Layer beim
Verbergen automatisch:

```astro
<v-map flavour="ol">
  <v-map-layergroup group-title="Base" basemapid="osm">
    <v-map-layer-osm id="osm"></v-map-layer-osm>
  </v-map-layergroup>

  <v-map-layergroup id="overlay" group-title="Daten" hidden>
    <v-map-layer-geojson id="g1" url="/data/points.geojson"></v-map-layer-geojson>
  </v-map-layergroup>
</v-map>

<button id="toggle">Toggle Overlay</button>

<script>
  const overlay = document.getElementById('overlay')!;
  document.getElementById('toggle')!.addEventListener('click', () => {
    if (overlay.hasAttribute('hidden')) overlay.removeAttribute('hidden');
    else overlay.setAttribute('hidden', '');
  });
</script>
```

### 6. Error-Events programmatisch konsumieren

`vmap-error` bubblet von jedem Layer zu `<v-map>` hoch. Für reines
Toast-Display reicht das deklarative `<v-map-error>`. Wenn du den
Fehler zusätzlich an einen App-Store / Analytics / Logs schicken
willst, hängst du einen `addEventListener` an:

```astro
<v-map id="map1" flavour="ol">
  <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>
  ...
</v-map>

<script>
  type VMapErrorDetail = {
    type: 'network' | 'validation' | 'parse' | 'provider';
    message: string;
    attribute?: string;
    cause?: unknown;
  };

  document.getElementById('map1')!.addEventListener('vmap-error', event => {
    const detail = (event as CustomEvent<VMapErrorDetail>).detail;
    if (!detail) return;
    console.error('[vmap]', detail.type, detail.message);
    // hier z. B. in einen Nanostore pushen oder an Sentry schicken
  });
</script>
```

## Production-Build

Astros Default ist `output: 'static'` — für eine v-map-Site brauchst
du nichts zu ändern. `pnpm build` produziert ein vollständig statisches
`dist/`-Verzeichnis, das du auf jedem File-Server hosten kannst.

Wenn du unter einem Subpfad deployst (z. B. GitHub Pages):

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
});
```

## Stolperfallen

1. **Inline-`<script>` standardmäßig im Module-Scope.** Astro behandelt
   `<script>`-Blöcke als ES-Modules und bündelt sie. Wenn du explizit
   raw Inline-JS willst (selten nötig), nutze `is:inline`.

2. **`set:html` für GeoJSON-Strings vermeiden.** GeoJSON-Daten gehören
   ins `geojson`-Attribut der Layer-Komponente, nicht ins HTML. Sonst
   baut Astro/Vite Dependency-Tracking auf den String und du bekommst
   bei großen FeatureCollections seltsame Build-Warnungen.

3. **Zoom als Number-Prop.** Im DOM sind alle Attribute Strings —
   `setAttribute('zoom', '12')` ist korrekt. Innerhalb von v-map wird
   das automatisch zur Number gecastet, weil `zoom` als
   `@Prop() zoom: number` deklariert ist.

4. **Astro Islands sind hier overkill.** Du brauchst keine
   `client:only`-Komponente, weil v-map ein nativer Custom-Element-
   Wrapper ist. Astro Islands sind nur dann sinnvoll, wenn du eine
   React-/Vue-/Svelte-/Solid-Komponente *außerhalb* von v-map
   einbetten willst.

## Vollständiger Code

Den kompletten Source der Live-Demo oben findest du im v-map-Repo unter
[`examples/astro/`](https://github.com/pt9912/v-map/tree/main/examples/astro).
Der relevante Teil ist
[`src/pages/index.astro`](https://github.com/pt9912/v-map/blob/main/examples/astro/src/pages/index.astro).

## Siehe auch

- **[Getting Started](../../getting-started)** — generelles Setup
- **[CDN ohne Bundler](../cdn-esm)** — die jsDelivr-Lade-Strategie im Detail
- **[Error Handling](../error-handling)** — die `<v-map-error>` Komponente
  und das `vmap-error` Event
- **[Komponenten-API](../../api/components/)** — alle 19 Web Components
