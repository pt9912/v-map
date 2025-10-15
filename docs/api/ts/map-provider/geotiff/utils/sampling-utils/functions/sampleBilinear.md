[**@npm9912/v-map**](../../../../../README.md)

***

[@npm9912/v-map](../../../../../README.md) / [map-provider/geotiff/utils/sampling-utils](../README.md) / sampleBilinear

# Function: sampleBilinear()

> **sampleBilinear**(`x`, `y`, `rasterBands`, `arrayType`, `width`, `height`, `offsetX`, `offsetY`, `colorStops?`): \[`number`, `number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/sampling-utils.ts:79](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/geotiff/utils/sampling-utils.ts#L79)

Bilinear Interpolation with window-based reading and multi-band support
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
