[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [utils/logger](../index.md) / LogTransport

# Interface: LogTransport

Defined in: [src/utils/logger.ts:18](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/utils/logger.ts#L18)

Transport-Interface – definiert, wohin ein Log geschrieben wird.
Du kannst z. B. einen HTTP-Transport für Remote-Logging implementieren.

## Methods

### log()

> **log**(`level`, `args`, `namespace?`): `void`

Defined in: [src/utils/logger.ts:20](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/utils/logger.ts#L20)

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
