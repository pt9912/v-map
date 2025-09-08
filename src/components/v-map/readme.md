# v-map



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type               | Default |
| --------- | --------- | ----------- | ------------------ | ------- |
| `center`  | `center`  |             | `string`           | `'0,0'` |
| `flavour` | `flavour` |             | `"cesium" \| "ol"` | `'ol'`  |
| `zoom`    | `zoom`    |             | `number`           | `2`     |


## Methods

### `addLayer(layerConfig: any) => Promise<void>`



#### Parameters

| Name          | Type  | Description |
| ------------- | ----- | ----------- |
| `layerConfig` | `any` |             |

#### Returns

Type: `Promise<void>`



### `getMapProvider() => Promise<MapProvider>`



#### Returns

Type: `Promise<MapProvider>`



### `setView(coordinates: [number, number], zoom: number) => Promise<void>`



#### Parameters

| Name          | Type               | Description |
| ------------- | ------------------ | ----------- |
| `coordinates` | `[number, number]` |             |
| `zoom`        | `number`           |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
