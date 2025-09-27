[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:641](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L641)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:651](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L651)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:655](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L655)

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:660](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L660)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:664](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L664)

#### Default

```ts
1000
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:646](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L646)

Wird ausgelöst, wenn der GeoTIFF-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerGeotiffCustomEvent`](../../../interfaces/VMapLayerGeotiffCustomEvent.md)\<`void`\>

#### Returns

`void`
