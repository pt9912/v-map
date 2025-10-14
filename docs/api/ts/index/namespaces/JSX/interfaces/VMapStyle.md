[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:1709](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1709)

## Properties

### autoApply?

> `optional` **autoApply**: `boolean`

Defined in: [src/components.d.ts:1714](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1714)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:1718](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1718)

Inline style content as string (alternative to src).

***

### format?

> `optional` **format**: [`StyleFormat`](../../../../types/styling/type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:1723](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1723)

The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles').

#### Default

```ts
'sld'
```

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:1727](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1727)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### onStyleError()?

> `optional` **onStyleError**: (`event`) => `void`

Defined in: [src/components.d.ts:1731](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1731)

Fired when style parsing fails.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<`Error`\>

#### Returns

`void`

***

### onStyleReady()?

> `optional` **onStyleReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1735](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1735)

Fired when style is successfully parsed and ready to apply.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<[`StyleEvent`](../../../../types/styling/type-aliases/StyleEvent.md)\>

#### Returns

`void`

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:1739](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1739)

The style source - can be a URL to fetch from or inline SLD/style content.
