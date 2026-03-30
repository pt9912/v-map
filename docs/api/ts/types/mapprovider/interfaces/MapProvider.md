[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [types/mapprovider](../README.md) / MapProvider

# Interface: MapProvider

Defined in: [src/types/mapprovider.ts:14](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L14)

## Methods

### addBaseLayer()?

> `optional` **addBaseLayer**(`layerConfig`, `basemapid`, `layerElementId`): `Promise`\<`string`\>

Defined in: [src/types/mapprovider.ts:27](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L27)

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

Defined in: [src/types/mapprovider.ts:23](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L23)

Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind

#### Parameters

##### layer

[`LayerConfig`](../../layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`string`\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:16](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L16)

#### Returns

`Promise`\<`void`\>

***

### ensureGroup()

> **ensureGroup**(`groupId`, `visible`, `opts?`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:37](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L37)

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

Defined in: [src/types/mapprovider.ts:15](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L15)

#### Parameters

##### options

[`ProviderOptions`](../../provideroptions/type-aliases/ProviderOptions.md)

#### Returns

`Promise`\<`void`\>

***

### onPointerMove()?

> `optional` **onPointerMove**(`callback`): () => `void`

Defined in: [src/types/mapprovider.ts:46](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L46)

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

Defined in: [src/types/mapprovider.ts:25](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L25)

#### Parameters

##### layerId

`string`

#### Returns

`Promise`\<`void`\>

***

### setBaseLayer()?

> `optional` **setBaseLayer**(`groupId`, `layerElementId`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:32](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L32)

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

Defined in: [src/types/mapprovider.ts:43](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L43)

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

Defined in: [src/types/mapprovider.ts:18](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L18)

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

Defined in: [src/types/mapprovider.ts:35](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L35)

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

Defined in: [src/types/mapprovider.ts:19](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L19)

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

Defined in: [src/types/mapprovider.ts:20](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L20)

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

Defined in: [src/types/mapprovider.ts:24](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L24)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>
