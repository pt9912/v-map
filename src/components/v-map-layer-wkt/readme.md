# v-map-layer-wkt



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                         | Type      | Default     |
| --------- | --------- | ------------------------------------------------------------------- | --------- | ----------- |
| `opacity` | `opacity` | Globale Opazität (0–1).                                             | `number`  | `1.0`       |
| `url`     | `url`     | URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`). | `string`  | `undefined` |
| `visible` | `visible` | Sichtbarkeit des Layers.                                            | `boolean` | `true`      |
| `wkt`     | `wkt`     | WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").   | `string`  | `undefined` |


## Events

| Event   | Description                                         | Type                |
| ------- | --------------------------------------------------- | ------------------- |
| `ready` | Signalisiert, dass das WKT-Layer initialisiert ist. | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
