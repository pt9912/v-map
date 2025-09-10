[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGroup

# Interface: VMapLayerGroup

Defined in: [src/components.d.ts:591](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L591)

## Properties

### basemap?

> `optional` **basemap**: `boolean`

Defined in: [src/components.d.ts:596](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L596)

Kennzeichnet diese Gruppe als Basis-Kartenebene (exklusiv sichtbar).

#### Default

```ts
false
```

***

### groupId?

> `optional` **groupId**: `string`

Defined in: [src/components.d.ts:601](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L601)

Eindeutige Gruppen-ID (z. B. für programmatisches Umschalten).

#### Default

```ts
Math.random().toString(36).slice(2, 11)
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:606](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L606)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:611](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L611)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
