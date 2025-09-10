[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:665](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L665)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:675](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L675)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:679](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L679)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:684](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L684)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:688](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L688)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:670](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L670)

Signalisiert, dass das WKT-Layer initialisiert ist.
 ready

#### Parameters

##### event

[`VMapLayerWktCustomEvent`](../../../interfaces/VMapLayerWktCustomEvent.md)\<`void`\>

#### Returns

`void`
