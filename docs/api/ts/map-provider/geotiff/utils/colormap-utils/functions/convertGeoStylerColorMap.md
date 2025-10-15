[**@npm9912/v-map**](../../../../../README.md)

***

[@npm9912/v-map](../../../../../README.md) / [map-provider/geotiff/utils/colormap-utils](../README.md) / convertGeoStylerColorMap

# Function: convertGeoStylerColorMap()

> **convertGeoStylerColorMap**(`geoStylerColorMap`, `valueRange?`): `object`

Defined in: [src/map-provider/geotiff/utils/colormap-utils.ts:103](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/map-provider/geotiff/utils/colormap-utils.ts#L103)

Convert GeoStyler ColorMap to internal ColorStop array

## Parameters

### geoStylerColorMap

[`GeoStylerColorMap`](../../../../../index/interfaces/GeoStylerColorMap.md)

GeoStyler ColorMap object

### valueRange?

\[`number`, `number`\]

Optional value range [min, max] for normalization

## Returns

`object`

Object with ColorStop array and computed range

### computedRange?

> `optional` **computedRange**: \[`number`, `number`\]

### stops

> **stops**: [`ColorStop`](../interfaces/ColorStop.md)[]
