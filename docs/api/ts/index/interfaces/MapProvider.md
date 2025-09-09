[**@pt9912/v-map**](../../README.md)

***

[@pt9912/v-map](../../README.md) / [index](../README.md) / MapProvider

# Interface: MapProvider

Defined in: [src/components/v-map/map-provider/map-provider.ts:20](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components/v-map/map-provider/map-provider.ts#L20)

## Methods

### addLayer()

> **addLayer**(`layer`): `Promise`\<`void`\>

Defined in: [src/components/v-map/map-provider/map-provider.ts:25](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components/v-map/map-provider/map-provider.ts#L25)

Layer hinzufügen; Rückgabe bewusst async, weil Erzeugung/Importe asynchron sind

#### Parameters

##### layer

[`LayerConfig`](../type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/components/v-map/map-provider/map-provider.ts:22](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components/v-map/map-provider/map-provider.ts#L22)

#### Returns

`Promise`\<`void`\>

***

### ensureGroup()?

> `optional` **ensureGroup**(`groupId`, `opts?`): `Promise`\<`void`\>

Defined in: [src/components/v-map/map-provider/map-provider.ts:31](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components/v-map/map-provider/map-provider.ts#L31)

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

Defined in: [src/components/v-map/map-provider/map-provider.ts:21](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components/v-map/map-provider/map-provider.ts#L21)

#### Parameters

##### options

`ProviderOptions`

#### Returns

`Promise`\<`void`\>

***

### setView()

> **setView**(`center`, `zoom`): `Promise`\<`void`\>

Defined in: [src/components/v-map/map-provider/map-provider.ts:28](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components/v-map/map-provider/map-provider.ts#L28)

View/Camera setzen; in OL/Cesium meist async (Animations/Promises), daher Promise<void>

#### Parameters

##### center

`LonLat`

##### zoom

`number`

#### Returns

`Promise`\<`void`\>
