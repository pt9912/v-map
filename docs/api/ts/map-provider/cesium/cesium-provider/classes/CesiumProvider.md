[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/cesium/cesium-provider](../README.md) / CesiumProvider

# Class: CesiumProvider

Defined in: [src/map-provider/cesium/cesium-provider.ts:36](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L36)

## Implements

- [`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)

## Constructors

### Constructor

> **new CesiumProvider**(): `CesiumProvider`

#### Returns

`CesiumProvider`

## Methods

### addLayer()

> **addLayer**(`layerConfig`): `Promise`\<`string`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:131](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L131)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:86](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L86)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`destroy`](../../../../types/mapprovider/interfaces/MapProvider.md#destroy)

***

### getMap()

> **getMap**(): `Viewer`

Defined in: [src/map-provider/cesium/cesium-provider.ts:267](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L267)

#### Returns

`Viewer`

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:42](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L42)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:246](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L246)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:253](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L253)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:227](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L227)

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

Defined in: [src/map-provider/cesium/cesium-provider.ts:257](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L257)

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

> **setZIndex**(`layerId`, `zindex`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:261](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L261)

#### Parameters

##### layerId

`string`

##### zindex

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`setZIndex`](../../../../types/mapprovider/interfaces/MapProvider.md#setzindex)

***

### updateLayer()

> **updateLayer**(`layerId`, `update`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/cesium-provider.ts:92](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/map-provider/cesium/cesium-provider.ts#L92)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../../../../types/mapprovider/type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md).[`updateLayer`](../../../../types/mapprovider/interfaces/MapProvider.md#updatelayer)
