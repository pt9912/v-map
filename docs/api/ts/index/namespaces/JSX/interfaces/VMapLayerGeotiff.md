[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:1283](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1283)

## Properties

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:1288](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1288)

ColorMap für die Visualisierung (kann entweder ein vordefinierter Name oder eine GeoStyler ColorMap sein).

#### Default

```ts
null
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:1293](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1293)

NoData Values to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1303](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1303)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1308](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1308)

URL to the GeoTIFF file to be displayed on the map.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:1313](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1313)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1318](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1318)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1323](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1323)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1298](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1298)

Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerGeotiffCustomEvent`](../../../interfaces/VMapLayerGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
