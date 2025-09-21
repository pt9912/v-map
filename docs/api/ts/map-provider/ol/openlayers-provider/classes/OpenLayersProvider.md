[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/ol/openlayers-provider](../README.md) / OpenLayersProvider

# Class: OpenLayersProvider

Defined in: [src/map-provider/ol/openlayers-provider.ts:51](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L51)

## Implements

- [`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)

## Constructors

### Constructor

> **new OpenLayersProvider**(): `OpenLayersProvider`

#### Returns

`OpenLayersProvider`

## Methods

### addLayer()

> **addLayer**(`layerConfig`): `Promise`\<`string`\>

Defined in: [src/map-provider/ol/openlayers-provider.ts:102](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L102)

Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind

#### Parameters

##### layerConfig

[`LayerConfig`](../../../../types/layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`addLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#addlayer)

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/map-provider/ol/openlayers-provider.ts:85](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L85)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### getMap()

> **getMap**(): `Map`

Defined in: [src/map-provider/ol/openlayers-provider.ts:496](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L496)

#### Returns

`Map`

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/ol/openlayers-provider.ts:57](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L57)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:457](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L457)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:469](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L469)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:416](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L416)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:489](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L489)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:479](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L479)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:90](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/map-provider/ol/openlayers-provider.ts#L90)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
