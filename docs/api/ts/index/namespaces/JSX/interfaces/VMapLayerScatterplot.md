[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:962](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L962)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:966](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L966)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getFillColor?

> `optional` **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:971](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L971)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius?

> `optional` **getRadius**: `number`

Defined in: [src/components.d.ts:976](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L976)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:986](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L986)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:990](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L990)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:995](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L995)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:981](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L981)

Wird ausgelöst, sobald der Scatterplot registriert wurde.
 ready

#### Parameters

##### event

[`VMapLayerScatterplotCustomEvent`](../../../interfaces/VMapLayerScatterplotCustomEvent.md)\<`void`\>

#### Returns

`void`
