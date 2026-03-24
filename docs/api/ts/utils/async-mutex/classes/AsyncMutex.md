[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [utils/async-mutex](../README.md) / AsyncMutex

# Class: AsyncMutex

Defined in: [src/utils/async-mutex.ts:2](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/utils/async-mutex.ts#L2)

## Constructors

### Constructor

> **new AsyncMutex**(): `AsyncMutex`

#### Returns

`AsyncMutex`

## Methods

### runExclusive()

> **runExclusive**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [src/utils/async-mutex.ts:6](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/utils/async-mutex.ts#L6)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `T` \| `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>
