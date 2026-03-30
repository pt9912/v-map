[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayergroup

# Interface: VMapLayergroup

Defined in: [src/components.d.ts:886](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L886)

## Properties

### basemapid

> **basemapid**: `string`

Defined in: [src/components.d.ts:891](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L891)

Base map identifier for this layer group. When set, layers in this group will be treated as base map layers.

#### Default

```ts
null
```

***

### getGroupId()

> **getGroupId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:895](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L895)

Returns the internal group identifier used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:900](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L900)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:905](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L905)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
