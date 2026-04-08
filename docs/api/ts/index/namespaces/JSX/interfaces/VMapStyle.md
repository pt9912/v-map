[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:2213](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L2213)

## Properties

### autoApply?

> `optional` **autoApply**: `boolean`

Defined in: [src/components.d.ts:2218](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L2218)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:2222](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L2222)

Inline style content as string (alternative to src).

***

### format?

> `optional` **format**: [`StyleFormat`](../../../../types/styling/type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:2227](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L2227)

The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles').

#### Default

```ts
'sld'
```

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:2231](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L2231)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### onStyleError()?

> `optional` **onStyleError**: (`event`) => `void`

Defined in: [src/components.d.ts:2235](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L2235)

Fired when style parsing fails.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<`Error`\>

#### Returns

`void`

***

### onStyleReady()?

> `optional` **onStyleReady**: (`event`) => `void`

Defined in: [src/components.d.ts:2239](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L2239)

Fired when style is successfully parsed and ready to apply.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<[`StyleEvent`](../../../../types/styling/type-aliases/StyleEvent.md)\>

#### Returns

`void`

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:2243](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L2243)

The style source - can be a URL to fetch from or inline SLD/style content.
