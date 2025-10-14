[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:693](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L693)

## Properties

### autoApply

> **autoApply**: `boolean`

Defined in: [src/components.d.ts:698](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L698)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:702](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L702)

Inline style content as string (alternative to src).

***

### format

> **format**: [`StyleFormat`](../../../../types/styling/type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:707](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L707)

The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles').

#### Default

```ts
'sld'
```

***

### getLayerTargetIds()

> **getLayerTargetIds**: () => `Promise`\<`string`[]\>

Defined in: [src/components.d.ts:711](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L711)

Get the target layer IDs as array. async

#### Returns

`Promise`\<`string`[]\>

***

### getStyle()

> **getStyle**: () => `Promise`\<[`ResolvedStyle`](../../../../types/styling/type-aliases/ResolvedStyle.md)\>

Defined in: [src/components.d.ts:715](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L715)

Get the currently parsed style.

#### Returns

`Promise`\<[`ResolvedStyle`](../../../../types/styling/type-aliases/ResolvedStyle.md)\>

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:719](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L719)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:723](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L723)

The style source - can be a URL to fetch from or inline SLD/style content.
