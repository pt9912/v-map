# v-map über CDN ohne Bundler laden

Du brauchst weder npm noch einen Bundler, um v-map einzusetzen. Eine
einzelne `<script type="module">` Zeile aus einem öffentlichen CDN reicht.

## Wann ist das nützlich?

- Schnelle Prototypen, CodePens, JSFiddles, Stack Overflow Snippets
- Statische HTML-Seiten ohne Build-Pipeline
- Demos, Reproducer für Bug-Reports
- Edge-/CMS-Seiten in denen du nicht bündeln kannst

Für produktive Apps mit eigenem Build empfehlen wir nach wie vor
`pnpm add @npm9912/v-map` und die Loader-API
(`defineCustomElements`) — siehe [Getting Started](../getting-started).

## Schnellstart

```html
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>v-map CDN Demo</title>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.2/dist/v-map/v-map.esm.js"
    ></script>
    <style>
      html, body { margin: 0; height: 100%; }
      v-map { display: block; width: 100%; height: 100vh; }
    </style>
  </head>
  <body>
    <v-map flavour="ol">
      <v-map-layergroup group-title="Basiskarten" basemapid="OSM-BASE">
        <v-map-layer-osm id="OSM-BASE" label="OpenStreetMap"></v-map-layer-osm>
      </v-map-layergroup>
    </v-map>
  </body>
</html>
```

Das ist alles. Speichere die Datei als `index.html`, öffne sie im Browser
oder serviere sie über einen einfachen statischen Server (z. B.
`python3 -m http.server`).

## Wie das funktioniert

Drei Mechanismen greifen ineinander:

1. **Stencil ESM Bundle.** v-map wird mit Stencil gebaut. Der Haupt-Bundle
   `v-map.esm.js` lädt seine Code-Chunks (`p-*.js`) zur Laufzeit nach. Stencil
   ermittelt das Basisverzeichnis automatisch über `import.meta.url` —
   wenn du `v-map.esm.js` von jsDelivr lädst, werden auch alle Chunks
   von jsDelivr nachgeladen. Du musst nichts konfigurieren.
2. **Auto-Importmap für Peer-Dependencies.** `<v-map>` hat eine Prop
   `useDefaultImportMap`, die per Default auf `true` steht. Beim ersten
   Mount injiziert v-map automatisch eine Browser-Importmap, die die
   Peer-Dependencies (`ol`, `leaflet`, `deck`, `@loaders.gl/*`) auf
   `https://esm.sh/<package>@<version>` umlenkt. So findet der dynamische
   `import('ol')` aus dem Stencil-Bundle eine ESM-kompatible Quelle, ohne
   dass du selbst eine Importmap schreiben musst.
3. **Custom Element Registry.** Sobald `v-map.esm.js` läuft, definiert
   Stencil alle 18 Custom Elements (`v-map`, `v-map-layer-*`, …). Ab
   diesem Moment funktionieren die Tags wie native HTML-Elemente.

## Provider-Hinweise

| Provider (`flavour`) | CDN-Status | Anmerkungen |
|---|---|---|
| `ol` (OpenLayers) | ✅ Out of the box | Wird über die Auto-Importmap geladen. |
| `leaflet` | ✅ Out of the box | Wird über die Auto-Importmap geladen. Leaflets eigene CSS-Datei wird von v-map automatisch nachinjiziert. |
| `deck` (Deck.gl) | ✅ Out of the box | Inklusive `@loaders.gl/*` Untermodule. |
| `cesium` | ⚠️ Sonderfall | Cesium wird **nicht** über die Auto-Importmap geladen, sondern über einen separaten Loader, der die Cesium-Distribution von einem CDN holt. Beim ersten `<v-map flavour="cesium">` lädt v-map Cesium intern nach. Bei reinen CDN-Setups gilt: Cesium funktioniert, ist aber wegen der Größe (ca. 5 MB) für Demos eher unhandlich. |

## Welcher CDN?

| CDN | Empfehlung | Warum |
|---|---|---|
| **jsDelivr** (`https://cdn.jsdelivr.net/npm/...`) | ✅ Empfohlen | Liefert npm-Pakete unverändert aus, sehr schnell, weltweit gecached, hohe Zuverlässigkeit. |
| **unpkg** (`https://unpkg.com/...`) | ✅ Alternative | Liefert npm-Pakete ebenfalls unverändert aus. Funktioniert genauso. |
| **esm.sh** (`https://esm.sh/...`) | ❌ Nicht für v-map | Wickelt npm-Pakete in einen ESM-Wrapper, der die `import.meta.url`-basierte Chunk-Auflösung von Stencil bricht. Funktioniert für viele andere Bibliotheken, **nicht** für Stencil-basierte. |

