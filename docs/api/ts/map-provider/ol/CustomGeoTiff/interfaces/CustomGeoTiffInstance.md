[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/ol/CustomGeoTiff](../index.md) / CustomGeoTiffInstance

# Interface: CustomGeoTiffInstance

Defined in: [src/map-provider/ol/CustomGeoTiff.ts:19](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/ol/CustomGeoTiff.ts#L19)

## Extends

- `GeoTIFFSource`

## Properties

### bandCount

> **bandCount**: `number`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/DataTile.d.ts:204

#### Inherited from

`GeoTIFF.bandCount`

***

### disposed

> `protected` **disposed**: `boolean`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Disposable.d.ts:15

The object has already been disposed.

#### Inherited from

`GeoTIFF.disposed`

***

### loading

> **loading**: `boolean`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:114

This source is currently loading data. Sources that defer loading to the
map's tile queue never set this to `true`.

#### Inherited from

`GeoTIFF.loading`

***

### on

> **on**: `TileSourceOnSignature`\<`EventsKey`\>

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:118

#### Inherited from

`GeoTIFF.on`

***

### once

> **once**: `TileSourceOnSignature`\<`EventsKey`\>

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:122

#### Inherited from

`GeoTIFF.once`

***

### projection

> `protected` **projection**: `Projection`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:98

#### Inherited from

`GeoTIFF.projection`

***

### tileGrid

> `protected` **tileGrid**: `TileGrid`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:136

#### Inherited from

`GeoTIFF.tileGrid`

***

### tileOptions

> `protected` **tileOptions**: `Options`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:151

#### Inherited from

`GeoTIFF.tileOptions`

***

### tmpSize

> `protected` **tmpSize**: `Size`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:141

#### Inherited from

`GeoTIFF.tmpSize`

***

### transformMatrix

> **transformMatrix**: `Transform`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/DataTile.d.ts:223

#### Inherited from

`GeoTIFF.transformMatrix`

***

### un

> **un**: `TileSourceOnSignature`\<`void`\>

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:126

#### Inherited from

`GeoTIFF.un`

***

### viewRejector()

> `protected` **viewRejector**: (`arg0`) => `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:139

#### Parameters

##### arg0

`Error`

#### Returns

`void`

#### Inherited from

`GeoTIFF.viewRejector`

***

### viewResolver()

> `protected` **viewResolver**: (`arg0`) => `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:134

#### Parameters

##### arg0

`ViewOptions`

#### Returns

`void`

#### Inherited from

`GeoTIFF.viewResolver`

***

### zDirection

> **zDirection**: `number` \| `NearestDirectionFunction`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:159

zDirection hint, read by the renderer. Indicates which resolution should be used
by a renderer if the views resolution does not match any resolution of the tile source.
If 0, the nearest resolution will be used. If 1, the nearest lower resolution
will be used. If -1, the nearest higher resolution will be used.

#### Inherited from

`GeoTIFF.zDirection`

## Methods

### addChangeListener()

> **addChangeListener**(`key`, `listener`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:145

#### Parameters

##### key

`string`

Key name.

##### listener

`Listener`

Listener.

#### Returns

`void`

#### Inherited from

`GeoTIFF.addChangeListener`

***

### addEventListener()

> **addEventListener**(`type`, `listener`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/events/Target.d.ts:50

#### Parameters

##### type

`string`

Type.

##### listener

`Listener`

Listener.

#### Returns

`void`

#### Inherited from

`GeoTIFF.addEventListener`

***

### applyProperties()

> `protected` **applyProperties**(`source`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:172

Apply any properties from another object without triggering events.

#### Parameters

##### source

`BaseObject`

The source object.

#### Returns

`void`

#### Inherited from

`GeoTIFF.applyProperties`

***

### changed()

> **changed**(): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Observable.d.ts:65

Increases the revision counter and dispatches a 'change' event.

#### Returns

`void`

#### Api

#### Inherited from

`GeoTIFF.changed`

***

### clear()

> **clear**(): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:227

Remove all cached reprojected tiles from the source. The next render cycle will create new tiles.

#### Returns

`void`

#### Api

#### Inherited from

`GeoTIFF.clear`

***

### determineProjection()

> **determineProjection**(`sources`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/GeoTIFF.d.ts:315

Determine the projection of the images in this GeoTIFF.
The default implementation looks at the ProjectedCSTypeGeoKey and the GeographicTypeGeoKey
of each image in turn.
You can override this method in a subclass to support more projections.

#### Parameters

##### sources

`GeoTIFFImage`[][]

Each source is a list of images
from a single GeoTIFF.

#### Returns

`void`

#### Inherited from

`GeoTIFF.determineProjection`

***

### determineTransformMatrix()

> **determineTransformMatrix**(`sources`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/GeoTIFF.d.ts:322

Determine any transform matrix for the images in this GeoTIFF.

#### Parameters

##### sources

`GeoTIFFImage`[][]

Each source is a list of images
from a single GeoTIFF.

#### Returns

`void`

#### Inherited from

`GeoTIFF.determineTransformMatrix`

***

### dispatchEvent()

> **dispatchEvent**(`event`): `boolean`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/events/Target.d.ts:61

Dispatches an event and calls all listeners listening for events
of this type. The event parameter can either be a string or an
Object with a `type` property.

#### Parameters

##### event

Event object.

`string` | `BaseEvent`

#### Returns

`boolean`

`false` if anyone called preventDefault on the
    event object or if any of the listeners returned false.

#### Api

#### Inherited from

`GeoTIFF.dispatchEvent`

***

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Disposable.d.ts:19

Clean up.

#### Returns

`void`

#### Inherited from

`GeoTIFF.dispose`

***

### disposeInternal()

> `protected` **disposeInternal**(): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Disposable.d.ts:24

Extension point for disposable objects.

#### Returns

`void`

#### Inherited from

`GeoTIFF.disposeInternal`

***

### get()

> **get**(`key`): `any`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:114

Gets a value.

#### Parameters

##### key

`string`

Key name.

#### Returns

`any`

Value.

#### Api

#### Inherited from

`GeoTIFF.get`

***

### getAttributions()

> **getAttributions**(): `Attribution`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:150

Get the attribution function for the source.

#### Returns

`Attribution`

Attribution function.

#### Api

#### Inherited from

`GeoTIFF.getAttributions`

***

### getAttributionsCollapsible()

> **getAttributionsCollapsible**(): `boolean`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:155

#### Returns

`boolean`

Attributions are collapsible.

#### Api

#### Inherited from

`GeoTIFF.getAttributionsCollapsible`

***

### getError()

> **getError**(): `Error`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/GeoTIFF.d.ts:305

#### Returns

`Error`

A source loading error. When the source state is `error`, use this function
to get more information about the error. To debug a faulty configuration, you may want to use
a listener like
```js
geotiffSource.on('change', () => {
  if (geotiffSource.getState() === 'error') {
    console.error(geotiffSource.getError());
  }
});
```

#### Inherited from

`GeoTIFF.getError`

***

### getGeoKeys()

> **getGeoKeys**(): `Promise`\<`Partial`\<`GeoKeys`\>\>

Defined in: [src/map-provider/ol/CustomGeoTiff.ts:20](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/ol/CustomGeoTiff.ts#L20)

#### Returns

`Promise`\<`Partial`\<`GeoKeys`\>\>

***

### getGutterForProjection()

> **getGutterForProjection**(`projection`): `number`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:164

#### Parameters

##### projection

`Projection`

Projection.

#### Returns

`number`

Gutter.

#### Inherited from

`GeoTIFF.getGutterForProjection`

***

### getInterpolate()

> **getInterpolate**(): `boolean`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:184

#### Returns

`boolean`

Use linear interpolation when resampling.

#### Inherited from

`GeoTIFF.getInterpolate`

***

### getKey()

> **getKey**(): `string`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:169

Return the key to be used for all tiles in the source.

#### Returns

`string`

The key for all tiles.

#### Inherited from

`GeoTIFF.getKey`

***

### getKeys()

> **getKeys**(): `string`[]

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:120

Get a list of object property names.

#### Returns

`string`[]

List of property names.

#### Api

#### Inherited from

`GeoTIFF.getKeys`

***

### getListeners()

> **getListeners**(`type`): `Listener`[]

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/events/Target.d.ts:69

Get the listeners for a specified event type. Listeners are returned in the
order that they will be called in.

#### Parameters

##### type

`string`

Type.

#### Returns

`Listener`[]

Listeners.

#### Inherited from

`GeoTIFF.getListeners`

***

### getProj4String()

> **getProj4String**(): `Promise`\<`string`\>

Defined in: [src/map-provider/ol/CustomGeoTiff.ts:22](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/ol/CustomGeoTiff.ts#L22)

#### Returns

`Promise`\<`string`\>

***

### getProjection()

> **getProjection**(): `Projection`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:161

Get the projection of the source.

#### Returns

`Projection`

Projection.

#### Api

#### Inherited from

`GeoTIFF.getProjection`

***

### getProjectionParameters()

> **getProjectionParameters**(): `Promise`\<`ProjectionParameters`\>

Defined in: [src/map-provider/ol/CustomGeoTiff.ts:21](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/ol/CustomGeoTiff.ts#L21)

#### Returns

`Promise`\<`ProjectionParameters`\>

***

### getProperties()

> **getProperties**(): `NoInfer`\<\{\[`x`: `string`\]: `any`; \}\>

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:126

Get an object of all property names and values.

#### Returns

`NoInfer`\<\{\[`x`: `string`\]: `any`; \}\>

Object.

#### Api

#### Inherited from

`GeoTIFF.getProperties`

***

### getPropertiesInternal()

> **getPropertiesInternal**(): `Partial`\<`NoInfer`\<\{\[`x`: `string`\]: `any`; \}\>\>

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:131

Get an object of all property names and values.

#### Returns

`Partial`\<`NoInfer`\<\{\[`x`: `string`\]: `any`; \}\>\>

Object.

#### Inherited from

`GeoTIFF.getPropertiesInternal`

***

### getReprojTile\_()

> **getReprojTile\_**(`z`, `x`, `y`, `targetProj`, `sourceProj`, `tileCache?`): `DataTile`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/DataTile.d.ts:253

#### Parameters

##### z

`number`

Tile coordinate z.

##### x

`number`

Tile coordinate x.

##### y

`number`

Tile coordinate y.

##### targetProj

`Projection`

The output projection.

##### sourceProj

`Projection`

The input projection.

##### tileCache?

`LRUCache`\<`Tile`\>

Tile cache.

#### Returns

`DataTile`

Tile.

#### Inherited from

`GeoTIFF.getReprojTile_`

***

### getResolutions()

> **getResolutions**(`projection?`): `number`[]

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:166

#### Parameters

##### projection?

`Projection`

Projection.

#### Returns

`number`[]

Resolutions.

#### Inherited from

`GeoTIFF.getResolutions`

***

### getRevision()

> **getRevision**(): `number`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Observable.d.ts:72

Get the version number for this object.  Each time the object is modified,
its version number will be incremented.

#### Returns

`number`

Revision.

#### Api

#### Inherited from

`GeoTIFF.getRevision`

***

### getState()

> **getState**(): `State`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:176

Get the state of the source, see import("./Source.js").State for possible states.

#### Returns

`State`

State.

#### Api

#### Inherited from

`GeoTIFF.getState`

***

### getTile()

> **getTile**(`z`, `x`, `y`, `pixelRatio`, `projection?`, `tileCache?`): `DataTile`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/DataTile.d.ts:264

#### Parameters

##### z

`number`

Tile coordinate z.

##### x

`number`

Tile coordinate x.

##### y

`number`

Tile coordinate y.

##### pixelRatio

`number`

Pixel ratio.

##### projection?

`Projection`

Projection.

##### tileCache?

`LRUCache`\<`Tile`\>

Tile cache.

#### Returns

`DataTile`

Tile (or null if outside source extent).

#### Inherited from

`GeoTIFF.getTile`

***

### getTileCoordForTileUrlFunction()

> **getTileCoordForTileUrlFunction**(`tileCoord`, `projection?`): `TileCoord`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:222

Returns a tile coordinate wrapped around the x-axis. When the tile coordinate
is outside the resolution and extent range of the tile grid, `null` will be
returned.

#### Parameters

##### tileCoord

`TileCoord`

Tile coordinate.

##### projection?

`Projection`

Projection.

#### Returns

`TileCoord`

Tile coordinate to be passed to the tileUrlFunction or
    null if no tile URL should be created for the passed `tileCoord`.

#### Inherited from

`GeoTIFF.getTileCoordForTileUrlFunction`

***

### getTileGrid()

> **getTileGrid**(): `TileGrid`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:192

Return the tile grid of the tile source.

#### Returns

`TileGrid`

Tile grid.

#### Api

#### Inherited from

`GeoTIFF.getTileGrid`

***

### getTileGridForProjection()

> **getTileGridForProjection**(`projection`): `TileGrid`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:197

#### Parameters

##### projection

`Projection`

Projection.

#### Returns

`TileGrid`

Tile grid.

#### Inherited from

`GeoTIFF.getTileGridForProjection`

***

### getTilePixelRatio()

> **getTilePixelRatio**(`pixelRatio`): `number`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:205

Get the tile pixel ratio for this source. Subclasses may override this
method, which is meant to return a supported pixel ratio that matches the
provided `pixelRatio` as close as possible.

#### Parameters

##### pixelRatio

`number`

Pixel ratio.

#### Returns

`number`

Tile pixel ratio.

#### Inherited from

`GeoTIFF.getTilePixelRatio`

***

### getTilePixelSize()

> **getTilePixelSize**(`z`, `pixelRatio`, `projection`): `Size`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:212

#### Parameters

##### z

`number`

Z.

##### pixelRatio

`number`

Pixel ratio.

##### projection

`Projection`

Projection.

#### Returns

`Size`

Tile size.

#### Inherited from

`GeoTIFF.getTilePixelSize`

***

### getTileSize()

> `protected` **getTileSize**(`z`): `Size`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/DataTile.d.ts:238

Get the source tile size at the given zoom level.  This may be different than the rendered tile
size.

#### Parameters

##### z

`number`

Tile zoom level.

#### Returns

`Size`

The source tile size.

#### Inherited from

`GeoTIFF.getTileSize`

***

### getView()

> **getView**(): `Promise`\<`ViewOptions`\>

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:170

#### Returns

`Promise`\<`ViewOptions`\>

A promise for view-related properties.

#### Inherited from

`GeoTIFF.getView`

***

### getWrapX()

> **getWrapX**(): `boolean`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:180

#### Returns

`boolean`

Wrap X.

#### Inherited from

`GeoTIFF.getWrapX`

***

### handleTileChange\_()

> **handleTileChange\_**(`event`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/DataTile.d.ts:200

Handle tile change events.

#### Parameters

##### event

`BaseEvent`

Event.

#### Returns

`void`

#### Inherited from

`GeoTIFF.handleTileChange_`

***

### hasListener()

> **hasListener**(`type?`): `boolean`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/events/Target.d.ts:75

#### Parameters

##### type?

`string`

Type. If not provided,
    `true` will be returned if this event target has any listeners.

#### Returns

`boolean`

Has listeners.

#### Inherited from

`GeoTIFF.hasListener`

***

### hasProperties()

> **hasProperties**(): `boolean`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:135

#### Returns

`boolean`

The object has properties.

#### Inherited from

`GeoTIFF.hasProperties`

***

### notify()

> **notify**(`key`, `oldValue`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:140

#### Parameters

##### key

`string`

Key name.

##### oldValue

`any`

Old value.

#### Returns

`void`

#### Inherited from

`GeoTIFF.notify`

***

### onceInternal()

> `protected` **onceInternal**(`type`, `listener`): `EventsKey` \| `EventsKey`[]

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Observable.d.ts:86

#### Parameters

##### type

Type.

`string` | `string`[]

##### listener

(`arg0`) => `unknown`

Listener.

#### Returns

`EventsKey` \| `EventsKey`[]

Event key.

#### Inherited from

`GeoTIFF.onceInternal`

***

### onInternal()

> `protected` **onInternal**(`type`, `listener`): `EventsKey` \| `EventsKey`[]

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Observable.d.ts:79

#### Parameters

##### type

Type.

`string` | `string`[]

##### listener

(`arg0`) => `unknown`

Listener.

#### Returns

`EventsKey` \| `EventsKey`[]

Event key.

#### Inherited from

`GeoTIFF.onInternal`

***

### refresh()

> **refresh**(): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:189

Refreshes the source. The source will be cleared, and data from the server will be reloaded.

#### Returns

`void`

#### Api

#### Inherited from

`GeoTIFF.refresh`

***

### registerProjectionIfNeeded()

> **registerProjectionIfNeeded**(): `Promise`\<`Projection`\>

Defined in: [src/map-provider/ol/CustomGeoTiff.ts:23](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/map-provider/ol/CustomGeoTiff.ts#L23)

#### Returns

`Promise`\<`Projection`\>

***

### removeChangeListener()

> **removeChangeListener**(`key`, `listener`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:150

#### Parameters

##### key

`string`

Key name.

##### listener

`Listener`

Listener.

#### Returns

`void`

#### Inherited from

`GeoTIFF.removeChangeListener`

***

### removeEventListener()

> **removeEventListener**(`type`, `listener`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/events/Target.d.ts:80

#### Parameters

##### type

`string`

Type.

##### listener

`Listener`

Listener.

#### Returns

`void`

#### Inherited from

`GeoTIFF.removeEventListener`

***

### set()

> **set**(`key`, `value`, `silent?`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:158

Sets a value.

#### Parameters

##### key

`string`

Key name.

##### value

`any`

Value.

##### silent?

`boolean`

Update without triggering an event.

#### Returns

`void`

#### Api

#### Inherited from

`GeoTIFF.set`

***

### setAttributions()

> **setAttributions**(`attributions`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:197

Set the attributions of the source.

#### Parameters

##### attributions

`AttributionLike`

Attributions.
    Can be passed as `string`, `Array<string>`, module:ol/source/Source~Attribution,
    or `undefined`.

#### Returns

`void`

#### Api

#### Inherited from

`GeoTIFF.setAttributions`

***

### setKey()

> `protected` **setKey**(`key`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Tile.d.ts:175

Set the value to be used as the key for all tiles in the source.

#### Parameters

##### key

`string`

The key for tiles.

#### Returns

`void`

#### Inherited from

`GeoTIFF.setKey`

***

### setLoader()

> `protected` **setLoader**(`loader`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/DataTile.d.ts:243

#### Parameters

##### loader

`Loader`

The data loader.

#### Returns

`void`

#### Inherited from

`GeoTIFF.setLoader`

***

### setProperties()

> **setProperties**(`values`, `silent?`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:166

Sets a collection of key-value pairs.  Note that this changes any existing
properties and adds new ones (it does not remove any existing properties).

#### Parameters

##### values

`Partial`\<`NoInfer`\<`Properties`\>\>

Values.

##### silent?

`boolean`

Update without triggering an event.

#### Returns

`void`

#### Api

#### Inherited from

`GeoTIFF.setProperties`

***

### setState()

> **setState**(`state`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/Source.d.ts:202

Set the state of the source.

#### Parameters

##### state

`State`

State.

#### Returns

`void`

#### Inherited from

`GeoTIFF.setState`

***

### setTileGridForProjection()

> **setTileGridForProjection**(`projection`, `tilegrid`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/DataTile.d.ts:277

Sets the tile grid to use when reprojecting the tiles to the given
projection instead of the default tile grid for the projection.

This can be useful when the default tile grid cannot be created
(e.g. projection has no extent defined) or
for optimization reasons (custom tile size, resolutions, ...).

#### Parameters

##### projection

`ProjectionLike`

Projection.

##### tilegrid

`TileGrid`

Tile grid to use for the projection.

#### Returns

`void`

#### Api

#### Inherited from

`GeoTIFF.setTileGridForProjection`

***

### setTileSizes()

> `protected` **setTileSizes**(`tileSizes`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/source/DataTile.d.ts:230

Set the source tile sizes.  The length of the array is expected to match the number of
levels in the tile grid.

#### Parameters

##### tileSizes

`Size`[]

An array of tile sizes.

#### Returns

`void`

#### Inherited from

`GeoTIFF.setTileSizes`

***

### unInternal()

> `protected` **unInternal**(`type`, `listener`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Observable.d.ts:93

Unlisten for a certain type of event.

#### Parameters

##### type

Type.

`string` | `string`[]

##### listener

(`arg0`) => `unknown`

Listener.

#### Returns

`void`

#### Inherited from

`GeoTIFF.unInternal`

***

### unset()

> **unset**(`key`, `silent?`): `void`

Defined in: node\_modules/.pnpm/ol@10.8.0/node\_modules/ol/Object.d.ts:179

Unsets a property.

#### Parameters

##### key

`string`

Key name.

##### silent?

`boolean`

Unset without triggering an event.

#### Returns

`void`

#### Api

#### Inherited from

`GeoTIFF.unset`
