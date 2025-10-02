[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayergroup

# Interface: VMapLayergroup

Defined in: [src/components.d.ts:514](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L514)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`, `layerElementId?`) => `Promise`\<`string`\>

Defined in: [src/components.d.ts:519](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L519)

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

Defined in: [src/components.d.ts:524](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L524)

Base map identifier for this layer group. When set, layers in this group will be treated as base map layers.

#### Default

```ts
null
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:529](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L529)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:534](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L534)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
