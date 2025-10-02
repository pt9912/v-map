[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:536](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L536)

## Properties

### autoApply

> **autoApply**: `boolean`

Defined in: [src/components.d.ts:541](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L541)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:545](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L545)

Inline style content as string (alternative to src).

***

### format

> **format**: [`StyleFormat`](../../../type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:550](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L550)

The styling format to parse (currently supports 'sld').

#### Default

```ts
'sld'
```

***

### getStyle()

> **getStyle**: () => `Promise`\<[`ResolvedStyle`](../../../type-aliases/ResolvedStyle.md)\>

Defined in: [src/components.d.ts:554](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L554)

Get the currently parsed style.

#### Returns

`Promise`\<[`ResolvedStyle`](../../../type-aliases/ResolvedStyle.md)\>

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:558](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L558)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:562](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L562)

The style source - can be a URL to fetch from or inline SLD/style content.
