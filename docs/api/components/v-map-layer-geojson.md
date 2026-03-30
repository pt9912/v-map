# v-map-layer-geojson

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `fillColor` | `string` | `fill-color` |  | Fill color for polygon geometries (CSS color value) |
| `fillOpacity` | `number` | `fill-opacity` |  | Fill opacity for polygon geometries (0-1) |
| `geojson` | `string` | `geojson` |  | Prop, die du intern nutzt/weiterverarbeitest |
| `iconSize` | `string` | `icon-size` |  | Icon size as [width, height] in pixels (comma-separated string like "32,32") |
| `iconUrl` | `string` | `icon-url` |  | Icon URL for point features (alternative to pointColor/pointRadius) |
| `loadState` | `error \| idle \| loading \| ready` | `load-state` | `'idle'` | Current load state of the layer. |
| `opacity` | `number` | `opacity` | `1.0` | Opazität der geojson-Kacheln (0–1). |
| `pointColor` | `string` | `point-color` |  | Point color for point geometries (CSS color value) |
| `pointRadius` | `number` | `point-radius` |  | Point radius for point geometries in pixels |
| `strokeColor` | `string` | `stroke-color` |  | Stroke color for lines and polygon outlines (CSS color value) |
| `strokeOpacity` | `number` | `stroke-opacity` |  | Stroke opacity (0-1) |
| `strokeWidth` | `number` | `stroke-width` |  | Stroke width in pixels |
| `textColor` | `string` | `text-color` |  | Text color for labels (CSS color value) |
| `textProperty` | `string` | `text-property` |  | Text property name from feature properties to display as label |
| `textSize` | `number` | `text-size` |  | Text size for labels in pixels |
| `url` | `string` | `url` | `null` | URL to fetch GeoJSON data from. Alternative to providing data via slot. |
| `visible` | `boolean` | `visible` | `true` | Whether the layer is visible on the map. |
| `zIndex` | `number` | `z-index` | `1000` | Z-index for layer stacking order. Higher values render on top. |

### Methods

- `getError() => Promise<VMapErrorDetail>` — Returns the last error detail, if any.
- `getLayerId() => Promise<string>` — Returns the internal layer ID used by the map provider.

