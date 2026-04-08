# v-map-layer-osm

[← Zur Übersicht](./) · [**@npm9912/v-map**](/)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `loadState` | `error \| idle \| loading \| ready` | `load-state` | `'idle'` | Current load state of the layer. |
| `opacity` | `number` | `opacity` | `1.0` | Opazität der OSM-Kacheln (0–1). |
| `url` | `string` | `url` | `'https://tile.openstreetmap.org'` | Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers |
| `zIndex` | `number` | `z-index` | `10` | Z-index for layer stacking order. Higher values render on top. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Wird ausgelöst, wenn der OSM-Layer bereit ist. |

### Methods

- `getError() => Promise<VMapErrorDetail>` — Returns the last error detail, if any.
- `getLayerId() => Promise<string>` — Returns the internal layer ID used by the map provider.

