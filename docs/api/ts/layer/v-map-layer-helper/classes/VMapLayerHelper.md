[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [layer/v-map-layer-helper](../README.md) / VMapLayerHelper

# Class: VMapLayerHelper

Defined in: [src/layer/v-map-layer-helper.ts:7](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L7)

## Constructors

### Constructor

> **new VMapLayerHelper**(`el`): `VMapLayerHelper`

Defined in: [src/layer/v-map-layer-helper.ts:11](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L11)

#### Parameters

##### el

`HTMLElement`

#### Returns

`VMapLayerHelper`

## Methods

### addToMapInternal()

> `protected` **addToMapInternal**(`group`, `vmap`, `createLayerConfig`, `elementId?`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:43](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L43)

#### Parameters

##### group

`Element`

##### vmap

`HTMLVMapElement`

##### createLayerConfig

() => [`LayerConfig`](../../../types/layerconfig/type-aliases/LayerConfig.md)

##### elementId?

`string`

#### Returns

`Promise`\<`void`\>

***

### getLayerId()

> **getLayerId**(): `string`

Defined in: [src/layer/v-map-layer-helper.ts:110](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L110)

#### Returns

`string`

***

### getMapProvider()

> **getMapProvider**(): [`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

Defined in: [src/layer/v-map-layer-helper.ts:106](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L106)

#### Returns

[`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

***

### initLayer()

> **initLayer**(`createLayerConfig`, `elementId?`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:123](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L123)

#### Parameters

##### createLayerConfig

() => [`LayerConfig`](../../../types/layerconfig/type-aliases/LayerConfig.md)

##### elementId?

`string`

#### Returns

`Promise`\<`void`\>

***

### removeLayer()

> **removeLayer**(): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:114](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L114)

#### Returns

`Promise`\<`void`\>

***

### setOpacity()

> **setOpacity**(`opacity`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:98](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L98)

#### Parameters

##### opacity

`number`

#### Returns

`Promise`\<`void`\>

***

### setVisible()

> **setVisible**(`visible`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:94](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L94)

#### Parameters

##### visible

`boolean`

#### Returns

`Promise`\<`void`\>

***

### setZIndex()

> **setZIndex**(`zIndex`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:102](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L102)

#### Parameters

##### zIndex

`number`

#### Returns

`Promise`\<`void`\>

***

### updateLayer()

> **updateLayer**(`update`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:119](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/layer/v-map-layer-helper.ts#L119)

#### Parameters

##### update

[`LayerUpdate`](../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>
