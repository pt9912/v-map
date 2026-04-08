[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/normalization-utils](../index.md) / normalizeToColorMapRange

# Function: normalizeToColorMapRange()

> **normalizeToColorMapRange**(`rawValue`, `valueRange?`): `number`

Defined in: [src/map-provider/geotiff/utils/normalization-utils.ts:66](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/map-provider/geotiff/utils/normalization-utils.ts#L66)

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
