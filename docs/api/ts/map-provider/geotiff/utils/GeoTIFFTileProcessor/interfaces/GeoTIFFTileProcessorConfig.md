[**@npm9912/v-map**](../../../../../index.md)

***

[@npm9912/v-map](../../../../../index.md) / [map-provider/geotiff/utils/GeoTIFFTileProcessor](../index.md) / GeoTIFFTileProcessorConfig

# Interface: GeoTIFFTileProcessorConfig

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:15](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L15)

Configuration for the GeoTIFF Tile Processor

## Properties

### baseImage

> **baseImage**: `GeoTIFFImage`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:32](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L32)

***

### fromProjection

> **fromProjection**: `string`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:28](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L28)

***

### imageHeight

> **imageHeight**: `number`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:25](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L25)

***

### imageWidth

> **imageWidth**: `number`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:24](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L24)

***

### noDataValue?

> `optional` **noDataValue**: `number`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:34](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L34)

***

### overviewImages

> **overviewImages**: `GeoTIFFImage`[]

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:33](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L33)

***

### resolution

> **resolution**: `number`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:23](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L23)

***

### sourceBounds

> **sourceBounds**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:21](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L21)

***

### sourceRef

> **sourceRef**: \[`number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:22](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L22)

***

### toProjection

> **toProjection**: `string`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:29](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L29)

***

### transformSourceMapToViewFn()

> **transformSourceMapToViewFn**: (`coord`) => \[`number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:18](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L18)

#### Parameters

##### coord

\[`number`, `number`\]

#### Returns

\[`number`, `number`\]

***

### transformViewToSourceMapFn()

> **transformViewToSourceMapFn**: (`coord`) => \[`number`, `number`\]

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:17](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L17)

#### Parameters

##### coord

\[`number`, `number`\]

#### Returns

\[`number`, `number`\]

***

### worldSize?

> `optional` **worldSize**: `number`

Defined in: [src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts:37](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/utils/GeoTIFFTileProcessor.ts#L37)
