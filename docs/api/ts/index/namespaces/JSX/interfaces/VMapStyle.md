[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:2109](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L2109)

## Properties

### autoApply?

> `optional` **autoApply**: `boolean`

Defined in: [src/components.d.ts:2114](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L2114)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:2118](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L2118)

Inline style content as string (alternative to src).

***

### format?

> `optional` **format**: [`StyleFormat`](../../../../types/styling/type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:2123](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L2123)

The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles').

#### Default

```ts
'sld'
```

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:2127](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L2127)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### onStyleError()?

> `optional` **onStyleError**: (`event`) => `void`

Defined in: [src/components.d.ts:2131](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L2131)

Fired when style parsing fails.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<`Error`\>

#### Returns

`void`

***

### onStyleReady()?

> `optional` **onStyleReady**: (`event`) => `void`

Defined in: [src/components.d.ts:2135](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L2135)

Fired when style is successfully parsed and ready to apply.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<[`StyleEvent`](../../../../types/styling/type-aliases/StyleEvent.md)\>

#### Returns

`void`

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:2139](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L2139)

The style source - can be a URL to fetch from or inline SLD/style content.
