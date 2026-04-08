[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/colormap-utils](../index.md) / convertGeoStylerColorMap

# Function: convertGeoStylerColorMap()

> **convertGeoStylerColorMap**(`geoStylerColorMap`, `valueRange?`): `object`

Defined in: [src/map-provider/geotiff/utils/colormap-utils.ts:103](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/map-provider/geotiff/utils/colormap-utils.ts#L103)

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
