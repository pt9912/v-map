# v-map-layer-terrain



<!-- Auto Generated Below -->


## Properties

| Property                     | Attribute           | Description                                                                            | Type      | Default     |
| ---------------------------- | ------------------- | -------------------------------------------------------------------------------------- | --------- | ----------- |
| `color`                      | `color`             | Basisfarbe für das Terrain. Erwartet Hex oder RGB (z. B. '#ff0000' oder '255,0,0').    | `string`  | `undefined` |
| `elevationData` _(required)_ | `elevation-data`    | URL zu Höhenraster im Heightmap-Format (z. B. GeoTIFF oder PNG Heightmap).             | `string`  | `undefined` |
| `elevationDecoder`           | `elevation-decoder` | JSON-Repräsentation eines Elevation-Decoders (z. B. '{"r":1,"g":1,"b":1,"offset":0}'). | `string`  | `undefined` |
| `maxZoom`                    | `max-zoom`          | Maximale Zoomstufe für das Terrain.                                                    | `number`  | `undefined` |
| `meshMaxError`               | `mesh-max-error`    | Fehler-Toleranz für das Mesh (wird an TerrainRenderer durchgereicht).                  | `number`  | `undefined` |
| `minZoom`                    | `min-zoom`          | Minimale Zoomstufe für das Terrain.                                                    | `number`  | `undefined` |
| `opacity`                    | `opacity`           | Opazität des Layers.                                                                   | `number`  | `1`         |
| `texture`                    | `texture`           | Optionale Textur (RGB) für das Terrain.                                                | `string`  | `undefined` |
| `visible`                    | `visible`           | Sichtbarkeit des Layers.                                                               | `boolean` | `true`      |
| `wireframe`                  | `wireframe`         | Darstellung des Mesh als Drahtgitter.                                                  | `boolean` | `undefined` |
| `zIndex`                     | `z-index`           | Z-Index für die Darstellung.                                                           | `number`  | `1000`      |


## Methods

### `isReady() => Promise<boolean>`

Liefert `true`, sobald das Terrain-Layer initialisiert wurde.

#### Returns

Type: `Promise<boolean>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
