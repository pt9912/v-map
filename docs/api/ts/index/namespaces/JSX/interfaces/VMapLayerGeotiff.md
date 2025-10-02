[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:1161](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1161)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1171](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1171)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1176](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1176)

URL to the GeoTIFF file to be displayed on the map.

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1181](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1181)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1186](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1186)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1166](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1166)

Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerGeotiffCustomEvent`](../../../interfaces/VMapLayerGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
