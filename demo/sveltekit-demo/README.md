# SvelteKit Demo

Diese Demo dient als lokale Integrationsumgebung für `@npm9912/v-map` mit SvelteKit/Vite.

## Workflow

Die Demo verwendet `@npm9912/v-map` über `file:../../`.

Wichtig:
- PNPM kann diese Abhängigkeit als materialisierte Paketkopie unter `.pnpm/...` statt als echten Live-Symlink verwenden.
- Deshalb synchronisiert `sync:vmap` vor `dev`, `check` und `build` immer die aktuellen Root-Artefakte (`dist/` und `loader/`) in die tatsächlich verwendete Paketkopie.
- Vor `vite dev` wird zusätzlich `node_modules/.vite` geleert, um veraltete Prebundle-Artefakte zu vermeiden.

## Commands

```sh
pnpm dev
pnpm check
pnpm build
pnpm smoke
```

Für Debug-Logs im Browser:

```js
localStorage.setItem('@pt9912/v-map:logLevel', 'debug');
```

Danach die Demo mit `?vmapDebug` öffnen, typischerweise:

```text
http://localhost:5173/?vmapDebug
```

## Vite Notes

Die Library importiert Leaflet wieder als `leaflet`, damit Stencil-Specs und E2E stabil bleiben.

Die Demo erzwingt den Leaflet-ESM-Build gezielt in Vite über einen präzisen Alias:

- `leaflet` -> absoluter Pfad auf `leaflet/dist/leaflet-src.esm.js`

Wichtig:
- Der Alias matcht nur den nackten Specifier `leaflet`.
- Tiefere Pfade wie `leaflet/dist/...` dürfen nicht erneut umgeschrieben werden, sonst entstehen kaputte Pfade oder doppelte Module.
- Der Alias ist bewusst ein Demo-/Vite-spezifischer Build-Hinweis, kein Library-API-Contract.

## Smoke Test

`pnpm smoke` prüft einen stabilen Minimalpfad:
- Dev-Server startet
- lokales GeoTIFF-Asset ist erreichbar
- `v-map` Custom Elements werden registriert
- der Deck-Provider wird initialisiert
- ein lokales GeoTIFF wird per UI aktiviert

Der Smoke-Test prüft bewusst nicht den vollständigen Headless-WebGL-Renderpfad.

## Lessons Learned / Best Practices

### Problems and fixes

- `@npm9912/v-map` wird via `file:../../` eingebunden, aber PNPM kann daraus eine Paketkopie unter `.pnpm/...` machen.
  Ergebnis: Nach einem Root-Build kann die Demo noch gegen veraltete gehashte Chunks laufen.
  Fix: `sync:vmap` vor `dev`, `check` und `build`.

- Vite-Fehler wie `504 (Outdated Optimize Dep)` und defekte dynamische Imports waren hier Cache-Probleme.
  Fix: `.vite` vor dem Dev-Start leeren.

- Eine direkte Umstellung der Library auf `leaflet/dist/leaflet-src.esm.js` war nicht über alle Umgebungen stabil:
  - gut für Vite
  - schlecht für Jest/Vitest-/Stencil-/E2E-Auflösung
  Fix: Library wieder auf `leaflet`, ESM-Erzwingung nur dort, wo sie wirklich gebraucht wird, nämlich in Vite.

- Deck/BitmapLayer-Texture-Erzeugung für GeoTIFF-Tiles schlug mit WebGL-Fehlern fehl.
  Ursache: rohe RGBA-Arrays lieferten nicht in jedem Pfad eine stabile Bildquelle für Deck/luma.
  Fix: Tile-Daten als `ImageData` an `BitmapLayer` übergeben.

- Debugging nur am GeoTIFF-Load-Pfad war nicht ausreichend.
  Fix: Logs direkt am Übergabepunkt zu `BitmapLayer`, z. B. `textureSource(...): kind=ImageData, ctor=ImageData, w=256, h=256`.

- Der Deck-GeoTIFF-Lifecycle hat dieselbe Quelle initial doppelt geladen.
  Fix: Load-Signatur plus Token-basierte Guard-Logik gegen doppelte und veraltete Loads.

- Der Deck-GeoTIFF-Layer konnte nach `opacity`-Änderungen dauerhaft verschwinden.
  Ursache: Clone-basierte Layer-Updates verloren geladene Laufzeitdaten wie `image`, `tileProcessor` und `sourceBounds`.
  Fix: Diese Laufzeitdaten werden jetzt in `state` gespiegelt und in neuen Layer-Instanzen wiederhergestellt.

### Best practices

- Demo-Konfiguration schlank halten. Probleme nach Möglichkeit in Library, Packaging oder Build-Flow beheben.
- Bei `file:`-Dependencies immer prüfen, ob der Paketmanager symlinkt oder eine Kopie materialisiert.
- Nach jedem Library-Build sicherstellen, dass die Demo wirklich das neue Build konsumiert.
- Vite-Optimize-Dep-Fehler zuerst als Cache-Problem behandeln.
- Bei Deck/WebGL-Problemen Bildtyp, Konstruktor, Breite, Höhe und Byte-Länge direkt am Render-Handoff loggen.
- Bei Deck-Composite-Layern bedenken, dass Prop-Updates oft per `clone(...)` laufen; Laufzeitdaten dürfen deshalb nicht nur auf der aktuellen Instanz hängen.
- Für reproduzierbare GeoTIFF-Debugs lokale kontrollierte Testdaten bevorzugen; externe größere Dateien nur ergänzend verwenden.
