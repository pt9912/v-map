# Terrain GeoTIFF Demo

Diese Demo-Seite ermöglicht das Testen der `v-map-layer-terrain-geotiff` Komponente mit verschiedenen Providern (deck.gl und Cesium).

## Inhalte

- `index.html` – Benutzeroberfläche mit Terrain-Controls
- `main.js` – Logik für Map-Erstellung, Terrain-Layer-Updates und Event-Logging
- Verwendet `../v-map/styles.css` für das Styling

## Voraussetzungen

### 1. Projekt bauen

Im Projekt-Root:

```bash
pnpm build
```

Dies erstellt den Stencil-Loader unter `loader/index.es2017.js`.

### 2. Test-DEMs herunterladen

Führe das Download-Script aus, um Test-DEM-Dateien nach `/tmp/v-map-test-dems/` zu laden:

```bash
bash scripts/download-test-dems.sh
```

Das Script lädt automatisch:
- `i30dem.tif` (USGS DEM, ~5.3 MB)
- `m30dem.tif` (USGS DEM, ~5.3 MB)

Die Dateien werden in `/tmp/v-map-test-dems/` gespeichert und 24 Stunden gecacht (erneuter Aufruf überspringt den Download). Da `/tmp` beim Neustart des Systems geleert werden kann, muss das Script ggf. erneut ausgeführt werden.

**Hinweis**: Ein Symlink von `demo/terrain-geotiff/test-dems` nach `/tmp/v-map-test-dems` ermöglicht den Zugriff über HTTP anstatt `file://` URLs.

### 3. Lokalen Server starten

Im Projekt-Root:

```bash
pnpm dlx http-server . -p 4174
```

Oder einen anderen statischen Server verwenden.

Wichtig: In diesem Repo kann `pnpm dlx http-server -p 4174` je nach Umgebung `./public` statt des Repo-Roots serven. Das explizite `.` ist hier erforderlich.

## Start

Öffne im Browser:

```
http://localhost:4174/demo/terrain-geotiff/
```
Für Debug-Logs im Browser:

```js
localStorage.setItem('@pt9912/v-map:logLevel', 'debug');
```

## Features

### Provider-Auswahl

- **deck.gl**: Verwendet deck.gl's TerrainLayer für mesh-basiertes 3D-Terrain
- **Cesium**: Verwendet Cesiums HeightmapTerrainProvider für Heightmap-basiertes Terrain

### DEM-Quellen

**Lokale Test-DEMs** (nach Download via Script):
- `./test-dems/i30dem.tif` - USGS DEM, Great Smoky Mountains (5.3 MB)
- `./test-dems/m30dem.tif` - USGS DEM, Great Smoky Mountains (5.3 MB)

**Online-Beispiele** (CORS-enabled):
- AWS Terrain Tile A (138 KB) - Schnell, klein, COG-optimiert
- AWS Terrain Tile B (138 KB) - Alternative Location

**CORS-Hinweis**: Viele öffentliche DEM-Quellen (z.B. Copernicus DEM auf S3) haben keine CORS-Header konfiguriert und können daher nicht direkt im Browser geladen werden. Die AWS Terrain Tiles funktionieren, da der S3-Bucket CORS-enabled ist.

### Terrain-Parameter

- **Höhenüberhöhung** (`elevation-scale`): 0.1 – 5.0
  - Überhöht die Höhendarstellung für bessere Sichtbarkeit

- **Mesh-Fehlertoleranz** (`mesh-max-error`): 0.5 – 10.0
  - Kleinere Werte = detaillierteres Mesh, aber langsamer
  - Größere Werte = gröberes Mesh, aber schneller

- **Wireframe**: Zeigt nur die Mesh-Linien

- **Opacity**: Transparenz des Terrain-Layers (0 – 1)

### Custom URL

Eigene GeoTIFF-URLs können im URL-Feld eingegeben und mit "URL anwenden" geladen werden.

## Unterstützte GeoTIFF-Formate

- Cloud-Optimized GeoTIFF (COG)
- Standard GeoTIFF mit Höhendaten
- Single-Band Float32/Int16 Elevation Data
- Verschiedene Projektionen (wird automatisch transformiert)

## Logs

Rechts werden alle relevanten Events und Änderungen protokolliert:
- Map-Provider-Events
- Terrain-Layer-Events (ready, URL-Änderungen)
- Parameter-Änderungen
- Console-Logs von v-map-Komponenten

## Hinweise

- **Lokale DEMs**: Die Test-DEMs werden über HTTP bereitgestellt (via Symlink `test-dems/` → `/tmp/v-map-test-dems/`). Browser blockieren direkte `file://` URLs aus Sicherheitsgründen.
- **Download-Button**: In der statisch servierten Demo kann kein Shell-Script direkt ausgeführt werden. Der Button kopiert deshalb den benötigten Befehl `bash ../../scripts/download-test-dems.sh`.
- **Performance**: Große GeoTIFFs können lange Ladezeiten haben. Verwende COGs für bessere Performance
- **Cesium**: Benötigt Cesium-Assets (werden automatisch geladen, wenn Cesium-Provider aktiv ist)

## Troubleshooting

### Terrain wird nicht angezeigt

1. Prüfe in den Logs, ob Fehler aufgetreten sind
2. Prüfe, ob die GeoTIFF-URL erreichbar ist (CORS, Netzwerk)
3. Bei lokalen Dateien: Stelle sicher, dass das Download-Script erfolgreich war
4. Browser-Konsole öffnen für detaillierte Fehlerinfos

### "defineCustomElements is not a function"

Das Projekt muss mit `pnpm build` gebaut werden, damit der Loader existiert.

### Lokale Dateien laden nicht

- Stelle sicher, dass der Symlink existiert: `ls -l demo/terrain-geotiff/test-dems`
- Falls nicht vorhanden: `ln -sf /tmp/v-map-test-dems demo/terrain-geotiff/test-dems`
- Verwende die relativen URLs `./test-dems/i30dem.tif` statt `file://` URLs
- HTTP-Server muss laufen (`pnpm dlx http-server -p 4174`)
