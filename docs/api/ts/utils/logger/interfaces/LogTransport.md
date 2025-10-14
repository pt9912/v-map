[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [utils/logger](../README.md) / LogTransport

# Interface: LogTransport

Defined in: [src/utils/logger.ts:18](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/utils/logger.ts#L18)

Transport-Interface – definiert, wohin ein Log geschrieben wird.
Du kannst z. B. einen HTTP-Transport für Remote-Logging implementieren.

## Methods

### log()

> **log**(`level`, `args`, `namespace?`): `void`

Defined in: [src/utils/logger.ts:20](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/utils/logger.ts#L20)

Log-Methode, die vom Logger intern aufgerufen wird.

#### Parameters

##### level

`LogLevel`

##### args

readonly `unknown`[]

##### namespace?

`string`

#### Returns

`void`
