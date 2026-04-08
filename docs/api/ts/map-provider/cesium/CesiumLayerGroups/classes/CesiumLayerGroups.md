[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/cesium/CesiumLayerGroups](../index.md) / CesiumLayerGroups

# Class: CesiumLayerGroups

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:123](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L123)

Root-Store für mehrere Cesium-Gruppen.
- Ordnung/Z-Index übernimmst du weiterhin im LayerManager pro Layer.
- Diese Klasse kümmert sich um Gruppensichtbarkeit & Basemap-Filter.

## Constructors

### Constructor

> **new CesiumLayerGroups**(): `CesiumLayerGroups`

#### Returns

`CesiumLayerGroups`

## Accessors

### groups

#### Get Signature

> **get** **groups**(): readonly [`CesiumLayerGroup`](CesiumLayerGroup.md)[]

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:127](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L127)

##### Returns

readonly [`CesiumLayerGroup`](CesiumLayerGroup.md)[]

## Methods

### addLayerToGroup()

> **addLayerToGroup**(`groupId`, `visible`, `ref`): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:146](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L146)

#### Parameters

##### groupId

`string`

##### visible

`boolean`

##### ref

`CesiumLayerRef`

#### Returns

`void`

***

### apply()

> **apply**(): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:183](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L183)

Wendet alle Gruppenregeln an (sichtbar/basemap).

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:189](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L189)

#### Returns

`void`

***

### ensureGroup()

> **ensureGroup**(`id`, `visible`): [`CesiumLayerGroup`](CesiumLayerGroup.md)

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:137](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L137)

#### Parameters

##### id

`string`

##### visible

`boolean` = `true`

#### Returns

[`CesiumLayerGroup`](CesiumLayerGroup.md)

***

### getGroup()

> **getGroup**(`id`): [`CesiumLayerGroup`](CesiumLayerGroup.md)

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:130](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L130)

#### Parameters

##### id

`string`

#### Returns

[`CesiumLayerGroup`](CesiumLayerGroup.md)

***

### hasGroup()

> **hasGroup**(`id`): `boolean`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:133](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L133)

#### Parameters

##### id

`string`

#### Returns

`boolean`

***

### removeLayer()

> **removeLayer**(`layerId`, `removeFromAll`): `boolean`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:156](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L156)

#### Parameters

##### layerId

`string`

##### removeFromAll

`boolean` = `true`

#### Returns

`boolean`

***

### setBasemap()

> **setBasemap**(`groupId`, `basemap`): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:175](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L175)

#### Parameters

##### groupId

`string`

##### basemap

`string`

#### Returns

`void`

***

### setGroupVisible()

> **setGroupVisible**(`groupId`, `visible`): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:168](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/cesium/CesiumLayerGroups.ts#L168)

#### Parameters

##### groupId

`string`

##### visible

`boolean`

#### Returns

`void`
