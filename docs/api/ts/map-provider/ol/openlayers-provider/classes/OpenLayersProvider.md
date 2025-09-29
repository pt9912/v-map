[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/ol/openlayers-provider](../README.md) / OpenLayersProvider

# Class: OpenLayersProvider

Defined in: [src/map-provider/ol/openlayers-provider.ts:20](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L20)

## Implements

- [`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)

## Constructors

### Constructor

> **new OpenLayersProvider**(): `OpenLayersProvider`

#### Returns

`OpenLayersProvider`

## Methods

### addBaseLayer()

> **addBaseLayer**(`layerConfig`, `basemapid`, `layerElementId`): `Promise`\<`string`\>

Defined in: [src/map-provider/ol/openlayers-provider.ts:123](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L123)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:172](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L172)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:55](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L55)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### getMap()

> **getMap**(): `Map`

Defined in: [src/map-provider/ol/openlayers-provider.ts:978](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L978)

#### Returns

`Map`

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/ol/openlayers-provider.ts:27](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L27)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:685](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L685)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:98](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L98)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:724](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L724)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:697](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L697)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:629](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L629)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:717](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L717)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:707](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L707)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:60](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/ol/openlayers-provider.ts#L60)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
