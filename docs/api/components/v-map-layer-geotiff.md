# v-map-layer-geotiff

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `opacity` | `number` | `opacity` | `1.0` | Opazität der GeoTIFF-Kacheln (0–1). |
| `url` | `string` | `url` | `null` |  |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers |
| `zIndex` | `number` | `z-index` | `1000` |  |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist. |

### Methods

- `getLayerId() => Promise<string>`

