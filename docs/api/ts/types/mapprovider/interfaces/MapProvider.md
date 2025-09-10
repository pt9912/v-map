[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [types/mapprovider](../README.md) / MapProvider

# Interface: MapProvider

Defined in: [src/types/mapprovider.ts:5](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/types/mapprovider.ts#L5)

## Methods

### addLayer()

> **addLayer**(`layer`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:10](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/types/mapprovider.ts#L10)

Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind

#### Parameters

##### layer

[`LayerConfig`](../../layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:7](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/types/mapprovider.ts#L7)

#### Returns

`Promise`\<`void`\>

***

### ensureGroup()?

> `optional` **ensureGroup**(`groupId`, `opts?`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:16](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/types/mapprovider.ts#L16)

Optional: von v-map-layer-group genutzt, wenn vorhanden

#### Parameters

##### groupId

`string`

##### opts?

###### basemap?

`boolean`

###### zIndex?

`number`

#### Returns

`Promise`\<`void`\>

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:6](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/types/mapprovider.ts#L6)

#### Parameters

##### options

[`ProviderOptions`](../../provideroptions/type-aliases/ProviderOptions.md)

#### Returns

`Promise`\<`void`\>

***

### setView()

> **setView**(`center`, `zoom`): `Promise`\<`void`\>

Defined in: [src/types/mapprovider.ts:13](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/types/mapprovider.ts#L13)

View/Camera setzen; in OL/Cesium meist async (Animations/Promises), daher Promise<void>

#### Parameters

##### center

[`LonLat`](../../lonlat/type-aliases/LonLat.md)

##### zoom

`number`

#### Returns

`Promise`\<`void`\>
