# v-map

[← Zur Übersicht](./README.md) · [**@npm9912/v-map**](/)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `center` | `string` | `center` | `'0,0'` | Mittelpunkt der Karte im **WGS84**-Koordinatensystem. Erwartet [lon, lat] (Längengrad, Breitengrad). |
| `cssMode` | `bundle \| cdn \| inline-min \| none` | `css-mode` | `'cdn'` | Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts). Bei `true` werden keine Provider initialisiert. |
| `flavour` | `cesium \| deck \| leaflet \| ol` | `flavour` | `'ol'` | Zu verwendender Karten-Provider. Unterstützte Werte: "ol" | "leaflet" | "cesium" | "deck". |
| `useDefaultImportMap` | `boolean` | `use-default-import-map` | `true` | Falls true, injiziert v-map automatisch die Import-Map. |
| `zoom` | `number` | `zoom` | `2` | Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20). |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `mapProviderReady` | `MapProviderDetail` | Wird ausgelöst, sobald der Karten-Provider initialisiert wurde und Layers entgegennimmt. `detail` enthält `{ provider, flavour }`. |

### Methods

- `isMapProviderReady() => Promise<boolean>` — Gibt zurück, ob der Karten-Provider initialisiert wurde und verwendet werden kann.
- `setView(coordinates: [number, number], zoom: number) => Promise<void>` — Setzt Kartenzentrum und Zoom (optional animiert).

