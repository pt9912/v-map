[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:688](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L688)

## Properties

### autoApply

> **autoApply**: `boolean`

Defined in: [src/components.d.ts:693](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L693)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:697](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L697)

Inline style content as string (alternative to src).

***

### format

> **format**: [`StyleFormat`](../../../type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:702](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L702)

The styling format to parse (currently supports 'sld').

#### Default

```ts
'sld'
```

***

### getStyle()

> **getStyle**: () => `Promise`\<[`ResolvedStyle`](../../../type-aliases/ResolvedStyle.md)\>

Defined in: [src/components.d.ts:706](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L706)

Get the currently parsed style.

#### Returns

`Promise`\<[`ResolvedStyle`](../../../type-aliases/ResolvedStyle.md)\>

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:710](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L710)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:714](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L714)

The style source - can be a URL to fetch from or inline SLD/style content.
