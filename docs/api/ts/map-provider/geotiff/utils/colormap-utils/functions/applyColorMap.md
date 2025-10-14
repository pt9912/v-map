[**@npm9912/v-map**](../../../../../README.md)

***

[@npm9912/v-map](../../../../../README.md) / [map-provider/geotiff/utils/colormap-utils](../README.md) / applyColorMap

# Function: applyColorMap()

> **applyColorMap**(`normalizedValue`, `colorStops`): \[`number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/colormap-utils.ts:168](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/geotiff/utils/colormap-utils.ts#L168)

Apply colormap to a normalized value using interpolation

## Parameters

### normalizedValue

`number`

Value between 0 and 1

### colorStops

[`ColorStop`](../interfaces/ColorStop.md)[]

Array of color stops (must be sorted by value)

## Returns

\[`number`, `number`, `number`\]

RGB color [r, g, b]
