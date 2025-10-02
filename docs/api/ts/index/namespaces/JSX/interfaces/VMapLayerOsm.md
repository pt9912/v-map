[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:1026](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1026)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1036](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1036)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1041](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1041)

Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server.

#### Default

```ts
'https://tile.openstreetmap.org'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1046](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1046)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1051](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1051)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1031](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1031)

Wird ausgelöst, wenn der OSM-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerOsmCustomEvent`](../../../interfaces/VMapLayerOsmCustomEvent.md)\<`void`\>

#### Returns

`void`
