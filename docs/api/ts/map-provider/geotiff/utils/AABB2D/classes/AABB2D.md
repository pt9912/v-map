[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/AABB2D](../index.md) / AABB2D

# Class: AABB2D

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:22](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/AABB2D.ts#L22)

## Constructors

### Constructor

> **new AABB2D**(`min`, `max`): `AABB2D`

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:23](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/AABB2D.ts#L23)

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

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:23](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/AABB2D.ts#L23)

***

### min

> **min**: [`Point2D`](../type-aliases/Point2D.md)

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:23](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/AABB2D.ts#L23)

## Methods

### contains()

> **contains**(`point`): `boolean`

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:25](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/AABB2D.ts#L25)

#### Parameters

##### point

[`Point2D`](../type-aliases/Point2D.md)

#### Returns

`boolean`

***

### fromTriangle()

> `static` **fromTriangle**(`triangle`): `AABB2D`

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:34](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/AABB2D.ts#L34)

#### Parameters

##### triangle

[`Triangle2D`](../type-aliases/Triangle2D.md)

#### Returns

`AABB2D`

***

### union()

> `static` **union**(`a`, `b`): `AABB2D`

Defined in: [src/map-provider/geotiff/utils/AABB2D.ts:42](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/AABB2D.ts#L42)

#### Parameters

##### a

`AABB2D`

##### b

`AABB2D`

#### Returns

`AABB2D`
