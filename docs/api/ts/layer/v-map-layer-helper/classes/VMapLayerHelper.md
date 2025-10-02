[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [layer/v-map-layer-helper](../README.md) / VMapLayerHelper

# Class: VMapLayerHelper

Defined in: [src/layer/v-map-layer-helper.ts:6](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L6)

## Constructors

### Constructor

> **new VMapLayerHelper**(`el`): `VMapLayerHelper`

Defined in: [src/layer/v-map-layer-helper.ts:10](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L10)

#### Parameters

##### el

`HTMLElement`

#### Returns

`VMapLayerHelper`

## Methods

### addToMapInternal()

> `protected` **addToMapInternal**(`group`, `vmap`, `createLayerConfig`, `elementId?`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:12](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L12)

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

Defined in: [src/layer/v-map-layer-helper.ts:65](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L65)

#### Returns

`string`

***

### getMapProvider()

> **getMapProvider**(): [`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

Defined in: [src/layer/v-map-layer-helper.ts:61](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L61)

#### Returns

[`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)

***

### initLayer()

> **initLayer**(`createLayerConfig`, `elementId?`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:77](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L77)

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

Defined in: [src/layer/v-map-layer-helper.ts:69](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L69)

#### Returns

`Promise`\<`void`\>

***

### setOpacity()

> **setOpacity**(`opacity`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:53](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L53)

#### Parameters

##### opacity

`number`

#### Returns

`Promise`\<`void`\>

***

### setVisible()

> **setVisible**(`visible`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:49](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L49)

#### Parameters

##### visible

`boolean`

#### Returns

`Promise`\<`void`\>

***

### setZIndex()

> **setZIndex**(`zIndex`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:57](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L57)

#### Parameters

##### zIndex

`number`

#### Returns

`Promise`\<`void`\>

***

### updateLayer()

> **updateLayer**(`update`): `Promise`\<`void`\>

Defined in: [src/layer/v-map-layer-helper.ts:73](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/layer/v-map-layer-helper.ts#L73)

#### Parameters

##### update

[`LayerUpdate`](../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>
