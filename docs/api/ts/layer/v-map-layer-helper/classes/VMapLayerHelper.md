[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [layer/v-map-layer-helper](../README.md) / VMapLayerHelper

# Class: VMapLayerHelper

Defined in: [src/layer/v-map-layer-helper.ts:14](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L14)

## Constructors

### Constructor

> **new VMapLayerHelper**(`el`, `host?`): `VMapLayerHelper`

Defined in: [src/layer/v-map-layer-helper.ts:28](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L28)

#### Parameters

##### el

`HTMLElement`

##### host?

[`VMapErrorHost`](../interfaces/VMapErrorHost.md)

#### Returns

`VMapLayerHelper`

## Methods

### addToMapInternal()

> `protected` **addToMapInternal**(`group`, `vmap`, `createLayerConfig`, `elementId?`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:99](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L99)

#### Parameters

##### group

`HTMLVMapLayergroupElement`

##### vmap

`HTMLVMapElement`

##### createLayerConfig

() => [`LayerConfig`](../../../types/layerconfig/type-aliases/LayerConfig.md)

##### elementId?

`string`

#### Returns

`Promise`\<`void`\>

***

### clearError()

> **clearError**(): `void`

Defined in: [src/layer/v-map-layer-helper.ts:60](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L60)

#### Returns

`void`

***

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:279](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L279)

#### Returns

`Promise`\<`void`\>

***

### getError()

> **getError**(): [`VMapErrorDetail`](../../../utils/events/interfaces/VMapErrorDetail.md)

Defined in: [src/layer/v-map-layer-helper.ts:64](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L64)

#### Returns

[`VMapErrorDetail`](../../../utils/events/interfaces/VMapErrorDetail.md)

***

### getLayerId()

> **getLayerId**(): `string`

Defined in: [src/layer/v-map-layer-helper.ts:298](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L298)

#### Returns

`string`

***

### getMapProvider()

> **getMapProvider**(): [`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

Defined in: [src/layer/v-map-layer-helper.ts:294](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L294)

#### Returns

[`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

***

### initLayer()

> **initLayer**(`createLayerConfig`, `elementId?`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:253](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L253)

#### Parameters

##### createLayerConfig

() => [`LayerConfig`](../../../types/layerconfig/type-aliases/LayerConfig.md)

##### elementId?

`string`

#### Returns

`Promise`\<`void`\>

***

### markReady()

> **markReady**(): `void`

Defined in: [src/layer/v-map-layer-helper.ts:39](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L39)

#### Returns

`void`

***

### markUpdated()

> **markUpdated**(): `void`

Defined in: [src/layer/v-map-layer-helper.ts:44](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L44)

#### Returns

`void`

***

### recreateLayer()

> **recreateLayer**(): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:241](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L241)

#### Returns

`Promise`\<`void`\>

***

### removeLayer()

> **removeLayer**(): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:302](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L302)

#### Returns

`Promise`\<`void`\>

***

### setError()

> **setError**(`detail`): `void`

Defined in: [src/layer/v-map-layer-helper.ts:49](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L49)

#### Parameters

##### detail

[`VMapErrorDetail`](../../../utils/events/interfaces/VMapErrorDetail.md)

#### Returns

`void`

***

### setOpacity()

> **setOpacity**(`opacity`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:192](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L192)

#### Parameters

##### opacity

`number`

#### Returns

`Promise`\<`void`\>

***

### setVisible()

> **setVisible**(`visible`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:177](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L177)

#### Parameters

##### visible

`boolean`

#### Returns

`Promise`\<`void`\>

***

### setZIndex()

> **setZIndex**(`zIndex`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:207](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L207)

#### Parameters

##### zIndex

`number`

#### Returns

`Promise`\<`void`\>

***

### startLoading()

> **startLoading**(): `void`

Defined in: [src/layer/v-map-layer-helper.ts:34](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L34)

#### Returns

`void`

***

### updateLayer()

> **updateLayer**(`update`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:222](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/layer/v-map-layer-helper.ts#L222)

#### Parameters

##### update

[`LayerUpdate`](../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>
