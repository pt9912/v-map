[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/leaflet/GeoTIFFGridLayer](../README.md) / GeoTIFFGridLayer

# Class: GeoTIFFGridLayer

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:22](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L22)

## Extends

- `unknown`

## Constructors

### Constructor

> **new GeoTIFFGridLayer**(`options`): `GeoTIFFGridLayer`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:30](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L30)

#### Parameters

##### options

[`GeoTIFFGridLayerOptions`](../interfaces/GeoTIFFGridLayerOptions.md)

#### Returns

`GeoTIFFGridLayer`

#### Overrides

`L.GridLayer.constructor`

## Methods

### createTile()

> **createTile**(`coords`, `done`): `HTMLCanvasElement`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:41](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L41)

#### Parameters

##### coords

`Coords`

##### done

`DoneCallback`

#### Returns

`HTMLCanvasElement`

***

### onAdd()

> **onAdd**(`map`): `this`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:35](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L35)

#### Parameters

##### map

`Map`

#### Returns

`this`

***

### updateSource()

> **updateSource**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:101](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L101)

#### Parameters

##### options

`Partial`\<[`GeoTIFFGridLayerOptions`](../interfaces/GeoTIFFGridLayerOptions.md)\>

#### Returns

`Promise`\<`void`\>
