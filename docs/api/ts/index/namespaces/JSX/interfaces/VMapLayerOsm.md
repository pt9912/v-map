[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:613](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L613)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:623](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L623)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:628](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L628)

Sichtbarkeit des Layers

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:618](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L618)

Wird ausgelöst, wenn der OSM-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerOsmCustomEvent`](../../../interfaces/VMapLayerOsmCustomEvent.md)\<`void`\>

#### Returns

`void`
