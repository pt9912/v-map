[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/sampling-utils](../index.md) / sampleNearest

# Function: sampleNearest()

> **sampleNearest**(`x`, `y`, `rasterBands`, `arrayType`, `width`, `height`, `offsetX`, `offsetY`, `colorStops?`): \[`number`, `number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/sampling-utils.ts:22](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/map-provider/geotiff/utils/sampling-utils.ts#L22)

Nearest-Neighbor Sampling with window-based reading and multi-band support
Returns [R, G, B, A] values (0-255)

## Parameters

### x

`number`

### y

`number`

### rasterBands

[`TypedArray`](../type-aliases/TypedArray.md)[]

### arrayType

[`TypedArrayType`](../../normalization-utils/type-aliases/TypedArrayType.md)

### width

`number`

### height

`number`

### offsetX

`number`

### offsetY

`number`

### colorStops?

[`ColorStop`](../../colormap-utils/interfaces/ColorStop.md)[]

## Returns

\[`number`, `number`, `number`, `number`\]
