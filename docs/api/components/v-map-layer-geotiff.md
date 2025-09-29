# v-map-layer-geotiff

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `opacity` | `number` | `opacity` | `1.0` | Opazität der GeoTIFF-Kacheln (0–1). |
| `url` | `string` | `url` | `null` | URL to the GeoTIFF file to be displayed on the map. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers |
| `zIndex` | `number` | `z-index` | `1000` | Z-index for layer stacking order. Higher values render on top. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist. |

### Methods

- `getLayerId() => Promise<string>` — Returns the internal layer ID used by the map provider.

