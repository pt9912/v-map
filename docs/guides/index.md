# Guides

Vertiefende Anleitungen zu bestimmten Themen rund um v-map.
Alle Guides setzen voraus, dass du den [Getting-Started-Guide](../getting-started)
gelesen hast.

## Verfügbare Guides

### [CDN ohne Bundler](./cdn-esm)

Wie du v-map mit einer einzigen `<script type="module">` Zeile aus einem
öffentlichen CDN (jsDelivr) lädst — ohne npm, ohne Build-Pipeline. Inklusive
Erklärung, wie die Auto-Importmap die Peer-Dependencies (OpenLayers, Leaflet,
Deck.gl) automatisch auflöst, und einer CDN-Empfehlung.

### [Error Handling](./error-handling)

Beschreibt die öffentliche Error-API für Anwender von v-map.
Wie das einheitliche `vmap-error` Event über alle Layer-Komponenten funktioniert,
wie Lade- und Laufzeitfehler unterschieden werden und wie Anwendungen darauf
reagieren können.

### [Styling](./styling)

Wie `<v-map-style>` kartographische Styles in verschiedenen Formaten parst und
auf Layer anwendet — mit Beispielen für GeoStyler-JSON, SLD, Mapbox-GL, QGIS
und lyrx, sowie wie Style und Layer über Events kommunizieren.

---

## Siehe auch

- **[Getting Started](../getting-started)** — Installation und erste Karte
- **[Komponenten-API](../api/components/)** — Vollständige Referenz aller 18 Web Components
- **[Layer-Matrix](../layers/matrix)** — Welcher Provider unterstützt welchen Layer-Typ
