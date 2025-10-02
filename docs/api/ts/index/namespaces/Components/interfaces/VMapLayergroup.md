[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayergroup

# Interface: VMapLayergroup

Defined in: [src/components.d.ts:487](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L487)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`, `layerElementId?`) => `Promise`\<`string`\>

Defined in: [src/components.d.ts:492](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L492)

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

Defined in: [src/components.d.ts:497](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L497)

Base map identifier for this layer group. When set, layers in this group will be treated as base map layers.

#### Default

```ts
null
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:502](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L502)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:507](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L507)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
