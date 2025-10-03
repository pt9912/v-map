[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayergroup

# Interface: VMapLayergroup

Defined in: [src/components.d.ts:666](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L666)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`, `layerElementId?`) => `Promise`\<`string`\>

Defined in: [src/components.d.ts:671](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L671)

Fügt ein Kind-Layer zur Gruppe hinzu.

#### Parameters

##### layerConfig

[`LayerConfig`](../../../../types/layerconfig/type-aliases/LayerConfig.md)

##### layerElementId?

`string`

#### Returns

`Promise`\<`string`\>

***

### basemapid

> **basemapid**: `string`

Defined in: [src/components.d.ts:676](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L676)

Base map identifier for this layer group. When set, layers in this group will be treated as base map layers.

#### Default

```ts
null
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:681](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L681)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:686](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L686)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
