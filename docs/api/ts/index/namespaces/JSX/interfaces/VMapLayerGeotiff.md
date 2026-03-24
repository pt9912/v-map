[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:1285](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1285)

## Properties

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:1290](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1290)

ColorMap für die Visualisierung (kann entweder ein vordefinierter Name oder eine GeoStyler ColorMap sein).

#### Default

```ts
null
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:1295](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1295)

NoData Values to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1305](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1305)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1310](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1310)

URL to the GeoTIFF file to be displayed on the map.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:1315](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1315)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1320](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1320)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1325](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1325)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1300](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1300)

Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerGeotiffCustomEvent`](../../../interfaces/VMapLayerGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
