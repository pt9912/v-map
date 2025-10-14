[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerTile3d

# Interface: VMapLayerTile3d

Defined in: [src/components.d.ts:1383](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L1383)

## Properties

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1387](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L1387)

Fired once the tileset layer is initialised.

#### Parameters

##### event

[`VMapLayerTile3dCustomEvent`](../../../interfaces/VMapLayerTile3dCustomEvent.md)\<`void`\>

#### Returns

`void`

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1392](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L1392)

Global opacity factor (0-1).

#### Default

```ts
1
```

***

### tilesetOptions?

> `optional` **tilesetOptions**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [src/components.d.ts:1396](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L1396)

Optional JSON string or object with Cesium3DTileset options.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1400](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L1400)

URL pointing to the Cesium 3D Tileset.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1405](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L1405)

Whether the tileset should be visible.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1410](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L1410)

Z-index used for ordering tilesets.

#### Default

```ts
1000
```
