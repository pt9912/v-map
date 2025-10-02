[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerTile3d

# Interface: VMapLayerTile3d

Defined in: [src/components.d.ts:1137](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L1137)

## Properties

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1141](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L1141)

Fired once the tileset layer is initialised.

#### Parameters

##### event

[`VMapLayerTile3dCustomEvent`](../../../interfaces/VMapLayerTile3dCustomEvent.md)\<`void`\>

#### Returns

`void`

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1146](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L1146)

Global opacity factor (0-1).

#### Default

```ts
1
```

***

### tilesetOptions?

> `optional` **tilesetOptions**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [src/components.d.ts:1150](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L1150)

Optional JSON string or object with Cesium3DTileset options.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1154](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L1154)

URL pointing to the Cesium 3D Tileset.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1159](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L1159)

Whether the tileset should be visible.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1164](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L1164)

Z-index used for ordering tilesets.

#### Default

```ts
1000
```
