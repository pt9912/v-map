# v-map



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute                | Description                                                                                                            | Type                                          | Default |
| --------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------- |
| `center`              | `center`                 | Mittelpunkt der Karte im **WGS84**-Koordinatensystem. Erwartet [lon, lat] (Längengrad, Breitengrad).                   | `string`                                      | `'0,0'` |
| `cssMode`             | `css-mode`               | Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts). Bei `true` werden keine Provider initialisiert. | `"bundle" \| "cdn" \| "inline-min" \| "none"` | `'cdn'` |
| `flavour`             | `flavour`                | Zu verwendender Karten-Provider. Unterstützte Werte: "ol" \| "leaflet" \| "cesium" \| "deck".                          | `"cesium" \| "deck" \| "leaflet" \| "ol"`     | `'ol'`  |
| `useDefaultImportMap` | `use-default-import-map` | Falls true, injiziert v-map automatisch die Import-Map.                                                                | `boolean`                                     | `true`  |
| `zoom`                | `zoom`                   | Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20).                                                         | `number`                                      | `2`     |


## Events

| Event              | Description                                                                                                                        | Type                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `mapProviderReady` | Wird ausgelöst, sobald der Karten-Provider initialisiert wurde und Layers entgegennimmt. `detail` enthält `{ provider, flavour }`. | `CustomEvent<MapProviderDetail>` |


## Methods

### `addLayer(layerConfig: any) => Promise<void>`

Fügt ein Layer-Element (Web Component) zur Karte hinzu.
Das Layer muss kompatibel mit dem aktiven Provider sein.

#### Parameters

| Name          | Type  | Description |
| ------------- | ----- | ----------- |
| `layerConfig` | `any` |             |

#### Returns

Type: `Promise<void>`



### `getMapProvider() => Promise<MapProvider>`

Liefert die aktive Provider-Instanz (z. B. OL-, Leaflet- oder Deck-Wrapper).
Nützlich für fortgeschrittene Integrationen.

#### Returns

Type: `Promise<MapProvider>`

Promise mit der Provider-Instanz oder `undefined`, falls noch nicht bereit.

### `isMapProviderAvailable() => Promise<boolean>`

Prüft, ob ein bestimmter Provider im aktuellen Build/Runtime verfügbar ist.

#### Returns

Type: `Promise<boolean>`

`true`, wenn verfügbar, sonst `false`.

### `setView(coordinates: [number, number], zoom: number) => Promise<void>`

Setzt Kartenzentrum und Zoom (optional animiert).

#### Parameters

| Name          | Type               | Description |
| ------------- | ------------------ | ----------- |
| `coordinates` | `[number, number]` |             |
| `zoom`        | `number`           | Zoomstufe   |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
