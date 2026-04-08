---
layout: home

hero:
  name: v-map
  text: Web-Mapping-Komponenten
  tagline: Provider-agnostische Web-Mapping-Komponentenbibliothek auf Basis von Stencil.js — OpenLayers, Cesium, Leaflet und Deck.gl hinter einem einheitlichen, deklarativen Web-Component-API.
  actions:
    - theme: brand
      text: Erste Schritte
      link: /getting-started
    - theme: alt
      text: Komponenten-API
      link: /api/components/index
    - theme: alt
      text: GitHub
      link: https://github.com/pt9912/v-map

features:
  - title: Provider-agnostisch
    details: OpenLayers, Leaflet, Cesium und Deck.gl hinter einem einheitlichen Web-Component-API. Ein Providerwechsel ist eine einzige Prop — `flavour="ol"`, `"leaflet"`, `"cesium"` oder `"deck"`.

  - title: 19 Web Components
    details: Karten-Container, Layer-Gruppen, Layer-Control, Styling, Error-Toasts und ein reicher Layer-Katalog (OSM, XYZ, WMS, WFS, WCS, GeoJSON, WKT, GeoTIFF, 3D-Tiles, Terrain, Deck.gl-Scatterplot, Google Tiles).

  - title: Deklaratives Building
    details: Komplette Karten und Layer aus JSON oder YAML konfigurieren — `<v-map-builder>` erzeugt Layer-Gruppen, Layer und Styles automatisch aus einer Konfiguration.

  - title: Styling mit GeoStyler
    details: '`<v-map-style>` mit Unterstützung für GeoStyler-JSON, SLD, mapbox-gl, QGIS und lyrx — providerübergreifend wiederverwendbar.'

  - title: Error-Toasts ohne JavaScript
    details: '`<v-map-error>` lauscht auf das `vmap-error` Event und rendert Fehler als Toasts im Karten-Container — kein Listener-Code, kein Boilerplate.'

  - title: Vollständige TypeScript-Typen
    details: Generierte Komponenten-Typen, JSX-Definitionen für React/Vue/Svelte/Stencil und eine durchgängig getypte API.

  - title: Touch-optimiert
    details: Funktioniert auf Desktop und mobilen Geräten — Pinch-Zoom, Pan und Touch-Gesten werden über alle Provider konsistent unterstützt.

  - title: Layer-Matrix
    details: Übersicht aller Layer-Typen und welche Provider sie unterstützen. Findet auf einen Blick die richtige Provider-Layer-Kombination.
    link: /layers/matrix
    linkText: Zur Matrix

  - title: Open Source (MIT)
    details: Entwickelt mit Stencil.js, getestet mit Vitest, dokumentiert mit VitePress. Pull Requests und Issues willkommen.
    link: https://github.com/pt9912/v-map
    linkText: GitHub Repository
---

## Schnellstart

Installation:

```bash
pnpm add @npm9912/v-map
# plus die gewünschte Engine
pnpm add ol
```

Im HTML einbinden:

```html
<script type="module"
        src="./node_modules/@npm9912/v-map/dist/v-map/v-map.esm.js"></script>

<v-map flavour="ol">
  <v-map-layergroup group-title="Basiskarten" basemapid="OSM-BASE">
    <v-map-layer-osm id="OSM-BASE" label="OpenStreetMap"></v-map-layer-osm>
  </v-map-layergroup>
</v-map>
```

Mehr Details im [Getting-Started-Guide](./getting-started).
