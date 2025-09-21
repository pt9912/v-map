[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:711](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L711)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:715](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L715)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getFillColor?

> `optional` **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:720](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L720)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius?

> `optional` **getRadius**: `number`

Defined in: [src/components.d.ts:725](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L725)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:735](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L735)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:739](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L739)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:744](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L744)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:730](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L730)

Wird ausgelöst, sobald der Scatterplot registriert wurde.
 ready

#### Parameters

##### event

[`VMapLayerScatterplotCustomEvent`](../../../interfaces/VMapLayerScatterplotCustomEvent.md)\<`void`\>

#### Returns

`void`
