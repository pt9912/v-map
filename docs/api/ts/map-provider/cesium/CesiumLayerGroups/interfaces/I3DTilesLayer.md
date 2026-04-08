[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/cesium/CesiumLayerGroups](../index.md) / I3DTilesLayer

# Interface: I3DTilesLayer

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:6](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L6)

## Extends

- [`ILayer`](../../i-layer/interfaces/ILayer.md)

## Methods

### getOpacity()

> **getOpacity**(): `number`

Defined in: [src/map-provider/cesium/i-layer.ts:6](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/i-layer.ts#L6)

#### Returns

`number`

#### Inherited from

[`ILayer`](../../i-layer/interfaces/ILayer.md).[`getOpacity`](../../i-layer/interfaces/ILayer.md#getopacity)

***

### getOptions()

> **getOptions**(): `Record`\<`string`, `unknown`\>

Defined in: [src/map-provider/cesium/i-layer.ts:2](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/i-layer.ts#L2)

#### Returns

`Record`\<`string`, `unknown`\>

#### Inherited from

[`ILayer`](../../i-layer/interfaces/ILayer.md).[`getOptions`](../../i-layer/interfaces/ILayer.md#getoptions)

***

### getVisible()

> **getVisible**(): `boolean`

Defined in: [src/map-provider/cesium/i-layer.ts:4](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/i-layer.ts#L4)

#### Returns

`boolean`

#### Inherited from

[`ILayer`](../../i-layer/interfaces/ILayer.md).[`getVisible`](../../i-layer/interfaces/ILayer.md#getvisible)

***

### getZIndex()

> **getZIndex**(): `number`

Defined in: [src/map-provider/cesium/i-layer.ts:8](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/i-layer.ts#L8)

#### Returns

`number`

#### Inherited from

[`ILayer`](../../i-layer/interfaces/ILayer.md).[`getZIndex`](../../i-layer/interfaces/ILayer.md#getzindex)

***

### remove()

> **remove**(): `void`

Defined in: [src/map-provider/cesium/i-layer.ts:10](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/i-layer.ts#L10)

#### Returns

`void`

#### Inherited from

[`ILayer`](../../i-layer/interfaces/ILayer.md).[`remove`](../../i-layer/interfaces/ILayer.md#remove)

***

### setColor()

> **setColor**(`color`, `opacity?`): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:7](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L7)

#### Parameters

##### color

`string` | `Color`

##### opacity?

`number`

#### Returns

`void`

***

### setOpacity()

> **setOpacity**(`value`): `void`

Defined in: [src/map-provider/cesium/i-layer.ts:7](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/i-layer.ts#L7)

#### Parameters

##### value

`number`

#### Returns

`void`

#### Inherited from

[`ILayer`](../../i-layer/interfaces/ILayer.md).[`setOpacity`](../../i-layer/interfaces/ILayer.md#setopacity)

***

### setOptions()

> **setOptions**(`options`): `void`

Defined in: [src/map-provider/cesium/i-layer.ts:3](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/i-layer.ts#L3)

#### Parameters

##### options

`Record`\<`string`, `unknown`\>

#### Returns

`void`

#### Inherited from

[`ILayer`](../../i-layer/interfaces/ILayer.md).[`setOptions`](../../i-layer/interfaces/ILayer.md#setoptions)

***

### setStyle()

> **setStyle**(`style`): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:8](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L8)

#### Parameters

##### style

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### setVisible()

> **setVisible**(`value`): `void`

Defined in: [src/map-provider/cesium/i-layer.ts:5](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/i-layer.ts#L5)

#### Parameters

##### value

`boolean`

#### Returns

`void`

#### Inherited from

[`ILayer`](../../i-layer/interfaces/ILayer.md).[`setVisible`](../../i-layer/interfaces/ILayer.md#setvisible)

***

### setZIndex()

> **setZIndex**(`zIndex`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/i-layer.ts:9](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/i-layer.ts#L9)

#### Parameters

##### zIndex

`number`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`ILayer`](../../i-layer/interfaces/ILayer.md).[`setZIndex`](../../i-layer/interfaces/ILayer.md#setzindex)
