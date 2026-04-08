[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/deck/DeckGLGeoTIFFLayer](../index.md) / DeckGLGeoTIFFLayerProps

# Interface: DeckGLGeoTIFFLayerProps

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:73](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L73)

## Extends

- `LayerProps`

## Properties

### \_dataDiff()?

> `optional` **\_dataDiff**: \<`LayerDataT`\>(`newData`, `oldData?`) => `object`[]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:83

Callback to determine the difference between two data values, in order to perform a partial update.

#### Type Parameters

##### LayerDataT

`LayerDataT` = `LayerData`\<`unknown`\>

#### Parameters

##### newData

`LayerDataT`

##### oldData?

`LayerDataT`

#### Returns

`object`[]

#### Inherited from

`LayerProps._dataDiff`

***

### autoHighlight?

> `optional` **autoHighlight**: `boolean`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:175

Enable GPU-based object highlighting. Default false.

#### Inherited from

`LayerProps.autoHighlight`

***

### colorFormat?

> `optional` **colorFormat**: `"RGBA"` \| `"RGB"`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:145

The format of colors, default 'RGBA'.

#### Inherited from

`LayerProps.colorFormat`

***

### colorMap?

> `optional` **colorMap**: [`GeoStylerColorMap`](../../../../index/interfaces/GeoStylerColorMap.md) \| [`ColorMapName`](../../../geotiff/utils/colormap-utils/type-aliases/ColorMapName.md)

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:146](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L146)

ColorMap für Grayscale-Daten

Unterstützt:
1. Vordefinierte Namen:
   - 'grayscale': Schwarz-Weiß (default)
   - 'viridis': Wissenschaftliche Farbskala (lila→gelb)
   - 'terrain': Terrain-Farben (blau→grün→braun→weiß)
   - 'turbo': Google Turbo (blau→grün→gelb→rot)
   - 'rainbow': Regenbogen

2. GeoStyler ColorMap (aus SLD via v-map-style):
   Wird automatisch vom styleReady Event übernommen

Nur für Single-Band (Grayscale) Daten!
RGB/RGBA Daten ignorieren diese Prop.

Default: 'grayscale'

***

### coordinateOrigin?

> `optional` **coordinateOrigin**: \[`number`, `number`, `number`\]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:129

The coordinate origin of the data.

#### Inherited from

`LayerProps.coordinateOrigin`

***

### coordinateSystem?

> `optional` **coordinateSystem**: `CoordinateSystem`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:125

The coordinate system of the data. Default to COORDINATE_SYSTEM.LNGLAT in a geospatial view or COORDINATE_SYSTEM.CARTESIAN in a non-geospatial view.

#### Inherited from

`LayerProps.coordinateSystem`

***

### data?

> `optional` **data**: `unknown`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:75

The data to visualize.

#### Inherited from

`LayerProps.data`

***

### dataComparator()?

> `optional` **dataComparator**: \<`LayerDataT`\>(`newData`, `oldData?`) => `boolean`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:79

Callback to determine if two data values are equal.

#### Type Parameters

##### LayerDataT

`LayerDataT` = `LayerData`\<`unknown`\>

#### Parameters

##### newData

`LayerDataT`

##### oldData?

`LayerDataT`

#### Returns

`boolean`

#### Inherited from

`LayerProps.dataComparator`

***

### dataTransform()?

> `optional` **dataTransform**: \<`LayerDataT`\>(`data`, `previousData?`) => `LayerDataT`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:90

Callback to manipulate remote data when it's fetched and parsed.

#### Type Parameters

##### LayerDataT

`LayerDataT` = `LayerData`\<`unknown`\>

#### Parameters

##### data

`unknown`

##### previousData?

`LayerDataT`

#### Returns

`LayerDataT`

#### Inherited from

`LayerProps.dataTransform`

***

### extensions?

> `optional` **extensions**: `LayerExtension`\<`unknown`\>[]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:157

Add additional functionalities to this layer.

#### Inherited from

