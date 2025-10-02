[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:1294](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1294)

## Properties

### autoApply?

> `optional` **autoApply**: `boolean`

Defined in: [src/components.d.ts:1299](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1299)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:1303](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1303)

Inline style content as string (alternative to src).

***

### format?

> `optional` **format**: [`StyleFormat`](../../../type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:1308](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1308)

The styling format to parse (currently supports 'sld').

#### Default

```ts
'sld'
```

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:1312](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1312)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### onStyleError()?

> `optional` **onStyleError**: (`event`) => `void`

Defined in: [src/components.d.ts:1316](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1316)

Fired when style parsing fails.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<`Error`\>

#### Returns

`void`

***

### onStyleReady()?

> `optional` **onStyleReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1320](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1320)

Fired when style is successfully parsed and ready to apply.

#### Parameters

##### event

[`VMapStyleCustomEvent`](../../../interfaces/VMapStyleCustomEvent.md)\<[`Style`](../../../interfaces/Style.md)\>

#### Returns

`void`

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:1324](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1324)

The style source - can be a URL to fetch from or inline SLD/style content.
