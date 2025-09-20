[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:686](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L686)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:696](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L696)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:700](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L700)

#### Default

```ts
'https://tile.openstreetmap.org'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:705](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L705)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:709](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L709)

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:691](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L691)

Wird ausgelöst, wenn der OSM-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerOsmCustomEvent`](../../../interfaces/VMapLayerOsmCustomEvent.md)\<`void`\>

#### Returns

`void`
