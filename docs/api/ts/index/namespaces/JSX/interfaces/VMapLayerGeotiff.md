[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:597](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L597)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:607](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L607)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:611](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L611)

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:616](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L616)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:620](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L620)

#### Default

```ts
1000
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:602](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L602)

Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerGeotiffCustomEvent`](../../../interfaces/VMapLayerGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
