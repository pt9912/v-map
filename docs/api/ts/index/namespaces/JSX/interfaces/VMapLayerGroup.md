[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGroup

# Interface: VMapLayerGroup

Defined in: [src/components.d.ts:664](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L664)

## Properties

### basemap?

> `optional` **basemap**: `boolean`

Defined in: [src/components.d.ts:669](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L669)

Kennzeichnet diese Gruppe als Basis-Kartenebene (exklusiv sichtbar).

#### Default

```ts
false
```

***

### groupId?

> `optional` **groupId**: `string`

Defined in: [src/components.d.ts:674](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L674)

Eindeutige Gruppen-ID (z. B. für programmatisches Umschalten).

#### Default

```ts
Math.random().toString(36).slice(2, 11)
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:679](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L679)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:684](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L684)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
