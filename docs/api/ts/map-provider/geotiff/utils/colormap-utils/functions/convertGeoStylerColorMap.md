[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/colormap-utils](../index.md) / convertGeoStylerColorMap

# Function: convertGeoStylerColorMap()

> **convertGeoStylerColorMap**(`geoStylerColorMap`, `valueRange?`): `object`

Defined in: [src/map-provider/geotiff/utils/colormap-utils.ts:103](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/map-provider/geotiff/utils/colormap-utils.ts#L103)

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
