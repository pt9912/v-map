[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/cesium/cesium-provider](../README.md) / CesiumProvider

# Class: CesiumProvider

Defined in: [src/map-provider/cesium/cesium-provider.ts:166](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L166)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:390](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L390)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:352](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L352)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:219](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L219)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### ensureGroup()

> **ensureGroup**(`groupId`, `visible`, `_opts?`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:418](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L418)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:175](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L175)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:432](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L432)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:382](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L382)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:427](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L427)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:446](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L446)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:1901](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L1901)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:450](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L450)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:454](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L454)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:1696](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/cesium-provider.ts#L1696)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
