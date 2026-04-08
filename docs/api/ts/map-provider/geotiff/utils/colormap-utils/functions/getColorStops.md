[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/colormap-utils](../index.md) / getColorStops

# Function: getColorStops()

> **getColorStops**(`colorMap`, `valueRange?`): `object`

Defined in: [src/map-provider/geotiff/utils/colormap-utils.ts:228](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/geotiff/utils/colormap-utils.ts#L228)

Get ColorStop array from ColorMapName or GeoStyler ColorMap

## Parameters

### colorMap

Predefined name or GeoStyler ColorMap

[`GeoStylerColorMap`](../../../../../index/interfaces/GeoStylerColorMap.md) | [`ColorMapName`](../type-aliases/ColorMapName.md)

### valueRange?

\[`number`, `number`\]

Optional value range for GeoStyler ColorMap

## Returns

`object`

ColorStop array and computed range (if applicable)

### computedRange?

> `optional` **computedRange**: \[`number`, `number`\]

### stops

> **stops**: [`ColorStop`](../interfaces/ColorStop.md)[]
