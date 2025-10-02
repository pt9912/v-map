[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerTile3d

# Interface: VMapLayerTile3d

Defined in: [src/components.d.ts:362](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L362)

## Properties

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:366](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L366)

Indicates whether the tileset has been initialised and added to the map.

#### Returns

`Promise`\<`boolean`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:371](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L371)

Global opacity factor (0-1).

#### Default

```ts
1
```

***

### tilesetOptions?

> `optional` **tilesetOptions**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [src/components.d.ts:375](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L375)

Optional JSON string or object with Cesium3DTileset options.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:379](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L379)

URL pointing to the Cesium 3D Tileset.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:384](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L384)

Whether the tileset should be visible.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:389](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L389)

Z-index used for ordering tilesets.

#### Default

```ts
1000
```
