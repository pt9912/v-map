[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerTerrainGeotiff

# Interface: VMapLayerTerrainGeotiff

Defined in: [src/components.d.ts:1496](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1496)

## Properties

### color?

> `optional` **color**: \[`number`, `number`, `number`\]

Defined in: [src/components.d.ts:1501](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1501)

Color for the terrain (if no texture is provided). [r, g, b] with values 0-255.

#### Default

```ts
[255, 255, 255]
```

***

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:1506](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1506)

ColorMap for elevation data visualization. Only relevant when no texture is set.

#### Default

```ts
null
```

***

### elevationScale?

> `optional` **elevationScale**: `number`

Defined in: [src/components.d.ts:1511](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1511)

Elevation exaggeration factor.

#### Default

```ts
1.0
```

***

### forceProjection?

> `optional` **forceProjection**: `boolean`

Defined in: [src/components.d.ts:1516](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1516)

Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys

#### Default

```ts
false
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1521](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1521)

Maximum zoom level.

#### Default

```ts
24
```

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:1526](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1526)

Mesh error tolerance in meters (Martini). Smaller values = more detailed mesh, but slower.

#### Default

```ts
4.0
```

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:1531](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1531)

Minimum zoom level.

#### Default

```ts
0
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:1536](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1536)

NoData value to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1546](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1546)

Opacity of the terrain layer (0–1).

#### Default

```ts
1
```

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:1551](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1551)

Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)

#### Default

```ts
null
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:1556](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1556)

Optional texture URL (can be an image or tile URL).

#### Default

```ts
null
```

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:1561](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1561)

Tile size in pixels.

#### Default

```ts
256
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1566](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1566)

URL to the GeoTIFF file containing elevation data.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:1571](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1571)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1576](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1576)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:1581](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1581)

Enable wireframe mode (show only mesh lines).

#### Default

```ts
false
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1586](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1586)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1541](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L1541)

Fired when the terrain layer is ready.
 ready

#### Parameters

##### event

[`VMapLayerTerrainGeotiffCustomEvent`](../../../interfaces/VMapLayerTerrainGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
