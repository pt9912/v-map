[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerTile3d

# Interface: VMapLayerTile3d

Defined in: [src/components.d.ts:354](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L354)

## Properties

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:358](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L358)

Indicates whether the tileset has been initialised and added to the map.

#### Returns

`Promise`\<`boolean`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:363](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L363)

Global opacity factor (0-1).

#### Default

```ts
1
```

***

### tilesetOptions?

> `optional` **tilesetOptions**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [src/components.d.ts:367](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L367)

Optional JSON string or object with Cesium3DTileset options.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:371](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L371)

URL pointing to the Cesium 3D Tileset.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:376](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L376)

Whether the tileset should be visible.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:381](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L381)

Z-index used for ordering tilesets.

#### Default

```ts
1000
```
