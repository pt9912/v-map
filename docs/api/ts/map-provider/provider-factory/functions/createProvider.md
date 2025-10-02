[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [map-provider/provider-factory](../README.md) / createProvider

# Function: createProvider()

> **createProvider**(`engine`): `Promise`\<[`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)\>

Defined in: [src/map-provider/provider-factory.ts:18](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/map-provider/provider-factory.ts#L18)

Erzeugt eine konkrete Karten-Provider-Instanz abhängig vom gewählten Flavour.

Unterstützt:
- "ol"      → OpenLayers
- "cesium"  → CesiumJS
- "deck"    → Deck.gl
- "leaflet" → Leaflet

## Parameters

### engine

[`Flavour`](../../../types/flavour/type-aliases/Flavour.md)

## Returns

`Promise`\<[`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)\>
