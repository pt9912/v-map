[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerTerrainGeotiff

# Interface: VMapLayerTerrainGeotiff

Defined in: [src/components.d.ts:1498](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1498)

## Properties

### color?

> `optional` **color**: \[`number`, `number`, `number`\]

Defined in: [src/components.d.ts:1503](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1503)

Color for the terrain (if no texture is provided). [r, g, b] with values 0-255.

#### Default

```ts
[255, 255, 255]
```

***

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:1508](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1508)

ColorMap for elevation data visualization. Only relevant when no texture is set.

#### Default

```ts
null
```

***

### elevationScale?

> `optional` **elevationScale**: `number`

Defined in: [src/components.d.ts:1513](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1513)

Elevation exaggeration factor.

#### Default

```ts
1.0
```

***

### forceProjection?

> `optional` **forceProjection**: `boolean`

Defined in: [src/components.d.ts:1518](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1518)

Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys

#### Default

```ts
false
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1523](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1523)

Maximum zoom level.

#### Default

```ts
24
```

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:1528](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1528)

Mesh error tolerance in meters (Martini). Smaller values = more detailed mesh, but slower.

#### Default

```ts
4.0
```

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:1533](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1533)

Minimum zoom level.

#### Default

```ts
0
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:1538](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1538)

NoData value to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1548](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1548)

Opacity of the terrain layer (0–1).

#### Default

```ts
1
```

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:1553](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1553)

Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)

#### Default

```ts
null
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:1558](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1558)

Optional texture URL (can be an image or tile URL).

#### Default

```ts
null
```

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:1563](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1563)

Tile size in pixels.

#### Default

```ts
256
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1568](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1568)

URL to the GeoTIFF file containing elevation data.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:1573](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1573)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1578](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1578)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:1583](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1583)

Enable wireframe mode (show only mesh lines).

#### Default

```ts
false
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1588](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1588)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1543](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1543)

Fired when the terrain layer is ready.
 ready

#### Parameters

##### event

[`VMapLayerTerrainGeotiffCustomEvent`](../../../interfaces/VMapLayerTerrainGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
