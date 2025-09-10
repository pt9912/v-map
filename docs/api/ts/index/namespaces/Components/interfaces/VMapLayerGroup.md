[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGroup

# Interface: VMapLayerGroup

Defined in: [src/components.d.ts:139](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L139)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:144](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L144)

Fügt ein Kind-Layer zur Gruppe hinzu.

#### Parameters

##### layerConfig

[`LayerConfig`](../../../../types/layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`void`\>

***

### basemap

> **basemap**: `boolean`

Defined in: [src/components.d.ts:149](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L149)

Kennzeichnet diese Gruppe als Basis-Kartenebene (exklusiv sichtbar).

#### Default

```ts
false
```

***

### groupId

> **groupId**: `string`

Defined in: [src/components.d.ts:154](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L154)

Eindeutige Gruppen-ID (z. B. für programmatisches Umschalten).

#### Default

```ts
Math.random().toString(36).slice(2, 11)
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:159](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L159)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:164](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L164)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
