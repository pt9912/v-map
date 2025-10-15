[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/deck/DeckGLGeoTIFFTerrainLayer](../README.md) / DeckGLGeoTIFFTerrainLayerProps

# Interface: DeckGLGeoTIFFTerrainLayerProps

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:15](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L15)

## Extends

- `LayerProps`

## Properties

### \_dataDiff()?

> `optional` **\_dataDiff**: \<`LayerDataT`\>(`newData`, `oldData?`) => `object`[]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:83

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

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:174

Enable GPU-based object highlighting. Default false.

#### Inherited from

`LayerProps.autoHighlight`

***

### color?

> `optional` **color**: \[`number`, `number`, `number`\]

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:70](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L70)

Farbe für das Terrain (wenn keine Textur vorhanden)
[r, g, b] mit Werten 0-255

***

### colorFormat?

> `optional` **colorFormat**: `"RGBA"` \| `"RGB"`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:144

The format of colors, default 'RGBA'.

#### Inherited from

`LayerProps.colorFormat`

***

### colorMap?

> `optional` **colorMap**: [`GeoStylerColorMap`](../../../../index/interfaces/GeoStylerColorMap.md) \| [`ColorMapName`](../../../geotiff/utils/colormap-utils/type-aliases/ColorMapName.md)

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:76](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L76)

ColorMap für Höhendaten-Visualisierung
Nur relevant wenn keine texture gesetzt ist

***

### coordinateOrigin?

> `optional` **coordinateOrigin**: \[`number`, `number`, `number`\]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:128

The coordinate origin of the data.

#### Inherited from

`LayerProps.coordinateOrigin`

***

### coordinateSystem?

> `optional` **coordinateSystem**: `CoordinateSystem`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:124

The coordinate system of the data. Default to COORDINATE_SYSTEM.LNGLAT in a geospatial view or COORDINATE_SYSTEM.CARTESIAN in a non-geospatial view.

#### Inherited from

`LayerProps.coordinateSystem`

***

### data?

> `optional` **data**: `unknown`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:75

The data to visualize.

#### Inherited from

`LayerProps.data`

***

### dataComparator()?

> `optional` **dataComparator**: \<`LayerDataT`\>(`newData`, `oldData?`) => `boolean`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:79

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

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:90

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

### elevationScale?

> `optional` **elevationScale**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:88](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L88)

Höhen-Überhöhung (Exaggeration Factor)
Default: 1.0

***

### extensions?

> `optional` **extensions**: `LayerExtension`\<`unknown`\>[]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:156

Add additional functionalities to this layer.

#### Inherited from

`LayerProps.extensions`

***

### fetch()?

> `optional` **fetch**: (`url`, `context`) => `any`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:94

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

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:26](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L26)

Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys

***

### getPolygonOffset()?

> `optional` **getPolygonOffset**: (`params`) => \[`number`, `number`\]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:168

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

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:182

The color of the highlight.

#### Inherited from

`LayerProps.highlightColor`

***

### highlightedObjectIndex?

> `optional` **highlightedObjectIndex**: `number`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:178

The index of the data object to highlight. If unspecified, the currently hoverred object is highlighted.

#### Inherited from

`LayerProps.highlightedObjectIndex`

***

### id

> **id**: `string`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:71

Unique identifier of the layer.

#### Inherited from

`LayerProps.id`

***

### loaders?

> `optional` **loaders**: `Loader`[]

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:160

Add support for additional data formats.

#### Inherited from

`LayerProps.loaders`

***

### loadOptions?

> `optional` **loadOptions**: `any`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:164

Options to customize the behavior of loaders

#### Inherited from

`LayerProps.loadOptions`

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:41](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L41)

Maximale Zoom-Stufe

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:53](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L53)

Mesh-Fehlertoleranz in Metern (Martini)
Kleinere Werte = detaillierteres Mesh, aber langsamer
Default: 4.0

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:36](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L36)

Minimale Zoom-Stufe

***

### modelMatrix?

> `optional` **modelMatrix**: `Matrix4Like`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:132

A 4x4 matrix to transform local coordianates to the world space.

#### Inherited from

`LayerProps.modelMatrix`

***

### noDataValue?

> `optional` **noDataValue**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:31](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L31)

NoData-Wert für ungültige Höhendaten

***

### numInstances?

> `optional` **numInstances**: `number`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:215

(Advanced) supply attribute size externally

#### Inherited from

`LayerProps.numInstances`

***

### onClick()?

> `optional` **onClick**: (`pickingInfo`, `event`) => `boolean` \| `void`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:201

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

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:186

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

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:209

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

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:213

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

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:205

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

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:193

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

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:197

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

### opacity?

> `optional` **opacity**: `number`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:120

Opacity of the layer, between 0 and 1. Default 1.

#### Inherited from

`LayerProps.opacity`

***

### operation?

> `optional` **operation**: `Operation` \| `"terrain+terrain"` \| `"terrain+mask"` \| `"terrain+draw"` \| `"mask+terrain"` \| `"mask+mask"` \| `"mask+draw"` \| `"draw+terrain"` \| `"draw+mask"` \| `"draw+draw"`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:108

Rendering operation of the layer. `+` separated list of names.

#### Inherited from

`LayerProps.operation`

***

### parameters?

> `optional` **parameters**: `Parameters`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:148

Override the WebGL parameters used to draw this layer. See https://luma.gl/modules/gltools/docs/api-reference/parameter-setting#parameters

#### Inherited from

`LayerProps.parameters`

***

### pickable?

> `optional` **pickable**: `boolean`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:116

If the layer can be picked on pointer events. Default false.

#### Inherited from

`LayerProps.pickable`

***

### positionFormat?

> `optional` **positionFormat**: `"XYZ"` \| `"XY"`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:140

The format of positions, default 'XYZ'.

#### Inherited from

`LayerProps.positionFormat`

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:21](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L21)

Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)

***

### startIndices?

> `optional` **startIndices**: `NumericArray`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:217

(Advanced) supply variable-width attribute size externally

#### Inherited from

`LayerProps.startIndices`

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:64](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L64)

Textur-URL (optional) - kann ein Bild oder tile-URL sein

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:46](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L46)

Tile-Größe in Pixeln

***

### transitions?

> `optional` **transitions**: `Record`\<`string`, `any`\>

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:152

Create smooth transitions when prop values update.

#### Inherited from

`LayerProps.transitions`

***

### updateTriggers?

> `optional` **updateTriggers**: `Record`\<`string`, `any`\>

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:104

The dependencies used to trigger re-evaluation of functional accessors (get*).

#### Inherited from

`LayerProps.updateTriggers`

***

### url

> **url**: `string`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:16](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L16)

***

### valueRange?

> `optional` **valueRange**: \[`number`, `number`\]

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:82](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L82)

Wertebereich für Normalisierung [min, max]
Wird für ColorMap-Mapping verwendet

***

### visible?

> `optional` **visible**: `boolean`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:112

If the layer should be rendered. Default true.

#### Inherited from

`LayerProps.visible`

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:59](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L59)

Wireframe-Modus (nur Mesh-Linien anzeigen)
Default: false

***

### wrapLongitude?

> `optional` **wrapLongitude**: `boolean`

Defined in: node\_modules/.pnpm/@deck.gl+core@9.1.15/node\_modules/@deck.gl/core/dist/types/layer-props.d.ts:136

(Geospatial only) normalize geometries that cross the 180th meridian. Default false.

#### Inherited from

`LayerProps.wrapLongitude`
