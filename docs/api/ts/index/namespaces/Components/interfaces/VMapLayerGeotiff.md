[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGeotiff

# Interface: VMapLayerGeotiff

Defined in: [src/components.d.ts:170](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L170)

## Properties

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:174](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L174)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:179](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L179)

Opazität der GeoTIFF-Kacheln (0–1).

#### Default

```ts
1
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:184](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L184)

URL to the GeoTIFF file to be displayed on the map.

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:189](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L189)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:194](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L194)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
