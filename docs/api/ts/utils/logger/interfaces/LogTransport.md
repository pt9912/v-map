[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [utils/logger](../README.md) / LogTransport

# Interface: LogTransport

Defined in: [src/utils/logger.ts:18](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/utils/logger.ts#L18)

Transport-Interface – definiert, wohin ein Log geschrieben wird.
Du kannst z. B. einen HTTP-Transport für Remote-Logging implementieren.

## Methods

### log()

> **log**(`level`, `args`, `namespace?`): `void`

Defined in: [src/utils/logger.ts:20](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/utils/logger.ts#L20)

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
