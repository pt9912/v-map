[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:1525](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1525)

## Properties

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1530](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1530)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1540](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1540)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1545](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1545)

Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server.

#### Default

```ts
'https://tile.openstreetmap.org'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1550](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1550)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1555](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1555)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1535](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1535)

Wird ausgelöst, wenn der OSM-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerOsmCustomEvent`](../../../interfaces/VMapLayerOsmCustomEvent.md)\<`void`\>

#### Returns

`void`
