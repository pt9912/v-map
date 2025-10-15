[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:784](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L784)

## Properties

### autoApply

> **autoApply**: `boolean`

Defined in: [src/components.d.ts:789](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L789)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:793](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L793)

Inline style content as string (alternative to src).

***

### format

> **format**: [`StyleFormat`](../../../../types/styling/type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:798](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L798)

The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles').

#### Default

```ts
'sld'
```

***

### getLayerTargetIds()

> **getLayerTargetIds**: () => `Promise`\<`string`[]\>

Defined in: [src/components.d.ts:802](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L802)

Get the target layer IDs as array. async

#### Returns

`Promise`\<`string`[]\>

***

### getStyle()

> **getStyle**: () => `Promise`\<[`ResolvedStyle`](../../../../types/styling/type-aliases/ResolvedStyle.md)\>

Defined in: [src/components.d.ts:806](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L806)

Get the currently parsed style.

#### Returns

`Promise`\<[`ResolvedStyle`](../../../../types/styling/type-aliases/ResolvedStyle.md)\>

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:810](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L810)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:814](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L814)

The style source - can be a URL to fetch from or inline SLD/style content.
