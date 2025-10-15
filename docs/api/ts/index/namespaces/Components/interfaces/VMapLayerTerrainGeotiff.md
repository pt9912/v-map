[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerTerrainGeotiff

# Interface: VMapLayerTerrainGeotiff

Defined in: [src/components.d.ts:369](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L369)

## Properties

### color?

> `optional` **color**: \[`number`, `number`, `number`\]

Defined in: [src/components.d.ts:374](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L374)

Color for the terrain (if no texture is provided). [r, g, b] with values 0-255.

#### Default

```ts
[255, 255, 255]
```

***

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:379](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L379)

ColorMap for elevation data visualization. Only relevant when no texture is set.

#### Default

```ts
null
```

***

### elevationScale?

> `optional` **elevationScale**: `number`

Defined in: [src/components.d.ts:384](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L384)

Elevation exaggeration factor.

#### Default

```ts
1.0
```

***

### forceProjection?

> `optional` **forceProjection**: `boolean`

Defined in: [src/components.d.ts:389](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L389)

Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys

#### Default

```ts
false
```

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:393](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L393)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:398](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L398)

Maximum zoom level.

#### Default

```ts
24
```

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:403](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L403)

Mesh error tolerance in meters (Martini). Smaller values = more detailed mesh, but slower.

#### Default

```ts
4.0
```

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:408](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L408)

Minimum zoom level.

#### Default

```ts
0
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:413](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L413)

NoData value to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:418](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L418)

Opacity of the terrain layer (0–1).

#### Default

```ts
1
```

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:423](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L423)

Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)

#### Default

```ts
null
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:428](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L428)

Optional texture URL (can be an image or tile URL).

#### Default

```ts
null
```

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:433](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L433)

Tile size in pixels.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:438](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L438)

URL to the GeoTIFF file containing elevation data.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:443](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L443)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:448](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L448)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:453](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L453)

Enable wireframe mode (show only mesh lines).

#### Default

```ts
false
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:458](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L458)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```
