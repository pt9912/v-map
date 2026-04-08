[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [types/mapprovider](../index.md) / LayerUpdate

# Type Alias: LayerUpdate

> **LayerUpdate** = `{ [K in LayerConfig["type"]]: { data: Partial<Extract<LayerConfig, { type: K }>>; type: K } }`\[[`LayerConfig`](../../layerconfig/type-aliases/LayerConfig.md)\[`"type"`\]\] \| \{ `data`: \{ `style?`: `Record`\<`string`, `unknown`\>; \}; `type`: `"tile3d-style"`; \}

Defined in: [src/types/mapprovider.ts:5](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/types/mapprovider.ts#L5)
