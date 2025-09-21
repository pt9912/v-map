[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [layer/v-map-layer-helper](../README.md) / VMapLayerHelper

# Class: VMapLayerHelper

Defined in: [src/layer/v-map-layer-helper.ts:5](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/layer/v-map-layer-helper.ts#L5)

## Constructors

### Constructor

> **new VMapLayerHelper**(`el`): `VMapLayerHelper`

Defined in: [src/layer/v-map-layer-helper.ts:9](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/layer/v-map-layer-helper.ts#L9)

#### Parameters

##### el

`HTMLElement`

#### Returns

`VMapLayerHelper`

## Methods

### addToMapInternal()

> `protected` **addToMapInternal**(`group`, `vmap`, `createLayerConfig`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:11](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/layer/v-map-layer-helper.ts#L11)

#### Parameters

##### group

`Element`

##### vmap

`HTMLVMapElement`

##### createLayerConfig

() => [`LayerConfig`](../../../types/layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`void`\>

***

### getLayerId()

> **getLayerId**(): `string`

Defined in: [src/layer/v-map-layer-helper.ts:61](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/layer/v-map-layer-helper.ts#L61)

#### Returns

`string`

***

### getMapProvider()

> **getMapProvider**(): [`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

Defined in: [src/layer/v-map-layer-helper.ts:57](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/layer/v-map-layer-helper.ts#L57)

#### Returns

[`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

***

### initLayer()

> **initLayer**(`createLayerConfig`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:69](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/layer/v-map-layer-helper.ts#L69)

#### Parameters

##### createLayerConfig

() => [`LayerConfig`](../../../types/layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`void`\>

***

### setOpacity()

> **setOpacity**(`opacity`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:49](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/layer/v-map-layer-helper.ts#L49)

#### Parameters

##### opacity

`number`

#### Returns

`Promise`\<`void`\>

***

### setVisible()

> **setVisible**(`visible`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:45](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/layer/v-map-layer-helper.ts#L45)

#### Parameters

##### visible

`boolean`

#### Returns

`Promise`\<`void`\>

***

### setZIndex()

> **setZIndex**(`zIndex`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:53](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/layer/v-map-layer-helper.ts#L53)

#### Parameters

##### zIndex

`number`

#### Returns

`Promise`\<`void`\>

***

### updateLayer()

> **updateLayer**(`update`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:65](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/layer/v-map-layer-helper.ts#L65)

#### Parameters

##### update

[`LayerUpdate`](../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>
