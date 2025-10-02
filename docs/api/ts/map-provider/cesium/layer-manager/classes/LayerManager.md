[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/cesium/layer-manager](../README.md) / LayerManager

# Class: LayerManager

Defined in: [src/map-provider/cesium/layer-manager.ts:34](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/map-provider/cesium/layer-manager.ts#L34)

## Constructors

### Constructor

> **new LayerManager**(`Cesium`, `viewer`): `LayerManager`

Defined in: [src/map-provider/cesium/layer-manager.ts:40](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/map-provider/cesium/layer-manager.ts#L40)

#### Parameters

##### Cesium

`__module`

##### viewer

`Viewer`

#### Returns

`LayerManager`

## Methods

### addLayer()

> **addLayer**\<`T`\>(`id`, `layer`): [`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

Defined in: [src/map-provider/cesium/layer-manager.ts:69](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/map-provider/cesium/layer-manager.ts#L69)

#### Type Parameters

##### T

`T` *extends* `GeoJsonDataSource` \| `DataSource` \| `Cesium3DTileset` \| `ImageryLayer`

#### Parameters

##### id

`string`

##### layer

`T`

#### Returns

[`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

***

### getLayer()

> **getLayer**(`layerId`): [`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

Defined in: [src/map-provider/cesium/layer-manager.ts:96](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/map-provider/cesium/layer-manager.ts#L96)

#### Parameters

##### layerId

`string`

#### Returns

[`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

***

### getLayerById()

> **getLayerById**(`layerId`): [`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

Defined in: [src/map-provider/cesium/layer-manager.ts:102](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/map-provider/cesium/layer-manager.ts#L102)

#### Parameters

##### layerId

`string`

#### Returns

[`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

***

### removeLayer()

> **removeLayer**(`layerId`): `void`

Defined in: [src/map-provider/cesium/layer-manager.ts:106](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/map-provider/cesium/layer-manager.ts#L106)

#### Parameters

##### layerId

`string`

#### Returns

`void`

***

### replaceLayer()

> **replaceLayer**\<`T`\>(`id`, `oldlayer`, `layer`): [`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

Defined in: [src/map-provider/cesium/layer-manager.ts:45](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/map-provider/cesium/layer-manager.ts#L45)

#### Type Parameters

##### T

`T` *extends* `GeoJsonDataSource` \| `DataSource` \| `Cesium3DTileset` \| `ImageryLayer`

#### Parameters

##### id

`string`

##### oldlayer

[`ILayer`](../../i-layer/interfaces/ILayer.md) | `I3DTilesLayer`

##### layer

`T`

#### Returns

[`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

***

### setOpacity()

> **setOpacity**(`layerId`, `opacity`): `void`

Defined in: [src/map-provider/cesium/layer-manager.ts:117](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/map-provider/cesium/layer-manager.ts#L117)

#### Parameters

##### layerId

`string`

##### opacity

`number`

#### Returns

`void`

***

### setVisible()

> **setVisible**(`layerId`, `visible`): `void`

Defined in: [src/map-provider/cesium/layer-manager.ts:112](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/map-provider/cesium/layer-manager.ts#L112)

#### Parameters

##### layerId

`string`

##### visible

`boolean`

#### Returns

`void`

***

### setZIndex()

> **setZIndex**(`layerId`, `zindex`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/layer-manager.ts:122](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/map-provider/cesium/layer-manager.ts#L122)

#### Parameters

##### layerId

`string`

##### zindex

`number`

#### Returns

`Promise`\<`void`\>
