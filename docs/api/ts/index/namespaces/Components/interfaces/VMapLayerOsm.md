[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:251](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L251)

## Properties

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:255](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L255)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:260](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L260)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:265](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L265)

Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server.

#### Default

```ts
'https://tile.openstreetmap.org'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:270](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L270)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:275](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L275)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```
