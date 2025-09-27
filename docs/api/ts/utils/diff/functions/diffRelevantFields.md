[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [utils/diff](../README.md) / diffRelevantFields

# Function: diffRelevantFields()

> **diffRelevantFields**(`a`, `b`): `Partial`\<`Record`\<`"type"` \| `"data"` \| `"url"` \| `"opacity"` \| `"zIndex"` \| `"visible"` \| `"style"` \| `"layers"` \| `"tiled"`, \{ `new`: `any`; `old`: `any`; \}\>\>

Defined in: [src/utils/diff.ts:114](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/utils/diff.ts#L114)

Compare fields relevant for rendering; returns patch (only changed fields)

## Parameters

### a

[`NormalizedLayer`](../interfaces/NormalizedLayer.md)

### b

[`NormalizedLayer`](../interfaces/NormalizedLayer.md)

## Returns

`Partial`\<`Record`\<`"type"` \| `"data"` \| `"url"` \| `"opacity"` \| `"zIndex"` \| `"visible"` \| `"style"` \| `"layers"` \| `"tiled"`, \{ `new`: `any`; `old`: `any`; \}\>\>
