# Releasing

Dieser Leitfaden beschreibt, wie ein Release von `@npm9912/v-map` veröffentlicht wird,
welche Voraussetzungen erfüllt sein müssen und welche Stolperfallen es gibt.

## Überblick

Releases laufen vollautomatisch über [semantic-release](https://semantic-release.gitbook.io/),
ausgelöst durch jeden Push auf den `main`-Branch. semantic-release liest die
Conventional-Commit-Historie seit dem letzten Tag, berechnet daraus die nächste
Versionsnummer und führt anschließend folgende Schritte aus:

1. Version in `package.json` hochsetzen
2. `CHANGELOG.md` aktualisieren
3. Auf npm publishen (`@npm9912/v-map`, public)
4. GitHub-Release mit Release Notes erstellen
5. Git-Tag `v<version>` setzen
6. Aktualisierte `package.json` und `CHANGELOG.md` zurück nach `main` committen
   (`chore(release): <version> [skip ci]`)

Alle Plugins sind in `.releaserc.json` konfiguriert. **`.releaserc.json` ist die einzige
Quelle der Wahrheit** — semantic-release ignoriert ein parallel vorhandenes `release`-Feld
in `package.json` nicht, aber doppelte Konfiguration verwirrt nur. Nicht beides pflegen.

## Voraussetzungen

### Einmalig (Repo-Setup)

- **`NPM_TOKEN`** als GitHub-Actions-Secret im Repository hinterlegt.
  Es muss ein Token sein, der Publish-Rechte für den Scope `@npm9912` hat
  (Automation-Token oder Granular Token mit `Read and write` für Packages).
  Read-only Token funktioniert nicht.
- **`GITHUB_TOKEN`** ist automatisch verfügbar — nichts zu tun.
- **Branch-Konfiguration:** semantic-release published nur von `main`
  (`branches: ["main"]` in `.releaserc.json`). Andere Branches lösen kein Release aus.

### Vor jedem Release

- `develop` ist aktuell, alle CI-Jobs (Test, Test Browser, Build, Docs) sind grün.
- Alle relevanten Commits folgen [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat:` → Minor-Bump (`0.1.0` → `0.2.0`)
  - `fix:` → Patch-Bump (`0.1.0` → `0.1.1`)
  - `BREAKING CHANGE:` Footer oder `feat!:` → Major-Bump (`0.1.0` → `1.0.0`)
  - `chore:`, `docs:`, `test:`, `refactor:`, `style:`, `ci:` → kein Release
- Wenn ausschließlich Commit-Typen ohne Release-Auswirkung vorliegen, gibt semantic-release
  *kein* Release aus und der Workflow läuft trotzdem grün durch — das ist kein Fehler.

## Branch-Strategie

- **`develop`** ist der Integrations-Branch. Alle Feature- und Fix-Commits landen hier.
- **`main`** ist der Release-Branch. Auf `main` wird **nicht direkt entwickelt**.
- Ein Release entsteht durch einen Merge `develop` → `main`.

## Release durchführen

### 1. Sicherstellen, dass `develop` release-fertig ist

```bash
git checkout develop
git pull --ff-only origin develop
gh run list --branch develop --limit 5   # alle grün?
```

### 2. `develop` nach `main` mergen

**Wichtig:** Immer `--no-ff` (Merge-Commit), niemals Squash. semantic-release braucht die
einzelnen Conventional-Commit-Messages, um die Release Notes korrekt zu generieren.
Ein Squash würde alles zu einem einzigen Commit zusammenziehen und damit die gesamte
Historie für die Versionsberechnung kollabieren.

```bash
git checkout main
git pull --ff-only origin main
git merge --no-ff develop -m "chore: merge develop for release"
git push origin main
```

Der Push triggert automatisch den `Release`-Workflow (`.github/workflows/release.yml`).

### 3. Release-Workflow beobachten

```bash
gh run list --branch main --limit 5
gh run watch <run-id> --exit-status
```

Was im Erfolgsfall passiert:

- Neuer Tag `v<version>` auf GitHub
- Neuer Eintrag unter [Releases](https://github.com/pt9912/v-map/releases)
- `pnpm view @npm9912/v-map version` zeigt die neue Version
- Auf `main` liegt ein neuer Commit `chore(release): <version> [skip ci]` mit
  hochgesetzter `package.json` und aktualisierter `CHANGELOG.md`

### 4. `main` zurück nach `develop` mergen

Sehr wichtig und leicht zu vergessen: Der Release-Commit von semantic-release liegt
ausschließlich auf `main`. Wenn er nicht zurück nach `develop` gemergt wird, divergieren
Versionsnummer und `CHANGELOG.md` zwischen den Branches und beim nächsten Release-Merge
gibt es Konflikte.

```bash
git checkout develop
git pull --ff-only origin develop
git merge origin/main           # idealerweise fast-forward
git push origin develop
```

## Versionierung

- Aktueller Versionsstand: siehe `package.json` und `CHANGELOG.md`.
- Das Projekt startete bewusst bei `0.1.0` (nicht `1.0.0`), um zu signalisieren,
  dass die API noch nicht stabilisiert ist. Realisiert über einen Placeholder-Tag
  `v0.0.0` auf dem Initial Commit als Baseline für semantic-release.
- Solange wir auf `0.x` sind, behandeln wir auch `feat:`-Commits als potenziell
  brechend in Bezug auf Konsumenten — eine echte Stabilitätsgarantie kommt erst
  mit `1.0.0`.

## Erstes Release einer neuen Major-Version

Sobald die API stabil ist und wir auf `1.0.0` gehen wollen, reicht ein einzelner
Commit mit `BREAKING CHANGE:` Footer:

```
feat: stabilize public API

BREAKING CHANGE: API is now considered stable. No code changes,
this commit only marks the 1.0 milestone.
```

semantic-release berechnet daraus den Sprung von der aktuellen `0.x.y` auf `1.0.0`.

## Fehlerbehebung

### Workflow läuft, aber kein Release wird erzeugt

Das ist meistens *kein* Fehler, sondern bedeutet: Es gab seit dem letzten Tag
keine release-relevanten Commits (nur `chore:`, `docs:`, `test:` etc.).
Im Job-Log steht dann `There are no relevant changes, so no new version is released.`.

### `npm publish` schlägt mit `403 Forbidden` fehl

- `NPM_TOKEN` fehlt oder ist read-only.
- Token gehört zu einem User ohne Publish-Rechte für den Scope `@npm9912`.
- Token ist abgelaufen.

Lösung: Neuen Automation-Token auf npmjs.com erstellen und in den Repo-Secrets
ersetzen. Anschließend Workflow neu auslösen (`gh run rerun <run-id>`).

### `semantic-release/git` kann den Release-Commit nicht pushen

Tritt z. B. auf, wenn `main` durch Branch-Protection-Rules vor direkten Pushes
geschützt ist. Workarounds:

- Branch Protection für `main` so konfigurieren, dass GitHub Actions pushen darf
  (Bypass für den Workflow-Bot).
- Alternativ: `@semantic-release/git` aus den Plugins entfernen und CHANGELOG/Version
  manuell pflegen — wird ausdrücklich nicht empfohlen.

### Zwei Releases hintereinander, der zweite schlägt fehl

Mögliche Ursache: `develop` wurde nach dem ersten Release nicht mit `main` synchronisiert
(siehe Schritt 4 oben). Beim nächsten Merge `develop` → `main` entsteht dann ein
Konflikt in `package.json` (Version) oder `CHANGELOG.md`. Lösung: erst Schritt 4
nachholen, dann den neuen Release-Merge fahren.

## Was niemals tun

- **Nicht** `[skip ci]` aus dem `chore(release):` Commit-Message-Template entfernen.
  Sonst löst der Release-Commit selbst wieder den Release-Workflow aus → Endlosschleife.
- **Nicht** Tags von Hand erstellen oder löschen, die zum semantic-release-Schema
  passen (`v<x>.<y>.<z>`). semantic-release nutzt sie als Versionsbaseline und gerät
  sonst durcheinander.
- **Nicht** mit `--force` auf `main` pushen. Ein einmal veröffentlichter Commit hängt
  an einem npm-Release und einem GitHub-Release; die zu überschreiben hinterlässt
  inkonsistenten Zustand.
- **Nicht** `develop` direkt nach npm publishen. Nur `main` ist als Release-Branch
  konfiguriert.
