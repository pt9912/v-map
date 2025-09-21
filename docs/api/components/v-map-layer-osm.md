# v-map-layer-osm

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `opacity` | `number` | `opacity` | `1.0` | Opazität der OSM-Kacheln (0–1). |
| `url` | `string` | `url` | `'https://tile.openstreetmap.org'` |  |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers |
| `zIndex` | `number` | `z-index` | `10` |  |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Wird ausgelöst, wenn der OSM-Layer bereit ist. |

### Methods

- `getLayerId() => Promise<string>`

