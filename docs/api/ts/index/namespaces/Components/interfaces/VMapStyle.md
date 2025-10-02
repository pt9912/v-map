[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapStyle

# Interface: VMapStyle

Defined in: [src/components.d.ts:690](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L690)

## Properties

### autoApply

> **autoApply**: `boolean`

Defined in: [src/components.d.ts:695](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L695)

Whether to automatically apply the style when loaded.

#### Default

```ts
true
```

***

### content?

> `optional` **content**: `string`

Defined in: [src/components.d.ts:699](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L699)

Inline style content as string (alternative to src).

***

### format

> **format**: [`StyleFormat`](../../../../types/styling/type-aliases/StyleFormat.md)

Defined in: [src/components.d.ts:704](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L704)

The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles').

#### Default

```ts
'sld'
```

***

### getStyle()

> **getStyle**: () => `Promise`\<[`ResolvedStyle`](../../../type-aliases/ResolvedStyle.md)\>

Defined in: [src/components.d.ts:708](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L708)

Get the currently parsed style.

#### Returns

`Promise`\<[`ResolvedStyle`](../../../type-aliases/ResolvedStyle.md)\>

***

### layerTargets?

> `optional` **layerTargets**: `string`

Defined in: [src/components.d.ts:712](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L712)

Target layer IDs to apply this style to. If not specified, applies to all compatible layers.

***

### src?

> `optional` **src**: `string`

Defined in: [src/components.d.ts:716](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L716)

The style source - can be a URL to fetch from or inline SLD/style content.
