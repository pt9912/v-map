[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:1053](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1053)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:1057](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1057)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getFillColor?

> `optional` **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:1062](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1062)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius?

> `optional` **getRadius**: `number`

Defined in: [src/components.d.ts:1067](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1067)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1077](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1077)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1081](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1081)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1086](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1086)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1072](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1072)

Wird ausgelöst, sobald der Scatterplot registriert wurde.
 ready

#### Parameters

##### event

[`VMapLayerScatterplotCustomEvent`](../../../interfaces/VMapLayerScatterplotCustomEvent.md)\<`void`\>

#### Returns

`void`
