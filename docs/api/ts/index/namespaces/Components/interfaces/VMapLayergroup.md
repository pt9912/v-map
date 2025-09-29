[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayergroup

# Interface: VMapLayergroup

Defined in: [src/components.d.ts:483](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L483)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`, `layerElementId?`) => `Promise`\<`string`\>

Defined in: [src/components.d.ts:488](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L488)

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

Defined in: [src/components.d.ts:493](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L493)

Base map identifier for this layer group. When set, layers in this group will be treated as base map layers.

#### Default

```ts
null
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:498](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L498)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:503](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L503)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
