[**@npm9912/v-map**](../../../../../README.md)

***

[@npm9912/v-map](../../../../../README.md) / [map-provider/geotiff/utils/sampling-utils](../README.md) / sampleNearest

# Function: sampleNearest()

> **sampleNearest**(`x`, `y`, `rasterBands`, `arrayType`, `width`, `height`, `offsetX`, `offsetY`, `colorStops?`): \[`number`, `number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/sampling-utils.ts:22](https://github.com/pt9912/v-map/blob/2a78c45e554a5a587112b3a4df3615fe7d611f93/src/map-provider/geotiff/utils/sampling-utils.ts#L22)

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
