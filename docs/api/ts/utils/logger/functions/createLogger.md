[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [utils/logger](../index.md) / createLogger

# Function: createLogger()

> **createLogger**(`namespace`): `object`

Defined in: [src/utils/logger.ts:182](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/utils/logger.ts#L182)

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
