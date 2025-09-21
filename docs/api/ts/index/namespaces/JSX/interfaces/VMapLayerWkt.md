[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:746](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L746)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:756](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L756)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:760](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L760)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:765](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L765)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:769](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L769)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:751](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L751)

Signalisiert, dass das WKT-Layer initialisiert ist.
 ready

#### Parameters

##### event

[`VMapLayerWktCustomEvent`](../../../interfaces/VMapLayerWktCustomEvent.md)\<`void`\>

#### Returns

`void`
