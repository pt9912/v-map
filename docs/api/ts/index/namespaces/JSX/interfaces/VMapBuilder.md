[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapBuilder

# Interface: VMapBuilder

Defined in: [src/components.d.ts:887](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L887)

A component that builds map configurations dynamically from JSON/YAML configuration scripts.

## Properties

### mapconfig?

> `optional` **mapconfig**: `unknown`

Defined in: [src/components.d.ts:891](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L891)

Configuration object for the map builder. Can be any structure that will be normalized to BuilderConfig.

***

### onConfigError()?

> `optional` **onConfigError**: (`event`) => `void`

Defined in: [src/components.d.ts:895](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L895)

Event emitted when there is an error parsing the map configuration.

#### Parameters

##### event

[`VMapBuilderCustomEvent`](../../../interfaces/VMapBuilderCustomEvent.md)\<\{ `errors?`: `string`[]; `message`: `string`; \}\>

#### Returns

`void`

***

### onConfigReady()?

> `optional` **onConfigReady**: (`event`) => `void`

Defined in: [src/components.d.ts:902](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L902)

Event emitted when the map configuration has been successfully parsed and is ready to use.

#### Parameters

##### event

[`VMapBuilderCustomEvent`](../../../interfaces/VMapBuilderCustomEvent.md)\<[`BuilderConfig`](../../../../utils/diff/interfaces/BuilderConfig.md)\>

#### Returns

`void`
