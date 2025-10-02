[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:1687](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1687)

## Properties

### autoApply?

> `optional` **autoApply**: `boolean`

Defined in: [src/components.d.ts:1692](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1692)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:1696](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1696)

Inline style content as string (alternative to src).

***

### format?

> `optional` **format**: [`StyleFormat`](../../../../types/styling/type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:1701](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1701)

The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles').

#### Default

```ts
'sld'
```

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:1705](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1705)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### onStyleError()?

> `optional` **onStyleError**: (`event`) => `void`

Defined in: [src/components.d.ts:1709](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1709)

Fired when style parsing fails.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<`Error`\>

#### Returns

`void`

***

### onStyleReady()?

> `optional` **onStyleReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1713](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1713)

Fired when style is successfully parsed and ready to apply.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<[`ResolvedStyle`](../../../type-aliases/ResolvedStyle.md)\>

#### Returns

`void`

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:1717](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1717)

The style source - can be a URL to fetch from or inline SLD/style content.
