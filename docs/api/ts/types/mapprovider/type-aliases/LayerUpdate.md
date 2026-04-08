[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [types/mapprovider](../index.md) / LayerUpdate

# Type Alias: LayerUpdate

> **LayerUpdate** = `{ [K in LayerConfig["type"]]: { data: Partial<Extract<LayerConfig, { type: K }>>; type: K } }`\[[`LayerConfig`](../../layerconfig/type-aliases/LayerConfig.md)\[`"type"`\]\] \| \{ `data`: \{ `style?`: `Record`\<`string`, `unknown`\>; \}; `type`: `"tile3d-style"`; \}

Defined in: [src/types/mapprovider.ts:5](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/types/mapprovider.ts#L5)
