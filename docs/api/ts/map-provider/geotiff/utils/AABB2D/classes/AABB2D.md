[**@npm9912/v-map**](../../../../../README.md)

***

[@npm9912/v-map](../../../../../README.md) / [map-provider/geotiff/utils/AABB2D](../README.md) / AABB2D

# Class: AABB2D

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:13](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/AABB2D.ts#L13)

## Constructors

### Constructor

> **new AABB2D**(`min`, `max`): `AABB2D`

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:14](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/AABB2D.ts#L14)

#### Parameters

##### min

[`Point2D`](../type-aliases/Point2D.md)

##### max

[`Point2D`](../type-aliases/Point2D.md)

#### Returns

`AABB2D`

## Properties

### max

> **max**: [`Point2D`](../type-aliases/Point2D.md)

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:14](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/AABB2D.ts#L14)

***

### min

> **min**: [`Point2D`](../type-aliases/Point2D.md)

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:14](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/AABB2D.ts#L14)

## Methods

### contains()

> **contains**(`point`): `boolean`

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:16](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/AABB2D.ts#L16)

#### Parameters

##### point

[`Point2D`](../type-aliases/Point2D.md)

#### Returns

`boolean`

***

### fromTriangle()

> `static` **fromTriangle**(`triangle`): `AABB2D`

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:25](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/AABB2D.ts#L25)

#### Parameters

##### triangle

[`Triangle2D`](../type-aliases/Triangle2D.md)

#### Returns

`AABB2D`

***

### union()

> `static` **union**(`a`, `b`): `AABB2D`

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:33](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/geotiff/utils/AABB2D.ts#L33)

#### Parameters

##### a

`AABB2D`

##### b

`AABB2D`

#### Returns

`AABB2D`
