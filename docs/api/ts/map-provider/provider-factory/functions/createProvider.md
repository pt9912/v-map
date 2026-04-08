[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [map-provider/provider-factory](../index.md) / createProvider

# Function: createProvider()

> **createProvider**(`engine`): `Promise`\<[`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)\>

Defined in: [src/map-provider/provider-factory.ts:19](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/map-provider/provider-factory.ts#L19)

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
