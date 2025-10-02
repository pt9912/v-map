[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapBuilder

# Interface: VMapBuilder

Defined in: [src/components.d.ts:834](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L834)

A component that builds map configurations dynamically from JSON/YAML configuration scripts.

## Properties

### mapconfig?

> `optional` **mapconfig**: `unknown`

Defined in: [src/components.d.ts:838](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L838)

Configuration object for the map builder. Can be any structure that will be normalized to BuilderConfig.

***

### onConfigError()?

> `optional` **onConfigError**: (`event`) => `void`

Defined in: [src/components.d.ts:842](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L842)

Event emitted when there is an error parsing the map configuration.

#### Parameters

##### event

[`VMapBuilderCustomEvent`](../../../interfaces/VMapBuilderCustomEvent.md)\<\{ `errors?`: `string`[]; `message`: `string`; \}\>

#### Returns

`void`

***

### onConfigReady()?

> `optional` **onConfigReady**: (`event`) => `void`

Defined in: [src/components.d.ts:849](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L849)

Event emitted when the map configuration has been successfully parsed and is ready to use.

#### Parameters

##### event

[`VMapBuilderCustomEvent`](../../../interfaces/VMapBuilderCustomEvent.md)\<[`BuilderConfig`](../../../../utils/diff/interfaces/BuilderConfig.md)\>

#### Returns

`void`
