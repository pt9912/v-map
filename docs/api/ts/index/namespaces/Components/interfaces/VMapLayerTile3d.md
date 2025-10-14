[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerTile3d

# Interface: VMapLayerTile3d

Defined in: [src/components.d.ts:369](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L369)

## Properties

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:373](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L373)

Indicates whether the tileset has been initialised and added to the map.

#### Returns

`Promise`\<`boolean`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:378](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L378)

Global opacity factor (0-1).

#### Default

```ts
1
```

***

### tilesetOptions?

> `optional` **tilesetOptions**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [src/components.d.ts:382](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L382)

Optional JSON string or object with Cesium3DTileset options.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:386](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L386)

URL pointing to the Cesium 3D Tileset.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:391](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L391)

Whether the tileset should be visible.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:396](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L396)

Z-index used for ordering tilesets.

#### Default

```ts
1000
```
