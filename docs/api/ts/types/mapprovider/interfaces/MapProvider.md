[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [types/mapprovider](../index.md) / MapProvider

# Interface: MapProvider

Defined in: [src/types/mapprovider.ts:16](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L16)

## Methods

### addBaseLayer()?

> `optional` **addBaseLayer**(`layerConfig`, `basemapid`, `layerElementId`): `Promise`\<`string`\>

Defined in: [src/types/mapprovider.ts:29](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L29)

#### Parameters

##### layerConfig

[`LayerConfig`](../../layerconfig/type-aliases/LayerConfig.md)

##### basemapid

`string`

##### layerElementId

`string`

#### Returns

`Promise`\<`string`\>

***

### addLayerToGroup()

> **addLayerToGroup**(`layer`): `Promise`\<`string`\>

Defined in: [src/types/mapprovider.ts:25](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L25)

Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind

#### Parameters

##### layer

[`LayerConfig`](../../layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`string`\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:18](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L18)

#### Returns

`Promise`\<`void`\>

***

### ensureGroup()

> **ensureGroup**(`groupId`, `visible`, `opts?`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:39](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L39)

#### Parameters

##### groupId

`string`

##### visible

`boolean`

##### opts?

###### basemapid?

`string`

#### Returns

`Promise`\<`void`\>

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:17](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L17)

#### Parameters

##### options

[`ProviderOptions`](../../provideroptions/type-aliases/ProviderOptions.md)

#### Returns

`Promise`\<`void`\>

***

### offLayerError()?

> `optional` **offLayerError**(`layerId`): `void`

Defined in: [src/types/mapprovider.ts:50](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L50)

Unregister the runtime error callback and detach native listeners for a layer.

#### Parameters

##### layerId

`string`

#### Returns

`void`

***

### onLayerError()?

> `optional` **onLayerError**(`layerId`, `callback`): `void`

Defined in: [src/types/mapprovider.ts:48](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L48)

Register a callback for runtime layer errors (tile load, feature fetch, etc.).

#### Parameters

##### layerId

`string`

##### callback

[`LayerErrorCallback`](../type-aliases/LayerErrorCallback.md)

#### Returns

`void`

***

### onPointerMove()?

> `optional` **onPointerMove**(`callback`): () => `void`

Defined in: [src/types/mapprovider.ts:53](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L53)

Register a callback for pointer-move with geo-coordinates. Returns unsubscribe function.

#### Parameters

##### callback

(`coordinate`, `pixel`) => `void`

#### Returns

> (): `void`

##### Returns

`void`

***

### removeLayer()

> **removeLayer**(`layerId`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:27](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L27)

#### Parameters

##### layerId

`string`

#### Returns

`Promise`\<`void`\>

***

### setBaseLayer()?

> `optional` **setBaseLayer**(`groupId`, `layerElementId`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:34](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L34)

#### Parameters

##### groupId

`string`

##### layerElementId

`string`

#### Returns

`Promise`\<`void`\>

***

### setGroupVisible()?

> `optional` **setGroupVisible**(`groupId`, `visible`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:45](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L45)

#### Parameters

##### groupId

`string`

##### visible

`boolean`

#### Returns

`Promise`\<`void`\>

***

### setOpacity()

> **setOpacity**(`layerId`, `opacity`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:20](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L20)

#### Parameters

##### layerId

`string`

##### opacity

`number`

#### Returns

`Promise`\<`void`\>

***

### setView()

> **setView**(`center`, `zoom`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:37](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L37)

View/Camera setzen; in OL/Cesium meist async (Animations/Promises), daher Promise<void>

#### Parameters

##### center

[`LonLat`](../../lonlat/type-aliases/LonLat.md)

##### zoom

`number`

#### Returns

`Promise`\<`void`\>

***

### setVisible()

> **setVisible**(`layerId`, `visible`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:21](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L21)

#### Parameters

##### layerId

`string`

##### visible

`boolean`

#### Returns

`Promise`\<`void`\>

***

### setZIndex()

> **setZIndex**(`layerId`, `zIndex`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:22](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L22)

#### Parameters

##### layerId

`string`

##### zIndex

`number`

#### Returns

`Promise`\<`void`\>

***

### updateLayer()

> **updateLayer**(`layerId`, `update`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:26](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/types/mapprovider.ts#L26)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>
