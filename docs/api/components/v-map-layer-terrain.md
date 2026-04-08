# v-map-layer-terrain

[← Zur Übersicht](./) · [**@npm9912/v-map**](/)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `color` | `string` | `color` |  | Basisfarbe für das Terrain. Erwartet Hex oder RGB (z. B. '#ff0000' oder '255,0,0'). |
| `elevationData` | `string` | `elevation-data` |  | URL zu Höhenraster im Heightmap-Format (z. B. GeoTIFF oder PNG Heightmap). |
| `elevationDecoder` | `string` | `elevation-decoder` |  | JSON-Repräsentation eines Elevation-Decoders (z. B. '{"r":1,"g":1,"b":1,"offset":0}'). |
| `loadState` | `error \| idle \| loading \| ready` | `load-state` | `'idle'` | Current load state of the layer. |
| `maxZoom` | `number` | `max-zoom` |  | Maximale Zoomstufe für das Terrain. |
| `meshMaxError` | `number` | `mesh-max-error` |  | Fehler-Toleranz für das Mesh (wird an TerrainRenderer durchgereicht). |
| `minZoom` | `number` | `min-zoom` |  | Minimale Zoomstufe für das Terrain. |
| `opacity` | `number` | `opacity` | `1` | Opazität des Layers. |
| `texture` | `string` | `texture` |  | Optionale Textur (RGB) für das Terrain. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers. |
| `wireframe` | `boolean` | `wireframe` |  | Darstellung des Mesh als Drahtgitter. |
| `zIndex` | `number` | `z-index` | `1000` | Z-Index für die Darstellung. |

### Methods

- `getError() => Promise<VMapErrorDetail>` — Returns the last error detail, if any.
- `isReady() => Promise<boolean>` — Liefert `true`, sobald das Terrain-Layer initialisiert wurde.

