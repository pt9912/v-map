[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:1372](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L1372)

## Properties

### autoApply?

> `optional` **autoApply**: `boolean`

Defined in: [src/components.d.ts:1377](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L1377)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:1381](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L1381)

Inline style content as string (alternative to src).

***

### format?

> `optional` **format**: [`StyleFormat`](../../../type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:1386](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L1386)

The styling format to parse (currently supports 'sld').

#### Default

```ts
'sld'
```

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:1390](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L1390)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### onStyleError()?

> `optional` **onStyleError**: (`event`) => `void`

Defined in: [src/components.d.ts:1394](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L1394)

Fired when style parsing fails.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<`Error`\>

#### Returns

`void`

***

### onStyleReady()?

> `optional` **onStyleReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1398](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L1398)

Fired when style is successfully parsed and ready to apply.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<[`ResolvedStyle`](../../../type-aliases/ResolvedStyle.md)\>

#### Returns

`void`

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:1402](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L1402)

The style source - can be a URL to fetch from or inline SLD/style content.
