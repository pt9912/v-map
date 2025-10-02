[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/cesium/CesiumLayerGroups](../README.md) / CesiumLayerGroups

# Class: CesiumLayerGroups

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:123](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L123)

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

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:127](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L127)

##### Returns

readonly [`CesiumLayerGroup`](CesiumLayerGroup.md)[]

## Methods

### addLayerToGroup()

> **addLayerToGroup**(`groupId`, `ref`): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:146](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L146)

#### Parameters

##### groupId

`string`

##### ref

`CesiumLayerRef`

#### Returns

`void`

***

### apply()

> **apply**(): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:179](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L179)

Wendet alle Gruppenregeln an (sichtbar/basemap).

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:185](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L185)

#### Returns

`void`

***

### ensureGroup()

> **ensureGroup**(`id`, `visible`): [`CesiumLayerGroup`](CesiumLayerGroup.md)

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:137](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L137)

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

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:130](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L130)

#### Parameters

##### id

`string`

#### Returns

[`CesiumLayerGroup`](CesiumLayerGroup.md)

***

### hasGroup()

> **hasGroup**(`id`): `boolean`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:133](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L133)

#### Parameters

##### id

`string`

#### Returns

`boolean`

***

### removeLayer()

> **removeLayer**(`layerId`, `removeFromAll`): `boolean`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:152](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L152)

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

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:171](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L171)

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

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:164](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/map-provider/cesium/CesiumLayerGroups.ts#L164)

#### Parameters

##### groupId

`string`

##### visible

`boolean`

#### Returns

`void`
