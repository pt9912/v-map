# v-map-layer-terrain-geotiff

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)

The `v-map-layer-terrain-geotiff` component displays 3D terrain from GeoTIFF elevation data using deck.gl's TerrainLayer.

### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `color` | `[number, number, number]` | `color` | `null` | Color for the terrain (if no texture is provided). [r, g, b] with values 0-255. |
| `colorMap` | `ColorMap \| string` | `color-map` | `null` | ColorMap for elevation data visualization. Only relevant when no texture is set. |
| `elevationScale` | `number` | `elevation-scale` | `1.0` | Elevation exaggeration factor. |
| `forceProjection` | `boolean` | `force-projection` | `false` | Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys |
| `maxZoom` | `number` | `max-zoom` | `24` | Maximum zoom level. |
| `meshMaxError` | `number` | `mesh-max-error` | `4.0` | Mesh error tolerance in meters (Martini). Smaller values = more detailed mesh, but slower. |
| `minZoom` | `number` | `min-zoom` | `0` | Minimum zoom level. |
| `nodata` | `number` | `nodata` | `null` | NoData value to discard (overriding any nodata values in the metadata). |
| `opacity` | `number` | `opacity` | `1.0` | Opacity of the terrain layer (0–1). |
| `projection` | `string` | `projection` | `null` | Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String) |
| `texture` | `string` | `texture` | `null` | Optional texture URL (can be an image or tile URL). |
| `tileSize` | `number` | `tile-size` | `256` | Tile size in pixels. |
| `url` | `string` | `url` | `null` | URL to the GeoTIFF file containing elevation data. |
| `valueRange` | `[number, number]` | `value-range` | `null` | Value range for colormap normalization [min, max]. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers |
| `wireframe` | `boolean` | `wireframe` | `false` | Enable wireframe mode (show only mesh lines). |
| `zIndex` | `number` | `z-index` | `100` | Z-index for layer stacking order. Higher values render on top. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Fired when the terrain layer is ready. |

### Methods

- `getLayerId() => Promise<string>` — Returns the internal layer ID used by the map provider.

