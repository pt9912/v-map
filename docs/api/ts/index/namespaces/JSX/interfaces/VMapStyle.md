[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:1689](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1689)

## Properties

### autoApply?

> `optional` **autoApply**: `boolean`

Defined in: [src/components.d.ts:1694](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1694)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:1698](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1698)

Inline style content as string (alternative to src).

***

### format?

> `optional` **format**: [`StyleFormat`](../../../../types/styling/type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:1703](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1703)

The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles').

#### Default

```ts
'sld'
```

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:1707](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1707)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### onStyleError()?

> `optional` **onStyleError**: (`event`) => `void`

Defined in: [src/components.d.ts:1711](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1711)

Fired when style parsing fails.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<`Error`\>

#### Returns

`void`

***

### onStyleReady()?

> `optional` **onStyleReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1715](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1715)

Fired when style is successfully parsed and ready to apply.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<[`StyleEvent`](../../../../types/styling/type-aliases/StyleEvent.md)\>

#### Returns

`void`

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:1719](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1719)

The style source - can be a URL to fetch from or inline SLD/style content.
