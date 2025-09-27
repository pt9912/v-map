[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapBuilder

# Interface: VMapBuilder

Defined in: [src/components.d.ts:610](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L610)

## Properties

### mapconfig?

> `optional` **mapconfig**: `unknown`

Defined in: [src/components.d.ts:611](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L611)

***

### onConfigError()?

> `optional` **onConfigError**: (`event`) => `void`

Defined in: [src/components.d.ts:612](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L612)

#### Parameters

##### event

[`VMapBuilderCustomEvent`](../../../interfaces/VMapBuilderCustomEvent.md)\<\{ `errors?`: `string`[]; `message`: `string`; \}\>

#### Returns

`void`

***

### onConfigReady()?

> `optional` **onConfigReady**: (`event`) => `void`

Defined in: [src/components.d.ts:616](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L616)

#### Parameters

##### event

[`VMapBuilderCustomEvent`](../../../interfaces/VMapBuilderCustomEvent.md)\<[`BuilderConfig`](../../../../utils/diff/interfaces/BuilderConfig.md)\>

#### Returns

`void`
