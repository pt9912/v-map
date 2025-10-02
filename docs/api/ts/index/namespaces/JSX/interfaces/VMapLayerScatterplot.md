[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:1162](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1162)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:1166](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1166)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getFillColor?

> `optional` **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:1171](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1171)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius?

> `optional` **getRadius**: `number`

Defined in: [src/components.d.ts:1176](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1176)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1186](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1186)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1190](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1190)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1195](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1195)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1181](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1181)

Wird ausgelöst, sobald der Scatterplot registriert wurde.
 ready

#### Parameters

##### event

[`VMapLayerScatterplotCustomEvent`](../../../interfaces/VMapLayerScatterplotCustomEvent.md)\<`void`\>

#### Returns

`void`
