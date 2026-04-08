[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/Triangulation](../index.md) / calculateBounds

# Function: calculateBounds()

> **calculateBounds**(`sourceRef`, `resolution`, `targetExtent`, `transformFn`, `step`): `object`

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:30](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/geotiff/utils/Triangulation.ts#L30)

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