esm.sh wird intern (über die Auto-Importmap) für die Peer-Dependencies
wie `ol` verwendet — das ist OK, weil OpenLayers ein normales ESM-Modul
ist, das esm.sh sauber transformieren kann. Für v-map selbst bleib bei
jsDelivr oder unpkg.

## Versions-Pinning

Pin die v-map-Version explizit (`@0.2.2`), nicht `@latest`:

```html
<!-- Empfohlen -->
<script src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.2/dist/v-map/v-map.esm.js"></script>

<!-- Riskant: nimmt jeden neuen Release, auch breaking changes -->
<script src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@latest/dist/v-map/v-map.esm.js"></script>
```

Solange v-map auf `0.x` ist, können auch Minor-Bumps API-relevante
Änderungen enthalten — siehe [Versionshinweis im Releasing-Guide](../releasing#versionierung).

## Komplettes Beispiel mit GeoJSON-Overlay

Komplett deklarativ — keine einzige Zeile JavaScript, inklusive
Fehler-Toasts via `<v-map-error>` und einem interaktiven Layer-Switcher
via `<v-map-layercontrol>` als Overlay. Das Beispiel unten ist auch als
standalone HTML-Datei in der Doku hinterlegt und wird hier in einem
sandboxed Iframe live vorgeführt:

@[demo:cdn-osm-geojson]

Der Iframe lädt
[`/demos/cdn-osm-geojson.html`](/demos/cdn-osm-geojson.html) — eine
echte HTML-Datei, die über jsDelivr die jeweils
zuletzt published Version (aktuell `@npm9912/v-map@0.4.2`) bezieht.
Du kannst sie direkt im neuen Tab öffnen, das `view-source:`-Schema
verwenden oder den Quellcode unten in eine eigene Datei kopieren.

```html
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>v-map CDN — OSM + GeoJSON</title>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.2/dist/v-map/v-map.esm.js"
    ></script>
    <style>
      html, body { margin: 0; height: 100%; font-family: system-ui, sans-serif; }
      v-map { display: block; width: 100%; height: 100vh; }
    </style>
  </head>
  <body>
    <v-map flavour="ol" center="[10.0, 51.0]" zoom="6">
      <v-map-error position="top-right" auto-dismiss="5000"></v-map-error>

      <v-map-layergroup group-title="Basiskarten" basemapid="OSM-BASE">
        <v-map-layer-osm
          id="OSM-BASE"
          label="OpenStreetMap"
          z-index="0"
          opacity="1.0"
        ></v-map-layer-osm>
      </v-map-layergroup>

      <v-map-layergroup group-title="Daten">
        <v-map-layer-geojson
          url="https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
          fill-color="#0066cc"
          fill-opacity="0.2"
          stroke-color="#003366"
          stroke-width="1"
        ></v-map-layer-geojson>
      </v-map-layergroup>
    </v-map>
  </body>
</html>
```

Sollte der GeoJSON-Endpoint mal nicht antworten oder ungültige Daten
liefern, erscheint oben rechts im Karten-Container automatisch ein
Toast mit der Fehlermeldung.

## Bekannte Einschränkungen im CDN-Modus

- **Cesium ist groß.** Wenn du `flavour="cesium"` einsetzt, lädt der
  Cesium-Loader rund 5 MB nach. Das ist für eine produktive App in
  Ordnung, fühlt sich für eine Demo aber träge an.
- **Erste Anzeige verzögert sich um einen Round-Trip.** Beim allerersten
  Aufruf werden Stencil-Chunks UND Peer-Deps gleichzeitig geladen, dafür
  beim zweiten Aufruf alles aus dem CDN-Cache.
- **Custom-Importmap.** Wenn du selbst eine Importmap setzt
  (`<script type="importmap">…`), wird die Auto-Importmap von v-map
  nicht überschreiben — du musst dann sicherstellen, dass alle
  Peer-Deps abgedeckt sind. Oder setz `use-default-import-map="false"`
  auf `<v-map>` und übernimm die volle Kontrolle.

## Siehe auch

- **[Getting Started](../getting-started)** — der bundlerbasierte Weg
- **[Error Handling](./error-handling)** — wie das `vmap-error` Event funktioniert
- **[Styling](./styling)** — Styles für CDN-geladene Karten anwenden
