[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGroup

# Interface: VMapLayerGroup

Defined in: [src/components.d.ts:157](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L157)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`) => `Promise`\<`string`\>

Defined in: [src/components.d.ts:162](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L162)

Fügt ein Kind-Layer zur Gruppe hinzu.

#### Parameters

##### layerConfig

[`LayerConfig`](../../../../types/layerconfig/type-aliases/LayerConfig.md)

#### Returns

`Promise`\<`string`\>

***

### basemap

> **basemap**: `boolean`

Defined in: [src/components.d.ts:167](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L167)

Kennzeichnet diese Gruppe als Basis-Kartenebene (exklusiv sichtbar).

#### Default

```ts
false
```

***

### groupId

> **groupId**: `string`

Defined in: [src/components.d.ts:172](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L172)

Eindeutige Gruppen-ID (z. B. für programmatisches Umschalten).

#### Default

```ts
Math.random().toString(36).slice(2, 11)
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:177](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L177)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:182](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L182)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
