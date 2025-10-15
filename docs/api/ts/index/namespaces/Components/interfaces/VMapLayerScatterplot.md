[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:286](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L286)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:290](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L290)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getFillColor

> **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:295](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L295)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius

> **getRadius**: `number`

Defined in: [src/components.d.ts:300](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L300)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:305](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L305)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:309](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L309)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:314](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/components.d.ts#L314)

Sichtbarkeit des Layers.

#### Default

```ts
true
```
