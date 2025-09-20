[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:205](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L205)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:209](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L209)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getFillColor

> **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:214](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L214)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius

> **getRadius**: `number`

Defined in: [src/components.d.ts:219](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L219)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:224](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L224)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:228](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L228)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:233](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L233)

Sichtbarkeit des Layers.

#### Default

```ts
true
```
