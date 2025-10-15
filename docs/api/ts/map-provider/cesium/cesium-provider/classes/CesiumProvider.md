[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/cesium/cesium-provider](../README.md) / CesiumProvider

# Class: CesiumProvider

Defined in: [src/map-provider/cesium/cesium-provider.ts:129](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L129)

## Implements

- [`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)

## Constructors

### Constructor

> **new CesiumProvider**(): `CesiumProvider`

#### Returns

`CesiumProvider`

## Methods

### addBaseLayer()

> **addBaseLayer**(`layerConfig`, `basemapid`, `layerElementId`): `Promise`\<`string`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:351](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L351)

#### Parameters

##### layerConfig

[`LayerConfig`](../../../../types/layerconfig/type-aliases/LayerConfig.md)

##### basemapid

`string`

##### layerElementId

`string`

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`addBaseLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#addbaselayer)

***

### addLayerToGroup()

> **addLayerToGroup**(`layerConfig`): `Promise`\<`string`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:313](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L313)

Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind

#### Parameters

##### layerConfig

[`LayerConfig`](../../../../types/layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`addLayerToGroup`](../../../../types/mapprovider/interfaces/MapProvider.md#addlayertogroup)

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:182](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L182)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### ensureGroup()

> **ensureGroup**(`groupId`, `visible`, `_opts?`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:379](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L379)

#### Parameters

##### groupId

`string`

##### visible

`boolean`

##### \_opts?

###### basemapid?

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`ensureGroup`](../../../../types/mapprovider/interfaces/MapProvider.md#ensuregroup)

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:138](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L138)

#### Parameters

##### options

[`ProviderOptions`](../../../../types/provideroptions/type-aliases/ProviderOptions.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`init`](../../../../types/mapprovider/interfaces/MapProvider.md#init)

***

### removeLayer()

> **removeLayer**(`layerId`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:393](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L393)

#### Parameters

##### layerId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`removeLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#removelayer)

***

### setBaseLayer()

> **setBaseLayer**(`groupId`, `layerElementId`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:343](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L343)

#### Parameters

##### groupId

`string`

##### layerElementId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`setBaseLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#setbaselayer)

***

### setGroupVisible()

> **setGroupVisible**(`groupId`, `visible`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:388](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L388)

#### Parameters

##### groupId

`string`

##### visible

`boolean`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`setGroupVisible`](../../../../types/mapprovider/interfaces/MapProvider.md#setgroupvisible)

***

### setOpacity()

> **setOpacity**(`layerId`, `opacity`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:407](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L407)

#### Parameters

##### layerId

`string`

##### opacity

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`setOpacity`](../../../../types/mapprovider/interfaces/MapProvider.md#setopacity)

***

### setView()

> **setView**(`center`, `zoom`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:1874](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L1874)

View/Camera setzen; in OL/Cesium meist async (Animations/Promises), daher Promise<void>

#### Parameters

##### center

[`LonLat`](../../../../types/lonlat/type-aliases/LonLat.md)

##### zoom

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`setView`](../../../../types/mapprovider/interfaces/MapProvider.md#setview)

***

### setVisible()

> **setVisible**(`layerId`, `visible`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:411](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L411)

#### Parameters

##### layerId

`string`

##### visible

`boolean`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`setVisible`](../../../../types/mapprovider/interfaces/MapProvider.md#setvisible)

***

### setZIndex()

> **setZIndex**(`layerId`, `zIndex`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:415](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L415)

#### Parameters

##### layerId

`string`

##### zIndex

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`setZIndex`](../../../../types/mapprovider/interfaces/MapProvider.md#setzindex)

***

### updateLayer()

> **updateLayer**(`layerId`, `update`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:1665](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/cesium-provider.ts#L1665)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
