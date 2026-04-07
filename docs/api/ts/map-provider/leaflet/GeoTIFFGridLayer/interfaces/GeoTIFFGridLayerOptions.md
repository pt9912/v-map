[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/leaflet/GeoTIFFGridLayer](../README.md) / GeoTIFFGridLayerOptions

# Interface: GeoTIFFGridLayerOptions

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:9](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L9)

## Extends

- `GridLayerOptions`

## Properties

### attribution?

> `optional` **attribution**: `string`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1670

#### Inherited from

`L.GridLayerOptions.attribution`

***

### bounds?

> `optional` **bounds**: `LatLngBoundsExpression`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1727

#### Inherited from

`L.GridLayerOptions.bounds`

***

### className?

> `optional` **className**: `string`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1742

#### Inherited from

`L.GridLayerOptions.className`

***

### colorMap?

> `optional` **colorMap**: [`GeoStylerColorMap`](../../../../index/interfaces/GeoStylerColorMap.md) \| [`ColorMapName`](../../../geotiff/utils/colormap-utils/type-aliases/ColorMapName.md)

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:11](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L11)

***

### keepBuffer?

> `optional` **keepBuffer**: `number`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1743

#### Inherited from

`L.GridLayerOptions.keepBuffer`

***

### maxNativeZoom?

> `optional` **maxNativeZoom**: `number`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1734

Maximum zoom number the tile source has available. If it is specified, the tiles on all zoom levels higher than
`maxNativeZoom` will be loaded from `maxNativeZoom` level and auto-scaled.

#### Inherited from

`L.GridLayerOptions.maxNativeZoom`

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1729

#### Inherited from

`L.GridLayerOptions.maxZoom`

***

### minNativeZoom?

> `optional` **minNativeZoom**: `number`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1739

Minimum zoom number the tile source has available. If it is specified, the tiles on all zoom levels lower than
`minNativeZoom` will be loaded from `minNativeZoom` level and auto-scaled.

#### Inherited from

`L.GridLayerOptions.minNativeZoom`

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1728

#### Inherited from

`L.GridLayerOptions.minZoom`

***

### nodata?

> `optional` **nodata**: `number`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:13](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L13)

***

### noWrap?

> `optional` **noWrap**: `boolean`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1740

#### Inherited from

`L.GridLayerOptions.noWrap`

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:17](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L17)

#### Overrides

`L.GridLayerOptions.opacity`

***

### pane?

> `optional` **pane**: `string`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1741

#### Inherited from

`L.GridLayerOptions.pane`

***

### resampleMethod?

> `optional` **resampleMethod**: `"near"` \| `"bilinear"`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:15](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L15)

***

### resolution?

> `optional` **resolution**: `number`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:14](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L14)

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:16](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L16)

#### Overrides

`L.GridLayerOptions.tileSize`

***

### updateInterval?

> `optional` **updateInterval**: `number`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1725

#### Inherited from

`L.GridLayerOptions.updateInterval`

***

### updateWhenIdle?

> `optional` **updateWhenIdle**: `boolean`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1723

#### Inherited from

`L.GridLayerOptions.updateWhenIdle`

***

### updateWhenZooming?

> `optional` **updateWhenZooming**: `boolean`

Defined in: node\_modules/.pnpm/@types+leaflet@1.9.21/node\_modules/@types/leaflet/index.d.ts:1724

#### Inherited from

`L.GridLayerOptions.updateWhenZooming`

***

### url

> **url**: `string`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:10](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L10)

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:12](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L12)

***

### viewProjection?

> `optional` **viewProjection**: `string`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:19](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L19)

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/map-provider/leaflet/GeoTIFFGridLayer.ts:18](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/map-provider/leaflet/GeoTIFFGridLayer.ts#L18)

#### Overrides

`L.GridLayerOptions.zIndex`
