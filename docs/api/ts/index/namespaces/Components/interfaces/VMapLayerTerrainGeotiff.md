[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerTerrainGeotiff

# Interface: VMapLayerTerrainGeotiff

Defined in: [src/components.d.ts:421](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L421)

## Properties

### color?

> `optional` **color**: \[`number`, `number`, `number`\]

Defined in: [src/components.d.ts:426](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L426)

Color for the terrain (if no texture is provided). [r, g, b] with values 0-255.

#### Default

```ts
[255, 255, 255]
```

***

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:431](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L431)

ColorMap for elevation data visualization. Only relevant when no texture is set.

#### Default

```ts
null
```

***

### elevationScale?

> `optional` **elevationScale**: `number`

Defined in: [src/components.d.ts:436](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L436)

Elevation exaggeration factor.

#### Default

```ts
1.0
```

***

### forceProjection?

> `optional` **forceProjection**: `boolean`

Defined in: [src/components.d.ts:441](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L441)

Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys

#### Default

```ts
false
```

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:445](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L445)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:449](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L449)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:454](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L454)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:459](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L459)

Maximum zoom level.

#### Default

```ts
24
```

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:464](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L464)

Mesh error tolerance in meters (Martini). Smaller values = more detailed mesh, but slower.

#### Default

```ts
4.0
```

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:469](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L469)

Minimum zoom level.

#### Default

```ts
0
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:474](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L474)

NoData value to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:479](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L479)

Opacity of the terrain layer (0–1).

#### Default

```ts
1
```

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:484](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L484)

Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)

#### Default

```ts
null
```

***

### renderMode?

> `optional` **renderMode**: `"terrain"` \| `"colormap"`

Defined in: [src/components.d.ts:489](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L489)

Rendering mode for GeoTIFF terrain.

#### Default

```ts
terrain
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:494](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L494)

Optional texture URL (can be an image or tile URL).

#### Default

```ts
null
```

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:499](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L499)

Tile size in pixels.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:504](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L504)

URL to the GeoTIFF file containing elevation data.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:509](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L509)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:514](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L514)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:519](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L519)

Enable wireframe mode (show only mesh lines).

#### Default

```ts
false
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:524](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L524)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```
