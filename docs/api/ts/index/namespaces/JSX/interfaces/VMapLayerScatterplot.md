[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:1412](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1412)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:1416](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1416)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getFillColor?

> `optional` **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:1421](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1421)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius?

> `optional` **getRadius**: `number`

Defined in: [src/components.d.ts:1426](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1426)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1436](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1436)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1440](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1440)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1445](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1445)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1431](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L1431)

Wird ausgelöst, sobald der Scatterplot registriert wurde.
 ready

#### Parameters

##### event

[`VMapLayerScatterplotCustomEvent`](../../../interfaces/VMapLayerScatterplotCustomEvent.md)\<`void`\>

#### Returns

`void`
