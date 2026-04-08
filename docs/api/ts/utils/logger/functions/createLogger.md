[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [utils/logger](../index.md) / createLogger

# Function: createLogger()

> **createLogger**(`namespace`): `object`

Defined in: [src/utils/logger.ts:182](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/utils/logger.ts#L182)

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
