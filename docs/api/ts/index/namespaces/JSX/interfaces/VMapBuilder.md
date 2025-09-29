[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapBuilder

# Interface: VMapBuilder

Defined in: [src/components.d.ts:765](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L765)

A component that builds map configurations dynamically from JSON/YAML configuration scripts.

## Properties

### mapconfig?

> `optional` **mapconfig**: `unknown`

Defined in: [src/components.d.ts:769](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L769)

Configuration object for the map builder. Can be any structure that will be normalized to BuilderConfig.

***

### onConfigError()?

> `optional` **onConfigError**: (`event`) => `void`

Defined in: [src/components.d.ts:773](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L773)

Event emitted when there is an error parsing the map configuration.

#### Parameters

##### event

[`VMapBuilderCustomEvent`](../../../interfaces/VMapBuilderCustomEvent.md)\<\{ `errors?`: `string`[]; `message`: `string`; \}\>

#### Returns

`void`

***

### onConfigReady()?

> `optional` **onConfigReady**: (`event`) => `void`

Defined in: [src/components.d.ts:780](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L780)

Event emitted when the map configuration has been successfully parsed and is ready to use.

#### Parameters

##### event

[`VMapBuilderCustomEvent`](../../../interfaces/VMapBuilderCustomEvent.md)\<[`BuilderConfig`](../../../../utils/diff/interfaces/BuilderConfig.md)\>

#### Returns

`void`
