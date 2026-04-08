[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:326](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L326)

## Properties

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:330](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L330)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:334](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L334)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:339](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L339)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:344](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L344)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:349](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L349)

Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server.

#### Default

```ts
'https://tile.openstreetmap.org'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:354](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L354)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:359](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L359)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```
