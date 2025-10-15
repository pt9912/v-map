[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerTile3d

# Interface: VMapLayerTile3d

Defined in: [src/components.d.ts:1588](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1588)

## Properties

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1592](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1592)

Fired once the tileset layer is initialised.

#### Parameters

##### event

[`VMapLayerTile3dCustomEvent`](../../../interfaces/VMapLayerTile3dCustomEvent.md)\<`void`\>

#### Returns

`void`

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1597](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1597)

Global opacity factor (0-1).

#### Default

```ts
1
```

***

### tilesetOptions?

> `optional` **tilesetOptions**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [src/components.d.ts:1601](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1601)

Optional JSON string or object with Cesium3DTileset options.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1605](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1605)

URL pointing to the Cesium 3D Tileset.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1610](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1610)

Whether the tileset should be visible.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1615](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1615)

Z-index used for ordering tilesets.

#### Default

```ts
1000
```
