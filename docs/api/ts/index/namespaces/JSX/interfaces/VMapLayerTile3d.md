[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerTile3d

# Interface: VMapLayerTile3d

Defined in: [src/components.d.ts:1590](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1590)

## Properties

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1594](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1594)

Fired once the tileset layer is initialised.

#### Parameters

##### event

[`VMapLayerTile3dCustomEvent`](../../../interfaces/VMapLayerTile3dCustomEvent.md)\<`void`\>

#### Returns

`void`

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1599](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1599)

Global opacity factor (0-1).

#### Default

```ts
1
```

***

### tilesetOptions?

> `optional` **tilesetOptions**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [src/components.d.ts:1603](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1603)

Optional JSON string or object with Cesium3DTileset options.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1607](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1607)

URL pointing to the Cesium 3D Tileset.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1612](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1612)

Whether the tileset should be visible.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1617](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1617)

Z-index used for ordering tilesets.

#### Default

```ts
1000
```
