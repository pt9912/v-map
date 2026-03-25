# V-Map Demo (Properties & Slot-Änderungen)

Diese kleine, frameworkfreie Test-Seite erlaubt es dir, **Property- und Slot-Updates** deiner Stencil-Komponenten (`@Listen`/`@Watch`) zu testen – **ohne** die Remounts, die in Storybook beim Ändern von Args auftreten.

## Inhalte

- `index.html` – Oberfläche und Controls
- `main.js` – Logik zum Erzeugen der Map, Updaten von Slot/Property, Event-Logging
- `styles.css` – kleines Dark-Theme

## Voraussetzungen

1. Im Wurzelprojekt (V-Map) **bauen**, damit der Stencil-Loader vorhanden ist:
   ```bash
   pnpm build
   ```
2. **Pfadannahme:** Die Test-Seite liegt in `./demo/v-map/` neben deinen `loader/`- und `dist/`-Ordnern, sodass der Loader unter `../../loader/index.js` erreichbar ist.  
   Alternativ kannst du den Loader-Pfad via Query-Param setzen:
   ```
   http://localhost:4174/demo/v-map/?loader=/absoluter/pfad/zu/loader/index.js
   ```

## Start

Statisch serven:

```bash
# im Projekt-Root
pnpm dlx http-server . -p 4174
# dann http://localhost:4174/demo/v-map/ öffnen
```

Wichtig: In diesem Repo kann `pnpm dlx http-server -p 4174` je nach Umgebung `./public` statt des Repo-Roots serven. Das explizite `.` ist hier erforderlich.

oder direkt die `index.html` im Browser öffnen (beachte CORS-Beschränkungen für ES-Module bei file://).

## Nutzung

- **Map-Provider wechseln:** Dropdown oben (ol/leaflet/deck/cesium).
- **Opacity:** Slider ändert das `opacity`-Attribut am GeoJSON-Layer.
- **Update-Modus:**
  - **Slot:** JSON wird in den `<div slot="geojson">` geschrieben (+ optionaler `slotchange`-Ping).
  - **Property:** `layer.geojson = {…}` setzt direkt die Prop → triggert deine `@Watch`er.
- **Beispiele:** Buttons befüllen die Textarea mit validem GeoJSON (Point/Line/Polygon/Cluster).
- **Logs:** Rechts werden Events und relevante Änderungen angezeigt (slot, layer attrs, map events).
- **Logs löschen:** Button _„Logs löschen“_ leert den Log-Container.

## Seitenleiste dynamisch verbreitern

Zwischen Karte und Log befindet sich ein **Drag-Handle**. Ziehe ihn horizontal, um die Breite der Logs zu ändern.

- Bereich: **240–900 px**
- Doppel-Klick auf den Handle toggelt zwischen **320 px** und **480 px**
- Die Breite wird in `localStorage` (Key `vmap:logWidth`) persistiert
