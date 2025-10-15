[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerTile3d

# Interface: VMapLayerTile3d

Defined in: [src/components.d.ts:460](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L460)

## Properties

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:464](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L464)

Indicates whether the tileset has been initialised and added to the map.

#### Returns

`Promise`\<`boolean`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:469](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L469)

Global opacity factor (0-1).

#### Default

```ts
1
```

***

### tilesetOptions?

> `optional` **tilesetOptions**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [src/components.d.ts:473](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L473)

Optional JSON string or object with Cesium3DTileset options.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:477](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L477)

URL pointing to the Cesium 3D Tileset.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:482](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L482)

Whether the tileset should be visible.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:487](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L487)

Z-index used for ordering tilesets.

#### Default

```ts
1000
```
