# Plan: Runtime-Fehlerpropagation fuer Layer

## Kontext

Die Error-API (`vmap-error`, `load-state`, `getError()`) faengt bisher nur Fehler waehrend der Layer-**Initialisierung** ab (wenn `addLayer` eine Exception wirft). Laufzeitfehler -- Tile-Ladefehler, Feature-Fetch-Fehler, Image-Ladefehler -- werden stillschweigend geloggt oder gehen verloren. Eine kaputte WMS-URL erzeugt hunderte `ERR_NAME_NOT_RESOLVED` in der Konsole, aber kein `vmap-error`-Event und kein `load-state="error"`.

**Ziel:** Laufzeitfehler aus allen 4 Map-Providern (OL, Leaflet, Cesium, Deck.gl) ueber die bestehende Error-API mit Debouncing propagieren.

## Entscheidung zum Fehlertyp

Laufzeit-Layer-Fehler verwenden die bestehende Kategorie `type: 'network'` -- sie beschreiben dieselbe Fehlerklasse (unerreichbare URL, HTTP-Fehler, DNS-Aufloesung). Es wird kein neuer `'runtime'`-Typ eingefuehrt. Das `message`-Feld unterscheidet den Ursprung (z.B. "Tile load error", "Feature load error").

## Callback-Signatur

Der Callback hat folgende einheitliche Signatur (ohne `layerId` im Error-Objekt -- die Zuordnung erfolgt ueber die Map-Registration):

```ts
type LayerErrorCallback = (error: { type: 'network'; message: string; cause?: unknown }) => void;
```

## Vorgehen

### 1. MapProvider-Interface erweitern

Zwei optionale Methoden zu `MapProvider` hinzufuegen (`src/types/mapprovider.ts`):

```ts
onLayerError?(layerId: string, callback: LayerErrorCallback): void;
offLayerError?(layerId: string): void;
```

### 2. VMapLayerHelper registriert/deregistriert Callback

In `src/layer/v-map-layer-helper.ts`:

- Nach erfolgreichem `addLayer` → `mapProvider.onLayerError(layerId, cb)` aufrufen
- Der Callback ruft ein neues `setRuntimeError()` mit **Leading-Edge-Throttle** (5s-Fenster) auf: Erster Fehler feuert sofort, nachfolgende werden bis zum Ablauf des Fensters unterdrueckt
- Bei `removeLayer()`/`dispose()` → `mapProvider.offLayerError(layerId)` aufrufen bevor layerId geloescht wird
- **Auch in `addToMapInternal()`**: Der bestehende `removeLayer`-Aufruf in Zeile 106 muss `offLayerError` aufrufen, bevor der alte Layer entfernt wird, um verwaiste Listener beim Recreate zu vermeiden

### 3. Jeder Provider haengt native Error-Listener an

Jeder Provider verwaltet `layerErrorCallbacks: Map<string, LayerErrorCallback>` und `layerErrorCleanups: Map<string, () => void>`.

**OpenLayers** (`src/map-provider/ol/openlayers-provider.ts`):
- `TileSource` (OSM, XYZ, WMS, ArcGIS, Google): `source.on('tileloaderror', handler)`
- `VectorSource` (GeoJSON-URL, WFS): `source.on('featuresloaderror', handler)`
- `ImageSource` (WCS): `source.on('imageloaderror', handler)`
- Cleanup: `source.un(event, handler)` pro layerId gespeichert
- **Source-Ersetzung**: Auf `change:source` am Layer lauschen, um alte Source-Listener abzuhaengen und neue anzuhaengen (deckt `updateWMSLayer`, `updateOSMLayer` etc. ab)

**Leaflet** (`src/map-provider/leaflet/leaflet-provider.ts`):
- `TileLayer` (OSM, XYZ, WMS, ArcGIS): `layer.on('tileerror', handler)`
- Cleanup: `layer.off('tileerror', handler)`
- **Kein Rebind bei updateLayer noetig**: Leaflet-Updates mutieren bestehende Layer in-place via `setUrl()`, `clearLayers()` etc. -- der Listener bleibt am selben Layer-Objekt haften. Einmalige Registrierung bei `onLayerError` reicht.

**Cesium** (`src/map-provider/cesium/cesium-provider.ts`):
- `ImageryProvider.errorEvent`: `provider.errorEvent.addEventListener(handler)`
- `Cesium3DTileset`: `tileset.tileFailed.addEventListener(handler)`
- Cleanup: `removeEventListener`
- **Rebind bei updateLayer**: Cesiums `updateLayer` verwendet zwei unterschiedliche Ersetzungspfade:
  - `layerManager.replaceLayer()` fuer google, xyz, wcs, wkt, geotiff, tile3d
  - `oldLayer.remove()` + `layerManager.addCustomLayer()` fuer terrain und terrain-geotiff
  - In beiden Faellen: `this.offLayerError(layerId)` vor der Ersetzung, `this.reattachErrorListeners(layerId)` danach mit dem neuen nativen Objekt

**Deck.gl** (`src/map-provider/deck/deck-provider.ts`):
- `onTileError` existiert bereits, reicht aber fuer WMS/WCS nicht aus: Die `getTileData()`-Catch-Bloecke in `buildWmsTileLayer` (Zeile 1017) und `buildWcsTileLayer` (Zeile 1156) geben stillschweigend transparente Fallback-Canvases zurueck und verhindern, dass `onTileError` jemals feuert.
- **Fix**: In den Catch-Bloecken von `getTileData()` den Error-Callback aufrufen, bevor die Fallback-Kachel zurueckgegeben wird:
  ```ts
  } catch (err) {
    const cb = this.layerErrorCallbacks.get(layerId);
    if (cb) cb({ type: 'network', message: `WMS tile fetch error: ${err}`, cause: err });
    // Transparente Fallback-Kachel wie bisher zurueckgeben
    ...
  }
  ```
