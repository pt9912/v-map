# Vitest Test Strategy Notes

## Kontext

Das `spec`-Projekt wurde von einem `dist`-abhängigen Setup in Richtung source-only verschoben. Der frühere `dist`-Import in `src/testing/setupTests.stencil.ts` wurde entfernt. Damit sind die verbleibenden Probleme im Voll-Run keine `dist`-Probleme mehr, sondern echte `jsdom`-Grenzen, vor allem bei Canvas-Pfaden.

Ein unsandboxed Lauf von `pnpm exec vitest run --project spec` zeigt Fehler wie:

- `Not implemented: HTMLCanvasElement.prototype.getContext`

Betroffen sind u. a. Canvas-Pfade in:

- `src/map-provider/leaflet/GeoTIFFGridLayer.ts`
- `src/map-provider/deck/deck-provider.ts`
- `src/map-provider/cesium/GeoTIFFImageryProvider.ts`

## Vergleich an einem Beispiel

Verglichen wurde der Provider `src/map-provider/cesium/GeoTIFFImageryProvider.ts`.

### 1. Spec mit Canvas-Mock

Verwendet wurde ein bestehender lokaler Mock-Ansatz in:

- `src/map-provider/cesium/GeoTIFFImageryProvider.spec.ts`

Ausgeführter Test:

- `pnpm exec vitest run --project spec src/map-provider/cesium/GeoTIFFImageryProvider.spec.ts -t "createFlippedImageFromRGBA – canvas fallback path"`

Ergebnis:

- `1` Testdatei grün
- `2` Tests grün
- `34` Tests übersprungen

Bewertung:

- gut für gezielte Branch-/Unit-Tests in `jsdom`
- funktioniert nur dort sauber, wo Canvas explizit gemockt wird
- skaliert schlecht als generelle Lösung für alle echten Render-/Canvas-Pfade

### 2. Echter Browser-Test

Neu angelegt:

- `src/map-provider/cesium/GeoTIFFImageryProvider.test.ts`

Der Browser-Test ruft `requestImage(...)` im Vitest-Browser-Mode auf und nutzt echte Canvas-APIs statt `getContext`-Mocks.

Ausgeführter Test:

- `pnpm exec vitest run --project browser src/map-provider/cesium/GeoTIFFImageryProvider.test.ts`

Ergebnis:

- `1` Testdatei grün
- `1` Test grün

Zusätzliche Verifikation:

- `pnpm exec vitest run --project browser`
- Ergebnis: `2` Dateien grün, `4` Tests grün

Bewertung:

- robuster für echtes Canvas-/Rendering-Verhalten
- näher an der tatsächlichen Runtime
- besser geeignet für Provider-/Raster-/Canvas-Pfade

## Schlussfolgerung

Für Canvas-lastige Provider-Logik gibt es zwei sinnvolle Ebenen:

- `spec`: source-nahe Unit- und Branch-Tests mit gezielten Canvas-Mocks
- `browser`: echte Render-/Canvas-/Runtime-Tests ohne `jsdom`-Workarounds

Empfohlene Richtung:

- `spec` schlank halten und nur dort mocken, wo reine Logik/Branches geprüft werden sollen
- echte Canvas- und Browser-Pfade bevorzugt in das Vitest-`browser`-Projekt verschieben

## Nächste Schritte

1. Weitere Canvas-fehlende Spec-Dateien identifizieren und in `mockbar in spec` vs. `besser im browser` einteilen.
2. Für Provider wie Cesium, Deck und GeoTIFF kleine Browser-Mode-Tests ergänzen.
3. Falls nötig, einen sehr kleinen gemeinsamen Canvas-Mock für `spec` einführen, aber nur für rein logische Fallback-Pfade, nicht als generellen Ersatz für Browser-Tests.

## Erreichter Stand

Nach der Umstellung weiterer problematischer Component-Specs auf source-only-Testhelpers gilt jetzt:

- `pnpm exec vitest run --project spec`
- Ergebnis: `66` Testdateien grün
- Ergebnis: `2132` Tests grün
- Ergebnis: `5` Tests übersprungen

Wichtige Befunde aus dem Abschluss:

- Das frühere `dist`-Problem im Spec-Setup ist beseitigt.
- Die verbleibenden Canvas-Fehler in `jsdom` wurden durch einen minimalen Spec-Fallback in `src/testing/setupTests.vitest.ts` entschärft.
- Echte Canvas-/Runtime-Pfade bleiben zusätzlich im Vitest-`browser`-Projekt testbar.
- Die beiden letzten Hänger `src/components/v-map-builder/v-map-builder.spec.tsx` und `src/components/v-map-style/v-map-style.spec.tsx` hingen jeweils bereits am ersten `render(...)`-Test und wurden durch lokale source-only-Render-Helper stabilisiert.
