[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/Triangulation](../index.md) / Triangulation

# Class: Triangulation

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:120](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/geotiff/utils/Triangulation.ts#L120)

Class for triangulation of the given target extent
Used for determining source data and the reprojection itself

## Constructors

### Constructor

> **new Triangulation**(`transformFn`, `targetExtent`, `errorThreshold`, `sourceRef`, `resolution`, `step`): `Triangulation`

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:132](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/geotiff/utils/Triangulation.ts#L132)

#### Parameters

##### transformFn

`TransformFunction`

Function that transforms [x, y] from target to source projection

##### targetExtent

\[`number`, `number`, `number`, `number`\]

[west, south, east, north] in target projection

##### errorThreshold

`number` = `0.5`

Maximum allowed error in pixels (default: 0.5)

##### sourceRef

\[`number`, `number`\] = `null`

##### resolution

`number` = `null`

##### step

`number` = `10`

#### Returns

`Triangulation`

## Methods

### applyAffineTransform()

> **applyAffineTransform**(`x`, `y`, `transform`): \[`number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:471](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/geotiff/utils/Triangulation.ts#L471)

Apply affine transformation to a point

#### Parameters

##### x

`number`

##### y

`number`

##### transform

###### a

`number`

###### b

`number`

###### c

`number`

###### d

`number`

###### e

`number`

###### f

`number`

#### Returns

\[`number`, `number`\]

***

### buildBVH()

> **buildBVH**(): `void`

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:401](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/geotiff/utils/Triangulation.ts#L401)

#### Returns

`void`

***

### calculateAffineTransform()

> **calculateAffineTransform**(`triangle`): `object`

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:433](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/geotiff/utils/Triangulation.ts#L433)

Calculate affine transformation matrix for a triangle
Maps from target triangle to source triangle

#### Parameters

##### triangle

[`ITriangle`](../../Triangle/interfaces/ITriangle.md)

#### Returns

`object`

##### a

> **a**: `number`

##### b

> **b**: `number`

##### c

> **c**: `number`

##### d

> **d**: `number`

##### e

> **e**: `number`

##### f

> **f**: `number`

***

### calculateSourceExtent()

> **calculateSourceExtent**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:379](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/geotiff/utils/Triangulation.ts#L379)

Calculate the bounding extent of all source coordinates

#### Returns

\[`number`, `number`, `number`, `number`\]

***

### findSourceTriangleForTargetPoint()

> **findSourceTriangleForTargetPoint**(`point`, `extraTri`): [`TriResult`](../type-aliases/TriResult.md)

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:406](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/geotiff/utils/Triangulation.ts#L406)

#### Parameters

##### point

\[`number`, `number`\]

##### extraTri

[`TriResult`](../type-aliases/TriResult.md) = `null`

#### Returns

[`TriResult`](../type-aliases/TriResult.md)

***

### getBounds()

> **getBounds**(): [`Bounds`](../type-aliases/Bounds.md)

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:183](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/geotiff/utils/Triangulation.ts#L183)

#### Returns

[`Bounds`](../type-aliases/Bounds.md)

***

### getTriangles()

> **getTriangles**(): [`ITriangle`](../../Triangle/interfaces/ITriangle.md)[]

Defined in: [src/map-provider/geotiff/utils/Triangulation.ts:372](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/geotiff/utils/Triangulation.ts#L372)

Get all triangles

#### Returns

[`ITriangle`](../../Triangle/interfaces/ITriangle.md)[]
