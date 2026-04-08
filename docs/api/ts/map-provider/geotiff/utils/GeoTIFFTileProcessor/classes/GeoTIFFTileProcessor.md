[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/GeoTIFFTileProcessor](../index.md) / GeoTIFFTileProcessor

# Class: GeoTIFFTileProcessor

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:71](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L71)

Processes GeoTIFF tiles with triangulation-based reprojection

This class encapsulates the tile rendering logic using triangulation
for efficient reprojection from arbitrary source projections to Web Mercator.

## Constructors

### Constructor

> **new GeoTIFFTileProcessor**(`config`): `GeoTIFFTileProcessor`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:79](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L79)

#### Parameters

##### config

[`GeoTIFFTileProcessorConfig`](../interfaces/GeoTIFFTileProcessorConfig.md)

#### Returns

`GeoTIFFTileProcessor`

## Methods

### createGlobalTriangulation()

> **createGlobalTriangulation**(): `void`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:90](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L90)

Create global triangulation for the entire GeoTIFF image
This is called once to avoid recreating triangulation for every tile

#### Returns

`void`

***

### getElevationData()

> **getElevationData**(`params`): `Promise`\<`Float32Array`\<`ArrayBufferLike`\>\>

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:666](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L666)

Get raw elevation values for a tile as Float32Array.

Returns a (tileSize+1) × (tileSize+1) float array suitable for Martini
terrain mesh generation. Border pixels are backfilled for Martini compatibility.
Band 0 of the GeoTIFF is used as the elevation source.

#### Parameters

##### params

###### tileSize

`number`

###### x

`number`

###### y

`number`

###### z

`number`

#### Returns

`Promise`\<`Float32Array`\<`ArrayBufferLike`\>\>

***

### getGlobalTriangulation()

> **getGlobalTriangulation**(): [`Triangulation`](../../Triangulation/classes/Triangulation.md)

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:155](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L155)

Get the global triangulation (may be undefined if not created yet)

#### Returns

[`Triangulation`](../../Triangulation/classes/Triangulation.md)

***

### getTileData()

> **getTileData**(`params`): `Promise`\<`Uint8ClampedArray`\<`ArrayBufferLike`\>\>

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:574](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L574)

Generate tile data with triangulation-based reprojection

This is the main method that orchestrates the entire tile rendering process.

#### Parameters

##### params

[`TileDataParams`](../interfaces/TileDataParams.md)

#### Returns

`Promise`\<`Uint8ClampedArray`\<`ArrayBufferLike`\>\>
