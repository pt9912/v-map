[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/cesium/CesiumGeoTIFFTerrainProvider](../README.md) / CesiumGeoTIFFTerrainProvider

# Class: CesiumGeoTIFFTerrainProvider

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:22](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L22)

Custom Cesium Terrain Provider for GeoTIFF elevation data

This provider loads a GeoTIFF file containing elevation data and provides
it to Cesium's terrain system as a heightmap.

## Implements

- `TerrainProvider`

## Constructors

### Constructor

> **new CesiumGeoTIFFTerrainProvider**(`options`): `CesiumGeoTIFFTerrainProvider`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:39](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L39)

#### Parameters

##### options

[`CesiumGeoTIFFTerrainProviderOptions`](../interfaces/CesiumGeoTIFFTerrainProviderOptions.md)

#### Returns

`CesiumGeoTIFFTerrainProvider`

## Properties

### tilingScheme

> **tilingScheme**: `TilingScheme`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:37](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L37)

Gets the tiling scheme used by the provider.

#### Implementation of

`TerrainProvider.tilingScheme`

## Accessors

### availability

#### Get Signature

> **get** **availability**(): `any`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:266](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L266)

Get the availability of tiles

##### Returns

`any`

#### Implementation of

`TerrainProvider.availability`

***

### credit

#### Get Signature

> **get** **credit**(): `any`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:346](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L346)

Get the credit to display

##### Returns

`any`

#### Implementation of

`TerrainProvider.credit`

***

### errorEvent

#### Get Signature

> **get** **errorEvent**(): `any`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:367](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L367)

Get the error event

##### Returns

`any`

#### Implementation of

`TerrainProvider.errorEvent`

***

### hasVertexNormals

#### Get Signature

> **get** **hasVertexNormals**(): `boolean`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:360](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L360)

Check if the provider has vertex normals

##### Returns

`boolean`

#### Implementation of

`TerrainProvider.hasVertexNormals`

***

### hasWaterMask

#### Get Signature

> **get** **hasWaterMask**(): `boolean`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:353](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L353)

Check if the provider has water mask

##### Returns

`boolean`

#### Implementation of

`TerrainProvider.hasWaterMask`

***

### readyPromise

#### Get Signature

> **get** **readyPromise**(): `Promise`\<`boolean`\>

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:339](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L339)

Check if the provider is ready

##### Returns

`Promise`\<`boolean`\>

***

### rectangle

#### Get Signature

> **get** **rectangle**(): `any`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:106](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L106)

Get the coverage rectangle in WGS84 coordinates

##### Returns

`any`

## Methods

### getLevelMaximumGeometricError()

> **getLevelMaximumGeometricError**(`level`): `number`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:287](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L287)

Get the maximum geometric error allowed at a specific level
Required by Cesium's TerrainProvider interface

The geometric error is the difference (in meters) between the actual terrain
and the terrain approximation at this level. Higher levels have lower error.

#### Parameters

##### level

`number`

#### Returns

`number`

#### Implementation of

`TerrainProvider.getLevelMaximumGeometricError`

***

### getTileDataAvailable()

> **getTileDataAvailable**(`x`, `y`, `level`): `boolean`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:309](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L309)

Check if tile data is available for a specific tile
Required by Cesium's TerrainProvider interface

#### Parameters

##### x

`number`

##### y

`number`

##### level

`number`

#### Returns

`boolean`

#### Implementation of

`TerrainProvider.getTileDataAvailable`

***

### getTilingScheme()

> **getTilingScheme**(): `TilingScheme`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:276](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L276)

Get the tiling scheme

#### Returns

`TilingScheme`

***

### loadTileDataAvailability()

> **loadTileDataAvailability**(`_x`, `_y`, `_level`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:297](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L297)

Makes sure we load availability data for a tile

#### Parameters

##### \_x

`number`

##### \_y

`number`

##### \_level

`number`

#### Returns

`Promise`\<`void`\>

Undefined if nothing need to be loaded or a Promise that resolves when all required tiles are loaded

#### Implementation of

`TerrainProvider.loadTileDataAvailability`

***

### requestTileGeometry()

> **requestTileGeometry**(`x`, `y`, `level`): `Promise`\<`TerrainData`\>

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:118](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L118)

Request tile geometry for a specific tile

#### Parameters

##### x

`number`

##### y

`number`

##### level

`number`

#### Returns

`Promise`\<`TerrainData`\>

#### Implementation of

`TerrainProvider.requestTileGeometry`
