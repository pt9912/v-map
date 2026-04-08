[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/colormap-utils](../index.md) / applyColorMap

# Function: applyColorMap()

> **applyColorMap**(`normalizedValue`, `colorStops`): \[`number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/colormap-utils.ts:168](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/geotiff/utils/colormap-utils.ts#L168)

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
