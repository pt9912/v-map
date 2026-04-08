[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerTerrainGeotiff

# Interface: VMapLayerTerrainGeotiff

Defined in: [src/components.d.ts:462](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L462)

## Properties

### color?

> `optional` **color**: \[`number`, `number`, `number`\]

Defined in: [src/components.d.ts:467](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L467)

Color for the terrain (if no texture is provided). [r, g, b] with values 0-255.

#### Default

```ts
[255, 255, 255]
```

***

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:472](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L472)

ColorMap for elevation data visualization. Only relevant when no texture is set.

#### Default

```ts
null
```

***

### elevationScale?

> `optional` **elevationScale**: `number`

Defined in: [src/components.d.ts:477](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L477)

Elevation exaggeration factor.

#### Default

```ts
1.0
```

***

### forceProjection?

> `optional` **forceProjection**: `boolean`

Defined in: [src/components.d.ts:482](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L482)

Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys

#### Default

```ts
false
```

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:486](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L486)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:490](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L490)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:495](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L495)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:500](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L500)

Maximum zoom level.

#### Default

```ts
24
```

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:505](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L505)

Mesh error tolerance in meters (Martini). Smaller values = more detailed mesh, but slower.

#### Default

```ts
4.0
```

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:510](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L510)

Minimum zoom level.

#### Default

```ts
0
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:515](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L515)

NoData value to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:520](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L520)

Opacity of the terrain layer (0–1).

#### Default

```ts
1
```

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:525](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L525)

Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)

#### Default

```ts
null
```

***

### renderMode?

> `optional` **renderMode**: `"terrain"` \| `"colormap"`

Defined in: [src/components.d.ts:530](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L530)

Rendering mode for GeoTIFF terrain.

#### Default

```ts
terrain
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:535](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L535)

Optional texture URL (can be an image or tile URL).

#### Default

```ts
null
```

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:540](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L540)

Tile size in pixels.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:545](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L545)

URL to the GeoTIFF file containing elevation data.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:550](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L550)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:555](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L555)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:560](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L560)

Enable wireframe mode (show only mesh lines).

#### Default

```ts
false
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:565](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L565)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```
