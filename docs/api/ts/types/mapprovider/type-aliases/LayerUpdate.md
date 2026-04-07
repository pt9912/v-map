[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [types/mapprovider](../README.md) / LayerUpdate

# Type Alias: LayerUpdate

> **LayerUpdate** = `{ [K in LayerConfig["type"]]: { data: Partial<Extract<LayerConfig, { type: K }>>; type: K } }`\[[`LayerConfig`](../../layerconfig/type-aliases/LayerConfig.md)\[`"type"`\]\] \| \{ `data`: \{ `style?`: `Record`\<`string`, `unknown`\>; \}; `type`: `"tile3d-style"`; \}

Defined in: [src/types/mapprovider.ts:5](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/types/mapprovider.ts#L5)
