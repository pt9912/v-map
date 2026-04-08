[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/geotiff/geotiff-source](../index.md) / GeoTIFFLoaderDeps

# Interface: GeoTIFFLoaderDeps

Defined in: [src/map-provider/geotiff/geotiff-source.ts:13](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/map-provider/geotiff/geotiff-source.ts#L13)

## Properties

### geokeysToProj4

> **geokeysToProj4**: `__module`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:16](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/map-provider/geotiff/geotiff-source.ts#L16)

***

### geotiff

> **geotiff**: `__module`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:14](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/map-provider/geotiff/geotiff-source.ts#L14)

***

### proj4

> **proj4**: \{(`toProj`): `Converter`; (`fromProj`, `toProj`): `Converter`; \<`T`\>(`toProj`, `coord`): `T`; \<`T`\>(`fromProj`, `toProj`, `coord`): `T`; \} & `object`

Defined in: [src/map-provider/geotiff/geotiff-source.ts:15](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/map-provider/geotiff/geotiff-source.ts#L15)

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
