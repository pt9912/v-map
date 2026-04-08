[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [utils/async-mutex](../index.md) / AsyncMutex

# Class: AsyncMutex

Defined in: [src/utils/async-mutex.ts:2](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/utils/async-mutex.ts#L2)

## Constructors

### Constructor

> **new AsyncMutex**(): `AsyncMutex`

#### Returns

`AsyncMutex`

## Methods

### runExclusive()

> **runExclusive**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [src/utils/async-mutex.ts:6](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/utils/async-mutex.ts#L6)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `T` \| `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>
