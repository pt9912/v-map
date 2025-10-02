[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:509](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L509)

## Properties

### autoApply

> **autoApply**: `boolean`

Defined in: [src/components.d.ts:514](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L514)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:518](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L518)

Inline style content as string (alternative to src).

***

### format

> **format**: [`StyleFormat`](../../../type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:523](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L523)

The styling format to parse (currently supports 'sld').

#### Default

```ts
'sld'
```

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:527](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L527)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:531](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L531)

The style source - can be a URL to fetch from or inline SLD/style content.
