[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayergroup

# Interface: VMapLayergroup

Defined in: [src/components.d.ts:927](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L927)

## Properties

### basemapid

> **basemapid**: `string`

Defined in: [src/components.d.ts:932](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L932)

Base map identifier for this layer group. When set, layers in this group will be treated as base map layers.

#### Default

```ts
null
```

***

### getGroupId()

> **getGroupId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:936](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L936)

Returns the internal group identifier used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:941](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L941)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:946](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L946)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
