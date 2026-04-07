[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/cesium/CesiumGeoTIFFTerrainProvider](../README.md) / CesiumGeoTIFFTerrainProvider

# Class: CesiumGeoTIFFTerrainProvider

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:25](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L25)

Custom Cesium Terrain Provider for GeoTIFF elevation data

This provider loads a GeoTIFF file containing elevation data and provides
it to Cesium's terrain system as a heightmap.

## Implements

- `TerrainProvider`

## Constructors

### Constructor

> **new CesiumGeoTIFFTerrainProvider**(`options`): `CesiumGeoTIFFTerrainProvider`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:42](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L42)

#### Parameters

##### options

[`CesiumGeoTIFFTerrainProviderOptions`](../interfaces/CesiumGeoTIFFTerrainProviderOptions.md)

#### Returns

`CesiumGeoTIFFTerrainProvider`

## Properties

### tilingScheme

> **tilingScheme**: `TilingScheme`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:40](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L40)

Gets the tiling scheme used by the provider.

#### Implementation of

`TerrainProvider.tilingScheme`

## Accessors

### availability

#### Get Signature

> **get** **availability**(): `TileAvailability`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:263](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L263)

Get the availability of tiles

##### Returns

`TileAvailability`

#### Implementation of

`TerrainProvider.availability`

***

### credit

#### Get Signature

> **get** **credit**(): `Credit`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:343](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L343)

Get the credit to display

##### Returns

`Credit`

#### Implementation of

`TerrainProvider.credit`

***

### errorEvent

#### Get Signature

> **get** **errorEvent**(): `Event`\<`ErrorEvent`\>

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:364](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L364)

Get the error event

##### Returns

`Event`\<`ErrorEvent`\>

#### Implementation of

`TerrainProvider.errorEvent`

***

### hasVertexNormals

#### Get Signature

> **get** **hasVertexNormals**(): `boolean`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:357](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L357)

Check if the provider has vertex normals

##### Returns

`boolean`

#### Implementation of

`TerrainProvider.hasVertexNormals`

***

### hasWaterMask

#### Get Signature

> **get** **hasWaterMask**(): `boolean`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:350](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L350)

Check if the provider has water mask

##### Returns

`boolean`

#### Implementation of

`TerrainProvider.hasWaterMask`

***

### readyPromise

#### Get Signature

> **get** **readyPromise**(): `Promise`\<`boolean`\>

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:336](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L336)

Check if the provider is ready

##### Returns

`Promise`\<`boolean`\>

***

### rectangle

#### Get Signature

> **get** **rectangle**(): `Rectangle`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:103](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L103)

Get the coverage rectangle in WGS84 coordinates

##### Returns

`Rectangle`

## Methods

### getLevelMaximumGeometricError()

> **getLevelMaximumGeometricError**(`level`): `number`

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:284](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L284)

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

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:306](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L306)

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

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:273](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L273)

Get the tiling scheme

#### Returns

`TilingScheme`

***

### loadTileDataAvailability()

> **loadTileDataAvailability**(`_x`, `_y`, `_level`): `Promise`\<`void`\>

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:294](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L294)

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

Defined in: [src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts:115](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/cesium/CesiumGeoTIFFTerrainProvider.ts#L115)

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
