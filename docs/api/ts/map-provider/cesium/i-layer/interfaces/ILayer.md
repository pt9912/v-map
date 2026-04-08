[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/cesium/i-layer](../index.md) / ILayer

# Interface: ILayer

Defined in: [src/map-provider/cesium/i-layer.ts:1](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/cesium/i-layer.ts#L1)

## Extended by

- [`I3DTilesLayer`](../../CesiumLayerGroups/interfaces/I3DTilesLayer.md)

## Methods

### getOpacity()

> **getOpacity**(): `number`

Defined in: [src/map-provider/cesium/i-layer.ts:6](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/cesium/i-layer.ts#L6)

#### Returns

`number`

***

### getOptions()

> **getOptions**(): `Record`\<`string`, `unknown`\>

Defined in: [src/map-provider/cesium/i-layer.ts:2](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/cesium/i-layer.ts#L2)

#### Returns

`Record`\<`string`, `unknown`\>

***

### getVisible()

> **getVisible**(): `boolean`

Defined in: [src/map-provider/cesium/i-layer.ts:4](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/cesium/i-layer.ts#L4)

#### Returns

`boolean`

***

### getZIndex()

> **getZIndex**(): `number`

Defined in: [src/map-provider/cesium/i-layer.ts:8](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/cesium/i-layer.ts#L8)

#### Returns

`number`

***

### remove()

> **remove**(): `void`

Defined in: [src/map-provider/cesium/i-layer.ts:10](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/cesium/i-layer.ts#L10)

#### Returns

`void`

***

### setOpacity()

> **setOpacity**(`value`): `void`

Defined in: [src/map-provider/cesium/i-layer.ts:7](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/cesium/i-layer.ts#L7)

#### Parameters

##### value

`number`

#### Returns

`void`

***

### setOptions()

> **setOptions**(`options`): `void`

Defined in: [src/map-provider/cesium/i-layer.ts:3](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/cesium/i-layer.ts#L3)

#### Parameters

##### options

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### setVisible()

> **setVisible**(`value`): `void`

Defined in: [src/map-provider/cesium/i-layer.ts:5](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/cesium/i-layer.ts#L5)

#### Parameters

##### value

`boolean`

#### Returns

`void`

***

### setZIndex()

> **setZIndex**(`zIndex`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/i-layer.ts:9](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/cesium/i-layer.ts#L9)

#### Parameters

##### zIndex

`number`

#### Returns

`Promise`\<`void`\>
