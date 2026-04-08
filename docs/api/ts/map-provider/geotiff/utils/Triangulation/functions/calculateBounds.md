[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/Triangulation](../index.md) / calculateBounds

# Function: calculateBounds()

> **calculateBounds**(`sourceRef`, `resolution`, `targetExtent`, `transformFn`, `step`): `object`

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:30](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/map-provider/geotiff/utils/Triangulation.ts#L30)

## Parameters

### sourceRef

\[`number`, `number`\]

### resolution

`number`

### targetExtent

\[`number`, `number`, `number`, `number`\]

### transformFn

`TransformFunction`

### step

`number` = `10`

## Returns

`object`

### source

> **source**: [`Bounds`](../type-aliases/Bounds.md)

### target

> **target**: [`Bounds`](../type-aliases/Bounds.md)
