[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:182](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L182)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:186](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L186)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getFillColor

> **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:191](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L191)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius

> **getRadius**: `number`

Defined in: [src/components.d.ts:196](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L196)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:201](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L201)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:205](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L205)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:210](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L210)

Sichtbarkeit des Layers.

#### Default

```ts
true
```
