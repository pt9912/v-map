[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayergroup

# Interface: VMapLayergroup

Defined in: [src/components.d.ts:465](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L465)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`, `layerElementId?`) => `Promise`\<`string`\>

Defined in: [src/components.d.ts:470](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L470)

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

Defined in: [src/components.d.ts:475](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L475)

Base map identifier for this layer group. When set, layers in this group will be treated as base map layers.

#### Default

```ts
null
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:480](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L480)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:485](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L485)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
