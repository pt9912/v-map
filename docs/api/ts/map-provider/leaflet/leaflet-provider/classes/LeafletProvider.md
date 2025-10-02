[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/leaflet/leaflet-provider](../README.md) / LeafletProvider

# Class: LeafletProvider

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:27](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L27)

## Implements

- [`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)

## Constructors

### Constructor

> **new LeafletProvider**(): `LeafletProvider`

#### Returns

`LeafletProvider`

## Methods

### addBaseLayer()

> **addBaseLayer**(`layerConfig`, `basemapid`, `layerElementId`): `Promise`\<`string`\>

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:160](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L160)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:86](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L86)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:427](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L427)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### getMap()

> **getMap**(): `Map`

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:1019](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L1019)

#### Returns

`Map`

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:37](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L37)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:442](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L442)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:213](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L213)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:556](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L556)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:464](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L464)

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

> **setView**(`__namedParameters`, `zoom`): `Promise`\<`void`\>

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:438](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L438)

View/Camera setzen; in OL/Cesium meist async (Animations/Promises), daher Promise<void>

#### Parameters

##### \_\_namedParameters

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:487](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L487)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:452](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L452)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:62](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/leaflet/leaflet-provider.ts#L62)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
