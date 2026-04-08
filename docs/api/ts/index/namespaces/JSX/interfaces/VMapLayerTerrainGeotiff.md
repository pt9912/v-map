[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerTerrainGeotiff

# Interface: VMapLayerTerrainGeotiff

Defined in: [src/components.d.ts:1651](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1651)

## Properties

### color?

> `optional` **color**: \[`number`, `number`, `number`\]

Defined in: [src/components.d.ts:1656](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1656)

Color for the terrain (if no texture is provided). [r, g, b] with values 0-255.

#### Default

```ts
[255, 255, 255]
```

***

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:1661](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1661)

ColorMap for elevation data visualization. Only relevant when no texture is set.

#### Default

```ts
null
```

***

### elevationScale?

> `optional` **elevationScale**: `number`

Defined in: [src/components.d.ts:1666](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1666)

Elevation exaggeration factor.

#### Default

```ts
1.0
```

***

### forceProjection?

> `optional` **forceProjection**: `boolean`

Defined in: [src/components.d.ts:1671](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1671)

Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys

#### Default

```ts
false
```

***

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1676](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1676)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1681](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1681)

Maximum zoom level.

#### Default

```ts
24
```

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:1686](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1686)

Mesh error tolerance in meters (Martini). Smaller values = more detailed mesh, but slower.

#### Default

```ts
4.0
```

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:1691](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1691)

Minimum zoom level.

#### Default

```ts
0
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:1696](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1696)

NoData value to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1706](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1706)

Opacity of the terrain layer (0–1).

#### Default

```ts
1
```

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:1711](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1711)

Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)

#### Default

```ts
null
```

***

### renderMode?

> `optional` **renderMode**: `"terrain"` \| `"colormap"`

Defined in: [src/components.d.ts:1716](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1716)

Rendering mode for GeoTIFF terrain.

#### Default

```ts
terrain
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:1721](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1721)

Optional texture URL (can be an image or tile URL).

#### Default

```ts
null
```

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:1726](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1726)

Tile size in pixels.

#### Default

```ts
256
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1731](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1731)

URL to the GeoTIFF file containing elevation data.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:1736](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1736)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1741](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1741)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:1746](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1746)

Enable wireframe mode (show only mesh lines).

#### Default

```ts
false
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1751](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1751)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1701](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1701)

Fired when the terrain layer is ready.
 ready

#### Parameters

##### event

[`VMapLayerTerrainGeotiffCustomEvent`](../../../interfaces/VMapLayerTerrainGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
