# V-Map

**Provider-agnostische Web-Mapping-Komponentenbibliothek für Webanwendungen.**
Gebaut mit [Stencil.js](https://stenciljs.com/) und [OpenLayers](https://openlayers.org/), [Cesium](https://cesium.com/), [Leaflet](https://leafletjs.com/) und [Deck.gl](https://deck.gl/) als austauschbare Render-Provider.

[![npm version](https://badge.fury.io/js/@npm9912%2Fv-map.svg)](https://www.npmjs.com/package/@npm9912/v-map)
[![Test](https://github.com/pt9912/v-map/actions/workflows/test.yml/badge.svg)](https://github.com/pt9912/v-map/actions/workflows/test.yml)
[![Build](https://github.com/pt9912/v-map/actions/workflows/build.yml/badge.svg)](https://github.com/pt9912/v-map/actions/workflows/build.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://pt9912.github.io/v-map/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Features

- **Provider-agnostisch:** OpenLayers, Leaflet, Cesium und Deck.gl hinter einem einheitlichen deklarativen Web-Component-API — ein Providerwechsel ist eine einzige Prop (`flavour`).
- **Reicher Layer-Katalog:** OSM, XYZ, WMS, WFS, WCS, GeoJSON, WKT, GeoTIFF, 3D-Tiles, Terrain, Deck.gl-Scatterplot, Google Tiles.
- **Layer-Gruppen & Layer-Control:** Basemap-/Overlay-Verwaltung mit Sichtbarkeitssteuerung (`v-map-layergroup`, `v-map-layercontrol`).
- **Styling:** `v-map-style` mit Unterstützung für [GeoStyler](https://geostyler.org/) JSON und SLD.
- **Deklaratives Building:** `v-map-builder` zum Konfigurieren komplexer Karten per Attribut.
- **Runtime-Error-API:** einheitliches `vmap-error` Event über alle Layer-Komponenten für konsistente Fehlerbehandlung.
- **Touch-optimiert:** Desktop und mobile Geräte.
- **Vollständige TypeScript-Typen** und JSX-Integration für Stencil/React/Vue/Svelte.

---

## Installation

```bash
pnpm add @npm9912/v-map
# oder
npm install @npm9912/v-map
```

Je nach gewünschtem Provider installierst du zusätzlich die passende Peer-Dependency:

```bash
pnpm add ol            # für flavour="ol"
pnpm add leaflet       # für flavour="leaflet"
pnpm add cesium        # für flavour="cesium"
pnpm add @deck.gl/core # für flavour="deck"
```

---

## Verwendung

### Plain HTML / ESM

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module"
          src="./node_modules/@npm9912/v-map/dist/v-map/v-map.esm.js"></script>
  <style>v-map { display: block; width: 100%; height: 100vh; }</style>
</head>
<body>
  <v-map flavour="ol">
    <v-map-layergroup group-title="Basiskarten" basemapid="OSM-BASE">
      <v-map-layer-osm id="OSM-BASE" label="OpenStreetMap"
                       z-index="0" opacity="1.0"></v-map-layer-osm>
    </v-map-layergroup>
    <v-map-layergroup group-title="Overlays">
      <v-map-layer-geojson src="data/points.geojson"></v-map-layer-geojson>
    </v-map-layergroup>
  </v-map>
</body>
</html>
```

### Framework-Integration (React, Vue, Svelte, SvelteKit …)

```ts
import { defineCustomElements } from '@npm9912/v-map/loader';

defineCustomElements();
```

Danach stehen die Custom Elements (`<v-map>`, `<v-map-layer-osm>`, …) im gesamten Projekt zur Verfügung.

Eine vollständige SvelteKit-Integration findest du unter [`demo/sveltekit-demo/`](./demo/sveltekit-demo/).

### Unterstützte `flavour`-Werte

| Wert       | Render-Provider                  |
|------------|----------------------------------|
| `ol`       | OpenLayers (Default)             |
| `leaflet`  | Leaflet                          |
| `cesium`   | CesiumJS (2D + 3D Globus)        |
| `deck`     | Deck.gl (GPU-beschleunigt)       |

---

## Komponenten-Übersicht

Insgesamt 18 Web Components in `src/components/`:

**Karten-Container & Infrastruktur**
- `v-map` — Haupt-Kartencontainer
- `v-map-builder` — deklaratives Building komplexer Karten
- `v-map-layergroup` — Gruppierung und Sichtbarkeitssteuerung
- `v-map-layercontrol` — interaktives Layer-Control
- `v-map-style` — Styling via GeoStyler JSON oder SLD

**Raster-Layer**
- `v-map-layer-osm` — OpenStreetMap-Tiles
- `v-map-layer-xyz` — generische XYZ-Tile-Sources
- `v-map-layer-google` — Google Maps Tiles
- `v-map-layer-wms` — OGC WMS
- `v-map-layer-wcs` — OGC WCS
- `v-map-layer-geotiff` — GeoTIFF

**Vektor-Layer**
- `v-map-layer-geojson` — GeoJSON
- `v-map-layer-wkt` — Well-Known-Text
- `v-map-layer-wfs` — OGC WFS
- `v-map-layer-scatterplot` — Deck.gl-Scatterplot

**3D & Terrain**
- `v-map-layer-tile3d` — 3D Tiles (Cesium)
- `v-map-layer-terrain` — Terrain-Provider
- `v-map-layer-terrain-geotiff` — Terrain aus GeoTIFF

Vollständige API-Referenz: [GitHub Pages Dokumentation](https://pt9912.github.io/v-map/).

---

## Error Handling

Alle Layer-Komponenten emittieren ein einheitliches `vmap-error` Event bei Lade- und Laufzeitfehlern:

```ts
document.querySelector('v-map')?.addEventListener('vmap-error', (e) => {
  const { detail } = e as CustomEvent;
  console.error(detail.source, detail.phase, detail.message);
});
```

Details: `docs/dev/CONCEPT-ERROR-API.md`.

---

## Entwicklung

### Voraussetzungen

- Node.js ≥ 22
- pnpm ≥ 9
- optional: Docker (für den Devcontainer)

### Setup

```bash
pnpm install
pnpm start          # Dev-Server auf http://localhost:3333
```

### Tests

Das Projekt nutzt [Vitest](https://vitest.dev/) mit den Projekten `spec`, `unit` und `browser`.

```bash
pnpm test                       # spec + browser
pnpm test:coverage              # alle Vitest-Projekte mit Coverage
pnpm test:vitest:browser        # nur Browser-/Runtime-Tests
pnpm test:vitest:browser:watch  # Browser-Tests im Watch-Modus
```

Hintergrund und CI-Hinweise: `docs/dev/vitest.md`.

### Storybook

```bash
pnpm storybook     # http://localhost:6006
```

### Dokumentation lokal bauen

```bash
pnpm docs:dev      # VitePress Dev-Server
pnpm docs:build    # Statische Ausgabe in docs/.vitepress/dist
```

---

## Devcontainer

Das Projekt enthält eine vorkonfigurierte Devcontainer-Umgebung (`.devcontainer/`):

- Basis-Image `node:22`
- pnpm, GitHub CLI, ESLint, Prettier, Vitest vorinstalliert
- Automatisches Setup via `post-create.sh`

Öffne das Repo in [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) oder [GitHub Codespaces](https://github.com/features/codespaces).

---

## Build & Release

### Build

```bash
pnpm build
```

Erzeugt die distributierbaren Bundles in `dist/` sowie den `loader/` für Framework-Integration.

### Release

Releases werden **vollautomatisch** durch [semantic-release](https://semantic-release.gitbook.io/) erstellt. Ausgelöst wird der Release-Workflow durch einen Merge von `develop` nach `main`.

- Versionierung und Changelog entstehen aus den [Conventional Commits](https://www.conventionalcommits.org/) seit dem letzten Tag.
- npm-Publish, GitHub-Release und Tag werden automatisch erzeugt.
- Vollständige Anleitung, Voraussetzungen und Fehlerbehebung: **[`docs/releasing.md`](./docs/releasing.md)**.

---

## Projektstruktur

```
v-map/
├── src/
│   ├── components/          # 18 Web Components (v-map, v-map-layer-*, …)
│   ├── map-provider/        # Provider-Implementierungen (ol, leaflet, cesium, deck)
│   ├── testing/             # Test-Setups und Mocks
│   └── index.ts             # Entry Point
├── loader/                  # Framework-Loader (defineCustomElements)
├── dist/                    # Build-Artefakte (generiert)
├── docs/
│   ├── releasing.md         # Release-Prozess
│   ├── dev/                 # Interne Entwicklerdoku
│   └── .vitepress/          # VitePress-Konfiguration
├── demo/                    # HTML- und SvelteKit-Integrationsdemos
├── .devcontainer/           # VS Code / Codespaces Setup
├── .github/workflows/       # CI/CD Pipelines (test, test-browser, build, release, docs)
├── .releaserc.json          # semantic-release Konfiguration
├── stencil.config.ts        # Stencil-Konfiguration
├── vite.config.ts           # Vite-Konfiguration
└── vitest.config.mts        # Vitest-Projekte
```

---

## Architektur

- **Saubere Trennung** von deklarativem DOM-API (Web Components) und imperativer Kartenlogik (Provider).
- **Engine-agnostisch:** Austausch bzw. Koexistenz von OpenLayers, Leaflet, Deck.gl und Cesium über ein klares Interface.
- **Typsicherheit** durch `LayerConfig`-Union mit exhaustiveness checks.
- **Shadow-DOM-kompatibel:** CSS-Injection, Adopted Stylesheets.
- **Erweiterbarkeit:** Neue Layer-Typen und Engines fügen sich je über einen Adapter ein.
- **Wiederverwendbarkeit:** `VMapLayerHelper` als einheitliche Registrierungs-/Update-Pipeline.
- **Konsistentes Error-API:** einheitliches `vmap-error` Event über alle Layer-Komponenten.

---

## Contributing

Pull Requests und Issues sind willkommen.

- Branch-Strategie: Feature-Branch → `develop` → `main` (siehe `docs/releasing.md`)
- Commit-Format: [Conventional Commits](https://www.conventionalcommits.org/)
- Alle Tests und Lints müssen grün sein (`pnpm test`, `pnpm lint`, `pnpm typecheck`)

---

## Lizenz

[MIT](./LICENSE)
