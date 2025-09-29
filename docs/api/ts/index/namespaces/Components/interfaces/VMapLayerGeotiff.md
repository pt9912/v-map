[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:168](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L168)

## Properties

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:172](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L172)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:177](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L177)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:182](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L182)

URL to the GeoTIFF file to be displayed on the map.

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:187](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L187)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:192](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L192)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
