[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [types/mapprovider](../index.md) / LayerUpdate

# Type Alias: LayerUpdate

> **LayerUpdate** = `{ [K in LayerConfig["type"]]: { data: Partial<Extract<LayerConfig, { type: K }>>; type: K } }`\[[`LayerConfig`](../../layerconfig/type-aliases/LayerConfig.md)\[`"type"`\]\] \| \{ `data`: \{ `style?`: `Record`\<`string`, `unknown`\>; \}; `type`: `"tile3d-style"`; \}

Defined in: [src/types/mapprovider.ts:5](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/types/mapprovider.ts#L5)
