[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [utils/diff](../README.md) / diffRelevantFields

# Function: diffRelevantFields()

> **diffRelevantFields**(`a`, `b`): `Partial`\<`Record`\<`"type"` \| `"visible"` \| `"opacity"` \| `"zIndex"` \| `"url"` \| `"layers"` \| `"tiled"` \| `"style"` \| `"data"`, \{ `new`: `any`; `old`: `any`; \}\>\>

Defined in: [src/utils/diff.ts:114](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/utils/diff.ts#L114)

Compare fields relevant for rendering; returns patch (only changed fields)

## Parameters

### a

[`NormalizedLayer`](../interfaces/NormalizedLayer.md)

### b

[`NormalizedLayer`](../interfaces/NormalizedLayer.md)

## Returns

`Partial`\<`Record`\<`"type"` \| `"visible"` \| `"opacity"` \| `"zIndex"` \| `"url"` \| `"layers"` \| `"tiled"` \| `"style"` \| `"data"`, \{ `new`: `any`; `old`: `any`; \}\>\>
