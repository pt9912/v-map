# v-map-layer-geojson



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                             | Type      | Default     |
| --------- | --------- | ----------------------------------------------------------------------- | --------- | ----------- |
| `geojson` | `geojson` | Prop, die du intern nutzt/weiterverarbeitest                            | `unknown` | `undefined` |
| `opacity` | `opacity` | Opazität der geojson-Kacheln (0–1).                                     | `number`  | `1.0`       |
| `url`     | `url`     | URL to fetch GeoJSON data from. Alternative to providing data via slot. | `string`  | `null`      |
| `visible` | `visible` | Whether the layer is visible on the map.                                | `boolean` | `true`      |
| `zIndex`  | `z-index` | Z-index for layer stacking order. Higher values render on top.          | `number`  | `1000`      |


## Methods

### `getLayerId() => Promise<string>`

Returns the internal layer ID used by the map provider.

#### Returns

Type: `Promise<string>`




## Dependencies

### Used by

 - [v-map-builder](../v-map-builder)

### Graph
```mermaid
graph TD;
  v-map-builder --> v-map-layer-geojson
  style v-map-layer-geojson fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