`LayerProps.extensions`

***

### fetch()?

> `optional` **fetch**: (`url`, `context`) => `any`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:94

Custom implementation to fetch and parse content from URLs.

#### Parameters

##### url

`string`

##### context

###### layer

`Layer`

###### loaders?

`Loader`[]

###### loadOptions?

`any`

###### propName

`string`

###### signal?

`AbortSignal`

#### Returns

`any`

#### Inherited from

`LayerProps.fetch`

***

### forceProjection?

> `optional` **forceProjection**: `boolean`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:97](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L97)

Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys

Nützlich wenn:
- GeoTIFF falsche/fehlende Projektionsinformationen hat
- Man die Projektion manuell überschreiben möchte

Default: false

***

### getPolygonOffset()?

> `optional` **getPolygonOffset**: (`params`) => \[`number`, `number`\]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:169

Callback to calculate the polygonOffset WebGL parameter.

#### Parameters

##### params

###### layerIndex

`number`

#### Returns

\[`number`, `number`\]

#### Inherited from

`LayerProps.getPolygonOffset`

***

### highlightColor?

> `optional` **highlightColor**: `number`[] \| (`pickingInfo`) => `number`[]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:183

The color of the highlight.

#### Inherited from

`LayerProps.highlightColor`

***

### highlightedObjectIndex?

> `optional` **highlightedObjectIndex**: `number`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:179

The index of the data object to highlight. If unspecified, the currently hoverred object is highlighted.

#### Inherited from

`LayerProps.highlightedObjectIndex`

***

### id

> **id**: `string`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:71

Unique identifier of the layer.

#### Inherited from

`LayerProps.id`

***

### loaders?

> `optional` **loaders**: `Loader`[]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:161

Add support for additional data formats.

#### Inherited from

`LayerProps.loaders`

***

### loadOptions?

> `optional` **loadOptions**: `any`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:165

Options to customize the behavior of loaders

#### Inherited from

`LayerProps.loadOptions`

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:102](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L102)

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:101](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L101)

***

### modelMatrix?

> `optional` **modelMatrix**: `Matrix4Like`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:133

A 4x4 matrix to transform local coordianates to the world space.

#### Inherited from

`LayerProps.modelMatrix`

***

### noDataValue?

> `optional` **noDataValue**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:99](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L99)

***

### nullColor?

> `optional` **nullColor**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:100](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L100)

***

### numInstances?

> `optional` **numInstances**: `number`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:216

(Advanced) supply attribute size externally

#### Inherited from

`LayerProps.numInstances`

***

### onClick()?

> `optional` **onClick**: (`pickingInfo`, `event`) => `boolean` \| `void`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:202

Called when the mouse clicks over an object of this layer.

#### Parameters

##### pickingInfo

###### color

`Uint8Array`\<`ArrayBufferLike`\>

###### coordinate?

`number`[]

###### devicePixel?

\[`number`, `number`\]

###### index

`number`

###### layer

`Layer`\<\{ \}\>

###### object?

`any`

###### picked

`boolean`

###### pixel?

\[`number`, `number`\]

###### pixelRatio

`number`

###### sourceLayer?

`Layer`\<\{ \}\>

###### viewport?

`Viewport`

###### x

`number`

###### y

`number`

##### event

`MjolnirEvent`

#### Returns

`boolean` \| `void`

#### Inherited from

`LayerProps.onClick`

***

### onDataLoad()?

> `optional` **onDataLoad**: \<`LayerDataT`\>(`data`, `context`) => `void`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:187

Called when remote data is fetched and parsed.

#### Type Parameters

##### LayerDataT

`LayerDataT` = `LayerData`\<`unknown`\>

#### Parameters

##### data

`LayerDataT`

##### context

###### layer

`Layer`

###### propName

`string`

#### Returns

`void`

#### Inherited from

`LayerProps.onDataLoad`

***

### onDrag()?

> `optional` **onDrag**: (`pickingInfo`, `event`) => `boolean` \| `void`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:210

