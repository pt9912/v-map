[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [map-provider/provider-factory](../README.md) / createProvider

# Function: createProvider()

> **createProvider**(`engine`): `Promise`\<[`MapProvider`](../../../types/mapprovider/interfaces/MapProvider.md)\>

Defined in: [src/map-provider/provider-factory.ts:19](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/provider-factory.ts#L19)

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
