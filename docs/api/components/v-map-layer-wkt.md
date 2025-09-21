# v-map-layer-wkt

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `opacity` | `number` | `opacity` | `1.0` | Globale Opazität (0–1). |
| `url` | `string` | `url` |  | URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`). |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers. |
| `wkt` | `string` | `wkt` |  | WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))"). |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Signalisiert, dass das WKT-Layer initialisiert ist. |