- Fuer Standard-XYZ/OSM/ArcGIS-Tiles: Bestehendes `onTileError` mit Callback-Lookup verdrahten
- **DeckGLGeoTIFFLayer / DeckGLGeoTIFFTerrainLayer**: Diese Klassen haben keinen Zugriff auf die Provider-Callback-Map. Loesung: Ein optionales `onTileError`-Prop zu `DeckGLGeoTIFFLayerProps` und `DeckGLGeoTIFFTerrainLayerProps` hinzufuegen. Der Provider setzt dieses Prop beim Erstellen des Layers mit einem Closure ueber `layerErrorCallbacks.get(layerId)`.
- Kein nativer Listener-Cleanup noetig (Callback-Lookup ist dynamisch ueber Map)

### 4. Source-/Layer-Ersetzung ueber alle Provider

| Provider | Ersetzungsmechanismus | Rebind-Strategie |
|----------|----------------------|-----------------|
| **OL** | `layer.setSource(new ...)` in updateXXXLayer | Auf `change:source` am Layer lauschen → Source-Listener neu anhaengen |
| **Cesium** | `replaceLayer()` bzw. `remove()` + `addCustomLayer()` in updateLayer | `offLayerError` vor Ersetzung, `reattachErrorListeners` danach (beide Pfade) |
| **Leaflet** | In-place-Mutation via `setUrl()`, `clearLayers()` etc. | Kein Rebind noetig -- Listener bleibt am selben Objekt |
| **Deck.gl** | Model-Factory baut bei `applyToDeck()` neu | Kein Rebind noetig -- Callback-Lookup ist dynamisch ueber Map |

### 5. Cleanup im VMapLayerHelper

`offLayerError` muss in **allen** Pfaden aufgerufen werden, die einen Layer entfernen:
- `dispose()` (Zeile 279)
- `removeLayer()` (Zeile 302)
- `addToMapInternal()` Zeile 106 (Recreate-Pfad: Entfernt alten Layer bevor neuer hinzugefuegt wird)

## Zu aendernde Dateien

| Datei | Aenderung |
|-------|-----------|
| `src/types/mapprovider.ts` | `onLayerError?` / `offLayerError?` hinzufuegen |
| `src/layer/v-map-layer-helper.ts` | Callback-Registrierung nach addLayer, Debounce, Cleanup in allen Entfernungspfaden |
| `src/map-provider/ol/openlayers-provider.ts` | onLayerError/offLayerError mit OL-Event-Listenern + change:source-Rebind implementieren |
| `src/map-provider/leaflet/leaflet-provider.ts` | onLayerError/offLayerError mit Leaflet-tileerror-Listenern (einmalig, kein Rebind) |
| `src/map-provider/cesium/cesium-provider.ts` | onLayerError/offLayerError mit Cesium errorEvent/tileFailed + Rebind bei replaceLayer und remove+addCustomLayer |
| `src/map-provider/deck/deck-provider.ts` | onTileError + getTileData-Catch-Bloecke in Callback-Map verdrahten |
| `src/map-provider/deck/DeckGLGeoTIFFLayer.ts` | Optionales `onTileError`-Prop hinzufuegen, in internem TileLayer verdrahten |
| `src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts` | Optionales `onTileError`-Prop hinzufuegen, in internem TileLayer verdrahten |

## Implementierungsreihenfolge

1. **Kerntypen**: mapprovider.ts (keine Aenderungen an events.ts noetig -- `'network'` wiederverwenden)
2. **VMapLayerHelper**: Callback-Registrierung + Leading-Edge-Debounce + Cleanup in allen Pfaden
3. **OL-Provider** (meiste Layer-Typen, beste Testabdeckung, Source-Rebind)
4. **Deck.gl-Provider** (stumme WMS/WCS-Catch-Bloecke fixen, GeoTIFF-Props erweitern)
5. **Leaflet-Provider** (einmalige Listener-Registrierung, kein Rebind)
6. **Cesium-Provider** (replaceLayer + remove/addCustomLayer-Rebind)
7. **Demo**: html-demo-es2017 mit kaputter WMS aktualisieren, die jetzt vmap-error ausloest

## Debounce-Details

- Leading-Edge-Throttle: Erster Fehler feuert sofort
- 5s-Unterdrueckungsfenster pro Layer
- Reset bei `clearError()` / `markReady()`, damit der naechste Fehler nach Erholung sofort feuert
- Lebt im VMapLayerHelper, nicht in den Providern

## Verifikation

1. `pnpm test:vitest` -- alle 2250+ Spec-Tests bestehen
2. `pnpm test:vitest:unit` -- Unit-Tests bestehen
3. `pnpm build` -- Stencil-Build ohne Warnungen erfolgreich
4. Manuell: html-demo-es2017 mit kaputter WMS oeffnen → rotes Banner erscheint, `[vmap-error]` in der Konsole, nur 1 Event pro 5s-Fenster
5. **Automatisierte Tests** fuer:
   - Debounce-Verhalten im VMapLayerHelper (Leading-Edge-Throttle, Reset nach clearError)
   - Cleanup nach `removeLayer()`, `dispose()` und `addToMapInternal()`-Recreate-Pfad
   - Rebind nach `updateLayer()` fuer OL (Source-Ersetzung) und Cesium (replaceLayer + remove/addCustomLayer)
   - Deck.gl WMS/WCS-Catch-Block ruft Callback auf bevor Fallback-Kachel zurueckgegeben wird
