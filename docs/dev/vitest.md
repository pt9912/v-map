# vitest

## Beachte

Für Canvas-lastige Provider-Logik gibt es zwei sinnvolle Ebenen:

- `spec`: source-nahe Unit- und Branch-Tests mit gezielten Canvas-Mocks
- `browser`: echte Render-/Canvas-/Runtime-Tests ohne `jsdom`-Workarounds

Empfohlene Richtung:

- `spec` schlank halten und nur dort mocken, wo reine Logik/Branches geprüft werden sollen
- echte Canvas- und Browser-Pfade bevorzugt in das Vitest-`browser`-Projekt verschieben

## Aktueller Einstieg

- `pnpm test` fährt `spec` und `browser`
- `pnpm test:coverage` fährt den vollständigen Vitest-Coverage-Lauf über `spec` und `browser`
- `pnpm run test:vitest:browser` ist der gezielte Einstieg für Browser-/Runtime-Tests

## Laufzeit-Hinweis

Die Browser-Suite startet intern einen lokalen Vitest-/Vite-Server für Chromium.

- In normaler lokaler Umgebung und in CI läuft das regulär
- In restriktiven Sandboxes kann das Binden eines lokalen Ports mit `EPERM` scheitern
- In solchen Umgebungen müssen Browser-/Coverage-Läufe unsandboxed oder mit erlaubtem Loopback-Port ausgeführt werden
