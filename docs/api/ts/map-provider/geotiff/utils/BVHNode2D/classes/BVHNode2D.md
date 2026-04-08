[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/BVHNode2D](../index.md) / BVHNode2D

# Class: BVHNode2D

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:4](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L4)

## Constructors

### Constructor

> **new BVHNode2D**(`bbox`, `triangles`, `left`, `right`): `BVHNode2D`

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:5](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L5)

#### Parameters

##### bbox

[`AABB2D`](../../AABB2D/classes/AABB2D.md)

##### triangles

[`Triangle2D`](../../AABB2D/type-aliases/Triangle2D.md)[] = `[]`

##### left

`BVHNode2D` = `null`

##### right

`BVHNode2D` = `null`

#### Returns

`BVHNode2D`

## Properties

### bbox

> **bbox**: [`AABB2D`](../../AABB2D/classes/AABB2D.md)

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:6](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L6)

***

### left

> **left**: `BVHNode2D` = `null`

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:8](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L8)

***

### right

> **right**: `BVHNode2D` = `null`

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:9](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L9)

***

### triangles

> **triangles**: [`Triangle2D`](../../AABB2D/type-aliases/Triangle2D.md)[] = `[]`

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:7](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L7)

## Methods

### findContainingTriangle()

> **findContainingTriangle**(`point`): [`Triangle2D`](../../AABB2D/type-aliases/Triangle2D.md)

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:56](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L56)

Finds the triangle containing the given point.

#### Parameters

##### point

[`Point2D`](../../AABB2D/type-aliases/Point2D.md)

The point to test.

#### Returns

[`Triangle2D`](../../AABB2D/type-aliases/Triangle2D.md)

The containing triangle or `null`.

***

### getStats()

> **getStats**(): `object`

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:153](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L153)

Get statistics about the BVH tree

#### Returns

`object`

Object with tree statistics

##### depth

> **depth**: `number`

##### leafCount

> **leafCount**: `number`

##### maxTrianglesPerLeaf

> **maxTrianglesPerLeaf**: `number`

##### minTrianglesPerLeaf

> **minTrianglesPerLeaf**: `number`

##### nodeCount

> **nodeCount**: `number`

##### triangleCount

> **triangleCount**: `number`

***

### toString()

> **toString**(`indent`): `string`

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:110](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L110)

Returns a string representation of the BVH tree structure

#### Parameters

##### indent

`string` = `''`

Internal parameter for recursive formatting

#### Returns

`string`

Formatted string showing tree structure

***

### build()

> `static` **build**(`triangles`, `depth`, `maxDepth`): `BVHNode2D`

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:12](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L12)

#### Parameters

##### triangles

[`Triangle2D`](../../AABB2D/type-aliases/Triangle2D.md)[]

##### depth

`number` = `0`

##### maxDepth

`number` = `10`

#### Returns

`BVHNode2D`

***

### punktInDreieck2D()

> `static` **punktInDreieck2D**(`p`, `triangle`): `boolean`

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:75](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L75)

#### Parameters

##### p

[`Point2D`](../../AABB2D/type-aliases/Point2D.md)

##### triangle

[`Triangle2D`](../../AABB2D/type-aliases/Triangle2D.md)

#### Returns

`boolean`

***

### toTriangle2D()

> `static` **toTriangle2D**(`triangle`): [`Triangle2D`](../../AABB2D/type-aliases/Triangle2D.md)

Defined in: [src/map-provider/geotiff/utils/BVHNode2D.ts:95](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/map-provider/geotiff/utils/BVHNode2D.ts#L95)

#### Parameters

##### triangle

[`ITriangle`](../../Triangle/interfaces/ITriangle.md)

#### Returns

[`Triangle2D`](../../AABB2D/type-aliases/Triangle2D.md)
