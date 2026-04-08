[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/leaflet/leaflet-provider](../index.md) / LeafletProvider

# Class: LeafletProvider

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:48](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L48)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:194](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L194)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:120](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L120)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:573](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L573)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### ensureGroup()

> **ensureGroup**(`groupId`, `visible`, `_opts?`): `Promise`\<`void`\>

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:720](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L720)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:1419](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L1419)

#### Returns

`Map`

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:60](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L60)

#### Parameters

##### options

[`ProviderOptions`](../../../../types/provideroptions/type-aliases/ProviderOptions.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`init`](../../../../types/mapprovider/interfaces/MapProvider.md#init)

***

### offLayerError()

> **offLayerError**(`layerId`): `void`

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:598](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L598)

Unregister the runtime error callback and detach native listeners for a layer.

#### Parameters

##### layerId

`string`

#### Returns

`void`

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`offLayerError`](../../../../types/mapprovider/interfaces/MapProvider.md#offlayererror)

***

### onLayerError()

> **onLayerError**(`layerId`, `callback`): `void`

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:588](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L588)

Register a callback for runtime layer errors (tile load, feature fetch, etc.).

#### Parameters

##### layerId

`string`

##### callback

[`LayerErrorCallback`](../../../../types/mapprovider/type-aliases/LayerErrorCallback.md)

#### Returns

`void`

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`onLayerError`](../../../../types/mapprovider/interfaces/MapProvider.md#onlayererror)

***

### removeLayer()

> **removeLayer**(`layerId`): `Promise`\<`void`\>

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:604](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L604)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:252](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L252)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:763](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L763)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:627](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L627)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:584](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L584)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:653](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L653)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:615](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L615)

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

Defined in: [src/map-provider/leaflet/leaflet-provider.ts:85](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/leaflet/leaflet-provider.ts#L85)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
