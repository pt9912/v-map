[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [layer/v-map-layer-helper](../index.md) / VMapLayerHelper

# Class: VMapLayerHelper

Defined in: [src/layer/v-map-layer-helper.ts:14](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L14)

## Constructors

### Constructor

> **new VMapLayerHelper**(`el`, `host?`): `VMapLayerHelper`

Defined in: [src/layer/v-map-layer-helper.ts:31](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L31)

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

Defined in: [src/layer/v-map-layer-helper.ts:112](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L112)

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

Defined in: [src/layer/v-map-layer-helper.ts:72](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L72)

#### Returns

`void`

***

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:294](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L294)

#### Returns

`Promise`\<`void`\>

***

### getError()

> **getError**(): [`VMapErrorDetail`](../../../utils/events/interfaces/VMapErrorDetail.md)

Defined in: [src/layer/v-map-layer-helper.ts:77](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L77)

#### Returns

[`VMapErrorDetail`](../../../utils/events/interfaces/VMapErrorDetail.md)

***

### getLayerId()

> **getLayerId**(): `string`

Defined in: [src/layer/v-map-layer-helper.ts:313](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L313)

#### Returns

`string`

***

### getMapProvider()

> **getMapProvider**(): [`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

Defined in: [src/layer/v-map-layer-helper.ts:309](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L309)

#### Returns

[`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

***

### initLayer()

> **initLayer**(`createLayerConfig`, `elementId?`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:268](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L268)

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

Defined in: [src/layer/v-map-layer-helper.ts:42](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L42)

#### Returns

`void`

***

### markUpdated()

> **markUpdated**(): `void`

Defined in: [src/layer/v-map-layer-helper.ts:47](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L47)

#### Returns

`void`

***

### recreateLayer()

> **recreateLayer**(): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:256](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L256)

#### Returns

`Promise`\<`void`\>

***

### removeLayer()

> **removeLayer**(): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:317](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L317)

#### Returns

`Promise`\<`void`\>

***

### setError()

> **setError**(`detail`): `void`

Defined in: [src/layer/v-map-layer-helper.ts:52](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L52)

#### Parameters

##### detail

[`VMapErrorDetail`](../../../utils/events/interfaces/VMapErrorDetail.md)

#### Returns

`void`

***

### setOpacity()

> **setOpacity**(`opacity`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:207](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L207)

#### Parameters

##### opacity

`number`

#### Returns

`Promise`\<`void`\>

***

### setRuntimeError()

> **setRuntimeError**(`detail`): `void`

Defined in: [src/layer/v-map-layer-helper.ts:63](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L63)

#### Parameters

##### detail

[`VMapErrorDetail`](../../../utils/events/interfaces/VMapErrorDetail.md)

#### Returns

`void`

***

### setVisible()

> **setVisible**(`visible`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:192](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L192)

#### Parameters

##### visible

`boolean`

#### Returns

`Promise`\<`void`\>

***

### setZIndex()

> **setZIndex**(`zIndex`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:222](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L222)

#### Parameters

##### zIndex

`number`

#### Returns

`Promise`\<`void`\>

***

### startLoading()

> **startLoading**(): `void`

Defined in: [src/layer/v-map-layer-helper.ts:37](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L37)

#### Returns

`void`

***

### updateLayer()

> **updateLayer**(`update`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:237](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/layer/v-map-layer-helper.ts#L237)

#### Parameters

##### update

[`LayerUpdate`](../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>
