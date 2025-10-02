[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:277](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L277)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:281](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L281)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getFillColor

> **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:286](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L286)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius

> **getRadius**: `number`

Defined in: [src/components.d.ts:291](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L291)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:296](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L296)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:300](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L300)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:305](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L305)

Sichtbarkeit des Layers.

#### Default

```ts
true
```
