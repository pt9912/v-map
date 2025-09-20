[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [layer/v-map-layer-helper](../README.md) / VMapLayerHelper

# Class: VMapLayerHelper

Defined in: src/layer/v-map-layer-helper.ts:5

## Constructors

### Constructor

> **new VMapLayerHelper**(`el`): `VMapLayerHelper`

Defined in: src/layer/v-map-layer-helper.ts:9

#### Parameters

##### el

`HTMLElement`

#### Returns

`VMapLayerHelper`

## Methods

### addToMapInternal()

> `protected` **addToMapInternal**(`group`, `vmap`, `createLayerConfig`): `Promise`\<`void`\>

Defined in: src/layer/v-map-layer-helper.ts:11

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

Defined in: src/layer/v-map-layer-helper.ts:61

#### Returns

`string`

***

### getMapProvider()

> **getMapProvider**(): [`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

Defined in: src/layer/v-map-layer-helper.ts:57

#### Returns

[`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

***

### initLayer()

> **initLayer**(`createLayerConfig`): `Promise`\<`void`\>

Defined in: src/layer/v-map-layer-helper.ts:69

#### Parameters

##### createLayerConfig

() => [`LayerConfig`](../../../types/layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`void`\>

***

### setOpacity()

> **setOpacity**(`opacity`): `Promise`\<`void`\>

Defined in: src/layer/v-map-layer-helper.ts:49

#### Parameters

##### opacity

`number`

#### Returns

`Promise`\<`void`\>

***

### setVisible()

> **setVisible**(`visible`): `Promise`\<`void`\>

Defined in: src/layer/v-map-layer-helper.ts:45

#### Parameters

##### visible

`boolean`

#### Returns

`Promise`\<`void`\>

***

### setZIndex()

> **setZIndex**(`zIndex`): `Promise`\<`void`\>

Defined in: src/layer/v-map-layer-helper.ts:53

#### Parameters

##### zIndex

`number`

#### Returns

`Promise`\<`void`\>

***

### updateLayer()

> **updateLayer**(`update`): `Promise`\<`void`\>

Defined in: src/layer/v-map-layer-helper.ts:65

#### Parameters

##### update

[`LayerUpdate`](../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>
