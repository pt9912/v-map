[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [types/mapprovider](../README.md) / MapProvider

# Interface: MapProvider

Defined in: [src/types/mapprovider.ts:10](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L10)

## Methods

### addBaseLayer()?

> `optional` **addBaseLayer**(`layerConfig`, `basemapid`, `layerElementId`): `Promise`\<`string`\>

Defined in: [src/types/mapprovider.ts:23](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L23)

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

Defined in: [src/types/mapprovider.ts:19](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L19)

Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind

#### Parameters

##### layer

[`LayerConfig`](../../layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`string`\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:12](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L12)

#### Returns

`Promise`\<`void`\>

***

### ensureGroup()

> **ensureGroup**(`groupId`, `visible`, `opts?`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:33](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L33)

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

Defined in: [src/types/mapprovider.ts:11](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L11)

#### Parameters

##### options

[`ProviderOptions`](../../provideroptions/type-aliases/ProviderOptions.md)

#### Returns

`Promise`\<`void`\>

***

### removeLayer()

> **removeLayer**(`layerId`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:21](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L21)

#### Parameters

##### layerId

`string`

#### Returns

`Promise`\<`void`\>

***

### setBaseLayer()?

> `optional` **setBaseLayer**(`groupId`, `layerElementId`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:28](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L28)

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

Defined in: [src/types/mapprovider.ts:39](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L39)

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

Defined in: [src/types/mapprovider.ts:14](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L14)

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

Defined in: [src/types/mapprovider.ts:31](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L31)

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

Defined in: [src/types/mapprovider.ts:15](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L15)

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

Defined in: [src/types/mapprovider.ts:16](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L16)

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

Defined in: [src/types/mapprovider.ts:20](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/types/mapprovider.ts#L20)

#### Parameters

##### layerId

`string`

##### update

[`LayerUpdate`](../type-aliases/LayerUpdate.md)

#### Returns

`Promise`\<`void`\>
