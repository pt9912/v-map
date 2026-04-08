[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:212](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L212)

## Properties

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:217](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L217)

ColorMap für die Visualisierung (kann entweder ein vordefinierter Name oder eine GeoStyler ColorMap sein).

#### Default

```ts
null
```

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:221](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L221)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:225](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L225)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:230](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L230)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:235](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L235)

NoData Values to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:240](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L240)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:245](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L245)

URL to the GeoTIFF file to be displayed on the map.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:250](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L250)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:255](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L255)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:260](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L260)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```
