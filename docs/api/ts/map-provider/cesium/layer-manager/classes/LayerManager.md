[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/cesium/layer-manager](../index.md) / LayerManager

# Class: LayerManager

Defined in: [src/map-provider/cesium/layer-manager.ts:38](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L38)

## Constructors

### Constructor

> **new LayerManager**(`Cesium`, `viewer`): `LayerManager`

Defined in: [src/map-provider/cesium/layer-manager.ts:44](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L44)

#### Parameters

##### Cesium

`__module`

##### viewer

`Viewer`

#### Returns

`LayerManager`

## Methods

### addCustomLayer()

> **addCustomLayer**(`id`, `layer`): [`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

Defined in: [src/map-provider/cesium/layer-manager.ts:100](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L100)

#### Parameters

##### id

`string`

##### layer

[`ILayer`](../../i-layer/interfaces/ILayer.md) | `I3DTilesLayer`

#### Returns

[`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

***

### addLayer()

> **addLayer**\<`T`\>(`id`, `layer`): [`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

Defined in: [src/map-provider/cesium/layer-manager.ts:73](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L73)

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

Defined in: [src/map-provider/cesium/layer-manager.ts:105](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L105)

#### Parameters

##### layerId

`string`

#### Returns

[`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

***

### getLayerById()

> **getLayerById**(`layerId`): [`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

Defined in: [src/map-provider/cesium/layer-manager.ts:111](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L111)

#### Parameters

##### layerId

`string`

#### Returns

[`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

***

### removeLayer()

> **removeLayer**(`layerId`): `void`

Defined in: [src/map-provider/cesium/layer-manager.ts:115](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L115)

#### Parameters

##### layerId

`string`

#### Returns

`void`

***

### replaceLayer()

> **replaceLayer**\<`T`\>(`id`, `oldlayer`, `layer`): [`ILayer`](../../i-layer/interfaces/ILayer.md) \| `I3DTilesLayer`

Defined in: [src/map-provider/cesium/layer-manager.ts:49](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L49)

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

Defined in: [src/map-provider/cesium/layer-manager.ts:126](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L126)

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

Defined in: [src/map-provider/cesium/layer-manager.ts:121](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L121)

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

Defined in: [src/map-provider/cesium/layer-manager.ts:131](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/cesium/layer-manager.ts#L131)

#### Parameters

##### layerId

`string`

##### zindex

`number`

#### Returns

`Promise`\<`void`\>
