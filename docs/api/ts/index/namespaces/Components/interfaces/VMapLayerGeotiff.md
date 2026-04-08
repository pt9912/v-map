[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:171](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L171)

## Properties

### colorMap?

> `optional` **colorMap**: `string` \| [`GeoStylerColorMap`](../../../interfaces/GeoStylerColorMap.md)

Defined in: [src/components.d.ts:176](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L176)

ColorMap für die Visualisierung (kann entweder ein vordefinierter Name oder eine GeoStyler ColorMap sein).

#### Default

```ts
null
```

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:180](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L180)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:184](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L184)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:189](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L189)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/components.d.ts:194](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L194)

NoData Values to discard (overriding any nodata values in the metadata).

#### Default

```ts
null
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:199](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L199)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:204](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L204)

URL to the GeoTIFF file to be displayed on the map.

#### Default

```ts
null
```

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/components.d.ts:209](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L209)

Value range for colormap normalization [min, max].

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:214](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L214)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:219](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L219)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
100
```
