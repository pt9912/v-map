[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/cesium/cesium-provider](../index.md) / CesiumProvider

# Class: CesiumProvider

Defined in: [src/map-provider/cesium/cesium-provider.ts:166](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L166)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:392](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L392)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:354](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L354)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:221](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L221)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### ensureGroup()

> **ensureGroup**(`groupId`, `visible`, `_opts?`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:420](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L420)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:177](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L177)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:441](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L441)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:436](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L436)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:477](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L477)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:384](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L384)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:429](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L429)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:490](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L490)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:1951](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L1951)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:494](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L494)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:498](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L498)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:1740](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/cesium-provider.ts#L1740)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
