[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/leaflet/WCSGridLayer](../README.md) / WCSGridLayer

# Class: WCSGridLayer

Defined in: [src/map-provider/leaflet/WCSGridLayer.ts:22](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/leaflet/WCSGridLayer.ts#L22)

Custom Leaflet GridLayer for WCS (Web Coverage Service) support

Supports:
- WCS 2.0.1 with subset parameters
- WCS 1.x.x with BBOX parameters (backward compatibility)
- GeoTIFF FLOAT32 format
- Dynamic BBOX-based requests

## Extends

- `unknown`

## Constructors

### Constructor

> **new WCSGridLayer**(`options`): `WCSGridLayer`

Defined in: [src/map-provider/leaflet/WCSGridLayer.ts:25](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/leaflet/WCSGridLayer.ts#L25)

#### Parameters

##### options

[`WCSGridLayerOptions`](../interfaces/WCSGridLayerOptions.md)

#### Returns

`WCSGridLayer`

#### Overrides

`L.GridLayer.constructor`

## Methods

### createTile()

> **createTile**(`coords`, `done`): `HTMLElement`

Defined in: [src/map-provider/leaflet/WCSGridLayer.ts:115](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/leaflet/WCSGridLayer.ts#L115)

Create tile element (required by GridLayer)

#### Parameters

##### coords

`Coords`

##### done

`DoneCallback`

#### Returns

`HTMLElement`

***

### updateOptions()

> **updateOptions**(`newOptions`): `void`

Defined in: [src/map-provider/leaflet/WCSGridLayer.ts:141](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/leaflet/WCSGridLayer.ts#L141)

Update WCS options and redraw

#### Parameters

##### newOptions

`Partial`\<[`WCSGridLayerOptions`](../interfaces/WCSGridLayerOptions.md)\>

#### Returns

`void`
