[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [utils/logger](../README.md) / createLogger

# Function: createLogger()

> **createLogger**(`namespace`): `object`

Defined in: [src/utils/logger.ts:186](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/utils/logger.ts#L186)

Erzeugt eine Logger-Instanz mit Namespace-Präfix.
Ideal für Komponenten: `const log = createLogger('MyComponent');`

## Parameters

### namespace

`string`

## Returns

`object`

### debug()

> **debug**: (...`args`) => `void`

#### Parameters

##### args

...`unknown`[]

#### Returns

`void`

### error()

> **error**: (...`args`) => `void`

#### Parameters

##### args

...`unknown`[]

#### Returns

`void`

### info()

> **info**: (...`args`) => `void`

#### Parameters

##### args

...`unknown`[]

#### Returns

`void`

### warn()

> **warn**: (...`args`) => `void`

#### Parameters

##### args

...`unknown`[]

#### Returns

`void`
