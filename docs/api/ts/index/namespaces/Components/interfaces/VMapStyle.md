[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:589](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L589)

## Properties

### autoApply

> **autoApply**: `boolean`

Defined in: [src/components.d.ts:594](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L594)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:598](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L598)

Inline style content as string (alternative to src).

***

### format

> **format**: [`StyleFormat`](../../../type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:603](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L603)

The styling format to parse (currently supports 'sld').

#### Default

```ts
'sld'
```

***

### getStyle()

> **getStyle**: () => `Promise`\<[`ResolvedStyle`](../../../type-aliases/ResolvedStyle.md)\>

Defined in: [src/components.d.ts:607](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L607)

Get the currently parsed style.

#### Returns

`Promise`\<[`ResolvedStyle`](../../../type-aliases/ResolvedStyle.md)\>

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:611](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L611)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:615](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L615)

The style source - can be a URL to fetch from or inline SLD/style content.
