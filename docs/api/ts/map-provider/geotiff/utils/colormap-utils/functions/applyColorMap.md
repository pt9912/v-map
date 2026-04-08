[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/colormap-utils](../index.md) / applyColorMap

# Function: applyColorMap()

> **applyColorMap**(`normalizedValue`, `colorStops`): \[`number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/colormap-utils.ts:168](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/map-provider/geotiff/utils/colormap-utils.ts#L168)

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
