[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:1385](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L1385)

## Properties

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1395](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L1395)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1400](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L1400)

Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server.

#### Default

```ts
'https://tile.openstreetmap.org'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1405](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L1405)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1410](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L1410)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1390](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L1390)

Wird ausgelöst, wenn der OSM-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerOsmCustomEvent`](../../../interfaces/VMapLayerOsmCustomEvent.md)\<`void`\>

#### Returns

`void`
