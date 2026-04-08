[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:285](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L285)

## Properties

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:289](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L289)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:293](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L293)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:298](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L298)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:303](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L303)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:308](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L308)

Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server.

#### Default

```ts
'https://tile.openstreetmap.org'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:313](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L313)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:318](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L318)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```
