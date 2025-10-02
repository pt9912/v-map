[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/deck/deck-provider](../README.md) / DeckProvider

# Class: DeckProvider

Defined in: [src/map-provider/deck/deck-provider.ts:24](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L24)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1039](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1039)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1011](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1011)

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

### buildScatterPlot()

> **buildScatterPlot**(`layerConfig`, `layerId`): `Promise`\<`Layer`\<\{ \}\>\>

Defined in: [src/map-provider/deck/deck-provider.ts:705](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L705)

#### Parameters

##### layerConfig

###### data?

`any`

###### getFillColor?

[`Color`](../../../../types/color/type-aliases/Color.md)

###### getRadius?

`number`

###### getTooltip?

(`info`) => `any`

###### groupId?

`string`

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

Defined in: [src/map-provider/deck/deck-provider.ts:1381](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1381)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### getMap()

> **getMap**(): `Deck`\<`null`\>

Defined in: [src/map-provider/deck/deck-provider.ts:1389](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1389)

#### Returns

`Deck`\<`null`\>

***

### init()

> **init**(`opts`): `Promise`\<`void`\>

Defined in: [src/map-provider/deck/deck-provider.ts:34](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L34)

#### Parameters

##### opts

[`ProviderOptions`](../../../../types/provideroptions/type-aliases/ProviderOptions.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`init`](../../../../types/mapprovider/interfaces/MapProvider.md#init)

***

### removeLayer()

> **removeLayer**(`layerId`): `Promise`\<`void`\>

Defined in: [src/map-provider/deck/deck-provider.ts:1176](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1176)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1079](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1079)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1220](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1220)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1191](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1191)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1224](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1224)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1209](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1209)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1200](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1200)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1087](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/map-provider/deck/deck-provider.ts#L1087)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
