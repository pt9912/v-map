[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [utils/logger](../index.md) / LogTransport

# Interface: LogTransport

Defined in: [src/utils/logger.ts:18](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/utils/logger.ts#L18)

Transport-Interface – definiert, wohin ein Log geschrieben wird.
Du kannst z. B. einen HTTP-Transport für Remote-Logging implementieren.

## Methods

### log()

> **log**(`level`, `args`, `namespace?`): `void`

Defined in: [src/utils/logger.ts:20](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/utils/logger.ts#L20)

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
