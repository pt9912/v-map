[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/cesium/cesium-provider](../README.md) / CesiumProvider

# Class: CesiumProvider

Defined in: [src/map-provider/cesium/cesium-provider.ts:122](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L122)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:321](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L321)

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

> **addLayerToGroup**(`layerConfig`, `groupId`): `Promise`\<`string`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:286](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L286)

Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind

#### Parameters

##### layerConfig

[`LayerConfig`](../../../../types/layerconfig/type-aliases/LayerConfig.md)

##### groupId

`string`

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`addLayerToGroup`](../../../../types/mapprovider/interfaces/MapProvider.md#addlayertogroup)

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:175](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L175)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:131](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L131)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:349](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L349)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:313](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L313)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:344](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L344)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:363](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L363)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:1223](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L1223)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:367](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L367)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:371](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L371)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:1073](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/map-provider/cesium/cesium-provider.ts#L1073)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
