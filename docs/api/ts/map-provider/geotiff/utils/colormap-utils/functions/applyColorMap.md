[**@npm9912/v-map**](../../../../../README.md)

***

[@npm9912/v-map](../../../../../README.md) / [map-provider/geotiff/utils/colormap-utils](../README.md) / applyColorMap

# Function: applyColorMap()

> **applyColorMap**(`normalizedValue`, `colorStops`): \[`number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/colormap-utils.ts:168](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/geotiff/utils/colormap-utils.ts#L168)

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
