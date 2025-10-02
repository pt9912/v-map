[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:172](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L172)

## Properties

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:176](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L176)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:181](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L181)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:186](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L186)

URL to the GeoTIFF file to be displayed on the map.

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:191](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L191)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:196](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L196)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
