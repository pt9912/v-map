[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapBuilder

# Interface: VMapBuilder

Defined in: [src/components.d.ts:1370](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L1370)

A component that builds map configurations dynamically from JSON/YAML configuration scripts.

## Properties

### mapconfig?

> `optional` **mapconfig**: `unknown`

Defined in: [src/components.d.ts:1374](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L1374)

Configuration object for the map builder. Can be any structure that will be normalized to BuilderConfig.

***

### onConfigError()?

> `optional` **onConfigError**: (`event`) => `void`

Defined in: [src/components.d.ts:1378](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L1378)

Event emitted when there is an error parsing the map configuration.

#### Parameters

##### event

[`VMapBuilderCustomEvent`](../../../interfaces/VMapBuilderCustomEvent.md)\<\{ `errors?`: `string`[]; `message`: `string`; \}\>

#### Returns

`void`

***

### onConfigReady()?

> `optional` **onConfigReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1385](https://github.com/pt9912/v-map/blob/ce6e00537dea9542f2a50d0b6b75035885736c96/src/components.d.ts#L1385)

Event emitted when the map configuration has been successfully parsed and is ready to use.

#### Parameters

##### event

[`VMapBuilderCustomEvent`](../../../interfaces/VMapBuilderCustomEvent.md)\<[`BuilderConfig`](../../../../utils/diff/interfaces/BuilderConfig.md)\>

#### Returns

`void`
