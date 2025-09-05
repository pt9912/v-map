# V-Map 🗺️

**Eine moderne, provider-unabhängige Kartenkomponente für Webanwendungen**
Built with [Stencil.js](https://stenciljs.com/), [OpenLayers](https://openlayers.org/), [Cesium](https://cesium.com/) und [Deck.gl](https://deck.gl/).

[![npm version](https://badge.fury.io/js/%40dein-org%2Fv-map.svg)](https://badge.fury.io/js/%40dein-org%2Fv-map)
[![CI Status](https://github.com/dein-benutzername/v-map/actions/workflows/test.yml/badge.svg)](https://github.com/dein-benutzername/v-map/actions)
[![Storybook](https://img.shields.io/badge/Storybook-%23FF4785?logo=storybook&logoColor=white)](https://dein-benutzername.github.io/v-map/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features
- **Mehrere Provider**: OpenLayers, Cesium, Google Maps (als Tile-Layer)
- **Layer-Gruppen**: Basemap- und Overlay-Verwaltung mit Sichtbarkeitssteuerung
- **GPU-beschleunigte Layer**: Integration von Deck.gl für große Datensätze
- **Touch-Optimiert**: Funktioniert auf Desktop und mobilen Geräten
- **TypeScript-Unterstützung**: Vollständige Typdefinitionen
- **Storybook-Dokumentation**: Interaktive Beispiele und API-Docs

---

## 📦 Installation
```bash
npm install @dein-org/v-map
```
oder mit yarn:
```bash
yarn add @dein-org/v-map
```

---

## 🚀 Schnellstart
### 1. Grundlegende Karte
```
<v-map flavour="ol" center="8.5417,49.0069" zoom="10">
  <v-map-layer-group basemap="true">
    <v-map-layer-osm></v-map-layer-osm>
  </v-map-layer-group>
  <v-map-layer-group title="Daten">
    <v-map-layer-geojson url="data.geojson"></v-map-layer-geojson>
  </v-map-layer-group>
</v-map>
```

### 2. Mit Google Maps (als Basemap)
```
<v-map flavour="ol" center="8.5417,49.0069" zoom="10">
  <v-map-layer-group basemap="true">
    <v-map-layer-google api-key="DEIN_API_KEY" map-type="roadmap" visible="true"></v-map-layer-google>
  </v-map-layer-group>
</v-map>
```

---

## 📖 API-Dokumentation

### `<v-map>`
**Props:**
| Prop       | Typ                     | Standardwert | Beschreibung                                                                 |
|------------|-------------------------|--------------|-----------------------------------------------------------------------------|
| `flavour`  | `'ol' | 'cesium'`     | `'ol'`       | Karten-Provider: OpenLayers (`'ol'`) oder Cesium (`'cesium'`)               |
| `center`   | `string` (Lon,Lat)      | `'0,0'`      | Zentrum der Karte (z. B. `"8.5417,49.0069"` für Karlsruhe)                  |
| `zoom`     | `number`                | `2`          | Zoom-Level (0 = Welt, 20 = Gebäude)                                         |
| `style`    | `CSSStyleDeclaration`   | `{}`         | CSS-Stile für die Karte (z. B. `width`, `height`)                           |

**Methoden:**
| Methode          | Parameter                     | Beschreibung                                  |
|------------------|-------------------------------|----------------------------------------------|
| `addLayer()`     | `layer: any`                  | Fügt einen Layer zur Karte hinzu              |
| `setView()`      | `coordinates: [number, number], zoom: number` | Setzt die Ansicht auf neue Koordinaten/Zoom |

---

### `<v-map-layer-group>`
**Props:**
| Prop      | Typ      | Standardwert | Beschreibung                                                                 |
|-----------|----------|--------------|-----------------------------------------------------------------------------|
| `basemap` | `boolean`| `false`      | Definiert die Gruppe als Basemap (zIndex=0) oder Overlay (zIndex=1)         |
| `title`   | `string` | `''`         | Titel der Layer-Gruppe (für interne Verwaltung)                            |

**Methoden:**
| Methode                  | Parameter       | Beschreibung                                                                 |
|--------------------------|-----------------|-----------------------------------------------------------------------------|
| `addLayer()`             | `layer: any`    | Fügt einen Layer zur Gruppe hinzu                                            |
| `setActiveBasemapLayer()`| `layer: any`    | Setzt den aktiven Basemap-Layer (nur für `basemap="true"`)                  |

---

### `<v-map-layer-google>`
**Props:**
| Prop      | Typ                          | Standardwert | Beschreibung                                                                 |
|-----------|------------------------------|--------------|-----------------------------------------------------------------------------|
| `api-key` | `string`                     | `-`          | **Pflicht:** Google Maps API-Key (nur für Maps Tile API nötig)              |
| `map-type`| `'roadmap' | 'satellite' | 'hybrid' | 'terrain'` | `'roadmap'` | Kartentyp                                                                   |
| `visible` | `boolean`                    | `false`      | Sichtbarkeit des Layers (nur ein Basemap-Layer kann sichtbar sein)         |

**Beispiel:**
```
<v-map-layer-google api-key="DEIN_API_KEY" map-type="satellite" visible="true"></v-map-layer-google>
```

---

### `<v-map-layer-osm>`
Einfacher OpenStreetMap-Layer.
**Props:**
| Prop      | Typ      | Standardwert | Beschreibung                     |
|-----------|----------|--------------|---------------------------------|
| `visible` | `boolean`| `false`      | Sichtbarkeit des Layers         |

---

### `<v-map-layer-geojson>`
Lädt GeoJSON-Daten und zeigt sie als Vektor-Layer an.
**Props:**
| Prop      | Typ      | Standardwert | Beschreibung                     |
|-----------|----------|--------------|---------------------------------|
| `url`     | `string` | `-`          | **Pflicht:** URL zur GeoJSON-Datei |
| `visible` | `boolean`| `true`       | Sichtbarkeit des Layers         |

**Beispiel:**
```
<v-map-layer-geojson url="https://example.com/data.geojson" visible="true"></v-map-layer-geojson>
```

---

## 🎨 Basemap-Wechsel (Beispiel)
```
<v-map flavour="ol" center="8.5417,49.0069" zoom="10">
  <v-map-layer-group basemap="true">
    <!-- Nur einer dieser Layer ist gleichzeitig sichtbar -->
    <v-map-layer-google api-key="..." map-type="roadmap" visible="true"></v-map-layer-google>
    <v-map-layer-google api-key="..." map-type="satellite" visible="false"></v-map-layer-google>
    <v-map-layer-osm visible="false"></v-map-layer-osm>
  </v-map-layer-group>

  <!-- UI-Steuerung -->
  <div class="basemap-switcher">
    <button onclick="switchTo('roadmap')">Straßenkarte</button>
    <button onclick="switchTo('satellite')">Satellit</button>
    <button onclick="switchTo('osm')">OpenStreetMap</button>
  </div>

<script>
  function switchTo(type) {
    document.querySelectorAll('v-map-layer-group[basemap="true"] v-map-layer-*').forEach(layer => {
      layer.setAttribute('visible', 'false');
    });
    if (type === 'osm') {
      document.querySelector('v-map-layer-osm').setAttribute('visible', 'true');
    } else {
      document.querySelector(`v-map-layer-google[map-type="${type}"]`).setAttribute('visible', 'true');
    }
  }
</script>
```

---

## 📚 Beispiele
### 1. Cesium 3D-Karte mit GeoJSON-Overlay
```
<v-map flavour="cesium" center="8.5417,49.0069" zoom="10">
  <v-map-layer-group basemap="true">
    <!-- Cesium hat keine explizite Basemap-Komponente, nutze die Standard-Ansicht -->
  </v-map-layer-group>
  <v-map-layer-group title="3D-Gebäude">
    <v-map-layer-geojson url="buildings.geojson"></v-map-layer-geojson>
  </v-map-layer-group>
</v-map>
```

### 2. OpenLayers mit mehreren Overlays
```
<v-map flavour="ol" center="8.5417,49.0069" zoom="12">
  <v-map-layer-group basemap="true">
    <v-map-layer-osm visible="true"></v-map-layer-osm>
  </v-map-layer-group>
  <v-map-layer-group title="Verkehr">
    <v-map-layer-geojson url="roads.geojson" visible="true"></v-map-layer-geojson>
  </v-map-layer-group>
  <v-map-layer-group title="Points of Interest">
    <v-map-layer-geojson url="pois.geojson" visible="true"></v-map-layer-geojson>
  </v-map-layer-group>
</v-map>
```

---

## 🛠️ Entwicklung
### Vorraussetzungen
- Node.js (v16 oder höher)
- npm oder yarn

### Lokale Entwicklung
1. Repository klonen:
   ```bash
   git clone https://github.com/dein-benutzername/v-map.git
   cd v-map
   ```
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
3. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```
4. Storybook starten:
   ```bash
   npm run storybook
   ```

### Build
```bash
npm run build
```

### Tests
```bash
npm test
```

---

## 📦 Veröffentlichen
Dieses Projekt nutzt [semantic-release](https://github.com/semantic-release/semantic-release) für automatische Versionierung.

**Commit-Richtlinien:**
- `fix: ...` → Patch Release (0.0.1)
- `feat: ...` → Minor Release (0.1.0)
- `BREAKING CHANGE: ...` → Major Release (1.0.0)

---

## 🤝 Contributing
Pull Requests sind willkommen! Für größere Änderungen bitte zuerst ein Issue erstellen.

1. Forke das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/xy`)
3. Commite deine Änderungen (`git commit -am 'Add feature xy'`)
4. Pushe den Branch (`git push origin feature/xy`)
5. Erstelle einen Pull Request

---

## 📄 Lizenz
[MIT](LICENSE) © [Dein Name oder Organisation]
