[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/leaflet/GeoTIFFGridLayer](../README.md) / GeoTIFFGridLayer

# Class: GeoTIFFGridLayer

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:21](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L21)

## Extends

- `unknown`

## Constructors

### Constructor

> **new GeoTIFFGridLayer**(`options`): `GeoTIFFGridLayer`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:29](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L29)

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

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:40](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L40)

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

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:34](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L34)

#### Parameters

##### map

`Map`

#### Returns

`this`

***

### updateSource()

> **updateSource**(`options`): `Promise`\<`void`\>

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:95](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L95)

#### Parameters

##### options

`Partial`\<[`GeoTIFFGridLayerOptions`](../interfaces/GeoTIFFGridLayerOptions.md)\>

#### Returns

`Promise`\<`void`\>
