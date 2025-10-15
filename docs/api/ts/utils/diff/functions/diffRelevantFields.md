[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [utils/diff](../README.md) / diffRelevantFields

# Function: diffRelevantFields()

> **diffRelevantFields**(`a`, `b`): `Partial`\<`Record`\<`"type"` \| `"visible"` \| `"opacity"` \| `"zIndex"` \| `"url"` \| `"layers"` \| `"tiled"` \| `"data"` \| `"style"`, \{ `new`: `any`; `old`: `any`; \}\>\>

Defined in: [src/utils/diff.ts:135](https://github.com/pt9912/v-map/blob/70860852b715a2bc9918cc3118d1d87cbfe98e50/src/utils/diff.ts#L135)

Compare fields relevant for rendering; returns patch (only changed fields)

## Parameters

### a

[`NormalizedLayer`](../interfaces/NormalizedLayer.md)

### b

[`NormalizedLayer`](../interfaces/NormalizedLayer.md)

## Returns

`Partial`\<`Record`\<`"type"` \| `"visible"` \| `"opacity"` \| `"zIndex"` \| `"url"` \| `"layers"` \| `"tiled"` \| `"data"` \| `"style"`, \{ `new`: `any`; `old`: `any`; \}\>\>
