[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/deck/DeckGLGeoTIFFTerrainLayer](../README.md) / createDeckGLGeoTIFFTerrainLayer

# Function: createDeckGLGeoTIFFTerrainLayer()

> **createDeckGLGeoTIFFTerrainLayer**(`props`): `Promise`\<`Layer`\<\{ \}\>\>

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:97](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L97)

Factory-Funktion zum Erstellen eines DeckGLGeoTIFFTerrainLayer

Dieser Layer kombiniert:
- GeoTIFF-Loading mit Projektion-Support (aus DeckGLGeoTIFFLayer)
- 3D-Terrain-Rendering (deck.gl TerrainLayer)
- Optional: ColorMap-basierte Texturierung

## Parameters

### props

[`DeckGLGeoTIFFTerrainLayerProps`](../interfaces/DeckGLGeoTIFFTerrainLayerProps.md)

## Returns

`Promise`\<`Layer`\<\{ \}\>\>
