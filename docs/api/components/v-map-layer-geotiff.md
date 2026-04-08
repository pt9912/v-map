# v-map-layer-geotiff

[← Zur Übersicht](./README.md) · [**@npm9912/v-map**](/)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `colorMap` | `ColorMap \| string` | `color-map` | `null` | ColorMap für die Visualisierung (kann entweder ein vordefinierter Name oder eine GeoStyler ColorMap sein). |
| `loadState` | `error \| idle \| loading \| ready` | `load-state` | `'idle'` | Current load state of the layer. |
| `nodata` | `number` | `nodata` | `null` | NoData Values to discard (overriding any nodata values in the metadata). |
| `opacity` | `number` | `opacity` | `1.0` | Opazität der GeoTIFF-Kacheln (0–1). |
| `url` | `string` | `url` | `null` | URL to the GeoTIFF file to be displayed on the map. |
| `valueRange` | `[number, number]` |  | `null` | Value range for colormap normalization [min, max]. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers |
| `zIndex` | `number` | `z-index` | `100` | Z-index for layer stacking order. Higher values render on top. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist. |

### Methods

- `getError() => Promise<VMapErrorDetail>` — Returns the last error detail, if any.
- `getLayerId() => Promise<string>` — Returns the internal layer ID used by the map provider.