Called when the mouse drags an object of this layer.

#### Parameters

##### pickingInfo

###### color

`Uint8Array`\<`ArrayBufferLike`\>

###### coordinate?

`number`[]

###### devicePixel?

\[`number`, `number`\]

###### index

`number`

###### layer

`Layer`\<\{ \}\>

###### object?

`any`

###### picked

`boolean`

###### pixel?

\[`number`, `number`\]

###### pixelRatio

`number`

###### sourceLayer?

`Layer`\<\{ \}\>

###### viewport?

`Viewport`

###### x

`number`

###### y

`number`

##### event

`MjolnirEvent`

#### Returns

`boolean` \| `void`

#### Inherited from

`LayerProps.onDrag`

***

### onDragEnd()?

> `optional` **onDragEnd**: (`pickingInfo`, `event`) => `boolean` \| `void`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:214

Called when the mouse releases an object of this layer.

#### Parameters

##### pickingInfo

###### color

`Uint8Array`\<`ArrayBufferLike`\>

###### coordinate?

`number`[]

###### devicePixel?

\[`number`, `number`\]

###### index

`number`

###### layer

`Layer`\<\{ \}\>

###### object?

`any`

###### picked

`boolean`

###### pixel?

\[`number`, `number`\]

###### pixelRatio

`number`

###### sourceLayer?

`Layer`\<\{ \}\>

###### viewport?

`Viewport`

###### x

`number`

###### y

`number`

##### event

`MjolnirEvent`

#### Returns

`boolean` \| `void`

#### Inherited from

`LayerProps.onDragEnd`

***

### onDragStart()?

> `optional` **onDragStart**: (`pickingInfo`, `event`) => `boolean` \| `void`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:206

Called when the mouse starts dragging an object of this layer.

#### Parameters

##### pickingInfo

###### color

`Uint8Array`\<`ArrayBufferLike`\>

###### coordinate?

`number`[]

###### devicePixel?

\[`number`, `number`\]

###### index

`number`

###### layer

`Layer`\<\{ \}\>

###### object?

`any`

###### picked

`boolean`

###### pixel?

\[`number`, `number`\]

###### pixelRatio

`number`

###### sourceLayer?

`Layer`\<\{ \}\>

###### viewport?

`Viewport`

###### x

`number`

###### y

`number`

##### event

`MjolnirEvent`

#### Returns

`boolean` \| `void`

#### Inherited from

`LayerProps.onDragStart`

***

### onError()?

> `optional` **onError**: (`error`) => `boolean` \| `void`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:194

Called when the layer encounters an error.

#### Parameters

##### error

`Error`

#### Returns

`boolean` \| `void`

#### Inherited from

`LayerProps.onError`

***

### onHover()?

> `optional` **onHover**: (`pickingInfo`, `event`) => `boolean` \| `void`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:198

Called when the mouse enters/leaves an object of this layer.

#### Parameters

##### pickingInfo

###### color

`Uint8Array`\<`ArrayBufferLike`\>

###### coordinate?

`number`[]

###### devicePixel?

\[`number`, `number`\]

###### index

`number`

###### layer

`Layer`\<\{ \}\>

###### object?

`any`

###### picked

`boolean`

###### pixel?

\[`number`, `number`\]

###### pixelRatio

`number`

###### sourceLayer?

`Layer`\<\{ \}\>

###### viewport?

`Viewport`

###### x

`number`

###### y

`number`

##### event

`MjolnirEvent`

#### Returns

`boolean` \| `void`

#### Inherited from

`LayerProps.onHover`

***

### onTileLoadError()?

> `optional` **onTileLoadError**: (`err`) => `void`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:162](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L162)

Optional callback for tile load errors, wired by provider.

#### Parameters

##### err

`Error`

#### Returns

`void`

***

### opacity?

> `optional` **opacity**: `number`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:121

Opacity of the layer, between 0 and 1. Default 1.

#### Inherited from

`LayerProps.opacity`

***

### operation?

