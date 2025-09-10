# v-map-layer-osm



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                     | Type      | Default |
| --------- | --------- | ------------------------------- | --------- | ------- |
| `opacity` | `opacity` | Opazität der OSM-Kacheln (0–1). | `number`  | `1.0`   |
| `visible` | `visible` | Sichtbarkeit des Layers         | `boolean` | `true`  |


## Events

| Event   | Description                                    | Type                |
| ------- | ---------------------------------------------- | ------------------- |
| `ready` | Wird ausgelöst, wenn der OSM-Layer bereit ist. | `CustomEvent<void>` |


## Methods

### `addToMap(mapElement: HTMLVMapElement) => Promise<void>`

Fügt den OSM-Layer der Karte hinzu (vom Eltern-<v-map> aufgerufen).

#### Parameters

| Name         | Type              | Description |
| ------------ | ----------------- | ----------- |
| `mapElement` | `HTMLVMapElement` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
