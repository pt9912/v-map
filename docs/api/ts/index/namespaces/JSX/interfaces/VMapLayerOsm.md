[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:1135](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1135)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1145](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1145)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1150](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1150)

Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server.

#### Default

```ts
'https://tile.openstreetmap.org'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1155](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1155)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1160](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1160)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1140](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1140)

Wird ausgelöst, wenn der OSM-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerOsmCustomEvent`](../../../interfaces/VMapLayerOsmCustomEvent.md)\<`void`\>

#### Returns

`void`
