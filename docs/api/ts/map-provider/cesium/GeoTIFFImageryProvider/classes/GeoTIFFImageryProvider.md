[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/cesium/GeoTIFFImageryProvider](../index.md) / GeoTIFFImageryProvider

# Class: GeoTIFFImageryProvider

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:34](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L34)

Custom ImageryProvider that renders GeoTIFF tiles on demand using
the shared GeoTIFFTileProcessor (triangulation-based reprojection).

## Implements

- `ImageryProvider`

## Constructors

### Constructor

> **new GeoTIFFImageryProvider**(`options`): `GeoTIFFImageryProvider`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:56](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L56)

#### Parameters

##### options

[`CesiumGeoTIFFImageryOptions`](../interfaces/CesiumGeoTIFFImageryOptions.md)

#### Returns

`GeoTIFFImageryProvider`

## Properties

### credit

> `readonly` **credit**: `Credit` = `undefined`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:40](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L40)

Gets the credit to display when this imagery provider is active.  Typically this is used to credit
the source of the imagery.

#### Implementation of

`ImageryProvider.credit`

***

### errorEvent

> `readonly` **errorEvent**: `Event`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:39](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L39)

Gets an event that is raised when the imagery provider encounters an asynchronous error.  By subscribing
to the event, you will be notified of the error and can potentially recover from it.  Event listeners
are passed an instance of TileProviderError.

#### Implementation of

`ImageryProvider.errorEvent`

***

### hasAlphaChannel

> `readonly` **hasAlphaChannel**: `true` = `true`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:43](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L43)

Gets a value indicating whether or not the images provided by this imagery provider
include an alpha channel.  If this property is false, an alpha channel, if present, will
be ignored.  If this property is true, any images without an alpha channel will be treated
as if their alpha is 1.0 everywhere.  When this property is false, memory usage
and texture upload time are reduced.

#### Implementation of

`ImageryProvider.hasAlphaChannel`

***

### maximumLevel

> `readonly` **maximumLevel**: `number`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:45](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L45)

Gets the maximum level-of-detail that can be requested.

#### Implementation of

`ImageryProvider.maximumLevel`

***

### minimumLevel

> `readonly` **minimumLevel**: `number`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:44](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L44)

Gets the minimum level-of-detail that can be requested.  Generally,
a minimum level should only be used when the rectangle of the imagery is small
enough that the number of tiles at the minimum level is small.  An imagery
provider with more than a few tiles at the minimum level will lead to
rendering problems.

#### Implementation of

`ImageryProvider.minimumLevel`

***

### proxy

> `readonly` **proxy**: `undefined` = `undefined`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:42](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L42)

Gets the proxy used by this provider.

#### Implementation of

`ImageryProvider.proxy`

***

### ready

> **ready**: `boolean` = `false`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:54](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L54)

***

### rectangle

> `readonly` **rectangle**: `Rectangle`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:38](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L38)

Gets the rectangle, in radians, of the imagery provided by the instance.

#### Implementation of

`ImageryProvider.rectangle`

***

### tileDiscardPolicy

> `readonly` **tileDiscardPolicy**: `TileDiscardPolicy` = `undefined`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:41](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L41)

Gets the tile discard policy.  If not undefined, the discard policy is responsible
for filtering out "missing" tiles via its shouldDiscardImage function.  If this function
returns undefined, no tiles are filtered.

#### Implementation of

`ImageryProvider.tileDiscardPolicy`

***

### tileHeight

> `readonly` **tileHeight**: `number`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:36](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L36)

Gets the height of each tile, in pixels.

#### Implementation of

`ImageryProvider.tileHeight`

***

### tileWidth

> `readonly` **tileWidth**: `number`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:35](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L35)

Gets the width of each tile, in pixels.

#### Implementation of

`ImageryProvider.tileWidth`

***

### tilingScheme

> `readonly` **tilingScheme**: `TilingScheme`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:37](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L37)

Gets the tiling scheme used by the provider.

#### Implementation of

`ImageryProvider.tilingScheme`

## Accessors

### readyPromise

#### Get Signature

> **get** **readyPromise**(): `Promise`\<`boolean`\>

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:101](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L101)

##### Returns

`Promise`\<`boolean`\>

***

### tileCredits

#### Get Signature

> **get** **tileCredits**(): `Credit`[]

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:105](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L105)

##### Returns

`Credit`[]

***

### tilingSchemeName

#### Get Signature

> **get** **tilingSchemeName**(): `string`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:94](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L94)

##### Returns

`string`

***

### url

#### Get Signature

> **get** **url**(): `string`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:117](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L117)

##### Returns

`string`

## Methods

### getTileCredits()

> **getTileCredits**(`_x`, `_y`, `_level`): `Credit`[]

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:109](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L109)

Gets the credits to be displayed when a given tile is displayed.

#### Parameters

##### \_x

`number`

##### \_y

`number`

##### \_level

`number`

#### Returns

`Credit`[]

The credits to be displayed when the tile is displayed.

#### Implementation of

`ImageryProvider.getTileCredits`

***

### pickFeatures()

> **pickFeatures**(): `undefined`

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:285](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L285)

Asynchronously determines what features, if any, are located at a given longitude and latitude within
a tile.
This function is optional, so it may not exist on all ImageryProviders.

#### Returns

`undefined`

A promise for the picked features that will resolve when the asynchronous
                  picking completes.  The resolved value is an array of ImageryLayerFeatureInfo
                  instances.  The array may be empty if no features are found at the given location.
                  It may also be undefined if picking is not supported.

#### Implementation of

`ImageryProvider.pickFeatures`

***

### requestImage()

> **requestImage**(`x`, `y`, `level`): `Promise`\<`HTMLCanvasElement` \| `ImageBitmap`\>

Defined in: [src/map-provider/cesium/GeoTIFFImageryProvider.ts:234](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/cesium/GeoTIFFImageryProvider.ts#L234)

Requests the image for a given tile.

#### Parameters

##### x

`number`

The tile X coordinate.

##### y

`number`

The tile Y coordinate.

##### level

`number`

The tile level.

#### Returns

`Promise`\<`HTMLCanvasElement` \| `ImageBitmap`\>

Returns a promise for the image that will resolve when the image is available, or
         undefined if there are too many active requests to the server, and the request should be retried later.

#### Implementation of

`ImageryProvider.requestImage`
