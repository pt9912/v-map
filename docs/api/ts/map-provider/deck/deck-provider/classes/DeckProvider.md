[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/deck/deck-provider](../README.md) / DeckProvider

# Class: DeckProvider

Defined in: [src/map-provider/deck/deck-provider.ts:25](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L25)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1128](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1128)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1100](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1100)

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

Defined in: [src/map-provider/deck/deck-provider.ts:786](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L786)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1474](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1474)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### getMap()

> **getMap**(): `Deck`\<`null`\>

Defined in: [src/map-provider/deck/deck-provider.ts:1576](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1576)

#### Returns

`Deck`\<`null`\>

***

### init()

> **init**(`opts`): `Promise`\<`void`\>

Defined in: [src/map-provider/deck/deck-provider.ts:35](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L35)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1277](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1277)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1168](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1168)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1321](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1321)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1292](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1292)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1325](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1325)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1310](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1310)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1301](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1301)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1176](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/map-provider/deck/deck-provider.ts#L1176)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
