[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/leaflet/google-map-tiles-layer](../README.md) / GoogleMapTilesLayer

# Class: GoogleMapTilesLayer

Defined in: [src/map-provider/leaflet/google-map-tiles-layer.ts:75](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/google-map-tiles-layer.ts#L75)

## Extends

- `unknown`

## Constructors

### Constructor

> **new GoogleMapTilesLayer**(`options`): `GoogleMapTilesLayer`

Defined in: [src/map-provider/leaflet/google-map-tiles-layer.ts:89](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/google-map-tiles-layer.ts#L89)

#### Parameters

##### options

`GoogleMapTilesOptions`

#### Returns

`GoogleMapTilesLayer`

#### Overrides

`L.GridLayer.constructor`

## Methods

### createTile()

> **createTile**(`coords`, `done`): `HTMLElement`

Defined in: [src/map-provider/leaflet/google-map-tiles-layer.ts:174](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/google-map-tiles-layer.ts#L174)

#### Parameters

##### coords

`Coords`

##### done

`DoneCallback`

#### Returns

`HTMLElement`

***

### onAdd()

> **onAdd**(`map`): `this`

Defined in: [src/map-provider/leaflet/google-map-tiles-layer.ts:155](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/google-map-tiles-layer.ts#L155)

#### Parameters

##### map

`Map`

#### Returns

`this`

***

### onRemove()

> **onRemove**(`map`): `this`

Defined in: [src/map-provider/leaflet/google-map-tiles-layer.ts:165](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/map-provider/leaflet/google-map-tiles-layer.ts#L165)

#### Parameters

##### map

`Map`

#### Returns

`this`
