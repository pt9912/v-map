[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/colormap-utils](../index.md) / convertGeoStylerColorMap

# Function: convertGeoStylerColorMap()

> **convertGeoStylerColorMap**(`geoStylerColorMap`, `valueRange?`): `object`

Defined in: [src/map-provider/geotiff/utils/colormap-utils.ts:103](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/geotiff/utils/colormap-utils.ts#L103)

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