> `optional` **operation**: `Operation` \| `"terrain+terrain"` \| `"terrain+mask"` \| `"terrain+draw"` \| `"mask+terrain"` \| `"mask+mask"` \| `"mask+draw"` \| `"draw+terrain"` \| `"draw+mask"` \| `"draw+draw"`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:108

Rendering operation of the layer. `+` separated list of names.

#### Inherited from

`LayerProps.operation`

***

### parameters?

> `optional` **parameters**: `Parameters`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:149

Override the WebGL parameters used to draw this layer. See https://luma.gl/modules/gltools/docs/api-reference/parameter-setting#parameters

#### Inherited from

`LayerProps.parameters`

***

### pickable?

> `optional` **pickable**: `boolean` \| `"3d"`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:117

If the layer can be picked on pointer events. Default false.
Set to '3d' to enable depth picking for 3D coordinates.

#### Inherited from

`LayerProps.pickable`

***

### positionFormat?

> `optional` **positionFormat**: `"XYZ"` \| `"XY"`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:141

The format of positions, default 'XYZ'.

#### Inherited from

`LayerProps.positionFormat`

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:86](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L86)

Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)

Verwendung:
1. Wenn nicht angegeben: Projektion wird aus GeoTIFF GeoKeys gelesen
2. Wenn GeoKeys fehlen: Dieser Wert wird als Fallback verwendet
3. Wenn forceProjection=true: Überschreibt GeoKeys komplett

Default fallback: 'EPSG:4326' (WGS84)

***

### resampleMethod?

> `optional` **resampleMethod**: `"near"` \| `"bilinear"`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:125](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L125)

Resampling-Methode

- 'near': Nearest Neighbor (schnellste, blockartig)
- 'bilinear': Bilineare Interpolation (langsamer, glatter)

Default: 'bilinear'

***

### resolution?

> `optional` **resolution**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:115](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L115)

Sampling-Auflösung (0.0 - 1.0)

- 1.0 = volle Auflösung (256x256 samples für 256x256 tile)
- 0.5 = halbe Auflösung (128x128 samples, upscaled zu 256x256)
- 0.25 = viertel Auflösung (64x64 samples, upscaled zu 256x256)

Niedrigere Werte = schneller, aber weniger genau
Default: 1.0

***

### startIndices?

> `optional` **startIndices**: `NumericArray`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:218

(Advanced) supply variable-width attribute size externally

#### Inherited from

`LayerProps.startIndices`

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:103](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L103)

***

### transitions?

> `optional` **transitions**: `Record`\<`string`, `any`\>

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:153

Create smooth transitions when prop values update.

#### Inherited from

`LayerProps.transitions`

***

### updateTriggers?

> `optional` **updateTriggers**: `Record`\<`string`, `any`\>

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:104

The dependencies used to trigger re-evaluation of functional accessors (get*).

#### Inherited from

`LayerProps.updateTriggers`

***

### url

> **url**: `string`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:74](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L74)

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/map-provider/deck/DeckGLGeoTIFFLayer.ts:160](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/map-provider/deck/DeckGLGeoTIFFLayer.ts#L160)

Wertebereich für Normalisierung [min, max]

Für Float32/Float64 Daten: Mappt Werte in diesem Bereich auf 0-1 für ColorMap
- Werte < min → 0.0 (erste Farbe)
- Werte > max → 1.0 (letzte Farbe)
- Dazwischen → linear interpoliert

Wenn nicht angegeben: Auto-detect aus Daten (kann langsam sein!)

Beispiel: [0, 3000] für Höhendaten 0-3000m

***

### visible?

> `optional` **visible**: `boolean`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:112

If the layer should be rendered. Default true.

#### Inherited from

`LayerProps.visible`

***

### wrapLongitude?

> `optional` **wrapLongitude**: `boolean`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.2.11/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:137

(Geospatial only) normalize geometries that cross the 180th meridian. Default false.

#### Inherited from

`LayerProps.wrapLongitude`
