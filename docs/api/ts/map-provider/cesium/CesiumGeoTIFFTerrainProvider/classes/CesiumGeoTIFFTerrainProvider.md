[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/cesium/CesiumGeoTIFFTerrainProvider](../README.md) / CesiumGeoTIFFTerrainProvider

# Class: CesiumGeoTIFFTerrainProvider

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:19](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L19)

Custom Cesium Terrain Provider for GeoTIFF elevation data

This provider loads a GeoTIFF file containing elevation data and provides
it to Cesium's terrain system as a heightmap.

## Constructors

### Constructor

> **new CesiumGeoTIFFTerrainProvider**(`options`): `CesiumGeoTIFFTerrainProvider`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:35](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L35)

#### Parameters

##### options

[`CesiumGeoTIFFTerrainProviderOptions`](../interfaces/CesiumGeoTIFFTerrainProviderOptions.md)

#### Returns

`CesiumGeoTIFFTerrainProvider`

## Accessors

### availability

#### Get Signature

> **get** **availability**(): `any`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:224](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L224)

Get the availability of tiles

##### Returns

`any`

***

### credit

#### Get Signature

> **get** **credit**(): `any`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:248](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L248)

Get the credit to display

##### Returns

`any`

***

### errorEvent

#### Get Signature

> **get** **errorEvent**(): `any`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:269](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L269)

Get the error event

##### Returns

`any`

***

### hasVertexNormals

#### Get Signature

> **get** **hasVertexNormals**(): `boolean`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:262](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L262)

Check if the provider has vertex normals

##### Returns

`boolean`

***

### hasWaterMask

#### Get Signature

> **get** **hasWaterMask**(): `boolean`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:255](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L255)

Check if the provider has water mask

##### Returns

`boolean`

***

### readyPromise

#### Get Signature

> **get** **readyPromise**(): `Promise`\<`boolean`\>

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:241](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L241)

Check if the provider is ready

##### Returns

`Promise`\<`boolean`\>

***

### rectangle

#### Get Signature

> **get** **rectangle**(): `any`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:98](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L98)

Get the coverage rectangle in WGS84 coordinates

##### Returns

`any`

## Methods

### getTilingScheme()

> **getTilingScheme**(): `any`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:234](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L234)

Get the tiling scheme

#### Returns

`any`

***

### requestTileGeometry()

> **requestTileGeometry**(`x`, `y`, `level`): `Promise`\<`any`\>

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:110](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L110)

Request tile geometry for a specific tile

#### Parameters

##### x

`number`

##### y

`number`

##### level

`number`

#### Returns

`Promise`\<`any`\>
