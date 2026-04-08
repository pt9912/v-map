[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/deck/DeckGLGeoTIFFTerrainLayer](../index.md) / createDeckGLGeoTIFFTerrainLayer

# Function: createDeckGLGeoTIFFTerrainLayer()

> **createDeckGLGeoTIFFTerrainLayer**(`props`): `Promise`\<`Layer`\<\{ \}\>\>

Defined in: [src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts:120](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/map-provider/deck/DeckGLGeoTIFFTerrainLayer.ts#L120)

Factory-Funktion zum Erstellen eines DeckGLGeoTIFFTerrainLayer

Rendert GeoTIFF-Höhendaten als 3D-Terrain-Mesh (Standard) oder als
colormap-basierte 2D-Kacheln.

Im terrain-Modus (Standard) wird der Martini-Algorithmus (@mapbox/martini)
für adaptive RTIN-Mesh-Generierung verwendet. meshMaxError, wireframe und
elevationScale sind in diesem Modus funktional.

## Parameters

### props

[`DeckGLGeoTIFFTerrainLayerProps`](../interfaces/DeckGLGeoTIFFTerrainLayerProps.md)

## Returns

`Promise`\<`Layer`\<\{ \}\>\>
