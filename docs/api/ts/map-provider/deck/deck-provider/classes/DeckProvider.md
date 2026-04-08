[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/deck/deck-provider](../index.md) / DeckProvider

# Class: DeckProvider

Defined in: [src/map-provider/deck/deck-provider.ts:81](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L81)

## Implements

- [`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)

## Constructors

### Constructor

> **new DeckProvider**(): `DeckProvider`

#### Returns

`DeckProvider`

## Methods

### addBaseLayer()

> **addBaseLayer**(`layerConfig`, `basemapid`, `layerElementId`): `Promise`\<`string`\>

Defined in: [src/map-provider/deck/deck-provider.ts:1318](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1318)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1290](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1290)

Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind

#### Parameters

##### layerConfig

[`LayerConfig`](../../../../types/layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`addLayerToGroup`](../../../../types/mapprovider/interfaces/MapProvider.md#addlayertogroup)

***

### buildScatterPlot()

> **buildScatterPlot**(`layerConfig`, `layerId`): `Promise`\<`Layer`\<\{ \}\>\>

Defined in: [src/map-provider/deck/deck-provider.ts:850](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L850)

#### Parameters

##### layerConfig

###### data?

`unknown`

###### getFillColor?

[`Color`](../../../../types/color/type-aliases/Color.md)

###### getRadius?

`number`

###### getTooltip?

(`info`) => `unknown`

###### groupId?

`string`

###### groupVisible?

`boolean`

###### onClick?

(`info`) => `void`

###### onHover?

(`info`) => `void`

###### opacity?

`number`

###### type

`"scatterplot"`

###### visible?

`boolean`

###### zIndex?

`number`

##### layerId

`string`

#### Returns

`Promise`\<`Layer`\<\{ \}\>\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/map-provider/deck/deck-provider.ts:1801](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1801)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### ensureGroup()

> **ensureGroup**(`groupId`, `visible`, `_opts?`): `Promise`\<`void`\>

Defined in: [src/map-provider/deck/deck-provider.ts:1364](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1364)

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

> **getMap**(): `Deck`\<`null`\>

Defined in: [src/map-provider/deck/deck-provider.ts:1902](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1902)

#### Returns

`Deck`\<`null`\>

***

### init()

> **init**(`opts`): `Promise`\<`void`\>

Defined in: [src/map-provider/deck/deck-provider.ts:92](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L92)

#### Parameters

##### opts

[`ProviderOptions`](../../../../types/provideroptions/type-aliases/ProviderOptions.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`init`](../../../../types/mapprovider/interfaces/MapProvider.md#init)

***

### offLayerError()

> **offLayerError**(`layerId`): `void`

Defined in: [src/map-provider/deck/deck-provider.ts:1555](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1555)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1551](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1551)

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

### onPointerMove()

> **onPointerMove**(`callback`): () => `void`

Defined in: [src/map-provider/deck/deck-provider.ts:1781](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1781)

Register a callback for pointer-move with geo-coordinates. Returns unsubscribe function.

#### Parameters

##### callback

(`coordinate`, `pixel`) => `void`

#### Returns

> (): `void`

##### Returns

`void`

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`onPointerMove`](../../../../types/mapprovider/interfaces/MapProvider.md#onpointermove)

***

### removeLayer()

> **removeLayer**(`layerId`): `Promise`\<`void`\>

Defined in: [src/map-provider/deck/deck-provider.ts:1559](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1559)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1358](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1358)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1605](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1605)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1576](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1576)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1609](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1609)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1594](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1594)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1585](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1585)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1401](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/deck/deck-provider.ts#L1401)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
