[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/normalization-utils](../index.md) / autoDetectValueRange

# Function: autoDetectValueRange()

> **autoDetectValueRange**(`data`, `sampleSize`): \[`number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/normalization-utils.ts:93](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/map-provider/geotiff/utils/normalization-utils.ts#L93)

Auto-detect value range from a Float32/Float64 array sample
Useful when valueRange is not provided

## Parameters

### data

The raster data array

`Float32Array`\<`ArrayBufferLike`\> | `Float64Array`\<`ArrayBufferLike`\>

### sampleSize

`number` = `1000`

Number of samples to analyze (default: 1000)

## Returns

\[`number`, `number`\]

Detected [min, max] range
