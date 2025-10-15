[**@npm9912/v-map**](../../../../../README.md)

***

[@npm9912/v-map](../../../../../README.md) / [map-provider/geotiff/utils/normalization-utils](../README.md) / normalizeToColorMapRange

# Function: normalizeToColorMapRange()

> **normalizeToColorMapRange**(`rawValue`, `valueRange?`): `number`

Defined in: [src/map-provider/geotiff/utils/normalization-utils.ts:66](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/map-provider/geotiff/utils/normalization-utils.ts#L66)

Normalize a raw value to 0-1 range for colormap application

## Parameters

### rawValue

`number`

The raw value from the raster

### valueRange?

\[`number`, `number`\]

Optional [min, max] range. If not provided, assumes normalized data.

## Returns

`number`

Normalized value 0-1
