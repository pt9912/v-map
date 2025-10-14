[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:1170](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1170)

## Properties

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:1175](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1175)

ColorMap für die Visualisierung (kann entweder ein vordefinierter Name oder eine GeoStyler ColorMap sein).

#### Default

```ts
null
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:1180](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1180)

NoData Values to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1190](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1190)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1195](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1195)

URL to the GeoTIFF file to be displayed on the map.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:1200](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1200)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1205](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1205)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1210](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1210)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1185](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1185)

Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerGeotiffCustomEvent`](../../../interfaces/VMapLayerGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
