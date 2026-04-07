# v-map-layer-tile3d

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `loadState` | `error \| idle \| loading \| ready` | `load-state` | `'idle'` | Current load state of the layer. |
| `opacity` | `number` | `opacity` | `1` | Global opacity factor (0-1). |
| `tilesetOptions` | `string \| unknown` | `tileset-options` |  | Optional JSON string or object with Cesium3DTileset options. |
| `url` | `string` | `url` |  | URL pointing to the Cesium 3D Tileset. |
| `visible` | `boolean` | `visible` | `true` | Whether the tileset should be visible. |
| `zIndex` | `number` | `z-index` | `1000` | Z-index used for ordering tilesets. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Fired once the tileset layer is initialised. |

### Methods

- `getError() => Promise<VMapErrorDetail>` — Returns the last error detail, if any.
- `isReady() => Promise<boolean>` — Indicates whether the tileset has been initialised and added to the map.

