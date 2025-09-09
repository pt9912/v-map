# v-map



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute                | Description                                             | Type                                          | Default |
| --------------------- | ------------------------ | ------------------------------------------------------- | --------------------------------------------- | ------- |
| `center`              | `center`                 |                                                         | `string`                                      | `'0,0'` |
| `cssMode`             | `css-mode`               |                                                         | `"bundle" \| "cdn" \| "inline-min" \| "none"` | `'cdn'` |
| `flavour`             | `flavour`                |                                                         | `"cesium" \| "deck" \| "leaflet" \| "ol"`     | `'ol'`  |
| `useDefaultImportMap` | `use-default-import-map` | Falls true, injiziert v-map automatisch die Import-Map. | `boolean`                                     | `true`  |
| `zoom`                | `zoom`                   |                                                         | `number`                                      | `2`     |


## Events

| Event              | Description | Type                             |
| ------------------ | ----------- | -------------------------------- |
| `mapProviderReady` |             | `CustomEvent<MapProviderDetail>` |


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



### `isMapProviderAvailable() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`



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
