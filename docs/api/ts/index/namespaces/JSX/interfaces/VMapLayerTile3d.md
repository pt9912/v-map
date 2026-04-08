[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerTile3d

# Interface: VMapLayerTile3d

Defined in: [src/components.d.ts:1857](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1857)

## Properties

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1862](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1862)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1866](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1866)

Fired once the tileset layer is initialised.

#### Parameters

##### event

[`VMapLayerTile3dCustomEvent`](../../../interfaces/VMapLayerTile3dCustomEvent.md)\<`void`\>

#### Returns

`void`

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1871](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1871)

Global opacity factor (0-1).

#### Default

```ts
1
```

***

### tilesetOptions?

> `optional` **tilesetOptions**: `string` \| `Record`\<`string`, `unknown`\>

Defined in: [src/components.d.ts:1875](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1875)

Optional JSON string or object with Cesium3DTileset options.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1879](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1879)

URL pointing to the Cesium 3D Tileset.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1884](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1884)

Whether the tileset should be visible.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1889](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1889)

Z-index used for ordering tilesets.

#### Default

```ts
1000
```
