[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerScatterplot

# Interface: VMapLayerScatterplot

Defined in: [src/components.d.ts:320](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L320)

## Properties

### data?

> `optional` **data**: `string`

Defined in: [src/components.d.ts:324](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L324)

Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt.

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:328](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L328)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### getFillColor

> **getFillColor**: [`Color`](../../../type-aliases/Color.md)

Defined in: [src/components.d.ts:333](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L333)

Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig).

#### Default

```ts
'#3388ff'
```

***

### getRadius

> **getRadius**: `number`

Defined in: [src/components.d.ts:338](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L338)

Funktion/konstanter Wert für den Punkt-Radius.

#### Default

```ts
4
```

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:343](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L343)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:348](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L348)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:352](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L352)

Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:357](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L357)

Sichtbarkeit des Layers.

#### Default

```ts
true
```
