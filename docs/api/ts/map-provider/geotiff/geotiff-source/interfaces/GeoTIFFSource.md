[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/geotiff/geotiff-source](../index.md) / GeoTIFFSource

# Interface: GeoTIFFSource

Defined in: [src/map-provider/geotiff/geotiff-source.ts:19](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L19)

## Properties

### baseImage

> **baseImage**: `GeoTIFFImage`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:21](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L21)

***

### fromProjection

> **fromProjection**: `string`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:26](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L26)

***

### height

> **height**: `number`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:24](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L24)

***

### noDataValue?

> `optional` **noDataValue**: `number`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:32](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L32)

***

### overviewImages

> **overviewImages**: `GeoTIFFImage`[]

Defined in: [src/map-provider/geotiff/geotiff-source.ts:22](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L22)

***

### proj4

> **proj4**: \{(`toProj`): `Converter`; (`fromProj`, `toProj`): `Converter`; \<`T`\>(`toProj`, `coord`): `T`; \<`T`\>(`fromProj`, `toProj`, `coord`): `T`; \} & `object`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:31](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L31)

#### Type Declaration

##### defaultDatum

> **defaultDatum**: `string`

##### defs()

> **defs**: \{(`name`, `projection`): `void`; (`name`): `ProjectionDefinition`[]; (`name`): `ProjectionDefinition`; \}

###### Call Signature

> (`name`, `projection`): `void`

###### Parameters

###### name

`string`

###### projection

`string` | `ProjectionDefinition` | `PROJJSONDefinition`

###### Returns

`void`

###### Call Signature

> (`name`): `ProjectionDefinition`[]

###### Parameters

###### name

\[`string`, `string`\][]

###### Returns

`ProjectionDefinition`[]

###### Call Signature

> (`name`): `ProjectionDefinition`

###### Parameters

###### name

`string`

###### Returns

`ProjectionDefinition`

##### mgrs

> **mgrs**: `Mgrs`

##### nadgrid()

> **nadgrid**: \{(`key`, `data`, `options?`): `NADGrid`; (`key`, `data`): `object`; \}

###### Call Signature

> (`key`, `data`, `options?`): `NADGrid`

###### Parameters

###### key

`string`

The key to associate with the loaded grid.

###### data

`ArrayBuffer`

The NTv2 grid data as an ArrayBuffer.

###### options?

`NTV2GridOptions`

Optional parameters for loading the grid.

###### Returns

`NADGrid`

- The loaded NAD grid information.

###### Call Signature

> (`key`, `data`): `object`

###### Parameters

###### key

`string`

The key to associate with the loaded grid.

###### data

`GeoTIFF`

The GeoTIFF instance to read the grid from.

###### Returns

`object`

- A promise that resolves to the loaded grid information.

###### ready

> **ready**: `Promise`\<`NADGrid`\>

##### Point

> **Point**: *typeof* `Point`

##### Proj

> **Proj**: *typeof* `Projection`

##### toPoint()

> **toPoint**: (`array`) => `InterfaceCoordinates`

###### Parameters

###### array

`number`[]

###### Returns

`InterfaceCoordinates`

##### transform()

> **transform**: (`source`, `dest`, `point`, `enforceAxis`) => `InterfaceCoordinates`

###### Parameters

###### source

`ProjectionDefinition`

###### dest

`ProjectionDefinition`

###### point

`TemplateCoordinates`

###### enforceAxis

`boolean`

###### Returns

`InterfaceCoordinates`

##### version

> **version**: `string`

##### WGS84

> **WGS84**: `Projection`

***

### resolution

> **resolution**: `number`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:30](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L30)

***

### samplesPerPixel

> **samplesPerPixel**: `number`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:25](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L25)

***

### sourceBounds

> **sourceBounds**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/geotiff-source.ts:28](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L28)

***

### sourceRef

> **sourceRef**: \[`number`, `number`\]

Defined in: [src/map-provider/geotiff/geotiff-source.ts:29](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L29)

***

### tiff

> **tiff**: `GeoTIFF`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:20](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L20)

***

### transformToWgs84()

> **transformToWgs84**: (`coord`) => \[`number`, `number`\]

Defined in: [src/map-provider/geotiff/geotiff-source.ts:34](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L34)

#### Parameters

##### coord

\[`number`, `number`\]

#### Returns

\[`number`, `number`\]

***

### wgs84Bounds

> **wgs84Bounds**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/map-provider/geotiff/geotiff-source.ts:33](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L33)

***

### width

> **width**: `number`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:23](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/map-provider/geotiff/geotiff-source.ts#L23)
