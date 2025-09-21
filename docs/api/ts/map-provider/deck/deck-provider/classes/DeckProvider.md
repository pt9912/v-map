[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/deck/deck-provider](../README.md) / DeckProvider

# Class: DeckProvider

Defined in: [src/map-provider/deck/deck-provider.ts:28](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L28)

## Implements

- [`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)

## Constructors

### Constructor

> **new DeckProvider**(): `DeckProvider`

#### Returns

`DeckProvider`

## Methods

### addLayer()

> **addLayer**(`config`): `Promise`\<`string`\>

Defined in: [src/map-provider/deck/deck-provider.ts:461](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L461)

Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind

#### Parameters

##### config

[`LayerConfig`](../../../../types/layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`addLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#addlayer)

***

### addLayerToGroup()

> **addLayerToGroup**(`_groupId`, `layerConfig`): `Promise`\<`string`\>

Defined in: [src/map-provider/deck/deck-provider.ts:490](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L490)

#### Parameters

##### \_groupId

`string`

##### layerConfig

[`LayerConfig`](../../../../types/layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`string`\>

***

### buildScatterPlot()

> **buildScatterPlot**(`layerConfig`, `layerId`): `Promise`\<`Layer`\<\{ \}\>\>

Defined in: [src/map-provider/deck/deck-provider.ts:205](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L205)

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

Defined in: [src/map-provider/deck/deck-provider.ts:494](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L494)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### getMap()

> **getMap**(): `Deck`\<`null`\>

Defined in: [src/map-provider/deck/deck-provider.ts:682](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L682)

#### Returns

`Deck`\<`null`\>

***

### init()

> **init**(`opts`): `Promise`\<`void`\>

Defined in: [src/map-provider/deck/deck-provider.ts:35](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L35)

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

Defined in: [src/map-provider/deck/deck-provider.ts:642](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L642)

#### Parameters

##### layerId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`removeLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#removelayer)

***

### setOpacity()

> **setOpacity**(`layerId`, `opacity`): `Promise`\<`void`\>

Defined in: [src/map-provider/deck/deck-provider.ts:652](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L652)

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

Defined in: [src/map-provider/deck/deck-provider.ts:502](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L502)

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

Defined in: [src/map-provider/deck/deck-provider.ts:672](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L672)

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

Defined in: [src/map-provider/deck/deck-provider.ts:662](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L662)

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

Defined in: [src/map-provider/deck/deck-provider.ts:449](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/map-provider/deck/deck-provider.ts#L449)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
