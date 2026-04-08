[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/sampling-utils](../index.md) / sampleBilinear

# Function: sampleBilinear()

> **sampleBilinear**(`x`, `y`, `rasterBands`, `arrayType`, `width`, `height`, `offsetX`, `offsetY`, `colorStops?`): \[`number`, `number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/sampling-utils.ts:79](https://github.com/pt9912/v-map/blob/32e748cc5b1e00a8ead1e01602763823427d8bf5/src/map-provider/geotiff/utils/sampling-utils.ts#L79)

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
