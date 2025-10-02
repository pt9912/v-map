[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/deck/deck-provider](../README.md) / DeckProvider

# Class: DeckProvider

Defined in: [src/map-provider/deck/deck-provider.ts:24](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L24)

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

Defined in: [src/map-provider/deck/deck-provider.ts:927](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L927)

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

Defined in: [src/map-provider/deck/deck-provider.ts:899](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L899)

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

Defined in: [src/map-provider/deck/deck-provider.ts:603](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L603)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1237](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L1237)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### getMap()

> **getMap**(): `Deck`\<`null`\>

Defined in: [src/map-provider/deck/deck-provider.ts:1245](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L1245)

#### Returns

`Deck`\<`null`\>

***

### init()

> **init**(`opts`): `Promise`\<`void`\>

Defined in: [src/map-provider/deck/deck-provider.ts:34](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L34)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1032](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L1032)

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

Defined in: [src/map-provider/deck/deck-provider.ts:967](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L967)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1076](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L1076)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1047](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L1047)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1080](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L1080)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1065](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L1065)

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

Defined in: [src/map-provider/deck/deck-provider.ts:1056](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L1056)

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

Defined in: [src/map-provider/deck/deck-provider.ts:975](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/map-provider/deck/deck-provider.ts#L975)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
