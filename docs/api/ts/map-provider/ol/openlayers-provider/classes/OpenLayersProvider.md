[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/ol/openlayers-provider](../README.md) / OpenLayersProvider

# Class: OpenLayersProvider

Defined in: [src/map-provider/ol/openlayers-provider.ts:49](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L49)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:173](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L173)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:231](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L231)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:80](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L80)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### ensureGroup()

> **ensureGroup**(`groupId`, `visible`, `_opts?`): `Promise`\<`void`\>

Defined in: [src/map-provider/ol/openlayers-provider.ts:115](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L115)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:1543](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L1543)

#### Returns

`Map`

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/ol/openlayers-provider.ts:56](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L56)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:1112](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L1112)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:148](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L148)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:1151](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L1151)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:1124](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L1124)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:1058](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L1058)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:1144](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L1144)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:1134](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L1134)

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

Defined in: [src/map-provider/ol/openlayers-provider.ts:85](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/ol/openlayers-provider.ts#L85)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
