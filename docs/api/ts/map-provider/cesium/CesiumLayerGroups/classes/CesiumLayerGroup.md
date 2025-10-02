[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/cesium/CesiumLayerGroups](../README.md) / CesiumLayerGroup

# Class: CesiumLayerGroup

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:29](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L29)

Eine Gruppe verwaltet Sichtbarkeit & Basemap-Filter ihrer Cesium-Layer.
- group.visible = false  => Alle Layer der Gruppe unsichtbar.
- group.basemap = "X"    => Nur Layer mit elementId==="X" in der Gruppe sichtbar.
- Der ursprüngliche Sichtbarkeitszustand jedes Layers wird gemerkt und bei
  Re-Aktivierung wiederhergestellt.

## Constructors

### Constructor

> **new CesiumLayerGroup**(`id`, `visible`): `CesiumLayerGroup`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:38](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L38)

#### Parameters

##### id

`string`

##### visible

`boolean` = `true`

#### Returns

`CesiumLayerGroup`

## Properties

### id

> `readonly` **id**: `string`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:30](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L30)

## Accessors

### basemap

#### Get Signature

> **get** **basemap**(): `string`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:52](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L52)

##### Returns

`string`

#### Set Signature

> **set** **basemap**(`b`): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:55](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L55)

##### Parameters

###### b

`string`

##### Returns

`void`

***

### visible

#### Get Signature

> **get** **visible**(): `boolean`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:43](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L43)

##### Returns

`boolean`

#### Set Signature

> **set** **visible**(`v`): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:46](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L46)

##### Parameters

###### v

`boolean`

##### Returns

`void`

## Methods

### addLayer()

> **addLayer**(`ref`): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:65](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L65)

#### Parameters

##### ref

`CesiumLayerRef`

#### Returns

`void`

***

### apply()

> **apply**(): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:95](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L95)

zentrale Logik: Basemap/Visibility anwenden

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:88](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L88)

#### Returns

`void`

***

### isDirty()

> **isDirty**(): `boolean`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:61](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L61)

#### Returns

`boolean`

***

### removeLayer()

> **removeLayer**(`layerId`): `boolean`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:81](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L81)

#### Parameters

##### layerId

`string`

#### Returns

`boolean`

***

### setLayerElementId()

> **setLayerElementId**(`layerId`, `elementId?`): `void`

Defined in: [src/map-provider/cesium/CesiumLayerGroups.ts:73](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/map-provider/cesium/CesiumLayerGroups.ts#L73)

optional zum Nachziehen von elementId (z. B. wenn erst später bekannt)

#### Parameters

##### layerId

`string`

##### elementId?

`string`

#### Returns

`void`
