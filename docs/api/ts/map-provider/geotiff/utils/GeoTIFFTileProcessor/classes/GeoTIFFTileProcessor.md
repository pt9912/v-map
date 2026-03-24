[**@npm9912/v-map**](../../../../../README.md)

***

[@npm9912/v-map](../../../../../README.md) / [map-provider/geotiff/utils/GeoTIFFTileProcessor](../README.md) / GeoTIFFTileProcessor

# Class: GeoTIFFTileProcessor

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:70](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L70)

Processes GeoTIFF tiles with triangulation-based reprojection

This class encapsulates the tile rendering logic using triangulation
for efficient reprojection from arbitrary source projections to Web Mercator.

## Constructors

### Constructor

> **new GeoTIFFTileProcessor**(`config`): `GeoTIFFTileProcessor`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:78](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L78)

#### Parameters

##### config

[`GeoTIFFTileProcessorConfig`](../interfaces/GeoTIFFTileProcessorConfig.md)

#### Returns

`GeoTIFFTileProcessor`

## Methods

### createGlobalTriangulation()

> **createGlobalTriangulation**(): `void`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:89](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L89)

Create global triangulation for the entire GeoTIFF image
This is called once to avoid recreating triangulation for every tile

#### Returns

`void`

***

### getGlobalTriangulation()

> **getGlobalTriangulation**(): [`Triangulation`](../../Triangulation/classes/Triangulation.md)

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:154](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L154)

Get the global triangulation (may be undefined if not created yet)

#### Returns

[`Triangulation`](../../Triangulation/classes/Triangulation.md)

***

### getTileData()

> **getTileData**(`params`): `Promise`\<`Uint8ClampedArray`\<`ArrayBufferLike`\>\>

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:554](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L554)

Generate tile data with triangulation-based reprojection

This is the main method that orchestrates the entire tile rendering process.

#### Parameters

##### params

[`TileDataParams`](../interfaces/TileDataParams.md)

#### Returns

`Promise`\<`Uint8ClampedArray`\<`ArrayBufferLike`\>\>
