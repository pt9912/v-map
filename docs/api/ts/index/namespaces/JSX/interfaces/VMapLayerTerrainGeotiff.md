[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerTerrainGeotiff

# Interface: VMapLayerTerrainGeotiff

Defined in: [src/components.d.ts:1755](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1755)

## Properties

### color?

> `optional` **color**: \[`number`, `number`, `number`\]

Defined in: [src/components.d.ts:1760](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1760)

Color for the terrain (if no texture is provided). [r, g, b] with values 0-255.

#### Default

```ts
[255, 255, 255]
```

***

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:1765](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1765)

ColorMap for elevation data visualization. Only relevant when no texture is set.

#### Default

```ts
null
```

***

### elevationScale?

> `optional` **elevationScale**: `number`

Defined in: [src/components.d.ts:1770](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1770)

Elevation exaggeration factor.

#### Default

```ts
1.0
```

***

### forceProjection?

> `optional` **forceProjection**: `boolean`

Defined in: [src/components.d.ts:1775](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1775)

Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys

#### Default

```ts
false
```

***

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1780](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1780)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1785](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1785)

Maximum zoom level.

#### Default

```ts
24
```

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:1790](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1790)

Mesh error tolerance in meters (Martini). Smaller values = more detailed mesh, but slower.

#### Default

```ts
4.0
```

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:1795](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1795)

Minimum zoom level.

#### Default

```ts
0
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:1800](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1800)

NoData value to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1810](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1810)

Opacity of the terrain layer (0–1).

#### Default

```ts
1
```

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:1815](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1815)

Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)

#### Default

```ts
null
```

***

### renderMode?

> `optional` **renderMode**: `"terrain"` \| `"colormap"`

Defined in: [src/components.d.ts:1820](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1820)

Rendering mode for GeoTIFF terrain.

#### Default

```ts
terrain
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:1825](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1825)

Optional texture URL (can be an image or tile URL).

#### Default

```ts
null
```

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:1830](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1830)

Tile size in pixels.

#### Default

```ts
256
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1835](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1835)

URL to the GeoTIFF file containing elevation data.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:1840](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1840)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1845](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1845)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:1850](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1850)

Enable wireframe mode (show only mesh lines).

#### Default

```ts
false
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1855](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1855)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1805](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L1805)

Fired when the terrain layer is ready.
 ready

#### Parameters

##### event

[`VMapLayerTerrainGeotiffCustomEvent`](../../../interfaces/VMapLayerTerrainGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
