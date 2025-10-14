[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:1299](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1299)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:1303](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1303)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getFillColor?

> `optional` **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:1308](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1308)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius?

> `optional` **getRadius**: `number`

Defined in: [src/components.d.ts:1313](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1313)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1323](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1323)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1327](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1327)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1332](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1332)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1318](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1318)

Wird ausgelöst, sobald der Scatterplot registriert wurde.
 ready

#### Parameters

##### event

[`VMapLayerScatterplotCustomEvent`](../../../interfaces/VMapLayerScatterplotCustomEvent.md)\<`void`\>

#### Returns

`void`
