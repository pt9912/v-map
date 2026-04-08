[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [utils/diff](../index.md) / diffRelevantFields

# Function: diffRelevantFields()

> **diffRelevantFields**(`a`, `b`): `Partial`\<`Record`\<`"type"` \| `"visible"` \| `"opacity"` \| `"zIndex"` \| `"url"` \| `"layers"` \| `"tiled"` \| `"data"` \| `"style"`, \{ `new`: `unknown`; `old`: `unknown`; \}\>\>

Defined in: [src/utils/diff.ts:137](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/utils/diff.ts#L137)

Compare fields relevant for rendering; returns patch (only changed fields)

## Parameters

### a

[`NormalizedLayer`](../interfaces/NormalizedLayer.md)

### b

[`NormalizedLayer`](../interfaces/NormalizedLayer.md)

## Returns

`Partial`\<`Record`\<`"type"` \| `"visible"` \| `"opacity"` \| `"zIndex"` \| `"url"` \| `"layers"` \| `"tiled"` \| `"data"` \| `"style"`, \{ `new`: `unknown`; `old`: `unknown`; \}\>\>
