[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:1165](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1165)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1175](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1175)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1180](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1180)

URL to the GeoTIFF file to be displayed on the map.

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1185](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1185)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1190](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1190)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1170](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1170)

Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerGeotiffCustomEvent`](../../../interfaces/VMapLayerGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
