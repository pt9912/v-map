[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/leaflet/leaflet-provider](../README.md) / LeafletProvider

# Class: LeafletProvider

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:32](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L32)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:171](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L171)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:97](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L97)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:520](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L520)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### ensureGroup()

> **ensureGroup**(`groupId`, `visible`, `_opts?`): `Promise`\<`void`\>

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:623](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L623)

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

### getMap()

> **getMap**(): `Map`

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:1252](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L1252)

#### Returns

`Map`

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:42](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L42)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:535](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L535)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:229](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L229)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:664](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L664)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:557](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L557)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:531](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L531)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:580](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L580)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:545](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L545)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:67](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/leaflet-provider.ts#L67)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
