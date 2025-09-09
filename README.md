# V-Map 🗺️

**Eine moderne, provider-unabhängige Kartenkomponente für Webanwendungen.**  
Gebaut mit [Stencil.js](https://stenciljs.com/), [OpenLayers](https://openlayers.org/), [Cesium](https://cesium.com/), [Leaflet](https://leafletjs.com/) und [Deck.gl](https://deck.gl/).

[![npm version](https://badge.fury.io/js/%40pt9912%2Fv-map.svg)](https://badge.fury.io/js/%40pt9912%2Fv-map)
[![CI Status](https://github.com/pt9912/v-map/actions/workflows/test.yml/badge.svg)](https://github.com/pt9912/v-map/actions)
[![Storybook](https://img.shields.io/badge/Storybook-%23FF4785?logo=storybook&logoColor=white)](https://pt9912.github.io/v-map/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- **Mehrere Provider**: OpenLayers, Leaflet, Cesium und Deck.gl
- **Layer-Gruppen**: Basemap- und Overlay-Verwaltung mit Sichtbarkeitssteuerung
- **GPU-beschleunigte Provider**: Integration von Deck.gl für große Datensätze
- **Touch-Optimiert**: Funktioniert auf Desktop und mobilen Geräten
- **TypeScript-Unterstützung**: Vollständige Typdefinitionen
- **Storybook-Dokumentation**: Interaktive Beispiele und API-Docs
- **Testing**: Jest/Vitest für Unit- und Komponententests
- **CI/CD**: Automatisiertes Testing und Releases via GitHub Actions
- **Devcontainer-Support**: Voll ausgestattete Entwicklungsumgebung mit Docker

---

## 📦 Installation

```bash
npm install @pt9912/v-map
# oder mit pnpm
pnpm add @pt9912/v-map
```

---

## 🚀 Verwendung

```tsx
import { VMap } from '@pt9912/v-map';

<v-map flavour="ol" style={{ height: '400px' }}>
  <v-map-layer-osm></v-map-layer-osm>
  <v-map-layer-geojson src="data/points.geojson"></v-map-layer-geojson>
</v-map>;
```

- `provider` unterstützt aktuell: **`openlayers`**, **`cesium`**
- Layer können kombiniert und gruppiert werden (`<v-map-layer-group>`).

---

## 🛠️ Entwicklung

### Voraussetzungen

- Node.js ≥ 22
- pnpm ≥ 9
- Docker (für Devcontainer-Umgebung)

### Setup

```bash
pnpm install
```

### Dev-Server starten

```bash
pnpm start
```

Läuft standardmäßig auf: [http://localhost:3333](http://localhost:3333)

---

## 🧪 Tests

Dieses Projekt nutzt **Jest** (Stencil integriert) und **Vitest** (für Utility-Funktionen).

```bash
pnpm test       # Unit- und Komponententests
pnpm test:spec  # Spezifikationstests
pnpm test:e2e   # E2E tests
```

---

## 📖 Storybook

Interaktive Dokumentation der Komponenten:

```bash
pnpm storybook
```

Erreichbar unter: [http://localhost:6006](http://localhost:6006)

---

## 🐳 Devcontainer

Das Projekt enthält eine vorkonfigurierte **Devcontainer-Umgebung**:

- Basierend auf `node:22`
- Enthält pnpm, GitHub CLI, Linting/Prettier, Jest/Vitest
- Automatisches Setup via `post-create.sh`

Öffne das Repo in [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) oder [GitHub Codespaces].

---

## 🔄 Build & Release

### Build

```bash
pnpm build
```

Erzeugt distributierbare Bundles (`dist/`).

### Release

Releases werden über [semantic-release](https://semantic-release.gitbook.io/) automatisiert:

- Commit Messages nach [Conventional Commits](https://www.conventionalcommits.org/)
- Automatisches Versioning, Changelog & npm-Publish

```bash
pnpm release
```

---

## 📂 Projektstruktur

```
v-map/
├── src/
│   ├── components/
│   │   ├── v-map/               # Hauptkarte
│   │   ├── v-map-layer-osm/     # OSM-Basemap
│   │   ├── v-map-layer-geojson/ # GeoJSON-Daten
│   │   └── v-map-layer-group/   # Layer-Gruppierung
│   └── index.ts                 # Entry Point
├── .devcontainer/               # VS Code/Codespaces Setup
├── .github/workflows/           # CI/CD Pipelines
├── jest.config.ts               # Jest-Konfiguration
├── vite.config.ts               # Vite-Build
├── vitest.config.ts             # Vitest-Tests
└── stencil.config.ts            # Stencil-Konfiguration
```

---

## 🤝 Contributing

Pull Requests und Issues sind willkommen!  
Bitte halte dich an [Conventional Commits](https://www.conventionalcommits.org/).

---
