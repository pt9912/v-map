[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:1022](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1022)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1032](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1032)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1037](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1037)

Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server.

#### Default

```ts
'https://tile.openstreetmap.org'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1042](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1042)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1047](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1047)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1027](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1027)

Wird ausgelöst, wenn der OSM-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerOsmCustomEvent`](../../../interfaces/VMapLayerOsmCustomEvent.md)\<`void`\>

#### Returns

`void`
