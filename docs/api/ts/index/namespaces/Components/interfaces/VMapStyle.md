[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:948](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L948)

## Properties

### autoApply

> **autoApply**: `boolean`

Defined in: [src/components.d.ts:953](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L953)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:957](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L957)

Inline style content as string (alternative to src).

***

### format

> **format**: [`StyleFormat`](../../../../types/styling/type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:962](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L962)

The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles').

#### Default

```ts
'sld'
```

***

### getLayerTargetIds()

> **getLayerTargetIds**: () => `Promise`\<`string`[]\>

Defined in: [src/components.d.ts:966](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L966)

Get the target layer IDs as array. async

#### Returns

`Promise`\<`string`[]\>

***

### getStyle()

> **getStyle**: () => `Promise`\<[`ResolvedStyle`](../../../../types/styling/type-aliases/ResolvedStyle.md)\>

Defined in: [src/components.d.ts:970](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L970)

Get the currently parsed style.

#### Returns

`Promise`\<[`ResolvedStyle`](../../../../types/styling/type-aliases/ResolvedStyle.md)\>

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:974](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L974)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:978](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L978)

The style source - can be a URL to fetch from or inline SLD/style content.
